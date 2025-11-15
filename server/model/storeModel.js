import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";

import {STORE_STATUS} from "../constants/index.js";

const Store = sequelize.define(
  "Store",
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    citizen_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    id_image: {
      type: DataTypes.STRING(255),
      defaultValue: "default-store.jpg",
      get() {
        const rawValue = this.getDataValue("id_image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/stores/${rawValue}`;
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9]{9,20}$/,
          msg: "Phone must contain only digits and be 9-20 characters long",
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [6, 25],
          msg: "Password must be between 6 and 25 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: { msg: "Must be a valid email address" },
      },
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bank_account_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bank_account_holder_name: {
      type: DataTypes.STRING(100),
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
      type: DataTypes.ENUM(...Object.values(STORE_STATUS)),
      allowNull: false,
      defaultValue: STORE_STATUS.PROCESSING,
    },
    followers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    wallet: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
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
    image: {
      type: DataTypes.STRING(255),
      defaultValue: "default-store.jpg",
      get() {
        const rawValue = this.getDataValue("image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/stores/${rawValue}`;
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verified_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "stores",
    timestamps: true,
    hooks: {
      /**
       * Tạo ID tùy chỉnh trước khi tạo Store
       */
      beforeValidate: async (store) => {
        // Tạo ID với tiền tố "STORE" + timestamp mili giây
        store.id = `STORE${Date.now()}`;
      },
      /**
       * Hash password trước khi lưu
       */
      beforeSave: async (store) => {
        if (store.changed("password")) {
          store.password = await bcrypt.hash(store.password, 12);
          store.passwordChangedAt = new Date();
        }
      },
    },
  }
);

// Kiểm tra password có khớp với hash trong DB không
Store.prototype.isCorrectPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Kiểm tra password đã thay đổi sau khi JWT được tạo chưa
Store.prototype.isPasswordChangedAfterJwtIat = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedTimestamp > jwtTimestamp;
  }
  return false;
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