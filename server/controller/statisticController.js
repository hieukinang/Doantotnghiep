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

export const getStatisticUserFollowDateRange = asyncHandler(async (req, res, next) => {
	const { type, startdate: sd, enddate: ed, status } = req.query;

	// parse/normalize date range; if not provided default to last 30 days
	const msPerDay = 24 * 60 * 60 * 1000;
	let start, end;
	if (!sd || !ed) {
		end = new Date();
		end.setHours(0, 0, 0, 0);
		start = new Date(end.getTime() - (30 - 1) * msPerDay);
	} else {
		start = parseYMD(sd);
		end = parseYMD(ed);
		if (!start) return next(new APIError("startdate không hợp lệ, phải theo định dạng YYYY-MM-DD", 400));
		if (!end) return next(new APIError("enddate không hợp lệ, phải theo định dạng YYYY-MM-DD", 400));
	}

	if (start.getTime() > end.getTime()) return next(new APIError("startdate phải nhỏ hơn hoặc bằng enddate", 400));

	const dayDiff = Math.floor((end - start) / msPerDay) + 1;
	if (dayDiff > 31) return next(new APIError("Khoảng thời gian không được vượt quá 30 ngày", 400));

	const startStr = formatYMD(start);
	const endStr = formatYMD(end);

	// Determine which types to include
	const chosenType = type ? String(type).trim().toUpperCase() : null;
	const VALID_TYPES = ["ADMIN", "CLIENT", "STORE", "SHIPPER"];
	if (chosenType && !VALID_TYPES.includes(chosenType)) return next(new APIError("Tham số 'type' không hợp lệ", 400));

	const typesToQuery = chosenType ? [chosenType] : VALID_TYPES.slice();

	// helper to run a per-table date aggregation on createdAt
	const runTableQuery = async (tableName, statusClause, repls) => {
		const sql = `
			SELECT DATE(createdAt) AS date, COUNT(*) AS cnt
			FROM ${tableName}
			WHERE DATE(createdAt) BETWEEN :start AND :end
			${statusClause}
			GROUP BY DATE(createdAt)
			ORDER BY DATE(createdAt) ASC
		`;
		return await sequelize.query(sql, { replacements: { start: startStr, end: endStr, ...(repls || {}) }, type: sequelize.QueryTypes.SELECT });
	};

	// Collect maps per type
	const maps = {
		ADMIN: {},
		CLIENT: {},
		STORE: {},
		SHIPPER: {},
	};

	for (const t of typesToQuery) {
		if (t === "ADMIN") {
			let statusClause = "";
			const repls = {};
			if (status !== undefined && status !== null && String(status).trim() !== "") {
				const s = String(status).trim().toLowerCase();
				let activeVal = null;
				if (s === "true" || s === "1") activeVal = 1;
				else if (s === "false" || s === "0") activeVal = 0;
				else if (s === "active") activeVal = 1;
				else if (s === "inactive") activeVal = 0;
				if (activeVal === null) return next(new APIError("Giá trị 'status' không hợp lệ cho ADMIN", 400));
				statusClause = " AND active = :status_val ";
				repls.status_val = activeVal;
			}
			const rows = await runTableQuery("admins", statusClause, repls);
			for (const r of rows) maps.ADMIN[r.date] = Number(r.cnt || 0);
		}

		if (t === "CLIENT") {
			let statusClause = "";
			const repls = {};
			if (status !== undefined && status !== null && String(status).trim() !== "") {
				statusClause = " AND status = :status_val ";
				repls.status_val = String(status).trim();
			}
			const rows = await runTableQuery("clients", statusClause, repls);
			for (const r of rows) maps.CLIENT[r.date] = Number(r.cnt || 0);
		}

		if (t === "STORE") {
			let statusClause = "";
			const repls = {};
			if (status !== undefined && status !== null && String(status).trim() !== "") {
				statusClause = " AND status = :status_val ";
				repls.status_val = String(status).trim();
			}
			const rows = await runTableQuery("stores", statusClause, repls);
			for (const r of rows) maps.STORE[r.date] = Number(r.cnt || 0);
		}

		if (t === "SHIPPER") {
			let statusClause = "";
			const repls = {};
			if (status !== undefined && status !== null && String(status).trim() !== "") {
				statusClause = " AND status = :status_val ";
				repls.status_val = String(status).trim();
			}
			const rows = await runTableQuery("shippers", statusClause, repls);
			for (const r of rows) maps.SHIPPER[r.date] = Number(r.cnt || 0);
		}
	}

	// Build daily array
	const daily = [];
	let totals = { ADMIN: 0, CLIENT: 0, STORE: 0, SHIPPER: 0, TOTAL: 0 };
	for (let i = 0; i < dayDiff; i++) {
		const cur = new Date(start.getTime() + i * msPerDay);
		const key = formatYMD(cur);
		const a = maps.ADMIN[key] || 0;
		const c = maps.CLIENT[key] || 0;
		const s = maps.STORE[key] || 0;
		const sh = maps.SHIPPER[key] || 0;
		const total = a + c + s + sh;
		totals.ADMIN += a; totals.CLIENT += c; totals.STORE += s; totals.SHIPPER += sh; totals.TOTAL += total;
		if (chosenType) {
			// only return the requested type counts
			switch (chosenType) {
				case 'ADMIN': daily.push({ date: key, count: a }); break;
				case 'CLIENT': daily.push({ date: key, count: c }); break;
				case 'STORE': daily.push({ date: key, count: s }); break;
				case 'SHIPPER': daily.push({ date: key, count: sh }); break;
			}
		} else {
			daily.push({ date: key, admin: a, client: c, store: s, shipper: sh, total });
		}
	}

	if (chosenType) {
		const t = chosenType;
		return res.status(200).json({ status: "success", data: { type: t, startdate: startStr, enddate: endStr, daily, total: totals[t] } });
	}

	return res.status(200).json({ status: "success", data: { startdate: startStr, enddate: endStr, daily, totals } });

});

export const getStatisticUserFollowYear = asyncHandler(async (req, res, next) => {
	const { type, year, status } = req.query;

	if (!year) return next(new APIError("Vui lòng truyền 'year' (ví dụ: 2025)", 400));
	const y = parseInt(String(year).trim(), 10);
	if (Number.isNaN(y) || y < 2023 || y > 9999) return next(new APIError("Giá trị 'year' không hợp lệ", 400));

	const chosenType = type ? String(type).trim().toUpperCase() : null;
	const VALID_TYPES = ["ADMIN", "CLIENT", "STORE", "SHIPPER"];
	if (chosenType && !VALID_TYPES.includes(chosenType)) return next(new APIError("Tham số 'type' không hợp lệ", 400));
	const typesToQuery = chosenType ? [chosenType] : VALID_TYPES.slice();

	const runTableQueryYear = async (tableName, statusClause, repls) => {
		const sql = `
			SELECT MONTH(createdAt) AS month, COUNT(*) AS cnt
			FROM ${tableName}
			WHERE YEAR(createdAt) = :year
			${statusClause}
			GROUP BY MONTH(createdAt)
			ORDER BY MONTH(createdAt) ASC
		`;
		return await sequelize.query(sql, { replacements: { year: y, ...(repls || {}) }, type: sequelize.QueryTypes.SELECT });
	};

	const maps = { ADMIN: {}, CLIENT: {}, STORE: {}, SHIPPER: {} };

	for (const t of typesToQuery) {
		if (t === "ADMIN") {
			let statusClause = "";
			const repls = {};
			if (status !== undefined && status !== null && String(status).trim() !== "") {
				const s = String(status).trim().toLowerCase();
				let activeVal = null;
				if (s === "true" || s === "1") activeVal = 1;
				else if (s === "false" || s === "0") activeVal = 0;
				else if (s === "active") activeVal = 1;
				else if (s === "inactive") activeVal = 0;
				if (activeVal === null) return next(new APIError("Giá trị 'status' không hợp lệ cho ADMIN", 400));
				statusClause = " AND active = :status_val ";
				repls.status_val = activeVal;
			}
			const rows = await runTableQueryYear("admins", statusClause, repls);
			for (const r of rows) maps.ADMIN[Number(r.month)] = Number(r.cnt || 0);
		}

		if (t === "CLIENT") {
			let statusClause = "";
			const repls = {};
			if (status !== undefined && status !== null && String(status).trim() !== "") {
				statusClause = " AND status = :status_val ";
				repls.status_val = String(status).trim();
			}
			const rows = await runTableQueryYear("clients", statusClause, repls);
			for (const r of rows) maps.CLIENT[Number(r.month)] = Number(r.cnt || 0);
		}

		if (t === "STORE") {
			let statusClause = "";
			const repls = {};
			if (status !== undefined && status !== null && String(status).trim() !== "") {
				statusClause = " AND status = :status_val ";
				repls.status_val = String(status).trim();
			}
			const rows = await runTableQueryYear("stores", statusClause, repls);
			for (const r of rows) maps.STORE[Number(r.month)] = Number(r.cnt || 0);
		}

		if (t === "SHIPPER") {
			let statusClause = "";
			const repls = {};
			if (status !== undefined && status !== null && String(status).trim() !== "") {
				statusClause = " AND status = :status_val ";
				repls.status_val = String(status).trim();
			}
			const rows = await runTableQueryYear("shippers", statusClause, repls);
			for (const r of rows) maps.SHIPPER[Number(r.month)] = Number(r.cnt || 0);
		}
	}

	const monthly = [];
	let totals = { ADMIN: 0, CLIENT: 0, STORE: 0, SHIPPER: 0, TOTAL: 0 };
	for (let m = 1; m <= 12; m++) {
		const a = maps.ADMIN[m] || 0;
		const c = maps.CLIENT[m] || 0;
		const s = maps.STORE[m] || 0;
		const sh = maps.SHIPPER[m] || 0;
		const total = a + c + s + sh;
		totals.ADMIN += a; totals.CLIENT += c; totals.STORE += s; totals.SHIPPER += sh; totals.TOTAL += total;
		if (chosenType) {
			switch (chosenType) {
				case 'ADMIN': monthly.push({ month: m, count: a }); break;
				case 'CLIENT': monthly.push({ month: m, count: c }); break;
				case 'STORE': monthly.push({ month: m, count: s }); break;
				case 'SHIPPER': monthly.push({ month: m, count: sh }); break;
			}
		} else {
			monthly.push({ month: m, admin: a, client: c, store: s, shipper: sh, total });
		}
	}

	if (chosenType) {
		const t = chosenType;
		return res.status(200).json({ status: "success", data: { type: t, year: y, monthly, total: totals[t] } });
	}

	return res.status(200).json({ status: "success", data: { year: y, monthly, totals } });
});

export const getStatisticOrderFollowDateRange = asyncHandler(async (req, res, next) => {
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

	const startStr = formatYMD(start);
	const endStr = formatYMD(end);

	const sql = `
		SELECT o.order_date AS date, COUNT(DISTINCT o.id) AS orders_count
		FROM orders o
		WHERE o.order_date BETWEEN :start AND :end
		GROUP BY o.order_date
		ORDER BY o.order_date ASC
	`;

	const rows = await sequelize.query(sql, {
		replacements: { start: startStr, end: endStr },
		type: sequelize.QueryTypes.SELECT,
	});

	const map = {};
	for (const r of rows) {
		map[r.date] = Number(r.orders_count || 0);
	}

	const daily = [];
	let totalOrders = 0;
	for (let d = 0; d < dayDiff; d++) {
		const cur = new Date(start.getTime() + d * msPerDay);
		const key = formatYMD(cur);
		const cnt = map[key] || 0;
		daily.push({ date: key, orders_count: cnt });
		totalOrders += cnt;
	}

	return res.status(200).json({ status: "success", data: { startdate: startStr, enddate: endStr, daily, totalOrders } });
});

export const getStatisticRevenueFollowDateRange = asyncHandler(async (req, res, next) => {
	const { startdate, enddate } = req.query;

	if (!startdate || !enddate) return next(new APIError("Vui lòng truyền cả 'startdate' và 'enddate' dưới dạng YYYY-MM-DD", 400));

	const start = parseYMD(startdate);
	const end = parseYMD(enddate);
	if (!start) return next(new APIError("startdate không hợp lệ, phải theo định dạng YYYY-MM-DD", 400));
	if (!end) return next(new APIError("enddate không hợp lệ, phải theo định dạng YYYY-MM-DD", 400));
	if (start.getTime() > end.getTime()) return next(new APIError("startdate phải nhỏ hơn hoặc bằng enddate", 400));

	const msPerDay = 24 * 60 * 60 * 1000;
	const dayDiff = Math.floor((end - start) / msPerDay) + 1;
	if (dayDiff > 31) return next(new APIError("Khoảng thời gian không được vượt quá 31 ngày", 400));

	const startStr = formatYMD(start);
	const endStr = formatYMD(end);

	// consider only completed orders
	const statuses = [ORDER_STATUS.DELIVERED, ORDER_STATUS.CLIENT_CONFIRMED];
	const statusesSql = statuses.map(s => `'${s}'`).join(",");

	// revenue per order = total_price * 0.8 + (shipping_fee - 21000)
	const sql = `
		SELECT o.order_date AS date, SUM((COALESCE(o.total_price,0) * 0.2) + (COALESCE(o.shipping_fee,0) - 21000)) AS revenue
		FROM orders o
		WHERE o.order_date BETWEEN :start AND :end
		  AND o.status IN (${statusesSql})
		GROUP BY o.order_date
		ORDER BY o.order_date ASC
	`;

	const rows = await sequelize.query(sql, {
		replacements: { start: startStr, end: endStr },
		type: sequelize.QueryTypes.SELECT,
	});

	const map = {};
	for (const r of rows) {
		map[r.date] = Number(r.revenue || 0);
	}

	const daily = [];
	let totalRevenue = 0;
	for (let d = 0; d < dayDiff; d++) {
		const cur = new Date(start.getTime() + d * msPerDay);
		const key = formatYMD(cur);
		const rev = map[key] || 0;
		daily.push({ date: key, revenue: rev });
		totalRevenue += rev;
	}

	return res.status(200).json({ status: "success", data: { startdate: startStr, enddate: endStr, daily, totalRevenue } });
});

export const getStatisticRevenueFollowYear = asyncHandler(async (req, res, next) => {
	const { year } = req.query;

	if (!year) return next(new APIError("Vui lòng truyền 'year' (ví dụ: 2025)", 400));
	const y = parseInt(String(year).trim(), 10);
	if (Number.isNaN(y) || y < 2023 || y > 9999) return next(new APIError("Giá trị 'year' không hợp lệ", 400));

	// consider only completed orders
	const statuses = [ORDER_STATUS.DELIVERED, ORDER_STATUS.CLIENT_CONFIRMED];
	const statusesSql = statuses.map(s => `'${s}'`).join(",");

	const sql = `
		SELECT MONTH(o.order_date) AS month, SUM((COALESCE(o.total_price,0) * 0.2) + (COALESCE(o.shipping_fee,0) - 21000)) AS revenue
		FROM orders o
		WHERE YEAR(o.order_date) = :year
		  AND o.status IN (${statusesSql})
		GROUP BY MONTH(o.order_date)
		ORDER BY MONTH(o.order_date) ASC
	`;

	const rows = await sequelize.query(sql, {
		replacements: { year: y },
		type: sequelize.QueryTypes.SELECT,
	});

	const map = {};
	for (const r of rows) {
		map[Number(r.month)] = Number(r.revenue || 0);
	}

	const monthly = [];
	let totalRevenue = 0;
	for (let m = 1; m <= 12; m++) {
		const rev = map[m] || 0;
		monthly.push({ month: m, revenue: rev });
		totalRevenue += rev;
	}

	return res.status(200).json({ status: "success", data: { year: y, monthly, totalRevenue } });
});