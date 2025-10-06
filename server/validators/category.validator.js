import validatorMiddleware from "../middleware/validator.middleware.js";
import { check, param } from "express-validator";
import Category from "../model/categoryModel.js";
import { isUnique } from "./custom.validators.js";

// Sequelize dùng id kiểu số nguyên (INTEGER), không phải MongoId
export const getCategoryValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid Id format"),
  validatorMiddleware,
];

export const createCategoryValidator = [
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ errors: [{ msg: "Category must have image", param: "image", location: "body" }] });
    }
    next();
  },
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Category name must be between 3 and 30 characters")
    .custom((val) => isUnique(val, Category, "name")),
  validatorMiddleware,
];

export const updateCategoryValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid id format"),
  check("name")
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage("Category name must be between 3 and 30 characters"),
  check("image").optional(),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid id format"),
  validatorMiddleware,
];
