import Favorite from "../model/favoriteModel.js";
import Product from "../model/productModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import { getAll } from "../utils/refactorControllers.utils.js";

// @desc    Get All Favorites for Logged Client
// @route   GET /api/favorites
// @access  Protected (Client)
export const getFavorites = asyncHandler(async (req, res, next) => {
  req.filterObj = { clientId: req.user.id };
  getAll(Favorite, {
    include: [
      {
        model: Product,
        as: "FavoriteProduct",
      },
    ],
  })(req, res, next);
});

// @desc    Add Product to Favorite
// @route   POST /api/favorites/:productId
// @access  Protected (Client)
export const addToFavorite = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const clientId = req.user.id;

  // Kiểm tra product tồn tại
  const product = await Product.findByPk(productId);
  if (!product) {
    return next(new APIError("Product not found", 404));
  }

  // Kiểm tra đã favorite chưa
  const existingFavorite = await Favorite.findOne({
    where: { clientId, productId },
  });
  if (existingFavorite) {
    return next(new APIError("Product already in favorites", 400));
  }

  // Tạo favorite
  const favorite = await Favorite.create({ clientId, productId });

  res.status(201).json({
    status: "success",
    message: "Product added to favorites",
  });
});

// @desc    Remove Product from Favorite
// @route   DELETE /api/favorites/:productId
// @access  Protected (Client)
export const removeFromFavorite = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const clientId = req.user.id;

  // Tìm và xóa favorite
  const favorite = await Favorite.findOne({
    where: { clientId, productId },
  });
  if (!favorite) {
    return next(new APIError("Favorite not found", 404));
  }

  await favorite.destroy();

  res.status(204).json({
    status: "success",
  });
});