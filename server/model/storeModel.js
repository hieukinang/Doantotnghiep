import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import {sequelize} from "../config/db.js";

const Store = sequelize.define(
  "Store",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    citizen_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_account_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_account_holder_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_sales: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    number_of_products: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    village: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    detail_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verified_mail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "stores",
    timestamps: true, // Nếu bạn muốn tự động có createdAt, updatedAt
  }
);

// Kiểm tra password có khớp với hash trong DB không
Store.prototype.isCorrectPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Tính tổng điểm rating dựa trên total_sales
Store.prototype.calculateRating = function () {
  if (this.total_sales === 0) return 0;
  return (this.rating / this.total_sales).toFixed(2);
};

// Format địa chỉ đầy đủ
Store.prototype.getFullAddress = function () {
  return `${this.detail_address || ""}, ${this.village || ""}, ${this.city || ""}`;
};


export default Store;
