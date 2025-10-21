import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Product from "./productModel.js";

const ProductImage = sequelize.define(
  "ProductImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("image_url");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/productSliceImages/${rawValue}`;
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Product,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "product_images",
    timestamps: true,
  }
);

export default ProductImage;