import express from "express";
import {isAuth} from "../../middleware/auth.middleware.js";
import {
  updateSingleCoupon,
  deleteSingleCoupon,
  getSingleCoupon,
  getAllCouponsForAdmin,
  createCouponforAdmin,
  createCouponforStore,
  getCouponByCode,
} from "../../controller/couponController.js";
import {
  IdValidator,
  createCouponforStoreValidator,
  createCouponforAdminValidator,
} from "../../validators/coupon.validator.js";

import Admin from "../../model/adminModel.js";
import { checkAdminStatus, checkStoreStatus } from "../../validators/status.validator.js";
import Store from "../../model/storeModel.js";

const router = express.Router();

router
  .route("/find-by-code")
  .get(getCouponByCode);

router.route("/admin", isAuth(Admin), checkAdminStatus)
  .get(getAllCouponsForAdmin)
  .post(createCouponforAdminValidator, createCouponforAdmin);

router.route("/admin/:id", isAuth(Admin), checkAdminStatus)
  .patch(IdValidator, updateSingleCoupon)
  .delete(IdValidator, deleteSingleCoupon);

router.route("/store").post(
  isAuth(Store), 
  checkStoreStatus,
  createCouponforStoreValidator,
  createCouponforStore);

router.route("/store/:id", isAuth(Store), checkStoreStatus)
  .get(IdValidator, getSingleCoupon)
  .patch(IdValidator, updateSingleCoupon)
  .delete(IdValidator, deleteSingleCoupon);

// Đặt sau cùng!
router
  .route("/:id")
  .get(IdValidator, getSingleCoupon);

export default router;
