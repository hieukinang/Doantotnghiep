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
    des: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    users: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // Có thể lưu danh sách userId dạng chuỗi, ví dụ: "1,2,3"
    },
    type_of_user: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Admin,
        key: "id",
      },
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;