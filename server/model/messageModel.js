import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Conversation from "./conversationModel.js";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Conversation,
        key: "id",
      },
    },
  },
  {
    tableName: "messages",
    timestamps: false, // vì đã có trường created_at riêng
  }
);

export default Message;