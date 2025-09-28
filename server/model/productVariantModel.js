import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Product from "./productModel.js";

const ProductVariant = sequelize.define(
  "ProductVariant",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sku_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: "product_variants",
    timestamps: true,
  }
);

export default ProductVariant;