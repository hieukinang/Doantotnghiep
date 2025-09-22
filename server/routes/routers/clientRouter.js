import express from "express";
import multer from "multer";
const upload = multer();

import {
    register
} from "../../controller/clientController.js";
import {
  registerValidator
} from "../../validators/auth.validator.js";

const router = express.Router();

router.route("/register").post(upload.none(), registerValidator, register);

export default router;
