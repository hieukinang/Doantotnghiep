import { TRANSACTION_TYPE } from "../constants/index.js";
import Client from "../model/clientModel.js";
import Admin from "../model/adminModel.js";
import Store from "../model/storeModel.js";
import Shipper from "../model/shipperModel.js";
import Transaction from "../model/transactionModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";

import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// (STRIPE_CHECKOUT_SESSION_OBJECT)[https://stripe.com/docs/api/checkout/sessions/create]
// @desc    CREATE Checkout Session
// @route   POST /api/orders/checkout-session

// @access  Protected
export const createCheckoutSession = asyncHandler(async (req, res, next) => {
  const { amount, description } = req.body;
  const userId = req.user?.id; // lấy từ token nếu đã xác thực
  const role = userId.match(/^[A-Za-z]+/)[0];
  const username = req.user?.username || req.user?.name || req.user?.fullname || "User";
  const email = req.user?.email || "";

  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    return next(new APIError("Invalid user or amount", 400));
  }

  // 4) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount * 100,
          product_data: {
            name: `Top-up for ${username}`,
            description: description || "Account Wallet Top-up",
            images: ["https://cdn3d.ifull-sh35048.png?f=webp"]
          }
        },
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/wallet/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/wallet`,
    customer_email: email,

    // lưu thông tin để xử lý trong webhook
    metadata: {
      userId: userId,
      role: role,
      amount: amountInCents
    }
  });

  // 5) send session to response
  res.status(200).json({status: "success", session});
});

// (STRIPE_CHECKOUT_WEBHOOK)[https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local]
// @desc    CREATE Checkout Webhook To Create Order After checkout.session.completed event
// @route   POST /webhook
// @access  Protected
export const webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const role = session.metadata.role; // "CLIENT" hoặc "ADMIN"
    const amount = Number(session.metadata.amount);

    // chọn đúng model theo role
    let UserModel;
    switch (role) {
    case "ADMIN":
        UserModel = Admin;
        break;
    case "CLIENT":
        UserModel = Client;
        break;
    case "STORE":
        UserModel = Store;
        break;
    case "SHIPPER":
        UserModel = Shipper;
        break;
    // Nếu có thêm role khác, thêm case ở đây
    default:
        return res.status(400).send("Invalid user role");
    }

    // Lấy user
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Kiểm tra xem transaction này đã tạo chưa (tránh cộng ví 2 lần)
    const exists = await Transaction.findOne({
      where: {
        user_id: userId,
        amount: amount,
        type: TRANSACTION_TYPE.TOP_UP,
        status: "SUCCESS"
      }
    });

    if (!exists) {
      // Cập nhật wallet
      user.wallet += amount;
      await user.save();

      // Lưu transaction
      await Transaction.create({
        user_id: userId,
        amount: amount,
        new_balance: user.wallet,
        type: TRANSACTION_TYPE.TOP_UP,
        status: "SUCCESS",
        description: "Nạp tiền qua Stripe"
      });
    }
  }

  res.status(200).json({ received: true });
});