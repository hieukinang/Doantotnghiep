import Admin from "../model/adminModel.js";
import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { generateSendToken } from "../utils/tokenHandler.utils.js";
import { uploadSingleImage } from "../middleware/imgUpload.middleware.js";
import { ADMIN_STATUS } from "../constants/index.js";

import sharp from "sharp";

import { Op } from "sequelize";

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer) - upload đồng thời 2 ảnh: id_image và image
export const uploadAdminImage = uploadSingleImage("image");

// 2) PROCESSING(Sharp)
export const resizeAdminImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  let filename = `${req.body.username}-${req.body.job_title}.jpeg`;
  if(req.user){
    filename = `Admin-${req.user.id}.jpeg`;
  }

  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`${process.env.FILES_UPLOADS_PATH}/admins/${filename}`);
  // put it in req.body to access it when we access updateMyProfile or updateSingleUser to save the filename into database
  req.body.image = filename;
  next();
});

export const register = asyncHandler(async (req, res, next) => {
  const {
    username,
    password,
    confirmPassword,
    phone,
    email,
    fullname,
    role,
    job_title,
    hire_date,
    salary,
    address,
    image,
    bank_name,
    bank_account_number,
    bank_account_holder_name
  } = req.body;
  // 1) If all data entered
  if (
    !username ||
    !password ||
    !confirmPassword ||
    !phone ||
    !email ||
    !fullname ||
    !role ||
    !job_title ||
    !hire_date ||
    !salary ||
    !address ||
    !image ||
    !bank_name ||
    !bank_account_number ||
    !bank_account_holder_name
  ) {
    return next(new APIError("Vui lòng nhập đầy đủ thông tin", 400));
  }
  // Kiểm tra trùng phone, email hoặc citizen_id
  const isAdminExist = await Admin.findOne({
    where: {
      [Op.or]: [
        { username },
        { email }
      ]
    }
  });
  if (isAdminExist) {
    return next(new APIError("Số điện thoại, email tồn tại", 400));
  }

    // CREATE_NEW_ADMIN
    const newAdmin = await Admin.create({
        username,
        password,
        confirmPassword,
        email,
        phone,
        fullname,
        role,
        job_title,
        hire_date,
        salary,
        address,
        image,
        bank_name,
        bank_account_number,
        bank_account_holder_name
    });
    res.status(201).json({
    status: "success",
    data: {
      newAdmin,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  // 1) If all data entered
  if (!username || !password) {
    return next(new APIError("Vui lòng nhập đầy đủ thông tin", 400));
  }

  // 2) If admin exist && password is correct
  const admin = await Admin.findOne({
    where: {
      [Op.or]: [{ username: username }]
    }
  });
  if (!admin || !await admin.isCorrectPassword(password)) {
    return next(new APIError("Email hoặc mật khẩu không đúng, vui lòng kiểm tra lại", 401));
  }
  if(!admin.active) {
    return next(new APIError("Tài khoản của bạn hiện không hoạt động, vui lòng liên hệ quản trị viên", 403));
  }

  generateSendToken(res, admin, 200);
});

export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Đăng xuất thành công",
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const adminId = req.user && req.user.id;
  if (!adminId) return next(new APIError("Yêu cầu xác thực", 401));

  const admin = await Admin.findByPk(adminId);
  req.body.image = `Admin-${req.user.id}.jpeg`;
  
  if (!admin) return next(new APIError("Không tồn tại", 404));
  // Build allowed update set dynamically from req.body keys that match model attributes
  const modelAttrs = Object.keys(Admin.rawAttributes || {});
  const forbidden = ["id", "passwordChangedAt"]; // fields we don't allow updating directly

  const bodyKeys = Object.keys(req.body || {});
  if (bodyKeys.length === 0) return next(new APIError("Không có trường nào để cập nhật", 400));

  const allowed = {};

  for (const key of bodyKeys) {
    if (forbidden.includes(key)) continue;
    if (!modelAttrs.includes(key)) continue; // skip unknown fields

    const value = req.body[key];

    // special handling for unique fields
    if (key === "username" || key === "email" || key === "phone") {
      if (value !== undefined && value !== admin[key]) {
        const exists = await Admin.findOne({ where: { [key]: value } });
        if (exists && String(exists.id) !== String(admin.id)) {
          return next(new APIError(`${key} đã được sử dụng`, 400));
        }
      }
      allowed[key] = value;
      continue;
    }

    // password requires confirmPassword
    if (key === "password") {
      const confirmPassword = req.body.confirmPassword;
      if (!confirmPassword) return next(new APIError("Vui lòng nhập confirmPassword khi thay đổi mật khẩu", 400));
      if (value !== confirmPassword) return next(new APIError("Mật khẩu và confirmPassword không khớp", 400));
      allowed.password = value;
      continue;
    }

    // image (if uploaded via middleware) will be present in req.body.image
    allowed[key] = value;
  }

  if (Object.keys(allowed).length === 0) return next(new APIError("Không có trường hợp lệ để cập nhật", 400));

  await admin.update(allowed);

  res.status(200).json({ status: "success", data: { admin } });
});