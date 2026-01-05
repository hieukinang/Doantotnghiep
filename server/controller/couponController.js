import Coupon from "../model/couponModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import { Op } from "sequelize";

export const createCouponforAdmin = createOne(Coupon);

export const createCouponforStore = asyncHandler(async (req, res, next) => {
  const storeId = req.user && req.user.id;
  if (!storeId) return next(new APIError("Authentication required", 401));

  // Lấy các trường còn lại từ body
  const { code, description, discount, quantity, expire } = req.body;

  // Tạo coupon, gán storeId từ user
  const coupon = await Coupon.create({
    code,
    description,
    discount,
    quantity,
    expire,
    storeId
  });

  res.status(201).json({ status: "success", data: { coupon } });
});

export const getAllCouponsForAdmin = getAll(Coupon, {
  where: { storeId: null, expire: { [Op.lte]: new Date() } }
});

export const getAllCouponsForStore = asyncHandler(async (req, res, next) => {
  const storeId = req.user && req.user.id;
  if (!storeId) return next(new APIError("Authentication required", 401));

  const coupons = await Coupon.findAll({
    where: { storeId, expire: { [Op.gt]: new Date() } },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: coupons.length,
    data: { coupons },
  });
});

export const getCouponByCode = asyncHandler(async (req, res, next) => {
  try {
    const { code } = req.query;
    const coupon = await Coupon.findOne({ where: { code, expire: { [Op.gt]: new Date() } } });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ data: coupon });
  } catch (error) {
    next(error);
  }
});

export const getAllStoreCoupon = asyncHandler(async (req, res, next) => {
  const { storeId } = req.params;
  if (!storeId) return next(new APIError("storeId is required", 400));

  const coupons = await Coupon.findAll({
    where: { storeId, expire: { [Op.gt]: new Date() } },
    order: [["discount", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: coupons.length,
    data: { coupons },
  });
});

export const getSingleCoupon = getOne(Coupon);

export const updateSingleCoupon = updateOne(Coupon);

export const deleteSingleCoupon = deleteOne(Coupon);
