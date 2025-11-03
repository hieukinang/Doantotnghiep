import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Store from "./storeModel.js";
import Client from "./clientModel.js";

const Follow = sequelize.define(
  "Follow",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    storeId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: Store,
        key: "id",
      },
    },
    clientId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: Client,
        key: "id",
      },
    },
  },
  {
    tableName: "follows",
    timestamps: true,
  }
);

export default Follow;