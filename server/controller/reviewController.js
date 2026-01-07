import Review from "../model/reviewModel.js";
import ReviewImage from "../model/reviewImageModel.js";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import Client from "../model/clientModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import { ORDER_STATUS } from "../constants/index.js";
import { uploadMixOfImages } from "../middleware/imgUpload.middleware.js";
import { getOne } from "../utils/refactorControllers.utils.js";
import Sharp from "sharp";
import { sequelize } from "../config/db.js";
import { fn, col } from "sequelize";

// helper to save uploaded images (stores raw buffer files)
export const uploadReviewImages = uploadMixOfImages([
  {name: "images", maxCount: 5},
]);

export const resizeReviewImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();
  // b) images field
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, idx) => {
        const reviewImageName = `review-${req.user.id}-${Date.now()}-image-${
          idx + 1
        }.jpeg`;

        await Sharp(img.buffer)
          .resize(800, 800)
          .toFormat("jpeg")
          .jpeg({quality: 90})
          .toFile(
            `${process.env.FILES_UPLOADS_PATH}/reviewImages/${reviewImageName}`
          );
        req.body.images.push(reviewImageName);
      })
    );
  }
  next();
});

// @desc Create a review (client) with up to 5 images when order status is DELIVERED
// @route POST /api/reviews/order/:orderId
// @access Protected(Client)

export const createReview = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const { orderId } = req.params;
  const { text, rating, productId } = req.body;

  if (!orderId) return next(new APIError("orderId là bắt buộc", 400));
  if (!productId) return next(new APIError("productId là bắt buộc", 400));
  if (!text || !rating) return next(new APIError("Vui lòng nhập đầy đủ thông tin", 400));

  // find order
  const order = await Order.findByPk(orderId);
  if (!order) return next(new APIError("Order không tồn tại", 404));
  if (order.clientId !== clientId) return next(new APIError("Bạn không thể đánh giá đơn hàng này", 403));
  if (![
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CLIENT_CONFIRMED,
  ].includes(order.status)) {
    return next(new APIError("Order phải ở trạng thái DELIVERED hoặc CLIENT_CONFIRMED trước khi đánh giá", 400));
  }

  // Đảm bảo product thuộc order này
  const product = await Product.findByPk(productId);
  if (!product) return next(new APIError("Product không tồn tại", 404));
  // create review and images inside a transaction, then update product stats
  const created = await sequelize.transaction(async (t) => {
    const review = await Review.create(
      { text, rating, clientId, productId, orderId },
      { transaction: t }
    );

    // Thêm các reviewImage vào database nếu có
    if (req.body.images && Array.isArray(req.body.images)) {
      await Promise.all(
        req.body.images.map((imgName) =>
          ReviewImage.create(
            { reviewId: review.id, url: imgName },
            { transaction: t }
          )
        )
      );
    }

    // Recalculate stats for product: average rating and count
    const stats = await Review.findOne({
      where: { productId },
      attributes: [
        [fn("AVG", col("rating")), "avgRating"],
        [fn("COUNT", col("id")), "count"],
      ],
      raw: true,
      transaction: t,
    });

    const avgRating = stats && stats.avgRating ? Number(stats.avgRating) : Number(rating);
    const count = stats && stats.count ? Number(stats.count) : 1;

      // Làm tròn avgRating sau dấu phẩy 1 chữ số
      const newRatingAverage = Math.round(avgRating * 10) / 10;

    await product.update(
      { rating_average: newRatingAverage, review_numbers: count },
      { transaction: t }
    );

    // return created review with client include
    return Review.findByPk(review.id, {
      include: [{ model: Client, as: "ReviewClient", attributes: ["id", "username", "image"] }],
      transaction: t,
    });
  });

  res.status(201).json({ status: "success", data: { review: created } });
});

// @desc Get single review details
// @route GET /api/reviews/:id
// @access Public
export const getOneReview = getOne(Review, {
  include: [
    { model: Client, as: "ReviewClient", attributes: ["id", "username", "image"] },
    { model: ReviewImage, as: "ReviewImages" }
  ]
});

// @desc Get all reviews for a product
// @route GET /api/reviews/product/:productId
// @access Public
// Lấy tất cả review của một sản phẩm
export const getAllByProduct = asyncHandler(async (req, res, next) => {
  const reviews = await Review.findAll({
    where: { productId: req.params.productId },
    include: [
      { model: Client, as: "ReviewClient", attributes: ["id", "username", "image"] },
      { model: ReviewImage, as: "ReviewImages" }
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

// @desc Update a review (client can update own review)
// @route PATCH /api/reviews/:id
// @access Protected(Client)
export const updateReview = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const { id } = req.params;
  const { text, rating } = req.body;
  const review = await Review.findByPk(id);
  if (!review) return next(new APIError("Review không tồn tại", 404));
  if (review.clientId !== clientId) return next(new APIError("Bạn không có quyền cập nhật review này", 403));
  const allowed = {};
  if (text !== undefined) allowed.text = text;
  if (rating !== undefined) allowed.rating = rating;
  if (Object.keys(allowed).length === 0) return next(new APIError("Không có trường nào để cập nhật", 400));

  // Update review inside a transaction. If rating changed, recalculate product stats.
  const updated = await sequelize.transaction(async (t) => {
    await review.update(allowed, { transaction: t });

    if (rating !== undefined) {
      // ensure product exists
      const product = await Product.findByPk(review.productId, { transaction: t });
      if (!product) throw new APIError("Product không tồn tại", 404);

      // Recalculate avg rating and count
      const stats = await Review.findOne({
        where: { productId: review.productId },
        attributes: [
          [fn("AVG", col("rating")), "avgRating"],
          [fn("COUNT", col("id")), "count"],
        ],
        raw: true,
        transaction: t,
      });

      const avgRating = stats && stats.avgRating ? Number(stats.avgRating) : Number(rating);
      const count = stats && stats.count ? Number(stats.count) : 0;
      const newRatingAverage = Math.round(avgRating * 10) / 10;

      await product.update(
        { rating_average: newRatingAverage, review_numbers: count },
        { transaction: t }
      );
    }

    // return the refreshed review with related data
    return Review.findByPk(review.id, {
      include: [
        { model: Client, as: "ReviewClient", attributes: ["id", "username", "image"] },
        { model: ReviewImage, as: "ReviewImages" }
      ],
      transaction: t,
    });
  });

  res.status(200).json({ status: "success", data: { review: updated } });
});

// @desc Get review by order id
// @route GET /api/reviews/order/:orderId
// @access Public
export const getOneByOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const review = await Review.findOne({ where: { orderId }, include: [{ model: Client, as: "ReviewClient", attributes: ["id", "username", "image"] }] });
  if (!review) return next(new APIError("Review không tồn tại cho đơn hàng này", 404));
  const images = await ReviewImage.findAll({ where: { reviewId: review.id } });
  const data = review.toJSON();
  data.images = images;
  res.status(200).json({ status: "success", data: { review: data } });
});

// @desc Get all reviews by rating
// @route GET /api/reviews/rating/:rating
// @access Public
export const getAllByRating = asyncHandler(async (req, res, next) => {
  const rating = parseInt(req.params.rating, 10);
  if (!rating || rating < 1 || rating > 5) return next(new APIError("Giá trị đánh giá không hợp lệ", 400));
  const reviews = await Review.findAll({ where: { rating }, include: [{ model: Client, as: "ReviewClient", attributes: ["id", "username", "image"] }], order: [["createdAt", "DESC"]] });
  res.status(200).json({ status: "success", results: reviews.length, data: { reviews } });
});

export default {};
