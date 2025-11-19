import express from "express";

import { 
    getTopSoldProductsToday, 
    getRandomProducts,
    getTopDiscountedProducts,
    getProductsByCategoryName,
    getPurchasedProducts,
    getMallRandomProducts,
} from "../../controller/recommendationController.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import Client from "../../model/clientModel.js";

const router = express.Router();

// GET /products/top-sold-today?page=1
router.get("/top-sold-today", getTopSoldProductsToday);

// GET /products/random-50?page=1
router.get("/random", getRandomProducts);

// GET /products/top-discounted?page=1
router.get("/top-discounted", getTopDiscountedProducts);

// GET /products/by-category?name=...&page=1
router.get("/by-category", getProductsByCategoryName);

// GET /products/purchased?page=1[&clientId=...]
router.get("/purchased", isAuth(Client), getPurchasedProducts);

// GET /products/mall-random?page=1
router.get("/mall-random", getMallRandomProducts);

export default router;
