import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Admin from "./adminModel.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    body: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    receivers: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // Có thể lưu danh sách userId dạng chuỗi, ví dụ: "1,2,3"
    },
    type_of_receiver: {
      type: DataTypes.ENUM("ADMIN", "SHIPPER", "STORE", "CLIENT"),
      allowNull: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type_of_sender: {
      type: DataTypes.ENUM("ADMIN", "SHIPPER", "STORE", "CLIENT"),
      allowNull: true,
    }
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;