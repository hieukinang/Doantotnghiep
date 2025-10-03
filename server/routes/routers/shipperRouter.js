import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
    uploadShipperImages,
    resizeShipperImages,
    getSingleShipper
} from "../../controller/shipperController.js";

import {
  loginValidator
} from "../../validators/auth.validator.js";

import {
  registerValidator
} from "../../validators/shipper.validator.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import Shipper from "../../model/shipperModel.js";

const router = express.Router();

router.route("/register").post(uploadShipperImages, registerValidator, resizeShipperImages, register);
router.route("/login").post(upload.none(), loginValidator, login);
router.route("/logout").post(isAuth(Shipper), logout);

router.route("/:id")
  .get(isAuth(Shipper), getSingleShipper);

export default router;
