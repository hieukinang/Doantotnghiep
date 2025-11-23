import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Client from "./clientModel.js";

const UserSearchQuery = sequelize.define(
  "UserSearchQuery",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING(255),
      allowNull: true, // Cho phép null nếu user guest
      references: {
        model: Client,
        key: "id",
      },
    },
    search_text: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    filter_data: {
      type: DataTypes.JSON, // Lưu filter như {category: "shoes", price: [100,300]}
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    }
  },
  {
    tableName: "user_search_queries",
    timestamps: true,
  }
);

export default UserSearchQuery;