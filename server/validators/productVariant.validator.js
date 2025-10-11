import validatorMiddleware from "../middleware/validator.middleware.js";
import { isExistInDB } from "./custom.validators.js";
import { check, param } from "express-validator";
import Product from "../model/productModel.js";
import ProductVariant from "../model/productVariantModel.js";
import VariantOption from "../model/variantOptionModel.js";

export const ProductIdValidator = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage("Invalid productId format")
    .bail()
    .custom(async (val) => {
      await isExistInDB(val, Product);
    })
    .withMessage("Product not found"),
  validatorMiddleware,
];

export const VariantIdValidator = [
  param("variantId")
    .isInt({ min: 1 })
    .withMessage("Invalid variantId format")
    .bail()
    .custom(async (val) => {
      await isExistInDB(val, ProductVariant);
    })
    .withMessage("ProductVariant not found"),
  validatorMiddleware,
];

export const VariantOptionIdValidator = [
  param("optionId")
    .isInt({ min: 1 })
    .withMessage("Invalid optionId format")
    .bail()
    .custom(async (val) => {
      await isExistInDB(val, VariantOption);
    })
    .withMessage("VariantOption not found"),
  validatorMiddleware,
];