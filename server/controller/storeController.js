import Store from "../model/storeModel.js";
import Follow from "../model/followModel.js";
import StoreBanner from "../model/storeBannerModel.js";
import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import {generateSendToken} from "../utils/tokenHandler.utils.js";
import {uploadMixOfImages, uploadSingleImage} from "../middleware/imgUpload.middleware.js";
import { STORE_STATUS } from "../constants/index.js";

import { sendEmail } from "../utils/sendEmail.utils.js";

import { getAll } from "../utils/refactorControllers.utils.js";

import fs from "fs";
import path from "path";
import sharp from "sharp";

import { Op } from "sequelize";

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer) - upload đồng thời 2 ảnh: id_image và image
export const uploadStoreImage = uploadSingleImage("image");

// 2) PROCESSING(Sharp)
export const resizeStoreImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `Store-${req.user.id}.jpeg`;

  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`${process.env.FILES_UPLOADS_PATH}/stores/${filename}`);
  // put it in req.body to access it when we access updateMyProfile or updateSingleUser to save the filename into database
  req.body.image = filename;
  next();
});

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer) - upload đồng thời 2 ảnh: id_image và image
export const uploadStoreImages = uploadMixOfImages([
    { name: "id_image", maxCount: 1 },
    { name: "image", maxCount: 1 },
]);

// 2) PROCESSING(Sharp)
export const resizeStoreImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  const storesDir = path.join(process.env.FILES_UPLOADS_PATH, "stores");
  if (!fs.existsSync(storesDir)) {
      fs.mkdirSync(storesDir, { recursive: true });
  }

  // Xử lý id_image
  if (req.files.id_image && req.files.id_image[0]) {
      const idImageFilename = `citizen_id-${req.body.citizen_id}.jpeg`;
      await sharp(req.files.id_image[0].buffer)
          .resize(400, 400)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(`${process.env.FILES_UPLOADS_PATH}/stores/${idImageFilename}`);
      req.body.id_image = idImageFilename;
  }

  // Xử lý image (avatar)
  if (req.files.image && req.files.image[0]) {
      const avatarFilename = `avatar-${req.body.citizen_id}.jpeg`;
      await sharp(req.files.image[0].buffer)
          .resize(400, 400)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(`${process.env.FILES_UPLOADS_PATH}/stores/${avatarFilename}`);
      req.body.image = avatarFilename;
  }
  next();
});

export const register = asyncHandler(async (req, res, next) => {
    const {
        citizen_id,
        id_image,
        name,
        phone,
        email,
        password,
        confirmPassword,
        bank_name,
        bank_account_number,
        bank_account_holder_name,
        city,
        village,
        detail_address,
        description,
        image
    } = req.body;
    // 1) If all data entered
    if (
        !citizen_id ||
        !id_image ||
        !name ||
        !phone ||
        !email ||
        !password ||
        !confirmPassword ||
        !bank_name ||
        !bank_account_number ||
        !bank_account_holder_name ||
        !city ||
        !village ||
        !detail_address ||
        !description ||
        !image
    ) {
        return next(new APIError("Vui lòng nhập đầy đủ thông tin", 400));
    }
    // Kiểm tra trùng phone, email hoặc citizen_id
    const isStoreExist = await Store.findOne({
        where: {
            [Op.or]: [
                { phone },
                { email },
                { citizen_id }
            ]
        }
    });
    if (isStoreExist) {
        return next(new APIError("Số điện thoại, email hoặc CCCD của cửa hàng đã tồn tại", 400));
    }

    // CREATE_NEW_STORE
    const newStore = await Store.create({
        citizen_id,
        id_image,
        name,
        phone,
        email,
        password,
        confirmPassword,
        bank_name,
        bank_account_number,
        bank_account_holder_name,
        city,
        village,
        detail_address,
        description,
        image
    });
    generateSendToken(res, newStore, 201);
});

export const login = asyncHandler(async (req, res, next) => {
    const {emailOrPhone, password} = req.body;
    // 1) If all data entered
    if(!emailOrPhone || !password) {
        return next(new APIError("Vui lòng nhập đầy đủ thông tin", 400));
    }

    // 2) If store exist && password is correct
    const store = await Store.findOne({
        where: {
            [Op.or]: [{email: emailOrPhone}, {phone: emailOrPhone}]
        }
    });
    if(!store || !await store.isCorrectPassword(password)){
        return next(new APIError("Email hoặc mật khẩu không đúng, vui lòng kiểm tra lại", 401));
    }

    generateSendToken(res, store, 200);
});

export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const updateStoreStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  // Chỉ cho phép cập nhật field `status`.
  if (typeof status === "undefined") {
    return next(new APIError("Trường 'status' là bắt buộc", 400));
  }

  const allowedStatuses = Object.values(STORE_STATUS);
  if (!allowedStatuses.includes(status)) {
    return next(
      new APIError(
        `Giá trị status không hợp lệ. Giá trị hợp lệ: ${allowedStatuses.join(", ")}`,
        400
      )
    );
  }

  // Tìm store trước
  const store = await Store.findByPk(id);
  if (!store) {
    return next(new APIError(`Không tìm thấy cửa hàng với id: ${id}`, 404));
  }

  // Cập nhật chỉ trường status và lưu (kích hoạt hooks nếu có)
  store.status = status;
  await store.save({ individualHooks: true });

  // Gửi email thông báo nếu có email
  if (store.email) {
    try {
      await sendEmail({
        email: store.email,
        subject: "Thông báo cập nhật hồ sơ cửa hàng",
        message: `Xin chào ${store.name},\n\nTrạng thái cửa hàng của bạn đã được cập nhật thành công: ${status}.\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
      });
    } catch (err) {
      // Không làm gián đoạn flow nếu gửi email lỗi
      console.error("Send email error:", err.message);
    }
  }

  res.status(200).json({ status: "success", data: store });
});

export const getAllProcessingStores = getAll(Store, {
    status: STORE_STATUS.PROCESSING
});

export const getStoreById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // Lấy thông tin store
  const store = await Store.findByPk(id);
  if (!store) {
    return next(new APIError(`Không tìm thấy cửa hàng với id: ${id}`, 404));
  }
  // Đếm số lượng follow
  const followCount = await Follow.count({ where: { storeId: id } });
  // Lấy danh sách banner của store
  const banners = await StoreBanner.findAll({ where: { storeId: id } });

  res.status(200).json({
    status: "success",
    data: {
      ...store.toJSON(),
      followCount,
      banners
    }
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const storeId = req.user && req.user.id;
  if (!storeId) return next(new APIError("Authentication required", 401));

  const store = await Store.findByPk(storeId);
  if (!store) return next(new APIError("Store not found", 404));

  // Build allowed update set dynamically from req.body keys that match model attributes
  const modelAttrs = Object.keys(Store.rawAttributes || {});
  const forbidden = ["id", "passwordChangedAt", "status", "citizen_id"]; // fields we don't allow updating directly

  const bodyKeys = Object.keys(req.body || {});
  if (bodyKeys.length === 0) return next(new APIError("No fields to update", 400));

  const allowed = {};

  for (const key of bodyKeys) {
    if (forbidden.includes(key)) continue;
    if (!modelAttrs.includes(key)) continue; // skip unknown fields

    const value = req.body[key];

    // special handling for unique fields
    if (key === "phone" || key === "email" || key === "citizen_id") {
      if (value !== undefined && value !== store[key]) {
        const exists = await Store.findOne({ where: { [key]: value } });
        if (exists && String(exists.id) !== String(store.id)) {
          return next(new APIError(`${key} already in use`, 400));
        }
      }
      allowed[key] = value;
      continue;
    }

    // password requires confirmPassword
    if (key === "password") {
      const confirmPassword = req.body.confirmPassword;
      if (!confirmPassword) return next(new APIError("confirmPassword is required when changing password", 400));
      if (value !== confirmPassword) return next(new APIError("Password and confirmPassword do not match", 400));
      allowed.password = value;
      continue;
    }

    // image (if uploaded via middleware) will be present in req.body.image
    allowed[key] = value;
  }

  if (Object.keys(allowed).length === 0) return next(new APIError("No valid fields to update", 400));

  await store.update(allowed);

  res.status(200).json({ status: "success", data: { store } });
});