import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Cart from "./cartModel.js";
import Product from "./productModel.js";

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
    tableName: "cart_items",
    timestamps: true,
  }
);

export default CartItem;