import Product from "../model/productModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import { sequelize } from "../config/db.js";
import { ORDER_STATUS } from "../constants/index.js";

// small helpers for local Y-M-D parsing/formatting
const parseYMD = (s) => {
	if (!s || String(s).trim().length === 0) return null;
	const parts = String(s).trim().split("-");
	if (parts.length !== 3) return null;
	const y = parseInt(parts[0], 10);
	const m = parseInt(parts[1], 10);
	const d = parseInt(parts[2], 10);
	if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
	return new Date(y, m - 1, d);
};
const formatYMD = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

// @desc Lay thong ke san pham theo khoang ngay thang
export const getStatisticProductFollowDateRange = asyncHandler(async (req, res, next) => {
		const storeId = req.user && req.user.id;
		const productId = req.params.id;
		const { startdate, enddate } = req.query;

		// Validate product id
		if (!productId) return next(new APIError("Thiếu tham số id sản phẩm", 400));

		// Validate dates (expect YYYY-MM-DD). Parse as local dates to avoid timezone shifts.
		if (!startdate || !enddate) return next(new APIError("Vui lòng truyền cả 'startdate' và 'enddate' dưới dạng YYYY-MM-DD", 400));
		const parseYMD = (s) => {
			if (!s || String(s).trim().length === 0) return null;
			const parts = String(s).trim().split("-");
			if (parts.length !== 3) return null;
			const y = parseInt(parts[0], 10);
			const m = parseInt(parts[1], 10);
			const d = parseInt(parts[2], 10);
			if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
			// Create local date at midnight for given Y-M-D
			return new Date(y, m - 1, d);
		};
		const formatYMD = (dt) => {
			return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
		};

		const start = parseYMD(startdate);
		const end = parseYMD(enddate);
		if (!start) return next(new APIError("startdate không hợp lệ, phải theo định dạng YYYY-MM-DD", 400));
		if (!end) return next(new APIError("enddate không hợp lệ, phải theo định dạng YYYY-MM-DD", 400));
		if (start.getTime() > end.getTime()) return next(new APIError("startdate phải nhỏ hơn hoặc bằng enddate", 400));

		// Enforce maximum range of 30 days (inclusive)
		const msPerDay = 24 * 60 * 60 * 1000;
		const dayDiff = Math.floor((end - start) / msPerDay) + 1;
		if (dayDiff > 31) return next(new APIError("Khoảng thời gian không được vượt quá 30 ngày", 400));

		// Check product exists and belongs to store (if route is protected for stores)
		const product = await Product.findByPk(productId);
		if (!product) return next(new APIError("Không tìm thấy sản phẩm", 404));
		if (String(product.storeId) !== String(storeId)) return next(new APIError("Sản phẩm không thuộc cửa hàng của bạn", 403));

		// Use raw SQL aggregation for performance: sum quantity grouped by order_date
		const startStr = formatYMD(start);
		const endStr = formatYMD(end);

		// Consider only completed/delivered orders
		const statuses = [ORDER_STATUS.DELIVERED, ORDER_STATUS.CLIENT_CONFIRMED];
		const statusesSql = statuses.map(s => `'${s}'`).join(",");

		const sql = `
			SELECT o.order_date AS date, SUM(oi.quantity) AS sold
			FROM order_items oi
			JOIN orders o ON oi.orderId = o.id
			JOIN product_variants pv ON oi.product_variantId = pv.id
			JOIN products p ON pv.productId = p.id
			WHERE p.id = :productId
				AND p.storeId = :storeId
				AND o.order_date BETWEEN :start AND :end
				AND o.status IN (${statusesSql})
			GROUP BY o.order_date
			ORDER BY o.order_date ASC
		`;

		const rows = await sequelize.query(sql, {
			replacements: { productId, storeId, start: startStr, end: endStr },
			type: sequelize.QueryTypes.SELECT,
		});

		// Build a map of date -> sold
		const soldMap = {};
		for (const r of rows) {
			// r.date is yyyy-mm-dd
			soldMap[r.date] = Number(r.sold || 0);
		}

		// Build daily array for each date in range
		const daily = [];
		let total = 0;
		for (let d = 0; d < dayDiff; d++) {
			const cur = new Date(start.getTime() + d * msPerDay);
			const key = formatYMD(cur);
			const sold = soldMap[key] || 0;
			daily.push({ date: key, sold });
			total += sold;
		}

		return res.status(200).json({ status: "success", data: { productId, startdate: startStr, enddate: endStr, daily, total } });

});

// @desc Thống kê số lượng bán theo tháng trong 1 năm cho 1 product (của store)
// @route GET /store/product/:id/year?year=YYYY
// @access Private(Store)
export const getStatisticProductFollowYear = asyncHandler(async (req, res, next) => {

	const storeId = req.user && req.user.id;
	const productId = req.params.id;
	const { year } = req.query;

	if (!productId) return next(new APIError("Thiếu tham số id sản phẩm", 400));
	if (!year) return next(new APIError("Vui lòng truyền 'year' (ví dụ: 2025)", 400));
	const y = parseInt(String(year).trim(), 10);
	if (Number.isNaN(y) || y < 2023 || y > 9999) return next(new APIError("Giá trị 'year' không hợp lệ", 400));

	// Check product exists and belongs to store
	const product = await Product.findByPk(productId);
	if (!product) return next(new APIError("Không tìm thấy sản phẩm", 404));
	if (String(product.storeId) !== String(storeId)) return next(new APIError("Sản phẩm không thuộc cửa hàng của bạn", 403));

	// Only consider delivered/confirmed orders
	const statuses = [ORDER_STATUS.DELIVERED, ORDER_STATUS.CLIENT_CONFIRMED];
	const statusesSql = statuses.map(s => `'${s}'`).join(",");

	const sql = `
		SELECT MONTH(o.order_date) AS month, SUM(oi.quantity) AS sold
		FROM order_items oi
		JOIN orders o ON oi.orderId = o.id
		JOIN product_variants pv ON oi.product_variantId = pv.id
		JOIN products p ON pv.productId = p.id
		WHERE p.id = :productId
		  AND p.storeId = :storeId
		  AND YEAR(o.order_date) = :year
		  AND o.status IN (${statusesSql})
		GROUP BY MONTH(o.order_date)
		ORDER BY MONTH(o.order_date) ASC
	`;

	const rows = await sequelize.query(sql, {
		replacements: { productId, storeId, year: y },
		type: sequelize.QueryTypes.SELECT,
	});

	const soldMap = {};
	for (const r of rows) {
		// r.month is number (1..12)
		soldMap[Number(r.month)] = Number(r.sold || 0);
	}

	const monthly = [];
	let total = 0;
	for (let m = 1; m <= 12; m++) {
		const sold = soldMap[m] || 0;
		monthly.push({ month: m, sold });
		total += sold;
	}

	return res.status(200).json({ status: "success", data: { productId, year: y, monthly, total } });

});

// @desc Thống kê doanh thu và số lượng đơn theo ngày trong khoảng cho cửa hàng
// @route GET /store/sales?startdate=YYYY-MM-DD&enddate=YYYY-MM-DD
// @access Private(Store)
export const getStatisticSalesFollowDateRange = asyncHandler(async (req, res, next) => {
		const storeId = req.user && req.user.id;
		const { startdate, enddate } = req.query;

		if (!startdate || !enddate) return next(new APIError("Vui lòng truyền cả 'startdate' và 'enddate' dưới dạng YYYY-MM-DD", 400));
		const start = parseYMD(startdate);
		const end = parseYMD(enddate);
		if (!start) return next(new APIError("startdate không hợp lệ, phải theo định dạng YYYY-MM-DD", 400));
		if (!end) return next(new APIError("enddate không hợp lệ, phải theo định dạng YYYY-MM-DD", 400));
		if (start.getTime() > end.getTime()) return next(new APIError("startdate phải nhỏ hơn hoặc bằng enddate", 400));

		const msPerDay = 24 * 60 * 60 * 1000;
		const dayDiff = Math.floor((end - start) / msPerDay) + 1;
		if (dayDiff > 31) return next(new APIError("Khoảng thời gian không được vượt quá 30 ngày", 400));

		// Consider only delivered/confirmed orders
		const statuses = [ORDER_STATUS.DELIVERED, ORDER_STATUS.CLIENT_CONFIRMED];
		const statusesSql = statuses.map(s => `'${s}'`).join(",");

		const startStr = formatYMD(start);
		const endStr = formatYMD(end);

		const sql = `
			SELECT o.order_date AS date, COUNT(DISTINCT o.id) AS orders_count, SUM(COALESCE(o.total_price,0) + COALESCE(o.shipping_fee,0)) AS revenue
			FROM orders o
			WHERE o.storeId = :storeId
				AND o.order_date BETWEEN :start AND :end
				AND o.status IN (${statusesSql})
			GROUP BY o.order_date
			ORDER BY o.order_date ASC
		`;

		const rows = await sequelize.query(sql, {
			replacements: { storeId, start: startStr, end: endStr },
			type: sequelize.QueryTypes.SELECT,
		});

		const map = {};
		for (const r of rows) {
			map[r.date] = { orders_count: Number(r.orders_count || 0), revenue: Number(r.revenue || 0) };
		}

		const daily = [];
		let totalOrders = 0;
		let totalRevenue = 0;
		for (let d = 0; d < dayDiff; d++) {
			const cur = new Date(start.getTime() + d * msPerDay);
			const key = formatYMD(cur);
			const entry = map[key] || { orders_count: 0, revenue: 0 };
			daily.push({ date: key, orders_count: entry.orders_count, revenue: entry.revenue });
			totalOrders += entry.orders_count;
			totalRevenue += entry.revenue;
		}

		return res.status(200).json({ status: "success", data: { startdate: startStr, enddate: endStr, daily, totalOrders, totalRevenue } });
});

// @desc Thống kê doanh thu và số lượng đơn theo tháng trong 1 năm cho cửa hàng
// @route GET /store/sales/year?year=YYYY
// @access Private(Store)
export const getStatisticSalesFollowYear = asyncHandler(async (req, res, next) => {
		const storeId = req.user && req.user.id;
		const { year } = req.query;

		if (!year) return next(new APIError("Vui lòng truyền 'year' (ví dụ: 2025)", 400));
		const y = parseInt(String(year).trim(), 10);
		if (Number.isNaN(y) || y < 1900 || y > 9999) return next(new APIError("Giá trị 'year' không hợp lệ", 400));

		const statuses = [ORDER_STATUS.DELIVERED, ORDER_STATUS.CLIENT_CONFIRMED];
		const statusesSql = statuses.map(s => `'${s}'`).join(",");

		const sql = `
			SELECT MONTH(o.order_date) AS month, COUNT(DISTINCT o.id) AS orders_count, SUM(COALESCE(o.total_price,0) + COALESCE(o.shipping_fee,0)) AS revenue
			FROM orders o
			WHERE o.storeId = :storeId
				AND YEAR(o.order_date) = :year
				AND o.status IN (${statusesSql})
			GROUP BY MONTH(o.order_date)
			ORDER BY MONTH(o.order_date) ASC
		`;

		const rows = await sequelize.query(sql, {
			replacements: { storeId, year: y },
			type: sequelize.QueryTypes.SELECT,
		});

		const map = {};
		for (const r of rows) {
			map[Number(r.month)] = { orders_count: Number(r.orders_count || 0), revenue: Number(r.revenue || 0) };
		}

		const monthly = [];
		let totalOrders = 0;
		let totalRevenue = 0;
		for (let m = 1; m <= 12; m++) {
			const e = map[m] || { orders_count: 0, revenue: 0 };
			monthly.push({ month: m, orders_count: e.orders_count, revenue: e.revenue });
			totalOrders += e.orders_count;
			totalRevenue += e.revenue;
		}

		return res.status(200).json({ status: "success", data: { year: y, monthly, totalOrders, totalRevenue } });
});

