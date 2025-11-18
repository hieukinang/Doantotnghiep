import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
    updateProfile,
    uploadClientImage,
    resizeClientImage,
} from "../../controller/clientController.js";
import {
  loginValidator
} from "../../validators/auth.validator.js";

import {
  registerValidator
} from "../../validators/client.validator.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import Client from "../../model/clientModel.js";

const router = express.Router();

router.route("/register").post(upload.none(), registerValidator, register);
router.route("/login").post(upload.none(), loginValidator, login);
router.route("/logout").post(isAuth(Client), logout);

router.route("/update-profile").patch(
  isAuth(Client),
  uploadClientImage,
  resizeClientImage,
  updateProfile
);

export default router;
