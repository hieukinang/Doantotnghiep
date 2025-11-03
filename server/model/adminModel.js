import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import {sequelize} from "../config/db.js"; // nơi bạn đã cấu hình Sequelize
import {ADMIN_ROLES} from "../constants/index.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      llowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Username is required" },
        len: {
          args: [3, 30],
          msg: "Username must be between 3 and 30 characters",
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
    phone: {
      type: DataTypes.STRING(10),
      validate: {
        is: {
          args: /^[0-9]{10}$/,
          msg: "Phone must be 10 digits",
        },
      },
    },
    fullname: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(ADMIN_ROLES)),
      defaultValue: ADMIN_ROLES.ADMIN,
    },
    job_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hire_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    image: {
      type: DataTypes.STRING(255),
      defaultValue: "default-admin.jpg",
      get() {
        const rawValue = this.getDataValue("image");
        if (!rawValue) return null;

        // Nếu là URL đầy đủ thì return luôn
        if (rawValue.startsWith("http")) return rawValue;

        return `${process.env.BASE_URL}/admins/${rawValue}`;
      },
    },
    bank_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bank_account_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bank_account_holder_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "admins",
    timestamps: true, // Sequelize sẽ tự động thêm createdAt, updatedAt
    hooks: {
      /**
       * Tạo ID tùy chỉnh trước khi tạo Admin
       */
      beforeValidate: async (admin) => {
        // Tạo ID với tiền tố "ADMIN" + timestamp mili giây
        admin.id = `ADMIN${Date.now()}`;
      },
      /**
       * Hash password trước khi lưu
       */
      beforeSave: async (admin) => {
        if (admin.changed("password")) {
          admin.password = await bcrypt.hash(admin.password, 12);
          admin.passwordChangedAt = new Date();
        }
      },
    },
  }
);

// Thiết lập các quan hệ


// Kiểm tra mật khẩu có chính xác không
Admin.prototype.isCorrectPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Kiểm tra password đã thay đổi sau khi JWT được tạo chưa
Admin.prototype.isPasswordChangedAfterJwtIat = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedTimestamp > jwtTimestamp;
  }
  return false;
};

export default Admin;
