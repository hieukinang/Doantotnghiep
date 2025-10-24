import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Order from "./orderModel.js";
import ProductVariant from "./productVariantModel.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Order,
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
    tableName: "order_items",
    timestamps: true,
  }
);

export default OrderItem;