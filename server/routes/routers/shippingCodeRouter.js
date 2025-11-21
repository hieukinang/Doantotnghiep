import express from "express";
import {
  createShippingCode,
  getAllShippingCodes,
  getSingleShippingCode,
  deleteShippingCode
} from "../../controller/shippingCodeController.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import Admin from "../../model/adminModel.js";
import { checkAdminStatus } from "../../validators/status.validator.js";

const router = express.Router();

router
  .route("/client")
  .get(getAllShippingCodes);

router
  .route("")
  .get(isAuth(Admin), checkAdminStatus, getAllShippingCodes)
  .post(isAuth(Admin), checkAdminStatus, createShippingCode);

router
  .route("/:id")
  .get(isAuth(Admin), checkAdminStatus, getSingleShippingCode)
  .delete(isAuth(Admin), checkAdminStatus, deleteShippingCode);

export default router;
