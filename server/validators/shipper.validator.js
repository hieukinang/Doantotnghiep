import validatorMiddleware from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import { isPasswordsMatches, isUnique } from "./custom.validators.js";
import Shipper from "../model/shipperModel.js";
import { SHIPPER_STATUS } from "../constants/index.js";

// Custom middleware kiểm tra file ảnh
const checkShipperImages = (req, res, next) => {
  const requiredFields = ["id_image", "image", "profile_image", "health_image"];
  const errors = [];

  requiredFields.forEach((field) => {
    // Nếu không có file hoặc file rỗng
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

export const registerValidator = [
	check("citizen_id")
		.notEmpty().withMessage("Citizen ID bắt buộc")
		.isString().withMessage("Citizen ID phải là chuỗi")
		.custom((val) => isUnique(val, Shipper, "citizen_id")),
	check("phone")
		.notEmpty().withMessage("Phone bắt buộc")
		.isString().withMessage("Phone phải là chuỗi")
		.isLength({ min: 9 }).withMessage("Phone tối thiểu 9 ký tự")
		.isLength({ max: 20 }).withMessage("Phone tối đa 20 ký tự")
		.custom((val) => isUnique(val, Shipper, "phone")),
	check("email")
		.notEmpty().withMessage("Email bắt buộc")
		.isEmail().withMessage("Vui lòng nhập địa chỉ email hợp lệ")
		.custom((val) => isUnique(val, Shipper, "email")),
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
	check("vehicle_name")
		.notEmpty().withMessage("Tên phương tiện bắt buộc"),
	check("license_plate")
		.notEmpty().withMessage("Biển số xe bắt buộc"),
	check("work_area_city")
		.notEmpty().withMessage("Khu vực làm việc (thành phố) bắt buộc"),
	check("work_area_village")
		.notEmpty().withMessage("Khu vực làm việc (xã/phường) bắt buộc"),
	check("bank_name")
		.notEmpty().withMessage("Tên ngân hàng bắt buộc"),
	check("bank_account_number")
		.notEmpty().withMessage("Số tài khoản ngân hàng bắt buộc"),
	check("bank_account_holder_name")
		.notEmpty().withMessage("Tên chủ tài khoản ngân hàng bắt buộc"),
	checkShipperImages, // kiểm tra file ảnh
	validatorMiddleware,
];