import express from "express";
import { 
    createComplaint, 
    resizeComplaintImages, 
    uploadComplaintImages 
} from "../../controller/complaintController.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import APIError from "../../utils/apiError.utils.js";
import Admin from "../../model/adminModel.js";
import Store from "../../model/storeModel.js";
import Shipper from "../../model/shipperModel.js";
import Client from "../../model/clientModel.js";
import { verifyToken } from "../../utils/tokenHandler.utils.js";

const router = express.Router();

const isAuth = () => asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return next(new APIError("Unauthorized, please login to get access", 401));
    }

    const decoded = verifyToken(token);
    const userId = decoded && decoded.userId;
    if (!userId) {
      return next(new APIError("Invalid token payload", 401));
    }

    const match = userId.match(/^[A-Za-z]+/);
    if (!match) {
      return next(new APIError("Invalid userId format in token", 401));
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
        return next(new APIError("Invalid user role", 401));
    }

    const currentUser = await UserModel.findByPk(userId);
    if (!currentUser) {
      return next(new APIError("The user that belong to this token does no longer exist", 401));
    }

    if (currentUser.isPasswordChangedAfterJwtIat && currentUser.isPasswordChangedAfterJwtIat(decoded.iat)) {
      return next(new APIError("User recently changed password, please log in again", 401));
    }

    req.user = currentUser;
    req.model = UserModel;
    next();
  });

// Create a complaint (client authenticated). Accept up to 5 images under field name 'images'.
router.post("", isAuth(), 
    uploadComplaintImages, 
    resizeComplaintImages,
    createComplaint);

export default router;
