import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      trim: true,
      set(value) {
        this.setDataValue("name", value.trim().toLowerCase());
      },
      validate: {
        notNull: { msg: "Category name is required" },
        len: {
          args: [3, 30],
          msg: "Category name must be between 3 and 30 characters",
        },
      },
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: "Category must have image" },
      },
      get() {
        const rawValue = this.getDataValue("image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/categories/${rawValue}`;
      },
    },
  },
  {
    tableName: "categories",
    timestamps: true,
  }
);

export default Category;