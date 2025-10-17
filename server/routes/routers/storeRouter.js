import express from "express";
import multer from "multer";
const upload = multer();

import {
    register, 
    login,
    logout,
    uploadStoreImages,
    resizeStoreImages,
    updateStoreProfile,
    getAllProcessingStores
} from "../../controller/storeController.js";

import {
  registerValidator,
} from "../../validators/store.validator.js";

import Admin from "../../model/adminModel.js";

import {
  loginValidator
} from "../../validators/auth.validator.js";

import { checkStoreStatus } from "../../validators/status.validator.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import Store from "../../model/storeModel.js";

const router = express.Router();

router.route("/register").post(uploadStoreImages, registerValidator, resizeStoreImages, register);
router.route("/login").post(upload.none(), checkStoreStatus, loginValidator, login);
router.route("/logout").post(isAuth(Store), logout);

router.route("/processing")
  .get(isAuth(Admin), getAllProcessingStores);

router.route("/update-profile/:id")
  .patch(
    uploadStoreImages,
    resizeStoreImages,
    updateStoreProfile
  );

export default router;
