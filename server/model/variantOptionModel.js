import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import ProductVariant from "./productVariantModel.js";
import Attribute from "./attributeModel.js";

const VariantOption = sequelize.define(
  "VariantOption",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_variantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductVariant,
        key: "id",
      },
    },
    attributeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Attribute,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "variant_options",
    timestamps: true,
  }
);

export default VariantOption;