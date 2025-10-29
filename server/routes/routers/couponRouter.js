import express from "express";
import {isAuth} from "../../middleware/auth.middleware.js";
import {
  deleteSingleCoupon,
  getSingleCoupon,
  getAllCouponsForAdmin,
  createCouponforAdmin,
  createCouponforStore,
  getCouponByCode,
  getAllCouponsForStore,
  getAllStoreCoupon
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

router.route("/admin")
  .get(isAuth(Admin), checkAdminStatus, getAllCouponsForAdmin)
  .post(isAuth(Admin), checkAdminStatus, createCouponforAdminValidator, createCouponforAdmin);

router.route("/admin/:id")
  .delete(isAuth(Admin), checkAdminStatus, IdValidator, deleteSingleCoupon);

router.route("/store")
  .get(isAuth(Store), checkStoreStatus, getAllCouponsForStore)
  .post(isAuth(Store), checkStoreStatus, createCouponforStoreValidator, createCouponforStore);

router.route("/store/:id")
  .delete(isAuth(Store), checkStoreStatus, IdValidator, deleteSingleCoupon);

router.get("/from-store/:storeId", getAllStoreCoupon);
router.get("/from-system", getAllCouponsForAdmin);

router
  .route("/:id")
  .get(IdValidator, getSingleCoupon);
export default router;
