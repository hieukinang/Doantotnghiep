import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Client from "./clientModel.js";

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    total_shipping_fee: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true, // Đảm bảo mỗi client chỉ có 1 cart
      references: {
        model: Client,
        key: "id",
      },
    },
  },
  {
    tableName: "cart",
    timestamps: true,
  }
);

export default Cart;