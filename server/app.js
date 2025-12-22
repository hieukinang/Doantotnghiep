import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import GlobalErrorMiddleware from "./middleware/GlobalError.middleware.js";
import APIError from "./utils/apiError.utils.js";
import cors from "cors";
import "./model/associations.js";
import cookieParser from "cookie-parser";
// import {webhookCheckout} from "./controller/orderController.js";

// SECURITY PACKAGES
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { 
  webhookCheckout,
  webhookCheckoutMoMo
 } from "./controller/transactionController.js";

//_________ENV_VARIABLES_________//
dotenv.config();

//_________EXPRESS_APP_________//
const app = express();

//_________ENABLE_CROSS_ORIGIN_RESOURCES_SHARING_________//
app.use(cors());
app.options("*", cors());

//_________SERVE_STATIC_FILES_________//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "uploads")));

//_________MOMO_WEBHOOK_________//
app.post(
  "/api/webhook/momo",
  express.json(), 
  webhookCheckoutMoMo
);

//_________STRIPE_WEBHOOK_________//
app.post(
  "/api/webhook",
  express.raw({type: "application/json"}),
  webhookCheckout
);

//_________MIDDLEWARES_________//
// 1)_[SECURITY]-{CROSS_SITE_SCRIPTING(XSS)}_HELMET_HEADERS_
app.use(helmet());

// 2)_[SECURITY]-{BRUTE_FORCE_ATTACK_&_DENIAL_OF_SERVICE(DOS)_ATTACK}_RATE_LIMITING_
const limiter = rateLimit({
  // maximum 500 requests per hour
  max: 5000,
  windowMs: 60 * 60 * 1000,
  message: "Hệ thống quá tải, vui lòng thử lại sau 1 giờ",
});
app.use(process.env.API_URL, limiter);

// 3) Morgan (HTTP requests LOGGER)
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// 4) Body parser (express.json() is a built express middleware that convert request body to JSON)
app.use(
  express.json({
    limit: "15kb",
  })
);

// Thêm hỗ trợ cho form-urlencoded (để nhận dữ liệu từ form truyền lên)
app.use(
  express.urlencoded({
    extended: true,
    limit: "15kb",
  })
);

// Thêm cookieParser vào sau body parser
app.use(cookieParser());

// 5)_[SECURITY]-{CROSS_SITE_SCRIPTING(XSS)_&_NO_SQL_INJECTION_ATTACK}_DATA_SANITIZATION_
// a)protect from No Sql Injection
app.use(mongoSanitize());
// b)protect from xss
app.use(xss());

// 6) HPP (protect against HTTP Parameter Pollution)
app.use(
  hpp({
    whitelist: [
      "quantityInStock",
      "price",
      "discount",
      "sold",
      "ratingAverage",
      "ReviewsNumber",
      "category",
    ],
  })
);

//_________ROUTES_________//
// 1) App Routes
app.use(routes);
// 2) 404 Urls
app.all("*", (req, res, next) => {
  next(new APIError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2) Wallet Success Page (cho mobile app redirect)
app.get("/wallet/success", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thanh toán thành công</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          max-width: 350px;
        }
        .icon { font-size: 60px; margin-bottom: 20px; }
        h1 { color: #333; margin-bottom: 10px; }
        p { color: #666; margin-bottom: 20px; }
        .note { font-size: 14px; color: #999; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">✅</div>
        <h1>Thanh toán thành công!</h1>
        <p>Giao dịch đã được xử lý. Số dư ví của bạn sẽ được cập nhật.</p>
        <p class="note">Bạn có thể đóng trang này và quay lại ứng dụng.</p>
      </div>
    </body>
    </html>
  `);
});

//_________GLOBAL_ERROR_MIDDLEWARE_________//
app.use(GlobalErrorMiddleware);

export default app;
