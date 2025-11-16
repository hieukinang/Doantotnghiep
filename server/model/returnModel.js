import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Order from "./orderModel.js";

const Return = sequelize.define(
  "Return",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
      field: "orderId",
    },
    return_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "returns",
    timestamps: true,
  }
);

export default Return;