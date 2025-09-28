import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
    uploadStoreImages,
    resizeStoreImages
} from "../../controller/storeController.js";
import {
  registerValidator
} from "../../validators/store.validator.js";

import {
  loginValidator
} from "../../validators/auth.validator.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import Store from "../../model/storeModel.js";

const router = express.Router();

router.route("/register").post(uploadStoreImages, resizeStoreImages, registerValidator, register);
router.route("/login").post(upload.none(), loginValidator, login);
router.route("/logout").post(isAuth(Store), logout);

export default router;
