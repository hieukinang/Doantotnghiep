import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Client from "./clientModel.js";
import Product from "./productModel.js";

const Favorite = sequelize.define(
  "Favorite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Client,
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
    tableName: "favorites",
    timestamps: true,
  }
);

export default Favorite;