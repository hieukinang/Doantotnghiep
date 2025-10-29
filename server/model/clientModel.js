import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import {sequelize} from "../config/db.js";
import {CLIENT_STATUS} from "../constants/index.js";
import {CLIENT_TYPE} from "../constants/index.js";
import Address from "./addressModel.js";

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
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
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    scores: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(CLIENT_TYPE)),
      defaultValue: CLIENT_TYPE.NORMAL,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(CLIENT_STATUS)),
      defaultValue: CLIENT_STATUS.ACTIVE,
    },
    main_address: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Address,
        key: "id",
      },
    },
    image: {
      type: DataTypes.STRING(255),
      defaultValue: "default-client.jpg",
      get() {
        const rawValue = this.getDataValue("image");
        if (!rawValue) return null;

        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/clients/${rawValue}`;
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
    wallet: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
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
    tableName: "clients",
    timestamps: true, // Sequelize sẽ tự động thêm createdAt và updatedAt
    hooks: {
      /**
       * Hash password trước khi lưu
       */
      beforeSave: async (client) => {
        if (client.changed("password")) {
          client.password = await bcrypt.hash(client.password, 12);
          client.passwordChangedAt = new Date();
        }
      },
    },
  }
);

// Kiểm tra mật khẩu có chính xác không
Client.prototype.isCorrectPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Kiểm tra password đã thay đổi sau khi JWT được tạo chưa
Client.prototype.isPasswordChangedAfterJwtIat = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedTimestamp > jwtTimestamp;
  }
  return false;
};

export default Client;
