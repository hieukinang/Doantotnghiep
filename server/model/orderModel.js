import { DataTypes, ENUM } from "sequelize";
import { sequelize } from "../config/db.js";
import Client from "./clientModel.js";
import Shipper from "./shipperModel.js";
import Store from "./storeModel.js";
import { ORDER_STATUS } from "../constants/index.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
      defaultValue: ORDER_STATUS.PROCESSING,
      allowNull: true,
    },
    shipping_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    shipping_fee: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    paid_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    delivered_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Client,
        key: "id",
      },
    },
    shipperId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Shipper,
        key: "id",
      },
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Store,
        key: "id",
      },
    }
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;