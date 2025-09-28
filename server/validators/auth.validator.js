import validatorMiddleware from "../middleware/validator.middleware.js";
import {check} from "express-validator";

export const loginValidator = [
  check("emailOrPhone")
    .notEmpty()
    .withMessage("Email or Phone is required")
    .isString()
    .withMessage("Email or Phone must be a string"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({min: 6})
    .withMessage("Password minimum length 6 characters")
    .isLength({max: 25})
    .withMessage("Password maximum length 25 characters"),
  validatorMiddleware,
];
