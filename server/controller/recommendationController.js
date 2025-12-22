import asyncHandler from "../utils/asyncHandler.utils.js";
import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";
import APIError from "../utils/apiError.utils.js";
import Product from "../model/productModel.js";
import Store from "../model/storeModel.js";
import { PRODUCT_STATUS } from "../constants/index.js";

// GET /products/top-sold-today?page=1
export const getTopSoldProductsToday = asyncHandler(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const pageSize = 10;

  // Use DATEONLY field comparison; get today's date in YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  const sql = `
    SELECT p.id, p.name, p.main_image, SUM(oi.quantity) AS totalSold
    FROM order_items oi
    JOIN orders o ON o.id = oi.orderId
    JOIN product_variants pv ON pv.id = oi.product_variantId
    JOIN products p ON p.id = pv.productId
    WHERE o.order_date = :today
    GROUP BY p.id, p.name, p.main_image
    ORDER BY totalSold DESC
    LIMIT 50
  `;

  const rows = await sequelize.query(sql, {
    replacements: { today },
    type: QueryTypes.SELECT,
  });

  if (!rows || rows.length === 0) {
    return res.status(200).json({ status: "success", results: 0, page, totalPages: 0, data: [] });
  }

  const totalItems = rows.length; // up to 50
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  if (page > totalPages) return next(new APIError("Page out of range", 400));

  const start = (page - 1) * pageSize;
  const pageData = rows.slice(start, start + pageSize).map((r) => ({
    id: r.id,
    name: r.name,
    main_image: r.main_image && String(r.main_image).startsWith("http") ? r.main_image : (r.main_image ? `${process.env.BASE_URL}/products/${r.main_image}` : null),
    totalSold: Number(r.totalSold) || 0,
  }));

  res.status(200).json({ status: "success", results: pageData.length, page, totalPages, data: pageData });
});

export const getRandomProducts = asyncHandler(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const pageSize = 10;

  // Fetch up to 50 random products. Use sequelize.random() for cross-dialect random ordering.
  const products = await Product.findAll({
    where: { status: PRODUCT_STATUS.ACTIVE },
    order: sequelize.random(),
    limit: 50,
  });

  if (!products || products.length === 0) {
    return res.status(200).json({ status: "success", results: 0, page, totalPages: 0, data: [] });
  }

  const totalItems = products.length; // up to 50
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  if (page > totalPages) return next(new APIError("Page out of range", 400));

  const start = (page - 1) * pageSize;
  const pageData = products.slice(start, start + pageSize);

  res.status(200).json({ status: "success", results: pageData.length, page, totalPages, data: pageData });
});

export const getTopDiscountedProducts = asyncHandler(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const pageSize = 10;

  const today = new Date().toISOString().slice(0, 10);

  const sql = `
    SELECT p.id, p.name, p.main_image, p.min_price, p.discount,
      (p.min_price * p.discount / 100.0) AS product_discount_amount,
      COALESCE((
        SELECT MAX(c.discount) FROM coupons c
        WHERE c.storeId = p.storeId
          AND c.quantity > 0
          AND (c.expire IS NULL OR DATE(c.expire) >= :today)
      ), 0) AS store_coupon,
      COALESCE((
        SELECT MAX(c2.discount) FROM coupons c2
        WHERE c2.storeId IS NULL
          AND c2.quantity > 0
          AND (c2.expire IS NULL OR DATE(c2.expire) >= :today)
      ), 0) AS global_coupon,
      (COALESCE((
        SELECT MAX(c.discount) FROM coupons c
        WHERE c.storeId = p.storeId
          AND c.quantity > 0
          AND (c.expire IS NULL OR DATE(c.expire) >= :today)
      ), 0) + COALESCE((
        SELECT MAX(c2.discount) FROM coupons c2
        WHERE c2.storeId IS NULL
          AND c2.quantity > 0
          AND (c2.expire IS NULL OR DATE(c2.expire) >= :today)
      ), 0)) AS coupon_discount
    FROM products p
    WHERE p.status = :activeStatus
    ORDER BY ((p.min_price * p.discount / 100.0) + (
        COALESCE((
          SELECT MAX(c.discount) FROM coupons c
          WHERE c.storeId = p.storeId
            AND c.quantity > 0
            AND (c.expire IS NULL OR DATE(c.expire) >= :today)
        ), 0) + COALESCE((
          SELECT MAX(c2.discount) FROM coupons c2
          WHERE c2.storeId IS NULL
            AND c2.quantity > 0
            AND (c2.expire IS NULL OR DATE(c2.expire) >= :today)
        ), 0)
      )) DESC
    LIMIT 50
  `;

  const rows = await sequelize.query(sql, {
    replacements: { today, activeStatus: PRODUCT_STATUS.ACTIVE },
    type: QueryTypes.SELECT,
  });

  if (!rows || rows.length === 0) {
    return res.status(200).json({ status: "success", results: 0, page, totalPages: 0, data: [] });
  }

  const totalItems = rows.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  if (page > totalPages) return next(new APIError("Page out of range", 400));

  const start = (page - 1) * pageSize;
  const pageData = rows.slice(start, start + pageSize).map((r) => ({
    id: r.id,
    name: r.name,
    main_image: r.main_image && String(r.main_image).startsWith("http") ? r.main_image : (r.main_image ? `${process.env.BASE_URL}/products/${r.main_image}` : null),
    min_price: Number(r.min_price),
    discount_percent: Number(r.discount) || 0,
    product_discount_amount: Number(r.product_discount_amount) || 0,
    coupon_discount: Number(r.coupon_discount) || 0,
    total_discount: (Number(r.product_discount_amount) || 0) + (Number(r.coupon_discount) || 0),
    final_price: Number(r.min_price) - ((Number(r.product_discount_amount) || 0) + (Number(r.coupon_discount) || 0)),
  }));

  res.status(200).json({ status: "success", results: pageData.length, page, totalPages, data: pageData });
});

// GET /products/by-category?name=...&page=1
export const getProductsByCategoryName = asyncHandler(async (req, res, next) => {
  const name = req.query.name;
  if (!name) return next(new APIError("Query parameter 'name' is required", 400));

  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const pageSize = 10;

  const sql = `
    SELECT p.id, p.name, p.main_image, p.min_price, p.discount, p.status, p.storeId
    FROM products p
    JOIN categories c ON c.id = p.categoryId
    WHERE LOWER(c.name) = LOWER(:name) AND p.status = :activeStatus
    LIMIT 50
  `;

  const rows = await sequelize.query(sql, {
    replacements: { name, activeStatus: PRODUCT_STATUS.ACTIVE },
    type: QueryTypes.SELECT,
  });

  if (!rows || rows.length === 0) {
    return res.status(200).json({ status: "success", results: 0, page, totalPages: 0, data: [] });
  }

  const totalItems = rows.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  if (page > totalPages) return next(new APIError("Page out of range", 400));

  const start = (page - 1) * pageSize;
  const pageData = rows.slice(start, start + pageSize).map((r) => ({
    id: r.id,
    name: r.name,
    main_image: r.main_image && String(r.main_image).startsWith("http") ? r.main_image : (r.main_image ? `${process.env.BASE_URL}/products/${r.main_image}` : null),
    min_price: Number(r.min_price),
    discount_percent: Number(r.discount) || 0,
    status: r.status,
    storeId: r.storeId,
  }));

  res.status(200).json({ status: "success", results: pageData.length, page, totalPages, data: pageData });
});

// GET /products/purchased?page=1[&clientId=...]
export const getPurchasedProducts = asyncHandler(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const pageSize = 10;

  // allow admin to pass clientId as query, otherwise use authenticated user
  const clientId = req.user.id;
  if (!clientId) return next(new APIError("clientId query or authentication required", 401));

  const sql = `
    SELECT DISTINCT p.id, p.name, p.main_image, p.min_price, p.discount, p.status, p.storeId
    FROM products p
    JOIN product_variants pv ON pv.productId = p.id
    JOIN order_items oi ON oi.product_variantId = pv.id
    JOIN orders o ON o.id = oi.orderId
    WHERE o.clientId = :clientId
    LIMIT 50
  `;

  const rows = await sequelize.query(sql, {
    replacements: { clientId },
    type: QueryTypes.SELECT,
  });

  if (!rows || rows.length === 0) {
    return res.status(200).json({ status: "success", results: 0, page, totalPages: 0, data: [] });
  }

  const totalItems = rows.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  if (page > totalPages) return next(new APIError("Page out of range", 400));

  const start = (page - 1) * pageSize;
  const pageData = rows.slice(start, start + pageSize).map((r) => ({
    id: r.id,
    name: r.name,
    main_image: r.main_image && String(r.main_image).startsWith("http") ? r.main_image : (r.main_image ? `${process.env.BASE_URL}/products/${r.main_image}` : null),
    min_price: Number(r.min_price),
    discount_percent: Number(r.discount) || 0,
    status: r.status,
    storeId: r.storeId,
  }));

  res.status(200).json({ status: "success", results: pageData.length, page, totalPages, data: pageData });
});

// GET /products/mall-random?page=1
export const getMallRandomProducts = asyncHandler(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const pageSize = 10;

  const products = await Product.findAll({
    include: [{ model: Store, as: "ProductStore", where: { is_mall: true }, attributes: [] }],
    where: { status: PRODUCT_STATUS.ACTIVE },
    order: sequelize.random(),
    limit: 50,
  });

  if (!products || products.length === 0) {
    return res.status(200).json({ status: "success", results: 0, page, totalPages: 0, data: [] });
  }

  const totalItems = products.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  if (page > totalPages) return next(new APIError("Page out of range", 400));

  const start = (page - 1) * pageSize;
  const pageData = products.slice(start, start + pageSize).map((p) => ({
    id: p.id,
    name: p.name,
    main_image: p.main_image,
    min_price: p.min_price,
    discount_percent: p.discount,
    storeId: p.storeId,
  }));

  res.status(200).json({ status: "success", results: pageData.length, page, totalPages, data: pageData });
});


