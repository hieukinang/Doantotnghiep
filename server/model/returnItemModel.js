import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Return from "./returnModel.js";
import OrderItem from "./orderItemModel.js";

const ReturnItem = sequelize.define(
  "ReturnItem",
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
        key: "id", // mapping tới trường id của bảng Return
      },
    },
    order_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OrderItem,
        key: "id", // mapping tới trường id của bảng OrderItem
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "return_items",
    timestamps: true,
  }
);

export default ReturnItem;