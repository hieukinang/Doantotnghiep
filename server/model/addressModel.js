import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    village: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    detail_address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    clientId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: "clients",
        key: "id",
      },
    },
  },
  {
    tableName: "addresses",
    timestamps: true,
  }
);

export default Address;