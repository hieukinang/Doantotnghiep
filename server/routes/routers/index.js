import express from "express";

import clientRouter from "./clientRouter.js";
import storeRouter from "./storeRouter.js";

const router = express.Router();

router.use(`/client`, clientRouter);
router.use(`/store`, storeRouter);


export default router;
