import validatorMiddleware from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import { isPasswordsMatches, isUnique } from "./custom.validators.js";
import Admin from "../model/adminModel.js";

export const registerValidator = [
	check("username")
		.notEmpty().withMessage("Username is required")
		.isString().withMessage("Username must be a string")
		.isLength({ min: 3 }).withMessage("Username minimum length 3 characters")
		.isLength({ max: 50 }).withMessage("Username maximum length 50 characters")
		.custom((val) => isUnique(val, Admin, "username")),
	check("phone")
		.notEmpty().withMessage("Phone is required")
		.isString().withMessage("Phone must be a string")
		.isLength({ min: 9 }).withMessage("Phone minimum length 9 characters")
		.isLength({ max: 20 }).withMessage("Phone maximum length 20 characters")
		.custom((val) => isUnique(val, Admin, "phone")),
	check("email")
		.notEmpty().withMessage("Email is required")
		.isEmail().withMessage("Please enter a valid email address")
		.custom((val) => isUnique(val, Admin, "email")),
	check("password")
		.notEmpty().withMessage("Password is required")
		.isString().withMessage("Password must be a string")
		.isLength({ min: 6 }).withMessage("Password minimum length 6 characters")
		.isLength({ max: 25 }).withMessage("Password maximum length 25 characters"),
	check("confirmPassword")
		.notEmpty().withMessage("confirmPassword is required")
		.custom((val, { req }) => isPasswordsMatches(val, req)),
	check("fullname")
		.notEmpty().withMessage("Full name is required")
		.isString().withMessage("Full name must be a string")
		.isLength({ min: 3 }).withMessage("Full name minimum length 3 characters")
		.isLength({ max: 100 }).withMessage("Full name maximum length 100 characters"),
	check("role")
		.notEmpty().withMessage("Role is required"),
	check("job_title")
		.notEmpty().withMessage("Job title is required")
		.isString().withMessage("Job title must be a string"),
	check("hire_date")
		.notEmpty().withMessage("Hire date is required"),
	check("salary")
		.notEmpty().withMessage("Salary is required")
		.isNumeric().withMessage("Salary must be a number"),
	check("address")
		.notEmpty().withMessage("Address is required"),
	check("image").optional(),
	check("bank_name")
		.notEmpty().withMessage("Bank name is required"),
	check("bank_account_number")
		.notEmpty().withMessage("Bank account number is required"),
	check("bank_account_holder_name")
		.notEmpty().withMessage("Bank account holder name is required"),
	validatorMiddleware,
];

export const loginValidator = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string"),
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
