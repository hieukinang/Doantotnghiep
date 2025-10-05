import validatorMiddleware from "../middleware/validator.middleware.js";
import { isExistInDB } from "./custom.validators.js";
import { check } from "express-validator";
import Product from "../model/productModel.js";

// Middleware kiểm tra file ảnh cho product
const checkProductImages = (req, res, next) => {
  const errors = [];

  // Kiểm tra main_image (bắt buộc)
  if (!req.files || !req.files["main_image"] || req.files["main_image"].length === 0) {
    errors.push({
      msg: "Main image is required",
      param: "main_image",
      location: "files",
    });
  }

  // Kiểm tra slide_images (không bắt buộc, nhưng nếu có thì tối đa 5)
  if (req.files && req.files["slide_images"]) {
    if (!Array.isArray(req.files["slide_images"])) {
      errors.push({
        msg: "Slide images must be an array of files",
        param: "slide_images",
        location: "files",
      });
    } else if (req.files["slide_images"].length > 5) {
      errors.push({
        msg: "Maximum 5 slide images allowed",
        param: "slide_images",
        location: "files",
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const createProductValidator = [
  // NAME
  check("name")
    .notEmpty().withMessage("Product name is required")
    .isString().withMessage("Product name must be a string")
    .isLength({ min: 3, max: 30 }).withMessage("Product name must be between 3 and 30 characters"),

  // DESCRIPTION
  check("description")
    .notEmpty().withMessage("Product description is required")
    .isString().withMessage("Product description must be a string")
    .isLength({ min: 20, max: 255 }).withMessage("Product description must be between 20 and 255 characters"),

  // ORIGIN
  check("origin")
    .optional()
    .isString().withMessage("Product origin must be a string")
    .isLength({ max: 100 }).withMessage("Product origin maximum length 100 characters"),
    
  checkProductImages, // kiểm tra file ảnh
  validatorMiddleware,
];

// Validator kiểm tra id có tồn tại trong database không
export const IdValidator = [
  check("id")
    .custom(async (val) => {
      await isExistInDB(val, Product);
    })
    .withMessage("Product not found"),
  validatorMiddleware,
];