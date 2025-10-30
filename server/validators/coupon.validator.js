import validatorMiddleware from "../middleware/validator.middleware.js";
import {check} from "express-validator";
import {isExistInDB, isUnique} from "./custom.validators.js";
import Coupon from "../model/couponModel.js";
import Product from "../model/productModel.js";

export const IdValidator = [
  check("id")
    .isInt({ min: 1 }).withMessage("Invalid Id format") // Nếu id là số nguyên
    .custom((val) => isExistInDB(val, Coupon))
    .withMessage("Coupon not found"),
  validatorMiddleware,
];
export const createCouponforAdminValidator = [
  check("code")
    .notEmpty().withMessage("Coupon code is required")
    .trim()
    .custom((val) => isUnique(val, Coupon, "code"))
    .withMessage("Coupon code must be unique"),
  check("discount")
    .notEmpty().withMessage("Coupon discount is required")
    .isFloat({ min: 1 }).withMessage("Discount must be greater than 0"),
  check("quantity")
    .notEmpty().withMessage("Coupon quantity is required")
    .isInt({ min: 1 }).withMessage("Quantity must be greater than 0"),
  check("expire")
    .notEmpty().withMessage("Coupon expiration date is required")
    .isISO8601().withMessage("Coupon expiration value must be a valid date")
    .custom((val) => {
      if (new Date(val) < new Date()) {
        throw new Error("Expiration date must be in the future");
      }
      return true;
    }),
  validatorMiddleware,
];
export const createCouponforStoreValidator = [
  check("code")
    .notEmpty().withMessage("Coupon code is required")
    .trim()
    .custom((val) => isUnique(val, Coupon, "code"))
    .withMessage("Coupon code must be unique"),
  check("discount")
    .notEmpty().withMessage("Coupon discount is required")
    .isFloat({ min: 1 }).withMessage("Discount must be greater than 0"),
  check("quantity")
    .notEmpty().withMessage("Coupon quantity is required")
    .isInt({ min: 1 }).withMessage("Quantity must be greater than 0"),
  check("expire")
    .notEmpty().withMessage("Coupon expiration date is required")
    .isISO8601().withMessage("Coupon expiration value must be a valid date")
    .custom((val) => {
      if (new Date(val) <= new Date()) {
        throw new Error("Expiration date must be in the future");
      }
      return true;
    }),
  validatorMiddleware,
];
export const updateCouponValidator = [
  check("id")
    .isInt({ min: 1 }).withMessage("Invalid Id format") // Nếu id là số nguyên
    .custom((val) => isExistInDB(val, Coupon))
    .withMessage("Coupon not found"),
  check("code")
    .notEmpty().withMessage("Coupon code is required")
    .trim()
    .custom((val) => isUnique(val, Coupon, "code"))
    .withMessage("Coupon code must be unique"),
  check("discount")
    .notEmpty().withMessage("Coupon discount is required")
    .isFloat({ min: 1 }).withMessage("Discount must be greater than 0"),
  check("quantity")
    .notEmpty().withMessage("Coupon quantity is required")
    .isInt({ min: 1 }).withMessage("Quantity must be greater than 0"),
  check("expire")
    .notEmpty().withMessage("Coupon expiration date is required")
    .isISO8601().withMessage("Coupon expiration value must be a valid date")
    .custom((val) => {
      if (new Date(val) < new Date()) {
        throw new Error("Expiration date must be in the future");
      }
      return true;
    }),
  validatorMiddleware,
];

export const checkCouponProductBelongsToStore = [
  check("productId")
    .notEmpty().withMessage("ProductId is required")
    .isInt({ min: 1 }).withMessage("ProductId must be a positive integer")
    .custom(async (val, { req }) => {
      // Tìm product theo id
      const product = await Product.findByPk(val);
      if (!product) {
        throw new Error("Product not found");
      }
      // Kiểm tra productId có thuộc về store hiện tại không
      if (product.storeId !== req.user.id) {
        throw new Error("You can only use coupon for your own product");
      }
      return true;
    }),
];
