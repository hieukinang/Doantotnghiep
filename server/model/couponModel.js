import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Store from "./storeModel.js";

const Coupon = sequelize.define(
  "Coupon",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // type: {
    //   type: DataTypes.ENUM("PERCENTAGE", "FIXED"),
    //   allowNull: false,
    // },
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
    tableName: "coupons",
    timestamps: true,
  }
);

export default Coupon;