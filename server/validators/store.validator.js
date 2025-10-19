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
    .isInt({ min: 1 }).withMessage("Invalid Id format") // Nếu id là số nguyên
    .custom((val) => isExistInDB(val, Store))
    .withMessage("Store not found"),
  validatorMiddleware,
];

export const registerValidator = [
  check("name")
    .notEmpty()
    .withMessage("Store name is required")
    .isString()
    .withMessage("Store name must be a string")
    .isLength({ min: 3 })
    .withMessage("Store name minimum length 3 characters")
    .isLength({ max: 100 })
    .withMessage("Store name maximum length 100 characters"),
  check("citizen_id")
    .notEmpty()
    .withMessage("Citizen ID is required")
    .isString()
    .withMessage("Citizen ID must be a string")
    .custom((val) => isUnique(val, Store, "citizen_id")),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isString()
    .withMessage("Phone must be a string")
    .isLength({ min: 9 })
    .withMessage("Phone minimum length 9 characters")
    .isLength({ max: 20 })
    .withMessage("Phone maximum length 20 characters")
    .custom((val) => isUnique(val, Store, "phone")),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((val) => isUnique(val, Store, "email")),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password minimum length 6 characters")
    .isLength({ max: 25 })
    .withMessage("Password maximum length 25 characters"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required")
    .custom((val, { req }) => isPasswordsMatches(val, req)),
  check("bank_name")
    .notEmpty()
    .withMessage("Bank name is required"),
  check("bank_account_number")
    .notEmpty()
    .withMessage("Bank account number is required"),
  check("bank_account_holder_name")
    .notEmpty()
    .withMessage("Bank account holder name is required"),
  check("city")
    .notEmpty()
    .withMessage("City is required"),
  check("village")
    .notEmpty()
    .withMessage("Village is required"),
  check("detail_address")
    .notEmpty()
    .withMessage("Detail address is required"),
  check("description")
    .notEmpty()
    .withMessage("Description is required"),
  checkStoreImages, // kiểm tra file ảnh
  validatorMiddleware,
];
