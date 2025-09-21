import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user1: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user2: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
  }
);

export default Conversation;