import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
    uploadShipperImages,
    uploadShipperImage,
    resizeShipperImage,
    resizeShipperImages,
    getSingleShipper,
    updateStatusShipper,
    getAllShippers,
    updateProfile,
} from "../../controller/shipperController.js";

import {
  loginValidator
} from "../../validators/auth.validator.js";

import {
  registerValidator,
} from "../../validators/shipper.validator.js";

import {checkAdminStatus, checkShipperStatus} from "../../validators/status.validator.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import Shipper from "../../model/shipperModel.js";
import Admin from "../../model/adminModel.js";

const router = express.Router();

router.route("/register").post(uploadShipperImages, registerValidator, resizeShipperImages, register);
router.route("/login").post(upload.none(), loginValidator, login);
router.route("/logout").post(isAuth(Shipper), logout);

router.route("/get-all")
  .get(isAuth(Admin), getAllShippers);

router.route("/:id")
  .get(isAuth(Shipper), getSingleShipper);

router.route("/update-status/:id")
  .patch(
    isAuth(Admin),
    checkAdminStatus,
    updateStatusShipper
  );

router.route("/update-profile").patch(
  isAuth(Shipper),
  uploadShipperImage,
  resizeShipperImage,
  updateProfile  
);

export default router;
