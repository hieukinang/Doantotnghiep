import Store from "../model/storeModel.js";
import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import {generateSendToken} from "../utils/tokenHandler.utils.js";
import {uploadMixOfImages} from "../middleware/imgUpload.middleware.js";
import { STORE_STATUS } from "../constants/index.js";

import { getAll, updateOne } from "../utils/refactorControllers.utils.js";

import fs from "fs";
import path from "path";
import sharp from "sharp";

import { Op } from "sequelize";
import { get } from "http";

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
    console.log(req.body);
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

export const updateStoreProfile = updateOne(Store);

export const getAllProcessingStores = getAll(Store, {
    status: STORE_STATUS.PROCESSING
});