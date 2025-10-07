import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
    uploadStoreImages,
    resizeStoreImages,
    updateStoreProfile
} from "../../controller/storeController.js";
import {
  registerValidator,
} from "../../validators/store.validator.js";

import {
  loginValidator
} from "../../validators/auth.validator.js";

import { checkStoreStatus } from "../../validators/status.validator.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import Store from "../../model/storeModel.js";
import { createCouponforStore, deleteSingleCoupon, getSingleCoupon, updateSingleCoupon } from "../../controller/couponController.js";
import { createCouponforStoreValidator, IdValidator } from "../../validators/coupon.validator.js";

const router = express.Router();

router.route("/register").post(uploadStoreImages, registerValidator, resizeStoreImages, register);
router.route("/login").post(upload.none(), checkStoreStatus, loginValidator, login);
router.route("/logout").post(isAuth(Store), logout);

router.route("/update-profile/:id")
  .patch(
    uploadStoreImages,
    resizeStoreImages,
    updateStoreProfile
  );

router.route("/coupons").post(
  isAuth(Store), 
  checkStoreStatus,
  createCouponforStoreValidator,
  createCouponforStore);

router.route("/coupons/:id", isAuth(Store), checkStoreStatus)
  .get(IdValidator, getSingleCoupon)
  .patch(IdValidator, updateSingleCoupon)
  .delete(IdValidator, deleteSingleCoupon);

export default router;
