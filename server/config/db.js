import { Sequelize } from "sequelize";
import "colors";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Xóa và tạo lại bảng
    console.log("MySQL Connected successfully!".cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export { sequelize };
export default connectToDB;