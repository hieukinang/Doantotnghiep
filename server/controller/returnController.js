import { uploadManyImages } from "../middleware/imgUpload.middleware.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { sequelize } from "../config/db.js";
import Return from "../model/returnModel.js";
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
  if (files.length > 3) return next(new APIError("Chỉ nhập tối đa 3 ảnh trả hàng", 400));

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
        throw new Error("Tệp tải lên không có buffer hoặc đường dẫn");
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
  if (!order) return next(new APIError("Không tìm thấy đơn hàng", 404));

  // Only allow return when delivered or client_confirmed
  if (![ORDER_STATUS.DELIVERED, ORDER_STATUS.CLIENT_CONFIRMED].includes(order.status)) {
    return next(new APIError("Đơn hàng không đủ điều kiện để trả hàng", 400));
  }

  const { reason } = req.body;

  // compute refund: prefer order.total_price if set, otherwise sum items
  let refundAmount = Number(order.total_price || 0) + order.shipping_fee;
  if (!refundAmount || refundAmount <= 0) {
    refundAmount = 0;
    for (const item of order.OrderItems) {
      const unitPrice = Number(item.price || 0);
      refundAmount += unitPrice * Number(item.quantity || 0);
    }
  }

  const t = await sequelize.transaction();
  try {
    // create Return record for the whole order
    const returnDoc = await Return.create({
      orderId: order.id,
      reason: reason || null,
      refund_amount: refundAmount,
    }, { transaction: t });

    // handle images saved by resizeReturnImages (filenames in req.body.return_images)
    if (req.body.return_images && Array.isArray(req.body.return_images)) {
      for (const imgPath of req.body.return_images) {
        await ReturnImage.create({
          return_id: returnDoc.id,
          image_path: imgPath,
        }, { transaction: t });
      }
    }

    // mark order as RETURNED
    order.status = ORDER_STATUS.RETURNED;
    await order.save({ transaction: t });

    await t.commit();

    // reload return with associations (images) for response
    const createdReturn = await Return.findByPk(returnDoc.id, {
      include: [
        { model: ReturnImage, as: "ReturnImages" },
      ],
    });

    res.status(201).json({
      status: "success",
      data: {
        return: createdReturn,
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

  if (!orderWithReturns) return next(new APIError("Không tìm thấy đơn hàng hoặc bạn không phải chủ cửa hàng này", 404));

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
  const order = await Order.findOne({
    where: { id, storeId },
    include: [{ model: OrderItem, as: "OrderItems" }],
  });
  if (!order) return next(new APIError("Không tìm thấy đơn hàng", 404));

  // only proceed if order is in RETURNED status
  if (order.status !== ORDER_STATUS.RETURNED) {
    return next(new APIError("Trạng thái đơn hàng không hợp lệ", 400));
  }

  // Find the latest return for this order
  const returnDoc = await Return.findOne({ where: { orderId: order.id } });
  if (!returnDoc) return next(new APIError("Không tìm thấy yêu cầu trả hàng cho đơn hàng này", 404));

  // parse isAccepted from query (treat any value 'true' (case-insensitive) as true)
  const isAccepted = String(req.query.isAccepted || "").toLowerCase() === "true";

  const refundAmount = Number(returnDoc.refund_amount || 0);
  // only require refund amount when accepting the return
  if (isAccepted && refundAmount <= 0) return next(new APIError("Không có số tiền hoàn trả để xử lý", 400));

  // if merchant rejects the return, mark order as RETURN_NOT_CONFIRMED and return success
  if (!isAccepted) {
    order.status = ORDER_STATUS.RETURN_NOT_CONFIRMED;
    await order.save();
    return res.status(200).json({ status: "success" });
  }

  const t = await sequelize.transaction();
  let committed = false;
  try {
    const client = await Client.findByPk(order.clientId, { transaction: t });
    const store = await Store.findByPk(order.storeId, { transaction: t });
    if (!client || !store) {
      await t.rollback();
      return next(new APIError("Không tìm thấy khách hàng hoặc cửa hàng", 404));
    }

    // revert stock for all product variants in the order
    for (const item of order.OrderItems) {
      if (item.product_variantId) {
        const variant = await ProductVariant.findByPk(item.product_variantId, { transaction: t });
        if (variant) {
          await variant.increment("stock_quantity", { by: item.quantity || 0, transaction: t });
        }
      }
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
      description: `Hoàn trả xác nhận cho yêu cầu trả hàng ${returnDoc.id} (đơn hàng ${order.id})`,
    }, { transaction: t });

    // create transaction for store (debit)
    await Transaction.create({
      user_id: store.id,
      amount: -refundAmount,
      new_balance: store.wallet,
      payment_method: "refund",
      type: TRANSACTION_TYPE.PAY_ORDER,
      status: "SUCCESS",
      description: `Hoàn trả trừ đi cho yêu cầu trả hàng ${returnDoc.id} (đơn hàng ${order.id})`,
    }, { transaction: t });

    // update order status to RETURN_CONFIRMED
    order.status = ORDER_STATUS.RETURN_CONFIRMED;
    await order.save({ transaction: t });

    await t.commit();
    committed = true;
  } catch (err) {
    if (!committed) {
      try { await t.rollback(); } catch (e) { /* ignore */ }
    }
    return next(err);
  }

  return res.status(200).json({ status: "success" });
});