import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
    uploadShipperImages,
    resizeShipperImages,
    getSingleShipper,
    updateShipper,
    getAllProcessingShippers,
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

router.route("/processing")
  .get(isAuth(Admin), getAllProcessingShippers);

router.route("/:id")
  .get(isAuth(Shipper), getSingleShipper);
router.route("/update-status/:id")
  .patch(
    isAuth(Admin),
    checkAdminStatus,
    updateShipper
  );

export default router;
