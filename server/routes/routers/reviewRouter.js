import express from "express";
import {
  createReview,
  uploadReviewImages,
  resizeReviewImages,
  getOneReview,
  getAllByProduct,
  updateReview,
  getOneByOrder,
  getAllByRating,
} from "../../controller/reviewController.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import Client from "../../model/clientModel.js";

const router = express.Router();

// Create review for an order (client) with up to 5 images
router.post("/order/:orderId", isAuth(Client), 
    uploadReviewImages,
    resizeReviewImages, 
    createReview);

// More specific GET routes first to avoid shadowing by '/:id'
// Get all reviews for a product
router.get("/product/:productId", getAllByProduct);

// Get review by order id
router.get("/order/:orderId", getOneByOrder);

// Get all reviews by rating
router.get("/rating/:rating", getAllByRating);

// Get a review by id
router.get("/:id", getOneReview);

// Update review (client)
router.patch("/:id", isAuth(Client), updateReview);

export default router;
