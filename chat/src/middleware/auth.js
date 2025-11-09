import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import APIError from '../utils/apiError.js';

async function authMiddleware(req, res, next) {
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
    return next(new APIError("Unauthorized , Please login to get access", 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
    const { userId } = payload;

    // Tìm user trong DB theo userId
    const currentUser = await User.findOne({ user_id: userId });
    if (!currentUser) {
      return next(new APIError("The user that belong to this token does no longer exist", 401));
    }

    // Nếu có logic đổi mật khẩu, kiểm tra tại đây (bỏ qua nếu không dùng)
    // if (currentUser.isPasswordChangedAfterJwtIat && currentUser.isPasswordChangedAfterJwtIat(payload.iat)) {
    //   return next(new APIError("User recently changed password, please log in again", 401));
    // }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new APIError('Invalid token', 401));
  }
}

export default authMiddleware;