import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
    uploadStoreImages,
    resizeStoreImages,
    updateStoreProfile
} from "../../controller/storeController.js";
import {
  registerValidator,
} from "../../validators/store.validator.js";

import {checkStoreStatusBody} from "../../validators/status.validator.js";

import {
  loginValidator
} from "../../validators/auth.validator.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import Store from "../../model/storeModel.js";
import Admin from "../../model/adminModel.js";

const router = express.Router();

router.route("/register").post(uploadStoreImages, registerValidator, resizeStoreImages, register);
router.route("/login").post(upload.none(), loginValidator, login);
router.route("/logout").post(isAuth(Store), logout);

router.route("/update-profile/:id")
  .patch(isAuth(Admin), 
    uploadStoreImages, 
    checkStoreStatusBody,
    resizeStoreImages, 
    updateStoreProfile);

export default router;
