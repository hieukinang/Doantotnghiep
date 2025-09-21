import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Product from "./productModel.js";

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
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 5,
        max: 75,
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    expire: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: "coupons",
    timestamps: true,
  }
);

// Thiết lập quan hệ với Product
Coupon.belongsTo(Product, { foreignKey: "productId", as: "product" });

export default Coupon;