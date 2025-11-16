import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Return from "./returnModel.js";

const ReturnImage = sequelize.define(
  "ReturnImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    return_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Return,
        key: "id",
      },
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("image_path");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/returnImages/${rawValue}`;
      },
    },
  },
  {
    tableName: "return_images",
    timestamps: true,
  }
);

export default ReturnImage;