import { DataTypes, Op } from "sequelize";
import { sequelize } from "../config/db.js";
import Client from "./clientModel.js";
import Product from "./productModel.js";
import Order from "./orderModel.js";

// Định nghĩa model Review
const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: "Review text is required" },
        len: {
          args: [3, 255],
          msg: "Review text must be between 3 and 255 characters",
        },
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        notNull: { msg: "Rating value is required" },
      },
    },
    clientId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Order,
        key: "id",
      },
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
  }
);

// Hàm tính toán lại ratingAverage và reviewsNumber cho Product
Review.calcRatingAverageAndNumberOfReviews = async function (productId) {
  const stats = await Review.findAll({
    where: { productId },
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("id")), "numOfReviews"],
      [sequelize.fn("AVG", sequelize.col("rating")), "avrRating"],
    ],
    raw: true,
  });

  const numOfReviews = parseInt(stats[0].numOfReviews, 10) || 0;
  const avrRating = parseFloat(stats[0].avrRating) || 0;

  await Product.update(
    {
      reviewsNumber: numOfReviews,
      ratingAverage: avrRating,
    },
    { where: { id: productId } }
  );
};

// Hook: Sau khi tạo hoặc cập nhật review
Review.afterSave(async (review, options) => {
  await Review.calcRatingAverageAndNumberOfReviews(review.productId);
});

// Hook: Sau khi xóa review
Review.afterDestroy(async (review, options) => {
  await Review.calcRatingAverageAndNumberOfReviews(review.productId);
});

export default Review;