import { DataTypes} from "sequelize";
import { sequelize } from "../config/db.js";
import Review from "./reviewModel.js";

// Định nghĩa model Review
const ReviewImage = sequelize.define(
  "ReviewImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Review,
        key: "id",
      },
    },
  },
  {
    tableName: "review_images",
    timestamps: true,
  }
);

export default ReviewImage;