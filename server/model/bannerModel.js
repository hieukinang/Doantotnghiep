import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Admin from "./adminModel.js";

const Banner = sequelize.define(
  "Banner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/banners/${rawValue}`;
      },
    },
    type: {
      type: DataTypes.ENUM("sidebar", "fixed"),
      allowNull: false,
      defaultValue: "sidebar",
    },
    adminId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: Admin,
        key: "id",
      },
    },
  },
  {
    tableName: "banners",
    timestamps: true, // tự động thêm createdAt, updatedAt
  }
);

export default Banner;