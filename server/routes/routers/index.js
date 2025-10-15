import express from "express";

import clientRouter from "./clientRouter.js";
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

const router = express.Router();

router.use(`/clients`, clientRouter);
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

export default router;
