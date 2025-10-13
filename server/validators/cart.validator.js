import validatorMiddleware from "../middleware/validator.middleware.js";
import {check} from "express-validator";
import Product from "../model/productModel.js";
import {isExistInDB} from "./custom.validators.js";

export const addToCartValidator = [
  check("product_variantId")
    .notEmpty()
    .withMessage("Please enter product id")
    .custom((val) => isExistInDB(val, Product)),
  validatorMiddleware,
];

export const removeFromCartValidator = [
  check("product_variantId").notEmpty().withMessage("Please enter product id"),
  validatorMiddleware,
];

export const updateCartItemQuantityValidator = [
  check("product_variantId").notEmpty().withMessage("Please enter product id"),
  check("quantity").notEmpty().withMessage("Please enter a quantity"),
  validatorMiddleware,
];

export const applyCouponValidator = [
  check("couponCode").notEmpty().withMessage("Please enter a coupon code"),
  check("product_variantId")
    .notEmpty()
    .withMessage("Please enter product id")
    .custom((val) => isExistInDB(val, Product)),
  validatorMiddleware,
];
