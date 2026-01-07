import validatorMiddleware from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import { isPasswordsMatches, isUnique } from "./custom.validators.js";
import Admin from "../model/adminModel.js";

export const registerValidator = [
	check("username")
		.notEmpty().withMessage("Username bắt buộc")
		.isString().withMessage("Username phải là chuỗi")
		.isLength({ min: 3 }).withMessage("Username tối thiểu 3 ký tự")
		.isLength({ max: 50 }).withMessage("Username tối đa 50 ký tự")
		.custom((val) => isUnique(val, Admin, "username")),
	check("phone")
		.notEmpty().withMessage("Phone bắt buộc")
		.isString().withMessage("Phone phải là chuỗi")
		.isLength({ min: 9 }).withMessage("Phone tối thiểu 9 ký tự")
		.isLength({ max: 20 }).withMessage("Phone tối đa 20 ký tự")
		.custom((val) => isUnique(val, Admin, "phone")),
	check("email")
		.notEmpty().withMessage("Email bắt buộc")
		.isEmail().withMessage("Vui lòng nhập địa chỉ email hợp lệ")
		.custom((val) => isUnique(val, Admin, "email")),
	check("password")
		.notEmpty().withMessage("Mật khẩu bắt buộc")
		.isString().withMessage("Mật khẩu phải là chuỗi")
		.isLength({ min: 6 }).withMessage("Mật khẩu tối thiểu 6 ký tự")
		.isLength({ max: 25 }).withMessage("Mật khẩu tối đa 25 ký tự"),
	check("confirmPassword")
		.notEmpty().withMessage("Xác nhận mật khẩu bắt buộc")
		.custom((val, { req }) => isPasswordsMatches(val, req)),
	check("fullname")
		.notEmpty().withMessage("Họ và tên bắt buộc")
		.isString().withMessage("Họ và tên phải là chuỗi")
		.isLength({ min: 3 }).withMessage("Họ và tên tối thiểu 3 ký tự")
		.isLength({ max: 100 }).withMessage("Họ và tên tối đa 100 ký tự"),
	check("role")
		.notEmpty().withMessage("Role bắt buộc"),
	check("job_title")
		.notEmpty().withMessage("Job title bắt buộc")
		.isString().withMessage("Job title phải là chuỗi"),
	check("hire_date")
		.notEmpty().withMessage("Hire date bắt buộc"),
	check("salary")
		.notEmpty().withMessage("Salary bắt buộc")
		.isNumeric().withMessage("Salary phải là số"),
	check("address")
		.notEmpty().withMessage("Địa chỉ bắt buộc"),
	check("image").optional(),
	check("bank_name")
		.notEmpty().withMessage("Tên ngân hàng bắt buộc"),
	check("bank_account_number")
		.notEmpty().withMessage("Số tài khoản ngân hàng bắt buộc"),
	check("bank_account_holder_name")
		.notEmpty().withMessage("Tên chủ tài khoản ngân hàng bắt buộc"),
	validatorMiddleware,
];

export const loginValidator = [
  check("username")
    .notEmpty()
    .withMessage("Username bắt buộc")
    .isString()
    .withMessage("Username phải là chuỗi"),
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
