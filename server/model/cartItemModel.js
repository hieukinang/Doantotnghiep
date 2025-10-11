import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Cart from "./cartModel.js";
import ProductVariant from "./productVariantModel.js";

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Cart,
        key: "id",
      },
    },
    product_variantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductVariant,
        key: "id",
      },
    },
  },
  {
    tableName: "cart_items",
    timestamps: true,
  }
);

export default CartItem;