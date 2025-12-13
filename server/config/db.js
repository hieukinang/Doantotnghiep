import { Sequelize } from "sequelize";
import "colors";
import dotenv from "dotenv";

dotenv.config();

import { ADMIN_ROLES } from "../constants/index.js";

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
    // await sequelize.sync({ force: true }); // Xóa và tạo lại bảng
    console.log("MySQL Connected successfully!".cyan.underline);

    // check existence via raw SQL
      const existing = await sequelize.query(
        "SELECT id FROM admins WHERE role = :role LIMIT 1",
        {
          replacements: { role: ADMIN_ROLES.MANAGER },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (!existing || existing.length === 0) {
        // hash password before inserting
        const hashedPassword = await bcrypt.hash(managerPassword, 12);
        const id = `ADMIN${Date.now()}`;

        await sequelize.query(
          `INSERT INTO admins (id, username, password, email, role, createdAt, updatedAt)
           VALUES (:id, :username, :password, :email, :role, NOW(), NOW())`,
          {
            replacements: {
              id,
              username: managerUsername,
              password: hashedPassword,
              email: managerEmail,
              role: ADMIN_ROLES.MANAGER,
            },
            type: sequelize.QueryTypes.INSERT,
          }
        );

        console.log(`Tạo tài khoản quản trị viên mặc định '${managerUsername}'`.green);
      } else {
        console.log("Đã tồn tại tài khoản quản trị viên mặc định".yellow);
      }
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export { sequelize };
export default connectToDB;