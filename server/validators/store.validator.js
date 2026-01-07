import validatorMiddleware from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import { isPasswordsMatches, isUnique } from "./custom.validators.js";
import Store from "../model/storeModel.js";
import { isExistInDB } from "./custom.validators.js";

// Custom middleware kiểm tra file ảnh cho store
const checkStoreImages = (req, res, next) => {
  const requiredFields = ["id_image", "image"];
  const errors = [];

  requiredFields.forEach((field) => {
    if (!req.files || !req.files[field] || req.files[field].length === 0) {
      errors.push({
        msg: `${field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())} is required`,
        param: field,
        location: "files",
      });
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const IdValidator = [
  check("id")
    .custom((val) => isExistInDB(val, Store))
    .withMessage("Store không tồn tại"),
  validatorMiddleware,
];

export const registerValidator = [
  check("name")
    .notEmpty()
    .withMessage("Tên cửa hàng bắt buộc")
    .isString()
    .withMessage("Tên cửa hàng phải là chuỗi")
    .isLength({ min: 3 })
    .withMessage("Tên cửa hàng tối thiểu 3 ký tự")
    .isLength({ max: 100 })
    .withMessage("Tên cửa hàng tối đa 100 ký tự"),
  check("citizen_id")
    .notEmpty()
    .withMessage("Citizen ID bắt buộc")
    .isString()
    .withMessage("Citizen ID phải là chuỗi")
    .custom((val) => isUnique(val, Store, "citizen_id")),
  check("phone")
    .notEmpty()
    .withMessage("Số điện thoại bắt buộc")
    .isString()
    .withMessage("Số điện thoại phải là chuỗi")
    .isLength({ min: 9 })
    .withMessage("Số điện thoại tối thiểu 9 ký tự")
    .isLength({ max: 20 })
    .withMessage("Số điện thoại tối đa 20 ký tự")
    .custom((val) => isUnique(val, Store, "phone")),
  check("email")
    .notEmpty()
    .withMessage("Email bắt buộc")
    .isEmail()
    .withMessage("Vui lòng nhập địa chỉ email hợp lệ")
    .custom((val) => isUnique(val, Store, "email")),
  check("password")
    .notEmpty()
    .withMessage("Mật khẩu bắt buộc")
    .isString()
    .withMessage("Mật khẩu phải là chuỗi")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu tối thiểu 6 ký tự")
    .isLength({ max: 25 })
    .withMessage("Mật khẩu tối đa 25 ký tự"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Xác nhận mật khẩu bắt buộc")
    .custom((val, { req }) => isPasswordsMatches(val, req)),
  check("bank_name")
    .notEmpty()
    .withMessage("Tên ngân hàng bắt buộc"),
  check("bank_account_number")
    .notEmpty()
    .withMessage("Số tài khoản ngân hàng bắt buộc"),
  check("bank_account_holder_name")
    .notEmpty()
    .withMessage("Tên chủ tài khoản ngân hàng bắt buộc"),
  check("city")
    .notEmpty()
    .withMessage("Thành phố bắt buộc"),
  check("village")
    .notEmpty()
    .withMessage("Xã/Phường bắt buộc"),
  check("detail_address")
    .notEmpty()
    .withMessage("Địa chỉ chi tiết bắt buộc"),
  check("description")
    .notEmpty()
    .withMessage("Mô tả bắt buộc"),
  checkStoreImages, // kiểm tra file ảnh
  validatorMiddleware,
];
