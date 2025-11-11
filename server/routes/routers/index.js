import express from "express";

import clientRouter from "./clientRouter.js";
import addressRouter from "./addressRouter.js";
import favoriteRouter from "./favoriteRouter.js";
import storeRouter from "./storeRouter.js";
import adminRouter from "./adminRouter.js";
import shipperRouter from "./shipperRouter.js";
import categoryRouter from "./categoryRouter.js";
import bannerRouter from "./bannerRouter.js";
import productRouter from "./productRouter.js";
import orderRouter from "./orderRouter.js";
import couponRouter from "./couponRouter.js";
import cartRouter from "./cartRouter.js";
import productVariantRouter from "./productVariantRouter.js";
import superCategoryRouter from "./superCategoryRouter.js";
import notificationRouter from "./notificationRouter.js";
import followRouter from "./followRouter.js";
import reviewRouter from "./reviewRouter.js";
import shippingCodeRouter from "./shippingCodeRouter.js";
import transactionRouter from "./transactionRouter.js";

const router = express.Router();

router.use(`/clients`, clientRouter);
router.use("/addresses", addressRouter);
router.use("/favorites", favoriteRouter);
router.use(`/stores`, storeRouter);
router.use(`/products`, productRouter);
router.use(`/banners`, bannerRouter);
router.use(`/categories`, categoryRouter);
router.use(`/shippers`, shipperRouter);
router.use(`/admins`, adminRouter);
router.use(`/orders`, orderRouter);
router.use(`/coupons`, couponRouter);
router.use("/carts", cartRouter);
router.use("/product-variants", productVariantRouter);
router.use("/supercategories", superCategoryRouter);
router.use("/notifications", notificationRouter);
router.use("/follows", followRouter); // follow endpoints attached to stores
router.use("/reviews", reviewRouter);
router.use("/shipping-codes", shippingCodeRouter);
router.use("/transactions", transactionRouter);

export default router;
