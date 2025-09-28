import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Client from "./clientModel.js";

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    village: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    detail_address: {
      type: DataTypes.STRING(100),
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
  },
  {
    tableName: "addresses",
    timestamps: true,
  }
);

export default Address;