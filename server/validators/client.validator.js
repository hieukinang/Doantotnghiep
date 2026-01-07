import { CLIENT_STATUS } from "../constants/index.js";
import validatorMiddleware from "../middleware/validator.middleware.js";
import {check} from "express-validator";
import Client from "../model/clientModel.js";
import {isPasswordsMatches, isUnique} from "./custom.validators.js";

export const registerValidator = [
  check("username")
    .notEmpty()
    .withMessage("Username bắt buộc")
    .isString()
    .withMessage("Username phải là chuỗi")
    .isLength({min: 3})
    .withMessage("Username tối thiểu 3 ký tự")
    .isLength({max: 30})
    .withMessage("Username tối đa 30 ký tự"),
  check("phone")
    .notEmpty()
    .withMessage("Phone bắt buộc")
    .isString()
    .withMessage("Phone phải là chuỗi")
    .isLength({min: 9})
    .withMessage("Phone tối thiểu 9 ký tự")
    .isLength({max: 20})
    .withMessage("Phone tối đa 20 ký tự")
    .custom((val) => isUnique(val, Client, "phone")),
  check("email")
    .notEmpty()
    .withMessage("Email bắt buộc")
    .isEmail()
    .withMessage("Vui lòng nhập địa chỉ email hợp lệ")
    .custom((val) => isUnique(val, Client, "email")),
  check("password")
    .notEmpty()
    .withMessage("Mật khẩu bắt buộc")
    .isString()
    .withMessage("Mật khẩu phải là chuỗi")
    .isLength({min: 6})
    .withMessage("Mật khẩu tối thiểu 6 ký tự")
    .isLength({max: 25})
    .withMessage("Mật khẩu tối đa 25 ký tự"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Xác nhận mật khẩu bắt buộc")
    .custom((val, {req}) => isPasswordsMatches(val, req)),
  check("image").optional(),
  validatorMiddleware,
];

// export const getSingleUserValidator = [
//   check("id").isMongoId().withMessage("Invalid Id format"),
//   validatorMiddleware,
// ];

// export const deleteSingleUserValidator = [
//   check("id").isMongoId().withMessage("Invalid id format"),
//   validatorMiddleware,
// ];

// export const updateSingleUserValidator = [
//   check("id").isMongoId().withMessage("Invalid id format"),
//   check("username")
//     .optional()
//     .isLength({min: 3})
//     .withMessage("Username length 3 characters")
//     .isLength({max: 30})
//     .withMessage("Username maximum length 30 characters"),
//   check("email")
//     .optional()
//     .isEmail()
//     .withMessage("Please enter a valid email address")
//     .custom((val) => isUnique(val, User, "email")),
//   check("role").optional(),
//   validatorMiddleware,
// ];

// export const updateMyProfileValidator = [
//   check("username")
//     .optional()
//     .isLength({min: 3})
//     .withMessage("Username length 3 characters")
//     .isLength({max: 30})
//     .withMessage("Username maximum length 30 characters"),
//   check("email")
//     .optional()
//     .isEmail()
//     .withMessage("Please enter a valid email address")
//     .custom((val) => isUnique(val, User, "email")),
//   validatorMiddleware,
// ];

// export const updateMyPasswordValidator = [
//   check("currentPassword")
//     .notEmpty()
//     .withMessage("Please enter your current password")
//     .isLength({min: 3})
//     .withMessage("Current password minimum length 6 characters")
//     .isLength({max: 30})
//     .withMessage("Current password maximum length 25 characters"),
//   check("newPassword")
//     .notEmpty()
//     .withMessage("Please enter your new password")
//     .isLength({min: 6})
//     .withMessage("New password minimum length 6 characters")
//     .isLength({max: 25})
//     .withMessage("New password maximum length 25 characters"),
//   check("confirmNewPassword")
//     .notEmpty()
//     .withMessage("Please confirm your new password")
//     .custom((val, {req}) => {
//       if (val !== req.body.newPassword) {
//         throw new Error(
//           `New password confirmation does not match new password`
//         );
//       }
//       // Indicates the success of this synchronous custom validator
//       return true;
//     }),
//   validatorMiddleware,
// ];
