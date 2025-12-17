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
      get() {
        const rawValue = this.getDataValue("url");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/reviewImages/${rawValue}`;
      },
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