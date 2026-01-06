import Order from "../model/orderModel.js";
import OrderItem from "../model/orderItemModel.js";
import Product from "../model/productModel.js";
import ProductVariant from "../model/productVariantModel.js";
import Coupon from "../model/couponModel.js";
import ShippingCode from "../model/shippingCodeModel.js";
import Client from "../model/clientModel.js";
import { sequelize } from "../config/db.js";
import { Op, cast, col, where as seqWhere, literal } from "sequelize";
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
import { uploadSingleImage } from "../middleware/imgUpload.middleware.js";
import Sharp from "sharp";
dotenv.config();

export const uploadShippingImage = uploadSingleImage("image");

// 2) PROCESSING(Sharp)
export const resizeShippingImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  // console.log(req.file);

  let filename = `${req.body.username}-${req.body.job_title}.jpeg`;
  if(req.user){
    filename = `Order-${req.params.id}.jpeg`;
  }

  await Sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`${process.env.FILES_UPLOADS_PATH}/imageShippings/${filename}`);
  // put it in req.body to access it when we access updateMyProfile or updateSingleUser to save the filename into database
  req.body.image = filename;
  next();
});

// @ desc   GET Orders by Client
// @access  Protected
export const getAllOrdersByClient = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const { status, order_id, startdate, enddate, orderby, page, limit } = req.query;

  const where = { clientId };

  // status filter (case-insensitive)
  if (typeof status !== 'undefined' && status !== null && String(status).trim() !== '') {
    const s = String(status).trim().toUpperCase();
    if (!Object.values(ORDER_STATUS).includes(s)) {
      return next(new APIError('Giá trị trạng thái đơn hàng không hợp lệ', 400));
    }
    where.status = s;
  }

  // order_id contains: cast id to CHAR and like
  if (order_id && String(order_id).trim().length > 0) {
    const pattern = `%${String(order_id).trim()}%`;
    where[Op.and] = where[Op.and] || [];
    where[Op.and].push(seqWhere(cast(col('id'), 'CHAR'), { [Op.like]: pattern }));
  }

  // date range filter on createdAt
  if (startdate || enddate) {
    let start = null;
    let end = null;
    if (startdate) {
      start = new Date(startdate);
      if (Number.isNaN(start.getTime())) return next(new APIError('startdate không hợp lệ', 400));
    }
    if (enddate) {
      end = new Date(enddate);
      if (Number.isNaN(end.getTime())) return next(new APIError('enddate không hợp lệ', 400));
    }
    if (start && end && start > end) return next(new APIError('startdate phải nhỏ hơn hoặc bằng enddate', 400));

    if (start && end) {
      const s = start.toISOString().slice(0, 10);
      const e = end.toISOString().slice(0, 10);
      where.createdAt = { [Op.between]: [s, e] };
    } else if (start) {
      const s = start.toISOString().slice(0, 10);
      where.createdAt = { [Op.gte]: s };
    } else if (end) {
      const e = end.toISOString().slice(0, 10);
      where.createdAt = { [Op.lte]: e };
    }
  }

  // pagination
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const perPage = Math.max(parseInt(limit) || 20, 1);
  const offset = (pageNum - 1) * perPage;

  // sorting
  let order = [['createdAt', 'DESC']];
  if (orderby && String(orderby).trim().length > 0) {
    // support orderby=created_at (default desc)
    const ob = String(orderby).trim().toLowerCase();
    if (ob === 'created_at' || ob === 'createdat' || ob === 'createdat') {
      order = [['createdAt', 'DESC']];
    }
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      { 
        model: OrderItem, 
        as: 'OrderItems',
        include: [
          {
            model: ProductVariant,
            as: 'OrderItemProductVariant',
            include: [
              { model: Product, as: 'ProductVariantProduct', attributes: ['id', 'name', 'main_image'] }
            ]
          }
        ]
      },
    ],
    order,
    limit: perPage,
    offset,
  });

  const totalPages = Math.ceil(count / perPage) || 1;

  res.status(200).json({
    status: 'success',
    results: rows.length,
    page: pageNum,
    perPage,
    totalPages,
    totalRecords: count,
    data: { orders: rows },
  });
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
  if (!order) return next(new APIError("Order không tồn tại", 404));
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
      return next(new APIError("Trạng thái đơn hàng không hợp lệ", 400));
    }
    where.status = status;
  }

  // Date range handling for order_date (DATEONLY)
  if (startDateQ || endDateQ) {
    // parse endDate: if not provided, set to today
    const now = new Date();
    let endDate = endDateQ ? new Date(endDateQ) : now;
    if (Number.isNaN(endDate.getTime())) return next(new APIError("enddate không hợp lệ", 400));

    // parse startDate if provided
    let startDate = null;
    if (startDateQ) {
      startDate = new Date(startDateQ);
      if (Number.isNaN(startDate.getTime())) return next(new APIError("startdate không hợp lệ", 400));
    }

    // If startDate provided, validate startDate <= endDate
    if (startDate && startDate > endDate) {
      return next(new APIError("startdate phải nhỏ hơn hoặc bằng enddate", 400));
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
  if (!order) return next(new APIError("Order không tồn tại", 404));
  if (order.status !== ORDER_STATUS.PENDING) {
    return next(new APIError("Chỉ những đơn hàng đang chờ mới có thể được xác nhận", 400));
  }

  // Cập nhật tồn kho cho từng variant
  const t = await sequelize.transaction();
  try {
    // Lấy các OrderItem và ProductVariant liên quan
    const orderWithItems = await Order.findOne({
      where: { id, storeId },
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
          include: [
            { model: ProductVariant, as: "OrderItemProductVariant" }
          ]
        }
      ],
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (!orderWithItems) {
      await t.rollback();
      return next(new APIError("Không tìm thấy đơn hàng", 404));
    }
    // Trừ tồn kho cho từng variant
    // for (const item of orderWithItems.OrderItems) {
    //   const variant = item.OrderItemProductVariant;
    //   if (variant && typeof item.quantity === "number") {
    //     if (variant.stock_quantity != null && variant.stock_quantity >= item.quantity) {
    //       await variant.decrement("stock_quantity", { by: item.quantity, transaction: t });
    //     } else {
    //       await t.rollback();
    //       return next(new APIError(`Không đủ tồn kho cho biến thể ${variant.id}.`, 400));
    //     }
    //   }
    // }
    orderWithItems.status = ORDER_STATUS.CONFIRMED;
    await orderWithItems.save({ transaction: t });
    await t.commit();
    res.status(200).json({ status: "success", data: { order: orderWithItems } });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
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
    return next(new APIError("Không tìm thấy đơn hàng đã xác nhận hoặc đang giao", 404));
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
  if (!order) return next(new APIError("Không tìm thấy đơn hàng", 404));
  if (order.status !== ORDER_STATUS.CONFIRMED) {
    return next(new APIError("Không tìm thấy đơn hàng đã xác nhận", 404));
  }

  // Lấy shipper từ DB để kiểm tra wallet
  const shipper = await Shipper.findByPk(shipperId);
  if (!shipper) return next(new APIError("Không tìm thấy shipper", 404));
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
  let { products, shipping_address } = req.body;

  if (!products) {
    return next(new APIError("Thiếu thông tin sản phẩm.", 400));
  }

  if (typeof products === "string") {
    try {
      products = JSON.parse(products);
    } catch (err) {
      return next(new APIError("Dữ liệu sản phẩm không hợp lệ.", 400));
    }
  }

  const variantIds = products.product_variantIds || products.product_variant_ids || [];
  const storeId = products.storeId || products.store_id || null;
  const couponIds = products.coupon_ids || [];
  const shipping_code_id = products.shipping_code_id || null;
  const quantities = products.quantities || [];

  if (!Array.isArray(variantIds) || variantIds.length === 0) {
    return next(new APIError("Danh sách sản phẩm phải là mảng và không được rỗng.", 400));
  }
  if (!storeId) {
    return next(new APIError("Thiếu thông tin cửa hàng.", 400));
  }

  if (quantities && quantities.length > 0) {
    if (!Array.isArray(quantities) || quantities.length !== variantIds.length) {
      return next(new APIError("Số lượng phải là mảng và có cùng độ dài với danh sách sản phẩm.", 400));
    }
    for (const q of quantities) {
      const qi = parseInt(q, 10);
      if (!qi || qi <= 0) return next(new APIError("Mỗi số lượng sản phẩm phải là số nguyên dương.", 400));
    }
  }

  if (!Array.isArray(couponIds)) {
    return next(new APIError("Danh sách mã giảm giá phải là mảng.", 400));
  }
  if (couponIds.length > 2) {
    return next(new APIError("Chỉ được sử dụng tối đa 2 mã giảm giá cho mỗi đơn hàng.", 400));
  }

  const items = [];
  for (let idx = 0; idx < variantIds.length; idx++) {
    const vId = variantIds[idx];
    const variant = await ProductVariant.findByPk(vId, {
      include: [{ model: Product, as: "ProductVariantProduct" }],
    });
    if (!variant) return next(new APIError(`Không tìm thấy biến thể sản phẩm với id: ${vId}`, 404));
    const product = variant.ProductVariantProduct;
    if (!product) return next(new APIError(`Không tìm thấy sản phẩm cho biến thể ${vId}.`, 404));
    if (product.storeId !== storeId) {
      return next(new APIError(`Biến thể ${vId} không thuộc cửa hàng ${storeId}.`, 400));
    }
    const qty = quantities && quantities.length > 0 ? parseInt(quantities[idx], 10) : 1;
    
    // Bước kiểm tra này vẫn giữ lại để báo lỗi sớm cho khách, 
    // nhưng tính an toàn tuyệt đối sẽ nằm ở bước Update trong Transaction bên dưới.
    if (variant.stock_quantity != null && variant.stock_quantity < qty) {
      return next(new APIError(`Không đủ tồn kho cho sản phẩm: ${product.name}`, 400));
    }
    items.push({ variant, product, quantity: qty });
  }

  const coupons = [];
  if (couponIds.length > 0) {
    for (const cid of couponIds) {
      const coupon = await Coupon.findByPk(cid);
      if (!coupon) return next(new APIError(`Không tìm thấy mã giảm giá với id: ${cid}`, 404));
      if (coupon.quantity != null && coupon.quantity <= 0) {
        return next(new APIError(`Mã giảm giá ${cid} không còn lượt sử dụng`, 400));
      }
      if (coupon.expire) {
        const exp = new Date(coupon.expire);
        if (exp < new Date(new Date().toDateString())) {
          return next(new APIError(`Mã giảm giá ${cid} đã hết hạn`, 400));
        }
      }
      if (coupon.storeId !== null && coupon.storeId !== storeId) {
        return next(new APIError(`Mã giảm giá ${cid} không áp dụng cho cửa hàng ${storeId}.`, 400));
      }
      coupons.push(coupon);
    }
    if (coupons.length === 2) {
      const hasAdminCoupon = coupons.some(c => c.storeId === null);
      const hasStoreCoupon = coupons.some(c => c.storeId === storeId);
      if (!hasAdminCoupon || !hasStoreCoupon) {
        return next(new APIError("Nếu sử dụng 2 mã giảm giá, phải có 1 mã hệ thống và 1 mã của cửa hàng.", 400));
      }
    }
  }

  const BASE_SHIPPING_FEE = 30000;
  let shippingDiscount = 0;
  let shippingCodeDoc = null;
  if (shipping_code_id) {
    shippingCodeDoc = await ShippingCode.findByPk(shipping_code_id);
    if (!shippingCodeDoc) return next(new APIError(`Không tìm thấy mã giảm giá vận chuyển.`, 404));
    if (shippingCodeDoc.quantity != null && shippingCodeDoc.quantity <= 0) {
      return next(new APIError(`Mã giảm giá vận chuyển đã hết lượt sử dụng.`, 400));
    }
    shippingDiscount = Number(shippingCodeDoc.discount || 0);
  }

  let subtotal = 0;
  for (const it of items) {
    subtotal += parseFloat(it.variant.price || 0) * it.quantity;
  }
  const couponFixedDiscount = coupons.reduce((acc, c) => acc + Number(c.discount || 0), 0);
  const total_price = Math.max(0, subtotal - couponFixedDiscount);
  const shipping_fee = Math.max(0, BASE_SHIPPING_FEE - shippingDiscount);

  const t = await sequelize.transaction();
  try {
    const order = await Order.create(
      {
        payment_method: PAYMENT_METHODS.CASH,
        total_price,
        order_date: new Date(),
        shipping_address: shipping_address || null,
        shipping_fee,
        clientId: req.user?.id || null,
        storeId,
      },
      { transaction: t }
    );

    const orderItemsPayload = [];
    for (const it of items) {
      // 🔒 THAY ĐỔI QUAN TRỌNG: TRỪ TỒN KHO ATOMIC
      // Chỉ trừ nếu stock_quantity >= số lượng khách mua
      const [affectedCount] = await ProductVariant.update(
        { stock_quantity: literal(`stock_quantity - ${it.quantity}`) },
        {
          where: {
            id: it.variant.id,
            stock_quantity: { [Op.gte]: it.quantity } // Điều kiện tiên quyết
          },
          transaction: t
        }
      );

      // Nếu affectedCount === 0 nghĩa là tại giây phút này kho đã không còn đủ
      if (affectedCount === 0) {
        throw new APIError(`Sản phẩm ${it.product.name} vừa hết hàng hoặc không đủ số lượng. Vui lòng thử lại.`, 400);
      }

      orderItemsPayload.push({
        quantity: it.quantity,
        price: parseFloat(it.variant.price || 0),
        orderId: order.id,
        title: it.product.name,
        image: it.product.main_image,
        product_variantId: it.variant.id,
      });
    }

    await OrderItem.bulkCreate(orderItemsPayload, { transaction: t });

    for (const c of coupons) {
      await c.decrement("quantity", { by: 1, transaction: t });
    }
    if (shippingCodeDoc) {
      await shippingCodeDoc.decrement("quantity", { by: 1, transaction: t });
    }

    await t.commit();

    // Lưu thông tin phụ (giữ nguyên logic gốc)
    if (coupons.length > 0) order.coupons = coupons.map(c => c.id);
    if (shippingCodeDoc) order.shipping_code = shippingCodeDoc.id;

    const qrCodeFileName = `order-${order.id}-qr.jpg`;
    await generateQRCodeJPG(`${order.id}`, process.env.FILES_UPLOADS_PATH + "/orders", qrCodeFileName);
    order.qr_code = qrCodeFileName;
    await order.save();

    const created = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: "OrderItems" }],
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
    return next(new APIError("Vui lòng cung cấp sản phẩm", 400));
  }

  if (typeof products === "string") {
    try {
      products = JSON.parse(products);
    } catch (err) {
      return next(new APIError("Lỗi sản phẩm", 400));
    }
  }

  const variantIds = products.product_variantIds || products.product_variant_ids || [];
  const storeId = products.storeId || products.store_id || null;
  const couponIds = products.coupon_ids || [];
  const shipping_code_id = products.shipping_code_id || null;
  const quantities = products.quantities || [];

  // 1. Validations cơ bản (Giữ nguyên)
  if (!Array.isArray(variantIds) || variantIds.length === 0) {
    return next(new APIError("product_variantIds phải là một mảng không rỗng", 400));
  }
  if (!storeId) {
    return next(new APIError("storeId là bắt buộc", 400));
  }
  if (quantities && quantities.length > 0) {
    if (!Array.isArray(quantities) || quantities.length !== variantIds.length) {
      return next(new APIError("quantities phải là một mảng có cùng độ dài với product_variantIds", 400));
    }
  }

  // 2. Thu thập dữ liệu Variants & Kiểm tra sơ bộ (Read-only)
  const items = [];
  for (let idx = 0; idx < variantIds.length; idx++) {
    const vId = variantIds[idx];
    const variant = await ProductVariant.findByPk(vId, {
      include: [{ model: Product, as: "ProductVariantProduct" }],
    });
    if (!variant) return next(new APIError(`Không tìm thấy biến thể ${vId}`, 404));
    
    const product = variant.ProductVariantProduct;
    if (!product || product.storeId !== storeId) {
      return next(new APIError(`Biến thể ${vId} không thuộc cửa hàng này`, 400));
    }
    
    const qty = quantities.length > 0 ? parseInt(quantities[idx], 10) : 1;
    items.push({ variant, product, quantity: qty });
  }

  // 3. Validate Coupons & Shipping (Giữ nguyên logic)
  const coupons = [];
  if (couponIds.length > 0) {
    for (const cid of couponIds) {
      const coupon = await Coupon.findByPk(cid);
      if (!coupon || (coupon.quantity != null && coupon.quantity <= 0)) {
        return next(new APIError(`Mã giảm giá ${cid} không khả dụng`, 400));
      }
      if (coupon.storeId !== null && coupon.storeId !== storeId) {
        return next(new APIError(`Mã giảm giá ${cid} không thuộc cửa hàng này`, 400));
      }
      coupons.push(coupon);
    }
  }

  let shippingCodeDoc = null;
  if (shipping_code_id) {
    shippingCodeDoc = await ShippingCode.findByPk(shipping_code_id);
    if (!shippingCodeDoc || (shippingCodeDoc.quantity != null && shippingCodeDoc.quantity <= 0)) {
      return next(new APIError("Mã vận chuyển không khả dụng", 400));
    }
  }

  // 4. Tính toán tổng tiền
  let subtotal = 0;
  items.forEach(it => subtotal += parseFloat(it.variant.price || 0) * it.quantity);
  const couponDiscount = coupons.reduce((acc, c) => acc + Number(c.discount || 0), 0);
  const shipping_fee = Math.max(0, 30000 - Number(shippingCodeDoc?.discount || 0));
  const total_due = Math.max(0, subtotal - couponDiscount) + shipping_fee;

  // 5. Kiểm tra khách hàng & Ví (Sơ bộ)
  const clientId = req.user?.id;
  const client = await Client.findByPk(clientId);
  if (!client) return next(new APIError("Không tìm thấy khách hàng", 404));
  if (Number(client.wallet || 0) < total_due) {
    return next(new APIError("Số dư ví không đủ", 400));
  }

  // =========================================================
  // BẮT ĐẦU TRANSACTION - XỬ LÝ CONCURRENCY
  // =========================================================
  const t = await sequelize.transaction();
  try {
    // A. TRỪ TIỀN VÍ (Atomic Update)
    // Chỉ trừ nếu wallet >= total_due ngay tại thời điểm thực thi SQL
    const [affectedClient] = await Client.update(
      { wallet: literal(`wallet - ${total_due}`) },
      { 
        where: { id: clientId, wallet: { [Op.gte]: total_due } },
        transaction: t 
      }
    );

    if (affectedClient === 0) {
      throw new APIError("Số dư ví thay đổi hoặc không đủ. Vui lòng thử lại.", 400);
    }

    // B. TẠO ĐƠN HÀNG
    const order = await Order.create({
      payment_method: PAYMENT_METHODS.WALLET,
      total_price: Math.max(0, subtotal - couponDiscount),
      order_date: new Date(),
      shipping_address: shipping_address || null,
      shipping_fee,
      paid_at: new Date(),
      clientId,
      storeId,
    }, { transaction: t });

    // C. TRỪ TỒN KHO & TẠO ITEM (Atomic Update)
    const orderItemsPayload = [];
    for (const it of items) {
      const [affectedStock] = await ProductVariant.update(
        { stock_quantity: literal(`stock_quantity - ${it.quantity}`) },
        { 
          where: { id: it.variant.id, stock_quantity: { [Op.gte]: it.quantity } },
          transaction: t 
        }
      );

      if (affectedStock === 0) {
        throw new APIError(`Sản phẩm ${it.product.name} vừa hết hàng.`, 400);
      }

      orderItemsPayload.push({
        quantity: it.quantity,
        price: parseFloat(it.variant.price || 0),
        orderId: order.id,
        title: it.product.name,
        image: it.product.main_image,
        product_variantId: it.variant.id,
      });
    }
    await OrderItem.bulkCreate(orderItemsPayload, { transaction: t });

    // D. GIẢM SỐ LƯỢNG COUPON/SHIPPING CODE
    for (const c of coupons) await c.decrement("quantity", { by: 1, transaction: t });
    if (shippingCodeDoc) await shippingCodeDoc.decrement("quantity", { by: 1, transaction: t });

    // E. GHI NHẬN GIAO DỊCH
    const updatedClient = await Client.findByPk(clientId, { transaction: t });
    await Transaction.create({
      user_id: clientId,
      amount: -total_due,
      new_balance: updatedClient.wallet,
      payment_method: PAYMENT_METHODS.WALLET,
      type: TRANSACTION_TYPE.PAY_ORDER,
      status: "SUCCESS",
      description: `Thanh toán ví cho đơn hàng ${order.id}`,
    }, { transaction: t });

    await t.commit();

    // F. HẬU XỬ LÝ (QR CODE)
    const qrCodeFileName = `order-${order.id}-qr.jpg`;
    await generateQRCodeJPG(`${order.id}`, process.env.FILES_UPLOADS_PATH + "/orders", qrCodeFileName);
    order.qr_code = qrCodeFileName;
    if (coupons.length > 0) order.coupons = coupons.map(c => c.id);
    if (shippingCodeDoc) order.shipping_code = shippingCodeDoc.id;
    await order.save();

    const created = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: "OrderItems" }] });
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

  if (!order) return next(new APIError("Không tìm thấy đơn hàng của bạn.", 404));
  if (
    order.status !== ORDER_STATUS.PENDING &&
    order.status !== ORDER_STATUS.CONFIRMED
  ) {
    return next(new APIError("Chỉ có thể hủy đơn hàng khi đang chờ xác nhận hoặc đã xác nhận.", 400));
  }

  // Thực hiện cập nhật trong 1 transaction để atomic
  const t = await sequelize.transaction();
  try {
    // Nếu đơn hàng đang CONFIRMED và  thì hoàn lại tồn kho cho từng ProductVariant
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
        return next(new APIError("Không tìm thấy khách hàng để hoàn tiền.", 404));
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
        description: `Hoàn tiền cho đơn hàng đã hủy #${order.id}`,
      }, { transaction: t });
    }

      // Hoàn lại coupon nếu có
      if (order.coupons && Array.isArray(order.coupons) && order.coupons.length > 0) {
        for (const couponId of order.coupons) {
          const coupon = await Coupon.findByPk(couponId, { transaction: t, lock: t.LOCK.UPDATE });
          if (coupon) {
            await coupon.increment("quantity", { by: 1, transaction: t });
          }
        }
      }
      // Hoàn lại shipping code nếu có
      if (order.shipping_code) {
        const shippingCode = await ShippingCode.findByPk(order.shipping_code, { transaction: t, lock: t.LOCK.UPDATE });
        if (shippingCode) {
          await shippingCode.increment("quantity", { by: 1, transaction: t });
        }
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
  if (!order) return next(new APIError("Không tìm thấy đơn hàng.", 404));

  // Chỉ cho phép giao khi đơn hàng đang ở trạng thái ĐANG VẬN CHUYỂN
  if (order.status !== ORDER_STATUS.IN_TRANSIT) {
    return next(new APIError("Chỉ có thể xác nhận giao cho đơn hàng đang vận chuyển.", 400));
  }

  if (!order.shipperId || order.shipperId !== shipperId) {
    return next(new APIError("Bạn không phải là người được phân công giao đơn hàng này.", 403));
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
        await store.reload({ transaction: t });

        // record transaction for store income from sale
        await Transaction.create({
          user_id: store.id,
          amount: Number(storeWalletAdd),
          new_balance: store.wallet,
          payment_method: order.payment_method || "sale",
          type: TRANSACTION_TYPE.TOP_UP,
          status: "SUCCESS",
          description: `Doanh thu cửa hàng từ đơn hàng ${order.id}`,
        }, { transaction: t });
      }
    }

    // 2) Update shipper: wallet += shipping_fee, debt += total_price
    const shipper = await Shipper.findByPk(shipperId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!shipper) {
      await t.rollback();
      return next(new APIError("Không tìm thấy shipper.", 404));
    }

    const shippingFee = 20000;
    const orderTotal = Number(order.total_price || 0);

    // Luôn cộng shippingFee vào ví shipper, không quan tâm payment_method
    await shipper.increment("wallet", { by: shippingFee, transaction: t });
    await shipper.reload({ transaction: t });
    await Transaction.create({
      user_id: shipperId,
      amount: shippingFee,
      new_balance: shipper.wallet,
      payment_method: "system_shipping_fee",
      type: TRANSACTION_TYPE.TOP_UP,
      status: "SUCCESS",
      description: `Phí vận chuyển cho đơn hàng ${order.id}`,
    }, { transaction: t });

    // Nếu thanh toán bằng tiền mặt thì trừ tiền đơn hàng khỏi ví shipper
    if (order.payment_method === "cash") {
      order.paid_at = new Date();
      await shipper.decrement("wallet", { by: orderTotal, transaction: t });
      await shipper.reload({ transaction: t });
      await Transaction.create({
        user_id: shipperId,
        amount: -orderTotal,
        new_balance: shipper.wallet,
        payment_method: "cash",
        type: TRANSACTION_TYPE.PAY_ORDER,
        status: "SUCCESS",
        description: `Trừ tiền đơn hàng ${order.id}`,
      }, { transaction: t });
    }

    // 4) Mark order as delivered
    order.status = ORDER_STATUS.DELIVERED;
    order.image_shipping = req.body.image || null;
    await order.save({ transaction: t });

    await t.commit();

    res.status(200).json({ status: "success", message: "Đã xác nhận giao hàng thành công.", data: { order } });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
});

export const clientConfirmedOrder = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const { id } = req.params;
  const isReceived = req.query.isReceived;
  const order = await Order.findOne({ where: { id, clientId } });
  if (!order) return next(new APIError("Không tìm thấy đơn hàng.", 404));
  if (order.status !== ORDER_STATUS.DELIVERED) {
    return next(new APIError("Đơn hàng chưa ở trạng thái đã giao.", 400));
  }
  if (String(isReceived) === "false") {
    order.status = ORDER_STATUS.CLIENT_NOT_CONFIRMED;
  } else {
    order.status = ORDER_STATUS.CLIENT_CONFIRMED;
  }
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
      return next(new APIError("Trạng thái đơn hàng không hợp lệ", 400));
    }
    where.status = status;
  }
  // Build include array; optionally filter by client username
  const includes = [];
  // If clientname is provided, include Client with a where clause to filter by username
  const clientInclude = { model: Client, as: "OrderClient", attributes: ["id", "username"] };
  includes.push(clientInclude);

  includes.push({
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
  });

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: includes,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
  // Map Sequelize instances to plain objects and expose client info (username)
  const transformedRows = rows.map((r) => {
    const obj = typeof r.toJSON === "function" ? r.toJSON() : r;
    // include client under `client` and add simple `client_username` for convenience
    obj.client = obj.OrderClient || null;
    obj.client_username = obj.OrderClient ? obj.OrderClient.username : null;
    return obj;
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
    results: transformedRows.length,
    data: { orders: transformedRows },
  });
});