import express from "express";

import clientRouter from "./clientRouter.js";
import storeRouter from "./storeRouter.js";
import adminRouter from "./adminRouter.js";
import shipperRouter from "./shipperRouter.js";
import categoryRouter from "./categoryRouter.js";
import bannerRouter from "./bannerRouter.js";

const router = express.Router();

router.use(`/clients`, clientRouter);
router.use(`/stores`, storeRouter);
router.use(`/banners`, bannerRouter);
router.use(`/categories`, categoryRouter);
router.use(`/shippers`, shipperRouter);
router.use(`/admins`, adminRouter);


export default router;
