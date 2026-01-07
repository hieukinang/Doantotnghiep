import validatorMiddleware from "../middleware/validator.middleware.js";
import {check} from "express-validator";

export const loginValidator = [
  check("emailOrPhone")
    .notEmpty()
    .withMessage("Email or Phone bắt buộc")
    .isString()
    .withMessage("Email or Phone phải là chuỗi"),
  check("password")
    .notEmpty()
    .withMessage("Mật khẩu bắt buộc")
    .isString()
    .withMessage("Mật khẩu phải là chuỗi")
    .isLength({min: 6})
    .withMessage("Mật khẩu tối thiểu 6 ký tự")
    .isLength({max: 25})
    .withMessage("Mật khẩu tối đa 25 ký tự"),
  validatorMiddleware,
];
