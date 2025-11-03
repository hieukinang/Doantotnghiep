import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Client from "./clientModel.js";
import Admin from "./adminModel.js";
import Store from "./storeModel.js";
import Shipper from "./shipperModel.js";

const Complaint = sequelize.define(
  "Complaint",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    details: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    resolved_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: Client,
        key: "id",
      },
    },
    adminId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: Admin,
        key: "id",
      },
    },
    storeId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: Store,
        key: "id",
      },
    },
    shipperId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: Shipper,
        key: "id",
      },
    },
  },
  {
    tableName: "complaints",
    timestamps: true,
  }
);

export default Complaint;