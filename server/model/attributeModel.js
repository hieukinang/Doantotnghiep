import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Category from "./categoryModel.js";

const Attribute = sequelize.define(
  "Attribute",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    data_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    tableName: "attributes",
    timestamps: true,
  }
);

export default Attribute;