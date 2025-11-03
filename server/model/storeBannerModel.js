import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Store from "./storeModel.js";

const StoreBanner = sequelize.define(
  "StoreBanner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("path");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/store_banners/${rawValue}`;
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
  },
  {
    tableName: "store_banners",
    timestamps: true,
  }
);

export default StoreBanner;