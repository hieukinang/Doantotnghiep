import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcrypt";

import { SHIPPER_STATUS } from "../constants/index.js";

// Định nghĩa bảng `shippers`
const Shipper = sequelize.define(
  "Shipper",
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    citizen_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    id_image: {
      type: DataTypes.STRING(255),
      defaultValue: "default-citizen_id_image.jpg",
      get() {
        const rawValue = this.getDataValue("id_image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/shippers/${rawValue}`;
      },
    },
    image: {
      type: DataTypes.STRING(255),
      defaultValue: "default-image.jpg",
      get() {
        const rawValue = this.getDataValue("image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/shippers/${rawValue}`;
      },
    },
    profile_image: {
      type: DataTypes.STRING(255),
      defaultValue: "default-profile_image.jpg",
      get() {
        const rawValue = this.getDataValue("profile_image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/shippers/${rawValue}`;
      },
    },
    health_image: {
      type: DataTypes.STRING(255),
      defaultValue: "default-health_image.jpg",
      get() {
        const rawValue = this.getDataValue("health_image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/shippers/${rawValue}`;
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SHIPPER_STATUS)),
      allowNull: false,
      defaultValue: SHIPPER_STATUS.PROCESSING,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    vehicle_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    license_plate: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_deliveries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    work_area_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    work_area_village: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    wallet: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    debt: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
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
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    is_verified_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "shippers",
    timestamps: true, // tự động có createdAt, updatedAt
    hooks: {
      /**
       * Tạo ID tùy chỉnh trước khi tạo Shipper
       */
      beforeValidate: async (shipper) => {
        // Tạo ID với tiền tố "SHIPPER" + timestamp mili giây
        shipper.id = `SHIPPER${Date.now()}`;
      },
      /**
       * Hash password trước khi lưu
       */
      beforeSave: async (shipper) => {
        if (shipper.changed("password")) {
          shipper.password = await bcrypt.hash(shipper.password, 12);
          shipper.passwordChangedAt = new Date();
        }
      },
    },
  }
);

//
// ========== Gắn METHODS vào prototype ==========
//

// 1. Kiểm tra mật khẩu
Shipper.prototype.isCorrectPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 2. Tính điểm đánh giá trung bình dựa trên số đơn hàng
Shipper.prototype.calculateRating = function () {
  if (this.total_deliveries === 0) return 0;
  return (this.rating / this.total_deliveries).toFixed(2);
};

// 3. Lấy khu vực làm việc đầy đủ
Shipper.prototype.getFullWorkArea = function () {
  const city = this.work_area_city || "";
  const village = this.work_area_village || "";
  return `${village}, ${city}`.trim();
};

// 4. Thêm tiền vào balance
Shipper.prototype.addBalance = function (amount) {
  if (amount <= 0) throw new Error("Amount must be greater than 0");
  this.balance += amount;
  return this.balance;
};

// 5. Trừ tiền từ balance
Shipper.prototype.subtractBalance = function (amount) {
  if (amount <= 0) throw new Error("Amount must be greater than 0");
  if (this.balance < amount) throw new Error("Insufficient balance");
  this.balance -= amount;
  return this.balance;
};

export default Shipper;
