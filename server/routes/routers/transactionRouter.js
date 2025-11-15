
import express from "express";
import { 
    createCheckoutSessionStripe,
    createCheckoutSessionMomo
} from "../../controller/transactionController.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import Client from "../../model/clientModel.js";

const router = express.Router();

router.route("/checkout-session/stripe").post(isAuth(Client), createCheckoutSessionStripe);

router.route("/checkout-session/momo").post(isAuth(Client), createCheckoutSessionMomo);

export default router;