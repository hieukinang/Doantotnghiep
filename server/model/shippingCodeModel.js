import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Admin from "./adminModel.js";

const ShippingCode = sequelize.define(
  "ShippingCode",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER, // phần trăm giảm giá phí vận chuyển
      allowNull: false,
      validate: {
        min: 1,
        max: 100,   
      }
    },
    quantity: {
      type: DataTypes.INTEGER, // số lượng mã còn lại
      allowNull: false,
      defaultValue: 1,
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    adminId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: Admin, // dùng tên bảng để tránh lỗi tuần hoàn
        key: "id",
      },
    },
  },
  {
    tableName: "shipping_codes",
    timestamps: true,
  }
);

export default ShippingCode;