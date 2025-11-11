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
import { webhookCheckout } from "./controller/transactionController.js";

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
  message: "Too many requests, please try again in one hour",
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

//_________GLOBAL_ERROR_MIDDLEWARE_________//
app.use(GlobalErrorMiddleware);

export default app;
