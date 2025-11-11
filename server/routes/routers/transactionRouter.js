
import express from "express";
import { createCheckoutSession } from "../../controller/transactionController.js";
import { isAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.route("/checkout-session").post(isAuth, createCheckoutSession);

export default router;