import Coupon from "../model/couponModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";

// @desc    CREATE A Coupon
// @route   POST /api/coupons
// @access  Private("ADMIN")
export const createCouponforAdmin = createOne(Coupon);
// @desc    CREATE A Coupon
// @route   POST /api/coupons
// @access  Private("STORE")
export const createCouponforStore = createOne(Coupon);
// @desc    GET All Coupons
// @route   GET /api/coupons
// @access  Private("ADMIN")
export const getAllCouponsForAdmin = getAll(Coupon, {
  where: { productId: null }
});
// @desc    GET Single Coupon
// @route   GET /api/coupons/:id
// @access  Private("ADMIN")
export const getSingleCoupon = getOne(Coupon);
// @desc    UPDATE Single Coupon
// @route   PATCH /api/coupons/:id
// @access  Private("ADMIN")
export const updateSingleCoupon = updateOne(Coupon);
// @desc    DELETE Single Coupon
// @route   DELETE /api/coupons/:id
// @access  Private("ADMIN")
export const deleteSingleCoupon = deleteOne(Coupon);
