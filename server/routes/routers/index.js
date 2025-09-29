import express from "express";

import clientRouter from "./clientRouter.js";
import storeRouter from "./storeRouter.js";
import adminRouter from "./adminRouter.js";
import shipperRouter from "./shipperRouter.js";

const router = express.Router();

router.use(`/client`, clientRouter);
router.use(`/store`, storeRouter);
router.use(`/shippers`, shipperRouter);
router.use(`/admin`, adminRouter);


export default router;
