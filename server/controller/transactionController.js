import { TRANSACTION_TYPE } from "../constants/index.js";
import Client from "../model/clientModel.js";
import Admin from "../model/adminModel.js";
import Store from "../model/storeModel.js";
import Shipper from "../model/shipperModel.js";
import Transaction from "../model/transactionModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import { sequelize } from "../config/db.js";

import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
import crypto from "crypto";
import https from 'https';
import { Op } from "sequelize";

// (STRIPE_CHECKOUT_SESSION_OBJECT)[https://stripe.com/docs/api/checkout/sessions/create]
// @desc    CREATE Checkout Session
// @route   POST /api/orders/checkout-session
// @access  Protected
export const createCheckoutSessionStripe = asyncHandler(async (req, res, next) => {

  const { amount } = req.body;
  const userId = req.user.id; // lấy từ token nếu đã xác thực
  const role = userId.match(/^[A-Za-z]+/)[0];
  const username = req.user?.username || req.user?.name || req.user?.fullname || "User";
  const email = req.user?.email || "";

  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    return next(new APIError("Invalid user or amount", 400));
  }

  let BASE_URL = "";
  switch (role) {
    case "ADMIN":
      BASE_URL = process.env.ADMIN_URL;
      break;
    case "CLIENT":
      BASE_URL = process.env.CLIENT_URL;
      break;
    case "STORE":
      BASE_URL = process.env.CLIENT_URL;
      break;
    case "SHIPPER":
      BASE_URL = process.env.SHIPPER_URL;
      break;
    default:
      return next(new APIError("Invalid user role", 400));
  }

  console.log(BASE_URL);

  // 4) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "vnd",
          unit_amount: amount,
          product_data: {
            name: `Top-up for ${username}`,
            description: "Account Wallet Top-up",
            images: ["https://cdn3d.iconscout.com/3d/premium/thumb/full-shopping-cart-5685678-4735048.png?f=webp"]
          }
        },
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: `${BASE_URL}/wallet/success`,
    cancel_url: `${BASE_URL}/wallet`,
    customer_email: email,

    // lưu thông tin để xử lý trong webhook
    metadata: {
      userId: userId,
      role: role,
      amount: amount
    }
  });

  // 5) send session to response
  res.status(200).json({ status: "success", session });
});

export const createCheckoutSessionMomo = asyncHandler(async (req, res, next) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var accessKey = 'F8BBA842ECF85';
  var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  var orderInfo = 'pay with MoMo';
  var partnerCode = 'MOMO';
  var redirectUrl = `${process.env.CLIENT_URL}/wallet/success`;
  var ipnUrl = `${process.env.NGROK_URL}/api/webhook/momo`;
  var requestType = "payWithMethod";
  var amount = req.body.amount;
  var orderId = partnerCode + new Date().getTime();
  var requestId = req.user.id;
  var extraData = '';
  var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
  var orderGroupId = '';
  var autoCapture = true;
  var lang = 'vi';

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
  //signature
  var signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    paymentCode: paymentCode,
    orderGroupId: orderGroupId,
    signature: signature
  });
  //Create the HTTPS objects
  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  }
  //Send the request and get the response
  let momoResponse = "";
  const req2 = https.request(options, res2 => {
    res2.setEncoding('utf8');
    res2.on('data', (chunk) => {
      momoResponse += chunk;
    });
    res2.on('end', () => {
      try {
        const data = JSON.parse(momoResponse);
        // Trả dữ liệu MoMo về cho client
        res.status(200).json(data);
      } catch (err) {
        res.status(500).json({ status: "fail", message: "MoMo response parse error", error: err.message });
      }
    });
  });

  req2.on('error', (e) => {
    res.status(500).json({ status: "fail", message: `problem with request: ${e.message}` });
  });

  req2.write(requestBody);
  req2.end();
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
        payment_method: "stripe",
        type: TRANSACTION_TYPE.TOP_UP,
        status: "SUCCESS",
        description: "Nạp tiền qua Stripe"
      });
    }
  }

  res.status(200).json({ received: true });
});

export const webhookCheckoutMoMo = asyncHandler(async (req, res, next) => {

  console.log("MoMo Webhook called with query:", req.body);
  // Nhận dữ liệu từ MoMo (qua query)
  const {
    amount,
    requestId,
    resultCode,
    message,
  } = req.body;

  // Chỉ xử lý khi thanh toán thành công (resultCode === '0')
  if (resultCode != 0) {
    return res.status(400).json({ status: "fail", message: "MoMo payment not successful", resultCode, messageMoMo: message });
  }

  // Lấy userId từ requestId (ví dụ: CLIENT1762871773034)
  const userId = requestId;
  if (!userId) {
    return res.status(400).json({ status: "fail", message: "Missing userId in requestId" });
  }

  // Tách role từ userId
  const match = userId.match(/^[A-Za-z]+/);
  if (!match) {
    return res.status(400).json({ status: "fail", message: "Invalid userId format" });
  }
  const role = match[0];

  // Chọn đúng model theo role
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
    default:
      return res.status(400).json({ status: "fail", message: "Invalid user role" });
  }

  // Lấy user
  const user = await UserModel.findByPk(userId);
  if (!user) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  // Kiểm tra transaction đã tồn tại chưa (tránh cộng ví 2 lần)
  const exists = await Transaction.findOne({
    where: {
      user_id: userId,
      amount: amount,
      type: TRANSACTION_TYPE.TOP_UP,
      status: "SUCCESS",
      payment_method: "momo"
    }
  });

  if (!exists) {
    // Cập nhật wallet
    user.wallet += Number(amount);
    await user.save();
    // Lưu transaction
    await Transaction.create({
      user_id: userId,
      amount: Number(amount),
      new_balance: user.wallet,
      payment_method: "momo",
      type: TRANSACTION_TYPE.TOP_UP,
      status: "SUCCESS",
      description: "Nạp tiền qua MoMo"
    });
  }

  res.status(200).json({ received: true });
});

export const getTransactionHistory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Lấy query param
  const { startDate, endDate, page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  // Validate ngày
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start))

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

    if (start >= end) {
      return res.status(400).json({
        status: "fail",
        message: "startDate must be earlier than endDate",
      });
    }
  }

  // Điều kiện lọc
  const whereConditions = { user_id: userId };

  if (startDate && endDate) {
    whereConditions.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  }

  // Query tổng số bản ghi trước
  const totalRecords = await Transaction.count({
    where: whereConditions,
  });

  const totalPages = Math.ceil(totalRecords / pageSize);

  // Lấy data theo phân trang
  const transactions = await Transaction.findAll({
    where: whereConditions,
    order: [["createdAt", "DESC"]], // mới nhất lên trước
    limit: pageSize,
    offset,
  });

  res.status(200).json({
    status: "success",
    pagination: {
      page: Number(page),
      pageSize,
      totalPages,
      totalRecords,
    },
    data: transactions,
  });
});

export const withdrawWallet = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { amount, password } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return next(new APIError("Invalid amount", 400));
  }
  // Lấy user
  const user = await req.model.findByPk(userId);
  if (!user) {
    return next(new APIError("User not found", 404));
  }

  if (user.wallet < Number(amount)) {
    return next(new APIError("Insufficient wallet balance", 400));
  }

  // Yêu cầu password để xác thực
  if (!password) {
    return next(new APIError("Password is required to withdraw", 400));
  }

  // Kiểm tra method isCorrectPassword có tồn tại và password có đúng không
  if (typeof user.isCorrectPassword !== "function") {
    return next(new APIError("Password verification not available for this user", 400));
  }

  const passwordMatches = await user.isCorrectPassword(password);
  if (!passwordMatches) {
    return next(new APIError("Incorrect password", 401));
  }

  // Thực hiện cập nhật wallet và tạo Transaction trong 1 transaction DB
  const t = await sequelize.transaction();
  try {
    user.wallet = Number(user.wallet) - Number(amount);
    await user.save({ transaction: t });

    await Transaction.create({
      user_id: userId,
      amount: Number(amount),
      new_balance: user.wallet,
      payment_method: "wallet",
      type: TRANSACTION_TYPE.WITHDRAW,
      status: "SUCCESS",
      description: "Rút tiền từ ví"
    }, { transaction: t });

    await t.commit();

    res.status(200).json({
      status: "success",
      message: "Withdraw successful",
      newBalance: user.wallet
    });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
});