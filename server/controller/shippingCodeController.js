import ShippingCode from "../model/shippingCodeModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";

// @desc Create a shipping code (Admin)
// @route POST /api/shipping-codes
// @access Admin
export const createShippingCode = asyncHandler(async (req, res, next) => {
  const adminId = req.user && req.user.id;
  if (!adminId) return next(new APIError("Authentication required", 401));

  const { code, description, discount, quantity, expire } = req.body;
  if (!code || discount === undefined) return next(new APIError("code and discount are required", 400));
  if(expire && new Date(expire) <= new Date()) {
    return next(new APIError("Expire date must be in the future", 400));
  }
  const shippingCode = await ShippingCode.create({
    code,
    description: description || null,
    discount,
    quantity: quantity ?? 1,
    expire: expire || null,
    adminId,
  });

  res.status(201).json({ status: "success", data: { shippingCode } });
});

// @desc Get all shipping codes (Admin)
// @route GET /api/shipping-codes
// @access Admin
export const getAllShippingCodes = asyncHandler(async (req, res, next) => {
  const codes = await ShippingCode.findAll({ order: [["createdAt", "DESC"]] });
  res.status(200).json({ status: "success", results: codes.length, data: { codes } });
});

// @desc Get single shipping code
// @route GET /api/shipping-codes/:id
// @access Admin
export const getSingleShippingCode = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const code = await ShippingCode.findByPk(id);
  if (!code) return next(new APIError("Shipping code not found", 404));
  res.status(200).json({ status: "success", data: { code } });
});

// @desc Delete shipping code
// @route DELETE /api/shipping-codes/:id
// @access Admin
export const deleteShippingCode = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const code = await ShippingCode.findByPk(id);
  if (!code) return next(new APIError("Shipping code not found", 404));
  await code.destroy();
  res.status(204).json({ status: "success" });
});

export default {};
