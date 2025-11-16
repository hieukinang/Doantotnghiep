import { uploadManyImages } from "../middleware/imgUpload.middleware.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { sequelize } from "../config/db.js";
import Return from "../model/returnModel.js";
import ReturnItem from "../model/returnItemModel.js";
import ReturnImage from "../model/returnImageModel.js";
import Order from "../model/orderModel.js";
import OrderItem from "../model/orderItemModel.js";
import ProductVariant from "../model/productVariantModel.js";
import Client from "../model/clientModel.js";
import Store from "../model/storeModel.js";
import Transaction from "../model/transactionModel.js";
import { TRANSACTION_TYPE, ORDER_STATUS } from "../constants/index.js";

export const uploadReturnImages = (req, res, next) => {
  return uploadManyImages("return_images", 3)(req, res, (err) => {
    next();
  });
};

export const resizeReturnImages = asyncHandler(async (req, res, next) => {
  // normalize files: support multer.array, multer.fields or single file
  let files = [];
  if (Array.isArray(req.files) && req.files.length) files = req.files;
  else if (req.files && Array.isArray(req.files.return_images)) files = req.files.return_images;
  else if (req.file) files = [req.file];

  if (!files || files.length === 0) return next();

  // enforce max 3 files
  if (files.length > 3) return next(new APIError("Maximum 3 return images allowed", 400));

  // ensure upload dir exists
  const uploadBase = process.env.FILES_UPLOADS_PATH || path.join(process.cwd(), "uploads");
  const uploadDir = path.join(uploadBase, "returnImages");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  req.body.return_images = [];

  for (let idx = 0; idx < files.length; idx++) {
    const img = files[idx];
    const returnImageName = `return-${req.user?.id || "anon"}-${Date.now()}-${idx + 1}.jpeg`;
    const outPath = path.join(uploadDir, returnImageName);

    try {
      if (img.buffer) {
        await sharp(img.buffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(outPath);
      } else if (img.path) {
        await sharp(img.path)
          .resize({ width: 1200, withoutEnlargement: true })
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(outPath);
      } else {
        throw new Error("Uploaded file has no buffer or path");
      }
      req.body.return_images.push(returnImageName);
    } catch (err) {
      return next(err);
    }
  }
  return next();
});

// @desc    POST Return Order by Client
// @route   POST /client/:id/return-order
// @access  Private("CLIENT")
export const returnOrderByClient = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const { id } = req.params; // order id

  // Find order with items
  const order = await Order.findOne({
    where: { id, clientId },
    include: [{ model: OrderItem, as: "OrderItems" }],
  });
  if (!order) return next(new APIError("Order not found", 404));

  // Only allow return when delivered or client_confirmed
  if (![ORDER_STATUS.DELIVERED, ORDER_STATUS.CLIENT_CONFIRMED].includes(order.status)) {
    return next(new APIError("Order is not eligible for return", 400));
  }

  // Parse inputs
  let { order_item_ids, quantities, reason } = req.body;

  try {
    if (typeof order_item_ids === "string") order_item_ids = JSON.parse(order_item_ids);
    if (typeof quantities === "string") quantities = JSON.parse(quantities);
  } catch (err) {
    return next(new APIError("Invalid order_item_ids or quantities format", 400));
  }

  if (!Array.isArray(order_item_ids) || !Array.isArray(quantities)) {
    return next(new APIError("order_item_ids and quantities must be arrays", 400));
  }

  if (order_item_ids.length !== quantities.length || order_item_ids.length === 0) {
    return next(new APIError("order_item_ids and quantities must have same non-zero length", 400));
  }

  // Validate each order item belongs to this order and quantities
  const t = await sequelize.transaction();
  try {
    let refundAmount = 0;

    // create Return record
    const returnDoc = await Return.create({
      orderId: order.id,
      reason: reason || null,
      refund_amount: 0,
    }, { transaction: t });

    for (let i = 0; i < order_item_ids.length; i++) {
      const itemId = Number(order_item_ids[i]);
      const qty = Number(quantities[i]);
      if (!itemId || !qty || qty <= 0) {
        await t.rollback();
        return next(new APIError(`Invalid item id or quantity at index ${i}` , 400));
      }

      const orderItem = await OrderItem.findByPk(itemId, { transaction: t });
      if (!orderItem) {
        await t.rollback();
        return next(new APIError(`OrderItem ${itemId} not found`, 404));
      }
      if (orderItem.orderId !== order.id) {
        await t.rollback();
        return next(new APIError(`OrderItem ${itemId} does not belong to this order`, 400));
      }
      if (qty > orderItem.quantity) {
        await t.rollback();
        return next(new APIError(`Return quantity for item ${itemId} exceeds purchased quantity`, 400));
      }

      // compute refund (price * qty)
      const unitPrice = Number(orderItem.price || 0);
      refundAmount += unitPrice * qty;

      // create return item
      await ReturnItem.create({
        return_id: returnDoc.id,
        order_item_id: orderItem.id,
        quantity: qty,
      }, { transaction: t });

      // update order item quantity (reduce by returned qty)
      orderItem.quantity = orderItem.quantity - qty;
      await orderItem.save({ transaction: t });

      // restock product variant if applicable
      if (orderItem.product_variantId) {
        const variant = await ProductVariant.findByPk(orderItem.product_variantId, { transaction: t });
        if (variant) {
          await variant.increment("stock_quantity", { by: qty, transaction: t });
        }
      }
    }

    // handle images saved by resizeReturnImages (filenames in req.body.return_images)
    if (req.body.return_images && Array.isArray(req.body.return_images)) {
      for (const imgPath of req.body.return_images) {
        await ReturnImage.create({
          return_id: returnDoc.id,
          image_path: imgPath,
        }, { transaction: t });
      }
    }

    // update refund amount in return record
    returnDoc.refund_amount = Number(refundAmount.toFixed(2));
    await returnDoc.save({ transaction: t });

    // credit client wallet and create transaction
    const client = req.user;
    if (refundAmount > 0) {
      client.wallet = Number(client.wallet || 0) + Number(refundAmount);
      await client.save({ transaction: t });

      await Transaction.create({
        user_id: client.id,
        amount: Number(refundAmount.toFixed(2)),
        new_balance: client.wallet,
        payment_method: "refund",
        type: TRANSACTION_TYPE.REFUND,
        status: "SUCCESS",
        description: `Refund for return ${returnDoc.id} (order ${order.id})`,
      }, { transaction: t });
    }

    // mark order as RETURNED
    order.status = ORDER_STATUS.RETURNED;
    await order.save({ transaction: t });

    await t.commit();

    // reload return with associations (images and items) for response
    const createdReturn = await Return.findByPk(returnDoc.id, {
      include: [
        { model: ReturnImage, as: "ReturnImages" },
        { model: ReturnItem, as: "ReturnItems" },
      ],
    });

    res.status(201).json({
      status: "success",
      data: {
        return: createdReturn,
        refundAmount,
      },
    });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
});

export const getReturnRequest = asyncHandler(async (req, res, next) => {
  const storeId = req.user && req.user.id;
  const { id } = req.params; // order id

  // Find order with its return requests, including return items and images
  const orderWithReturns = await Order.findOne({
    where: { id, storeId },
    include: [
      {
        model: Return,
        as: "OrderReturns",
        include: [
          {
            model: ReturnItem,
            as: "ReturnItems",
            include: [
              { model: OrderItem, as: "ReturnItemOrderItem" },
            ],
          },
          { model: ReturnImage, as: "ReturnImages" },
        ],
      },
    ],
  });

  if (!orderWithReturns) return next(new APIError("Order not found or you are not the owner of this store", 404));

  // Return all return information for this order
  res.status(200).json({
    status: "success",
    data: {
      returns: orderWithReturns.OrderReturns || [],
    },
  });
});

export const confirmReturnOrder = asyncHandler(async (req, res, next) => {
  const storeId = req.user && req.user.id;
  const { id } = req.params; // order id

  // verify order belongs to store
  const order = await Order.findOne({ where: { id, storeId } });
  if (!order) return next(new APIError("Order not found or you are not the owner of this store", 404));

  // only proceed if order is in RETURNED status
  if (order.status !== ORDER_STATUS.RETURNED) {
    return next(new APIError("Order must be in RETURNED status to confirm return", 400));
  }

  // Find the latest return for this order
  const returnDoc = await Return.findOne({ where: { orderId: order.id }, order: [["createdAt", "DESC"]] });
  if (!returnDoc) return next(new APIError("Return request not found for this order", 404));

  const refundAmount = Number(returnDoc.refund_amount || 0);
  if (refundAmount <= 0) return next(new APIError("No refund amount to process", 400));

  const t = await sequelize.transaction();
  try {
    const client = await Client.findByPk(order.clientId, { transaction: t });
    const store = await Store.findByPk(order.storeId, { transaction: t });
    if (!client || !store) {
      await t.rollback();
      return next(new APIError("Client or Store not found", 404));
    }

    // credit client wallet
    client.wallet = Number(client.wallet || 0) + refundAmount;
    await client.save({ transaction: t });

    // debit store wallet
    store.wallet = Number(store.wallet || 0) - refundAmount;
    await store.save({ transaction: t });

    // create transaction for client (refund)
    await Transaction.create({
      user_id: client.id,
      amount: refundAmount,
      new_balance: client.wallet,
      payment_method: "refund",
      type: TRANSACTION_TYPE.REFUND,
      status: "SUCCESS",
      description: `Refund confirmed for return ${returnDoc.id} (order ${order.id})`,
    }, { transaction: t });

    // create transaction for store (debit)
    await Transaction.create({
      user_id: store.id,
      amount: -refundAmount,
      new_balance: store.wallet,
      payment_method: "refund",
      type: TRANSACTION_TYPE.PAY_ORDER,
      status: "SUCCESS",
      description: `Refund deducted for return ${returnDoc.id} (order ${order.id})`,
    }, { transaction: t });

    // update order status to RETURN_CONFIRMED
    order.status = ORDER_STATUS.RETURN_CONFIRMED;
    await order.save({ transaction: t });

    await t.commit();

    // reload return with associations for response
    const createdReturn = await Return.findByPk(returnDoc.id, {
      include: [
        { model: ReturnImage, as: "ReturnImages" },
        { model: ReturnItem, as: "ReturnItems" },
      ],
    });

    return res.status(200).json({ status: "success" });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
});