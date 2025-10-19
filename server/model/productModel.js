import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Category from "./categoryModel.js";
import Store from "./storeModel.js";
import { PRODUCT_STATUS } from "../constants/index.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        this.setDataValue("name", value.trim().toLowerCase());
      },
      validate: {
        notNull: { msg: "Product name is required" },
        len: {
          args: [3, 30],
          msg: "Product name must be between 3 and 30 characters",
        },
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        this.setDataValue("description", value.trim());
      },
      validate: {
        notNull: { msg: "Product description is required" },
        len: {
          args: [20, 255],
          msg: "Product description must be between 20 and 255 characters",
        },
      },
    },
    origin: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    min_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    rating_average: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    review_numbers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    main_image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("main_image");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/products/${rawValue}`;
      },
      validate: {
        notNull: { msg: "Product must have main image" },
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PRODUCT_STATUS)),
      allowNull: false,
      defaultValue: PRODUCT_STATUS.PROCESSING,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: "id",
      },
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;