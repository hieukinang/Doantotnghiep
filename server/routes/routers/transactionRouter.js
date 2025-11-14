
import express from "express";
import { createCheckoutSession } from "../../controller/transactionController.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import Client from "../../model/clientModel.js";

const router = express.Router();

router.route("/checkout-session").post(isAuth(Client), createCheckoutSession);

export default router;