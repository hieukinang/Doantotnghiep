import Order from "../model/orderModel.js";
import OrderItem from "../model/orderItemModel.js";
import Product from "../model/productModel.js";
import ProductVariant from "../model/productVariantModel.js";
import Coupon from "../model/couponModel.js";
import ShippingCode from "../model/shippingCodeModel.js";
import Client from "../model/clientModel.js";
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { generateQRCodeJPG } from "../utils/barcode.utils.js";
import APIError from "../utils/apiError.utils.js";
import { ORDER_STATUS } from "../constants/index.js";
import { PAYMENT_METHODS } from "../constants/index.js";
import dotenv from "dotenv";
import Shipper from "../model/shipperModel.js";
import Store from "../model/storeModel.js";
import Transaction from "../model/transactionModel.js";
import { TRANSACTION_TYPE } from "../constants/index.js";
dotenv.config();

// @ desc middleware to filter orders for the logged user
// @access  Protected
export const getAllOrdersByClient = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const status = req.query.status;

  // Build where clause: always filter by clientId, optionally by status if provided and valid
  const where = { clientId };
  if (status !== undefined && status !== null && String(status).trim() !== "") {
    if (!Object.values(ORDER_STATUS).includes(status)) {
      return next(new APIError("Invalid order status", 400));
    }
    where.status = status;
  }

  const orders = await Order.findAll({
    where,
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        // include: [
        //   {
        //     model: ProductVariant,
        //     as: "OrderItemProductVariant",
        //     include: [{ model: Product, as: "ProductVariantProduct" }],
        //   },
        // ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ status: "success", results: orders.length, data: { orders } });
});

// @desc    GET Single Order
// @route   GET /api/orders/:id
// @access  Private("ADMIN")
// Lấy 1 đơn hàng theo id (của client hoặc admin)
export const getSingleOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findByPk(id, {
    include: [
      {
        model: OrderItem, as: "OrderItems", include: [
          {
            model: ProductVariant, as: "OrderItemProductVariant", include: [
              { model: Product, as: "ProductVariantProduct", attributes: ["id", "name", "main_image"] }
            ]
          }
        ]
      }
    ]
  });
  if (!order) return next(new APIError("Order not found", 404));
  res.status(200).json({ status: "success", data: { order } });
});

// @desc    GET Orders by Store
// @route   GET /store
// @access  Private("STORE")
export const getAllOrdersByStore = asyncHandler(async (req, res, next) => {
  const storeId = req.user && req.user.id;
  const status = req.query.status;
  const startDateQ = req.query.startDate;
  const endDateQ = req.query.endDate;

  const where = { storeId };
  if (status !== undefined && status !== null && String(status).trim() !== "") {
    if (!Object.values(ORDER_STATUS).includes(status)) {
      return next(new APIError("Invalid order status", 400));
    }
    where.status = status;
  }

  // Date range handling for order_date (DATEONLY)
  if (startDateQ || endDateQ) {
    // parse endDate: if not provided, set to today
    const now = new Date();
    let endDate = endDateQ ? new Date(endDateQ) : now;
    if (Number.isNaN(endDate.getTime())) return next(new APIError("Invalid endDate", 400));

    // parse startDate if provided
    let startDate = null;
    if (startDateQ) {
      startDate = new Date(startDateQ);
      if (Number.isNaN(startDate.getTime())) return next(new APIError("Invalid startDate", 400));
    }

    // If startDate provided, validate startDate <= endDate
    if (startDate && startDate > endDate) {
      return next(new APIError("startDate must be before or equal to endDate", 400));
    }

    // Normalize to YYYY-MM-DD for DATEONLY comparison
    const endStr = endDate.toISOString().slice(0, 10);
    if (startDate) {
      const startStr = startDate.toISOString().slice(0, 10);
      where.order_date = { [Op.between]: [startStr, endStr] };
    } else {
      // startDate not provided: get all orders up to endDate
      where.order_date = { [Op.lte]: endStr };
    }
  }

  const orders = await Order.findAll({
    where,
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        include: [
          {
            model: ProductVariant,
            as: "OrderItemProductVariant",
            include: [
              { model: Product, as: "ProductVariantProduct", attributes: ["id", "name", "main_image"] },
            ],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ status: "success", results: orders.length, data: { orders } });
});

// @desc    POST Confirm Order by Store
// @route   POST /store/:id
// @access  Private("STORE")
export const confirmOrderByStore = asyncHandler(async (req, res, next) => {
  const storeId = req.user && req.user.id;
  const { id } = req.params;

  const order = await Order.findOne({ where: { id, storeId } });
  if (!order) return next(new APIError("Order not found", 404));
  if (order.status !== ORDER_STATUS.PENDING) {
    return next(new APIError("Only pending orders can be confirmed", 400));
  }

  order.status = ORDER_STATUS.CONFIRMED;
  await order.save();

  res.status(200).json({ status: "success", data: { order } });
});

// @desc    GET Confirm Orders by id
// @route   GET /shipper/:id
// @access  Private("SHIPPER")
export const shipperFindOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Tìm đơn hàng theo id và status CONFIRMED
  const order = await Order.findOne({
    where: {
      id,
      status: ORDER_STATUS.CONFIRMED,
    },
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        include: [
          {
            model: ProductVariant,
            as: "OrderItemProductVariant",
            include: [
              {
                model: Product,
                as: "ProductVariantProduct",
                attributes: ["id", "name", "main_image"],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!order) {
    return next(new APIError("No confirmed order found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    data: { order },
  });
});

// @desc    POST Receive Order by Shipper
// @route   POST /shipper/:id
// @access  Private("SHIPPER")
export const shipperReceiveOrder = asyncHandler(async (req, res, next) => {
  const shipperId = req.user && req.user.id;
  const { id } = req.params;
  const order = await Order.findByPk(id);
  if (!order) return next(new APIError("Order not found", 404));
  if (order.status !== ORDER_STATUS.CONFIRMED) {
    return next(new APIError("Order not found", 404));
  }

  // Lấy shipper từ DB để kiểm tra wallet
  const shipper = await Shipper.findByPk(shipperId);
  if (!shipper) return next(new APIError("Shipper not found", 404));
  if (shipper.wallet < 50000) {
    return next(new APIError("Số tiền trong ví của bạn phải lớn hơn 50,000 để nhận đơn hàng", 400));
  }

  order.status = ORDER_STATUS.IN_TRANSIT;
  order.shipperId = shipperId;
  await order.save();

  res.status(200).json({ status: "success" });
});

// @desc    CREATE Cash Order
// @route   POST /api/orders/checkout-cash
// @access  Protected
export const createCashOrder = asyncHandler(async (req, res, next) => {
  // New payload shape: products is an object
  let { products, shipping_address } = req.body;

  if (!products) {
    return next(new APIError("products is required", 400));
  }

  if (typeof products === "string") {
    try {
      products = JSON.parse(products);
    } catch (err) {
      return next(new APIError("Invalid products payload", 400));
    }
  }

  const variantIds = products.product_variantIds || products.product_variant_ids || [];
  const storeId = products.storeId || products.store_id || null;
  const couponIds = products.coupon_ids || [];
  const shipping_code_id = products.shipping_code_id || null;
  // quantities is an array parallel to variantIds
  const quantities = products.quantities || products.quantities || [];

  if (!Array.isArray(variantIds) || variantIds.length === 0) {
    return next(new APIError("product_variantIds must be a non-empty array", 400));
  }
  if (!storeId) {
    return next(new APIError("storeId is required", 400));
  }
  // If quantities provided, must be an array with same length as variantIds and all positive integers
  if (quantities && quantities.length > 0) {
    if (!Array.isArray(quantities) || quantities.length !== variantIds.length) {
      return next(new APIError("quantities must be an array with same length as product_variantIds", 400));
    }
    for (const q of quantities) {
      const qi = parseInt(q, 10);
      if (!qi || qi <= 0) return next(new APIError("each quantity must be a positive integer", 400));
    }
  }
  if (!Array.isArray(couponIds)) {
    return next(new APIError("coupon_ids must be an array", 400));
  }
  if (couponIds.length > 2) {
    return next(new APIError("You can provide at most 2 coupons", 400));
  }

  // Fetch variants and ensure they belong to the provided store
  const items = [];
  for (let idx = 0; idx < variantIds.length; idx++) {
    const vId = variantIds[idx];
    const variant = await ProductVariant.findByPk(vId, {
      include: [{ model: Product, as: "ProductVariantProduct" }],
    });
    if (!variant) return next(new APIError(`No product variant match with id: ${vId}`, 404));
    const product = variant.ProductVariantProduct;
    if (!product) return next(new APIError(`Product for variant ${vId} not found`, 404));
    if (product.storeId !== storeId) {
      return next(new APIError(`Variant ${vId} does not belong to store ${storeId}`, 400));
    }
    const qty = quantities && quantities.length > 0 ? parseInt(quantities[idx], 10) : 1;
    if (!qty || qty <= 0) return next(new APIError(`Invalid quantity for variant ${vId}`, 400));
    if (variant.stock_quantity != null && variant.stock_quantity < qty) {
      return next(new APIError(`Not enough stock for variant ${vId}`, 400));
    }
    items.push({ variant, product, quantity: qty });
  }

  // Validate coupons: <=2, if 2 => one admin (storeId=null) and one store coupon (storeId == storeId param)
  const coupons = [];
  if (couponIds.length > 0) {
    for (const cid of couponIds) {
      const coupon = await Coupon.findByPk(cid);
      if (!coupon) return next(new APIError(`No coupon match with id: ${cid}`, 404));
      if (coupon.quantity != null && coupon.quantity <= 0) {
        return next(new APIError(`Coupon ${cid} is no longer available`, 400));
      }
      if (coupon.expire) {
        const exp = new Date(coupon.expire);
        const today = new Date();
        if (exp < new Date(today.toDateString())) {
          return next(new APIError(`Coupon ${cid} has expired`, 400));
        }
      }
      // restriction: admin coupon has storeId == null; store coupon must match storeId
      if (coupon.storeId !== null && coupon.storeId !== storeId) {
        return next(new APIError(`Coupon ${cid} does not apply to store ${storeId}`, 400));
      }
      coupons.push(coupon);
    }

    if (coupons.length === 2) {
      const hasAdminCoupon = coupons.some(c => c.storeId === null);
      const hasStoreCoupon = coupons.some(c => c.storeId === storeId);
      if (!hasAdminCoupon || !hasStoreCoupon) {
        return next(new APIError("If providing two coupons, one must be system-level and one must belong to the store", 400));
      }
    }
  }

  // Shipping fee and shipping code discount (fixed)
  const BASE_SHIPPING_FEE = 30000;
  let shippingDiscount = 0;
  let shippingCodeDoc = null;
  if (shipping_code_id) {
    shippingCodeDoc = await ShippingCode.findByPk(shipping_code_id);
    if (!shippingCodeDoc) return next(new APIError(`Shipping code not found`, 404));
    if (shippingCodeDoc.quantity != null && shippingCodeDoc.quantity <= 0) {
      return next(new APIError(`Shipping code is no longer available`, 400));
    }
    if (shippingCodeDoc.expire) {
      const exp = new Date(shippingCodeDoc.expire);
      const today = new Date();
      if (exp < new Date(today.toDateString())) {
        return next(new APIError(`Shipping code has expired`, 400));
      }
    }
    shippingDiscount = Number(shippingCodeDoc.discount || 0);
  }

  // Compute subtotal and fixed coupon discount
  let subtotal = 0;
  for (const it of items) {
    const price = parseFloat(it.variant.price || 0);
    subtotal += price * it.quantity;
  }
  const couponFixedDiscount = coupons.reduce((acc, c) => acc + Number(c.discount || 0), 0);
  const total_price = Math.max(0, subtotal - couponFixedDiscount);
  const shipping_fee = Math.max(0, BASE_SHIPPING_FEE - shippingDiscount);

  const t = await sequelize.transaction();
  try {
    // Create order
    const order = await Order.create(
      {
        payment_method: PAYMENT_METHODS.CASH,
        total_price,
        order_date: new Date(),
        shipping_address: shipping_address || null,
        shipping_fee,
        clientId: req.user && req.user.id ? req.user.id : null,
        storeId,
      },
      { transaction: t }
    );

    // Create order items and update stocks/sold
    const orderItemsPayload = [];
    for (const it of items) {
      const unitPrice = parseFloat(it.variant.price || 0);
      orderItemsPayload.push({
        quantity: it.quantity,
        price: unitPrice,
        orderId: order.id,
        title: it.product ? it.product.name : null,
        image: it.product ? it.product.main_image : null,
        product_variantId: it.variant.id,
      });

      if (it.variant.stock_quantity != null) {
        await it.variant.decrement("stock_quantity", { by: it.quantity, transaction: t });
      }
      // if (it.product) {
      //   await it.product.increment("sold", { by: it.quantity, transaction: t });
      // }
    }
    await OrderItem.bulkCreate(orderItemsPayload, { transaction: t });

    // Decrement coupon quantities (each used once per order if provided)
    for (const c of coupons) {
      await c.decrement("quantity", { by: 1, transaction: t });
    }
    // Decrement shipping code quantity if used
    if (shippingCodeDoc) {
      await shippingCodeDoc.decrement("quantity", { by: 1, transaction: t });
    }

    // // Update store total_sales (e.g., 90% share as before)
    // const store = await Store.findByPk(storeId, { transaction: t });
    // if (store) {
    //   const storeShare = Math.round(total_price);
    //   await store.increment("total_sales", { by: storeShare, transaction: t });
    // }

    await t.commit();

    // Generate QR code for the order
    const qrCodeFileName = `order-${order.id}-qr.jpg`;
    await generateQRCodeJPG(`${order.id}`, process.env.FILES_UPLOADS_PATH + "/orders", qrCodeFileName);
    order.qr_code = qrCodeFileName;
    await order.save();

    const created = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: "OrderItems" },
      ],
    });

    res.status(201).json({ status: "success", data: created });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
});

// @desc CREATE wallet order
// @route   POST /api/orders/checkout-wallet
// @access  Protected
export const createWalletOrder = asyncHandler(async (req, res, next) => {
  let { products, shipping_address } = req.body;

  if (!products) {
    return next(new APIError("products is required", 400));
  }

  if (typeof products === "string") {
    try {
      products = JSON.parse(products);
    } catch (err) {
      return next(new APIError("Invalid products payload", 400));
    }
  }

  const variantIds = products.product_variantIds || products.product_variant_ids || [];
  const storeId = products.storeId || products.store_id || null;
  const couponIds = products.coupon_ids || [];
  const shipping_code_id = products.shipping_code_id || null;
  const quantities = products.quantities || [];

  if (!Array.isArray(variantIds) || variantIds.length === 0) {
    return next(new APIError("product_variantIds must be a non-empty array", 400));
  }
  if (!storeId) {
    return next(new APIError("storeId is required", 400));
  }
  if (quantities && quantities.length > 0) {
    if (!Array.isArray(quantities) || quantities.length !== variantIds.length) {
      return next(new APIError("quantities must be an array with same length as product_variantIds", 400));
    }
    for (const q of quantities) {
      const qi = parseInt(q, 10);
      if (!qi || qi <= 0) return next(new APIError("each quantity must be a positive integer", 400));
    }
  }
  if (!Array.isArray(couponIds)) {
    return next(new APIError("coupon_ids must be an array", 400));
  }
  if (couponIds.length > 2) {
    return next(new APIError("You can provide at most 2 coupons", 400));
  }

  // Fetch variants
  const items = [];
  for (let idx = 0; idx < variantIds.length; idx++) {
    const vId = variantIds[idx];
    const variant = await ProductVariant.findByPk(vId, {
      include: [{ model: Product, as: "ProductVariantProduct" }],
    });
    if (!variant) return next(new APIError(`No product variant match with id: ${vId}`, 404));
    const product = variant.ProductVariantProduct;
    if (!product) return next(new APIError(`Product for variant ${vId} not found`, 404));
    if (product.storeId !== storeId) {
      return next(new APIError(`Variant ${vId} does not belong to store ${storeId}`, 400));
    }
    const qty = quantities && quantities.length > 0 ? parseInt(quantities[idx], 10) : 1;
    if (!qty || qty <= 0) return next(new APIError(`Invalid quantity for variant ${vId}`, 400));
    if (variant.stock_quantity != null && variant.stock_quantity < qty) {
      return next(new APIError(`Not enough stock for variant ${vId}`, 400));
    }
    items.push({ variant, product, quantity: qty });
  }

  // Validate coupons
  const coupons = [];
  if (couponIds.length > 0) {
    for (const cid of couponIds) {
      const coupon = await Coupon.findByPk(cid);
      if (!coupon) return next(new APIError(`No coupon match with id: ${cid}`, 404));
      if (coupon.quantity != null && coupon.quantity <= 0) {
        return next(new APIError(`Coupon ${cid} is no longer available`, 400));
      }
      if (coupon.expire) {
        const exp = new Date(coupon.expire);
        const today = new Date();
        if (exp < new Date(today.toDateString())) {
          return next(new APIError(`Coupon ${cid} has expired`, 400));
        }
      }
      if (coupon.storeId !== null && coupon.storeId !== storeId) {
        return next(new APIError(`Coupon ${cid} does not apply to store ${storeId}`, 400));
      }
      coupons.push(coupon);
    }
    if (coupons.length === 2) {
      const hasAdminCoupon = coupons.some(c => c.storeId === null);
      const hasStoreCoupon = coupons.some(c => c.storeId === storeId);
      if (!hasAdminCoupon || !hasStoreCoupon) {
        return next(new APIError("If providing two coupons, one must be system-level and one must belong to the store", 400));
      }
    }
  }

  // Shipping fee
  const BASE_SHIPPING_FEE = 30000;
  let shippingDiscount = 0;
  let shippingCodeDoc = null;
  if (shipping_code_id) {
    shippingCodeDoc = await ShippingCode.findByPk(shipping_code_id);
    if (!shippingCodeDoc) return next(new APIError("Shipping code not found", 404));
    if (shippingCodeDoc.quantity != null && shippingCodeDoc.quantity <= 0) {
      return next(new APIError("Shipping code is no longer available", 400));
    }
    if (shippingCodeDoc.expire) {
      const exp = new Date(shippingCodeDoc.expire);
      const today = new Date();
      if (exp < new Date(today.toDateString())) {
        return next(new APIError("Shipping code has expired", 400));
      }
    }
    shippingDiscount = Number(shippingCodeDoc.discount || 0);
  }

  // Subtotal & discounts
  let subtotal = 0;
  for (const it of items) {
    const price = parseFloat(it.variant.price || 0);
    subtotal += price * it.quantity;
  }
  const couponFixedDiscount = coupons.reduce((acc, c) => acc + Number(c.discount || 0), 0);
  const total_price = Math.max(0, subtotal - couponFixedDiscount);
  const shipping_fee = Math.max(0, BASE_SHIPPING_FEE - shippingDiscount);
  const total_due = total_price + shipping_fee;

  const clientId = req.user && req.user.id ? req.user.id : null;
  if (!clientId) return next(new APIError("Authentication required", 401));
  const client = await Client.findByPk(clientId);
  if (!client) return next(new APIError("Client not found", 404));

  const currentBalance = Number(client.wallet || 0);
  if (currentBalance < total_due) {
    return next(new APIError("Số dư ví không đủ để thanh toán đơn hàng", 400));
  }

  const t = await sequelize.transaction();
  try {
    // Create order
    const order = await Order.create(
      {
        payment_method: PAYMENT_METHODS.WALLET,
        total_price,
        order_date: new Date(),
        shipping_address: shipping_address || null,
        shipping_fee,
        clientId,
        storeId,
      },
      { transaction: t }
    );

    // Order items & stock updates
    const orderItemsPayload = [];
    for (const it of items) {
      const unitPrice = parseFloat(it.variant.price || 0);
      orderItemsPayload.push({
        quantity: it.quantity,
        price: unitPrice,
        orderId: order.id,
        title: it.product ? it.product.name : null,
        image: it.product ? it.product.main_image : null,
        product_variantId: it.variant.id,
      });
      if (it.variant.stock_quantity != null) {
        await it.variant.decrement("stock_quantity", { by: it.quantity, transaction: t });
      }
    }
    await OrderItem.bulkCreate(orderItemsPayload, { transaction: t });

    // Decrement coupons
    for (const c of coupons) {
      await c.decrement("quantity", { by: 1, transaction: t });
    }
    // Decrement shipping code quantity if used
    if (shippingCodeDoc) {
      await shippingCodeDoc.decrement("quantity", { by: 1, transaction: t });
    }

    // Deduct client wallet
    client.wallet = currentBalance - total_due;
    await client.save({ transaction: t });

    // Record transaction
    await Transaction.create({
      user_id: client.id,
      amount: -total_due,
      new_balance: client.wallet,
      payment_method: PAYMENT_METHODS.WALLET,
      type: TRANSACTION_TYPE.PAY_ORDER,
      status: "SUCCESS",
      description: `Wallet payment for order ${order.id}`,
    }, { transaction: t });

    await t.commit();

    const qrCodeFileName = `order-${order.id}-qr.jpg`;
    await generateQRCodeJPG(`${order.id}`, process.env.FILES_UPLOADS_PATH + "/orders", qrCodeFileName);
    order.qr_code = qrCodeFileName;
    await order.save();

    const created = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: "OrderItems" },
      ],
    });

    res.status(201).json({ status: "success", data: created });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
});

// @desc    POST Cancel Order by Client
// @route   POST /client/:id/cancel-order
// @access  Private("CLIENT")
export const cancelOrderByClient = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const { id } = req.params;
  const { cancel_reason } = req.body;

  // Tìm đơn hàng của client, kèm các OrderItem và ProductVariant
  const order = await Order.findOne({
    where: { id, clientId },
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        include: [
          { model: ProductVariant, as: "OrderItemProductVariant" }
        ]
      }
    ]
  });

  if (!order) return next(new APIError("Không tìm thấy đơn hàng", 404));
  if (
    order.status !== ORDER_STATUS.PENDING &&
    order.status !== ORDER_STATUS.CONFIRMED
  ) {
    return next(new APIError("Bạn không thể hủy đơn hàng này", 400));
  }

  // Thực hiện cập nhật trong 1 transaction để atomic
  const t = await sequelize.transaction();
  try {
    // Cập nhật lại số lượng tồn kho cho từng ProductVariant trong OrderItem
    for (const item of order.OrderItems) {
      const variant = item.OrderItemProductVariant;
      if (variant && typeof item.quantity === "number") {
        await variant.increment("stock_quantity", { by: item.quantity, transaction: t });
      }
    }

    // Nếu đơn hàng được thanh toán bằng ví, hoàn tiền lại vào ví của client và tạo Transaction
    if (order.payment_method === PAYMENT_METHODS.WALLET) {
      const client = await Client.findByPk(order.clientId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!client) {
        await t.rollback();
        return next(new APIError("Client not found for refund", 404));
      }

      const refundAmount = Number(order.total_price || 0) + Number(order.shipping_fee || 0);
      client.wallet = Number(client.wallet || 0) + refundAmount;
      await client.save({ transaction: t });

      await Transaction.create({
        user_id: client.id,
        amount: refundAmount,
        new_balance: client.wallet,
        payment_method: "wallet",
        type: TRANSACTION_TYPE.REFUND,
        status: "SUCCESS",
        description: `Refund for cancelled order ${order.id}`,
      }, { transaction: t });
    }

    order.status = ORDER_STATUS.CANCELLED;
    order.cancel_reason = cancel_reason;
    await order.save({ transaction: t });

    await t.commit();

    res.status(200).json({ status: "success", data: order });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
});

export const shipperDeliverOrder = asyncHandler(async (req, res, next) => {
  const shipperId = req.user && req.user.id;
  const { id } = req.params;

  const order = await Order.findByPk(id);
  if (!order) return next(new APIError("Order not found", 404));

  // Only allow delivery when order is currently IN_TRANSIT
  if (order.status !== ORDER_STATUS.IN_TRANSIT) {
    return next(new APIError("Only orders in transit can be marked as delivered", 400));
  }

  if (!order.shipperId || order.shipperId !== shipperId) {
    return next(new APIError("You are not assigned to this order", 403));
  }

  // Start DB transaction for atomic updates
  const t = await sequelize.transaction();
  try {
    // 1) Update store: total_sales += total_price, wallet += 80% * total_price
    if (order.storeId) {
      const store = await Store.findByPk(order.storeId, { transaction: t, lock: t.LOCK.UPDATE });
      if (store) {
        const totalPrice = Number(order.total_price || 0);
        const storeWalletAdd = Number((totalPrice * 0.8).toFixed(2));
        await store.increment("total_sales", { by: Math.round(totalPrice), transaction: t });
        await store.increment("wallet", { by: storeWalletAdd, transaction: t });
      }
    }

    // 2) Update shipper: wallet += shipping_fee, debt += total_price
    const shipper = await Shipper.findByPk(shipperId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!shipper) {
      await t.rollback();
      return next(new APIError("Shipper not found", 404));
    }

    const shippingFee = 21000;
    const orderTotal = Number(order.total_price || 0);

    // Behavior:
    // - If payment was via wallet: credit shipper with shipping fee only.
    // - If payment was via cash: deduct the order total from shipper wallet.
    if (order.payment_method === "wallet") {
      await shipper.increment("wallet", { by: shippingFee, transaction: t });
      await shipper.reload({ transaction: t });

      // record top-up for shipping fee
      await Transaction.create({
        user_id: shipperId,
        amount: shippingFee,
        new_balance: shipper.wallet,
        payment_method: "system_shipping_fee",
        type: TRANSACTION_TYPE.TOP_UP,
        status: "SUCCESS",
        description: `Shipping fee for order ${order.id}`,
      }, { transaction: t });
    } else if (order.payment_method === "cash") {
      // deduct order total from shipper wallet
      await shipper.decrement("wallet", { by: orderTotal, transaction: t });
      await shipper.reload({ transaction: t });

      // record deduction for order payment
      await Transaction.create({
        user_id: shipperId,
        amount: -orderTotal,
        new_balance: shipper.wallet,
        payment_method: "cash",
        type: TRANSACTION_TYPE.PAY_ORDER,
        status: "SUCCESS",
        description: `Order amount deducted for order ${order.id}`,
      }, { transaction: t });
    } else {
      // fallback: still credit shipping fee
      await shipper.increment("wallet", { by: shippingFee, transaction: t });
      await shipper.reload({ transaction: t });
      await Transaction.create({
        user_id: shipperId,
        amount: shippingFee,
        new_balance: shipper.wallet,
        payment_method: "system_shipping_fee",
        type: TRANSACTION_TYPE.TOP_UP,
        status: "SUCCESS",
        description: `Shipping fee for order ${order.id}`,
      }, { transaction: t });
    }

    // 4) Mark order as delivered
    order.status = ORDER_STATUS.DELIVERED;
    await order.save({ transaction: t });

    await t.commit();

    res.status(200).json({ status: "success", data: { order } });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
});

export const clientConfirmedOrderIsDeliveried = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const { id } = req.params;
  const order = await Order.findOne({ where: { id, clientId } });
  if (!order) return next(new APIError("Order not found", 404));
  if (order.status !== ORDER_STATUS.DELIVERED) {
    return next(new APIError("Order is not in delivered status", 400));
  }
  order.status = ORDER_STATUS.CLIENT_CONFIRMED;
  await order.save();
  res.status(200).json({ status: "success", data: order });
});

export const getAllOrdersByShipper = asyncHandler(async (req, res, next) => {
  const shipperId = req.user && req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = 10; // <--- thêm dòng này
  const offset = (page - 1) * limit;
  const status = req.query.status;

  const where = { shipperId };
  if (status !== undefined && status !== null && String(status).trim() !== "") {
    if (!Object.values(ORDER_STATUS).includes(status)) {
      return next(new APIError("Invalid order status", 400));
    }
    where.status = status;
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        include: [
          {
            model: ProductVariant,
            as: "OrderItemProductVariant",
            include: [
              { model: Product, as: "ProductVariantProduct", attributes: ["id", "name", "main_image"] },
            ],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit) || 1;
  res.status(200).json({
    status: "success",
    pagination: {
      page,
      limit,
      totalPages,
      totalRecords: count,
    },
    results: rows.length,
    data: { orders: rows },
  });
});