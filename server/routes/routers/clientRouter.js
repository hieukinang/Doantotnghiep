import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
} from "../../controller/clientController.js";
import {
  registerValidator,
  loginValidator
} from "../../validators/auth.validator.js";

import { isAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(upload.none(), registerValidator, register);
router.route("/login").post(upload.none(), loginValidator, login);
router.route("/logout").post(isAuth, logout);

export default router;
