import validatorMiddleware from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import { isPasswordsMatches, isUnique } from "./custom.validators.js";
import Shipper from "../model/shipperModel.js";

export const registerValidator = [
	check("citizen_id")
		.notEmpty().withMessage("Citizen ID is required")
		.isString().withMessage("Citizen ID must be a string")
		.custom((val) => isUnique(val, Shipper, "citizen_id")),
	check("id_image")
		.notEmpty().withMessage("ID image is required"),
	check("phone")
		.notEmpty().withMessage("Phone is required")
		.isString().withMessage("Phone must be a string")
		.isLength({ min: 9 }).withMessage("Phone minimum length 9 characters")
		.isLength({ max: 20 }).withMessage("Phone maximum length 20 characters")
		.custom((val) => isUnique(val, Shipper, "phone")),
	check("email")
		.notEmpty().withMessage("Email is required")
		.isEmail().withMessage("Please enter a valid email address")
		.custom((val) => isUnique(val, Shipper, "email")),
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
	check("vehicle_name")
		.notEmpty().withMessage("Vehicle name is required"),
	check("license_plate")
		.notEmpty().withMessage("License plate is required"),
	check("work_area_city")
		.notEmpty().withMessage("Work area city is required"),
	check("work_area_village")
		.notEmpty().withMessage("Work area village is required"),
	check("bank_name")
		.notEmpty().withMessage("Bank name is required"),
	check("bank_account_number")
		.notEmpty().withMessage("Bank account number is required"),
	check("bank_account_holder_name")
		.notEmpty().withMessage("Bank account holder name is required"),
	check("image")
		.notEmpty().withMessage("ID image is required"),
	check("profile_image")
		.notEmpty().withMessage("Profile image is required"),
	check("health_image")
		.notEmpty().withMessage("Health image is required"),
	validatorMiddleware,
];
