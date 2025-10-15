import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const SuperCategory = sequelize.define(
  "SuperCategory",
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
        notNull: { msg: "SuperCategory name is required" },
        len: {
          args: [3, 30],
          msg: "SuperCategory name must be between 3 and 30 characters",
        },
      },
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: "SuperCategory must have image" },
      },
      get() {
        const rawValue = this.getDataValue("image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/supercategories/${rawValue}`;
      },
    },
  },
  {
    tableName: "supercategories",
    timestamps: true,
  }
);

export default SuperCategory;