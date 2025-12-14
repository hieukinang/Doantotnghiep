import express from "express";
import { 
    createComplaint, 
    resizeComplaintImages, 
    uploadComplaintImages,
    getAllComplaints,
    replyComplaint,
    getComplaintbyId
  } from "../../controller/complaintController.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import APIError from "../../utils/apiError.utils.js";
import Admin from "../../model/adminModel.js";
import Store from "../../model/storeModel.js";
import Shipper from "../../model/shipperModel.js";
import Client from "../../model/clientModel.js";
import { verifyToken } from "../../utils/tokenHandler.utils.js";
import { isAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

const isAuth_complaint = () => asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return next(new APIError("Không có token, vui lòng đăng nhập để truy cập", 401));
    }

    const decoded = verifyToken(token);
    const userId = decoded && decoded.userId;
    if (!userId) {
      return next(new APIError("Payload token không hợp lệ", 401));
    }

    const match = userId.match(/^[A-Za-z]+/);
    if (!match) {
      return next(new APIError("Định dạng userId trong token không hợp lệ", 401));
    }
    const role = match[0];

    let UserModel;
    switch (role) {
      case "ADMIN":
        UserModel = Admin;
        break;
      case "CLIENT":
        UserModel = Client;
        break;
      case "STORE":
        UserModel = Store;
        break;
      case "SHIPPER":
        UserModel = Shipper;
        break;
      default:
        return next(new APIError("Người dùng không hợp lệ", 401));
    }

    const currentUser = await UserModel.findByPk(userId);
    if (!currentUser) {
      return next(new APIError("Không hợp lệ", 401));
    }

    if (currentUser.isPasswordChangedAfterJwtIat && currentUser.isPasswordChangedAfterJwtIat(decoded.iat)) {
      return next(new APIError("Người dùng vừa thay đổi mật khẩu, vui lòng đăng nhập lại", 401));
    }

    req.user = currentUser;
    req.model = UserModel;
    next();
});

// Create a complaint (client authenticated). Accept up to 5 images under field name 'images'.
router.post("", isAuth_complaint(), 
  uploadComplaintImages, 
  resizeComplaintImages,
  createComplaint);

router.get("", isAuth(Admin),
  getAllComplaints
);

router.post("/reply/:complaintId", isAuth(Admin),
  replyComplaint
);

router.get("/:id", isAuth(Admin),
  getComplaintbyId)

export default router;
