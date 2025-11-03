import express from "express";
import {
  getFavorites,
  addToFavorite,
  removeFromFavorite,
} from "../../controller/favoriteController.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import Client from "../../model/clientModel.js";

const router = express.Router();

// All routes require Client authentication
router.use(isAuth(Client));

router
  .route("/")
  .get(getFavorites);

router
  .route("/:productId")
  .post(addToFavorite)
  .delete(removeFromFavorite);

export default router;