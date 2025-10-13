import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
    uploadStoreImage,
    resizeAdminImage
} from "../../controller/adminController.js";
import {
  loginValidator,
  registerValidator
} from "../../validators/admin.validator.js";

import { allowedTo, isAuth } from "../../middleware/auth.middleware.js";
import Admin from "../../model/adminModel.js";

const router = express.Router();

router.route("/register").post(
  // isAuth(Admin),          // chỉ admin mới được tạo admin account
  // checkAdminStatus,
  // allowedTo("manager"),  // chỉ manager mới được tạo admin
  uploadStoreImage,      // nếu hợp lệ mới upload file
  registerValidator,     // validate dữ liệu trước
  resizeAdminImage,      // xử lý ảnh
  register
);
router.route("/login").post(upload.none(), loginValidator, login);
router.route("/logout").post(isAuth(Admin), logout);

export default router;
