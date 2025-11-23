import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Client from "./clientModel.js";
import Product from "./productModel.js"; // Giả sử bạn đã có bảng Product

const UserViewEvent = sequelize.define(
  "UserViewEvent",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING(255),
      allowNull: true, // Cho phép null nếu user chưa đăng nhập
      references: {
        model: Client,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    duration: {
      type: DataTypes.INTEGER, // số giây xem trang
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING(50), // mobile | desktop | tablet
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(100), // search | homepage | recommendation | category
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "user_view_events",
    timestamps: true, // createdAt, updatedAt
  }
);

export default UserViewEvent;
