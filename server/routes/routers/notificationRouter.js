import express from "express";
import {
  adminCreateNotification
} from "../../controller/notificationController.js";
import { allowedTo, isAuth } from "../../middleware/auth.middleware.js";
import Admin from "../../model/adminModel.js";
import { checkAdminStatus } from "../../validators/status.validator.js";
import { ADMIN_ROLES } from "../../constants/index.js";

const router = express.Router();

// Admin
// Tạo thông báo mới
router.post("/admin", 
    isAuth(Admin), 
    allowedTo(ADMIN_ROLES.MANAGER), 
    checkAdminStatus, 
    adminCreateNotification
);

export default router;