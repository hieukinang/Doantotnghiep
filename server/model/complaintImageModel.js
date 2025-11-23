import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Complaint from "./complaintModel.js";

const ComplaintImage = sequelize.define(
  "ComplaintImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("path");
        if (!rawValue) return null;
        if (rawValue.startsWith("http")) return rawValue;
        return `${process.env.BASE_URL}/complaints/${rawValue}`;
      },
    },
    complaintId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Complaint,
        key: "id",
      },
    },
  },
  {
    tableName: "complaint_images",
    timestamps: true,
  }
);

export default ComplaintImage;