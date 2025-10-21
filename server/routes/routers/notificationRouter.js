import express from "express";
import {
  adminCreateNotification,
  getUserNotifications
} from "../../controller/notificationController.js";
import { allowedTo, isAuth } from "../../middleware/auth.middleware.js";
import Admin from "../../model/adminModel.js";
import { checkAdminStatus } from "../../validators/status.validator.js";
import { ADMIN_ROLES } from "../../constants/index.js";
import Client from "../../model/clientModel.js";
import Store from "../../model/storeModel.js";
import Shipper from "../../model/shipperModel.js";

const router = express.Router();

// Admin
// Tạo thông báo mới
router.post("/admin", 
    isAuth(Admin), 
    allowedTo(ADMIN_ROLES.MANAGER), 
    checkAdminStatus, 
    adminCreateNotification
);

// Client
// Lấy tất cả thông báo dành cho client đang đăng nhập
router.get("/client", isAuth(Client), getUserNotifications("CLIENT"));

// Store
// Lấy tất cả thông báo dành cho store đang đăng nhập
router.get("/store", isAuth(Store), getUserNotifications("STORE"));

// Shipper
// Lấy tất cả thông báo dành cho shipper đang đăng nhập
router.get("/shipper", isAuth(Shipper), getUserNotifications("SHIPPER"));

export default router;