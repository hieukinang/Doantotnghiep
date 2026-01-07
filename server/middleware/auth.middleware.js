import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { verifyToken } from "../utils/tokenHandler.utils.js";

export const isAuth = (Model) =>
  asyncHandler(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return next(new APIError("Lỗi xác thực", 401));
    }

    const decoded = verifyToken(token);

    // Model là Client, Store, Shipper, Admin...
    const currentUser = await Model.findByPk(decoded.userId);
    if (!currentUser) {
      return next(
        new APIError(
          "Người dùng thuộc token này không còn tồn tại",
          401
        )
      );
    }

    if (currentUser.isPasswordChangedAfterJwtIat && currentUser.isPasswordChangedAfterJwtIat(decoded.iat)) {
      return next(
        new APIError("Người dùng vừa thay đổi mật khẩu, vui lòng đăng nhập lại", 401)
      );
    }

    req.user = currentUser;
    next();
  });

// @desc    allowedTo Middleware
export const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new APIError(
          `Bạn với vai trò ${req.user.role} không có quyền thực hiện hành động này`,
          403
        )
      );
    }
    next();
  };
};