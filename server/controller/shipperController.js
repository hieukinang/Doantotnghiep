import Shipper from "../model/shipperModel.js";
import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { generateSendToken } from "../utils/tokenHandler.utils.js";
import { uploadMixOfImages } from "../middleware/imgUpload.middleware.js";

import { SHIPPER_STATUS } from "../constants/index.js";

import fs from "fs";
import path from "path";
import sharp from "sharp";

import { Op } from "sequelize";
import { getOne, updateOne, getAll } from "../utils/refactorControllers.utils.js";

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer) - upload đồng thời 4 ảnh: id_image, image, profile_image, health_image
export const uploadShipperImages = uploadMixOfImages([
    { name: "id_image", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "profile_image", maxCount: 1 },
    { name: "health_image", maxCount: 1 },
]);

// 2) PROCESSING(Sharp)
export const resizeShipperImages = asyncHandler(async (req, res, next) => {
    if (!req.files) return next();

    const shippersDir = path.join(process.env.FILES_UPLOADS_PATH, "shippers");
    if (!fs.existsSync(shippersDir)) {
        fs.mkdirSync(shippersDir, { recursive: true });
    }

  // Xử lý id_image
  if (req.files.id_image && req.files.id_image[0]) {
      const idImageFilename = `citizen_id-${req.body.citizen_id || Date.now()}.jpeg`;
      await sharp(req.files.id_image[0].buffer)
          .resize(400, 400)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(`${process.env.FILES_UPLOADS_PATH}/shippers/${idImageFilename}`);
      req.body.id_image = idImageFilename;
  }

    // Xử lý image (vehicle)
    if (req.files.image && req.files.image[0]) {
        const vehicleFilename = `vehicle-${req.body.citizen_id || Date.now()}.jpeg`;
        await sharp(req.files.image[0].buffer)
            .resize(400, 400)
            .toFormat("jpeg")
            .jpeg({ quality: 80 })
            .toFile(`${process.env.FILES_UPLOADS_PATH}/shippers/${vehicleFilename}`);
        req.body.image = vehicleFilename;
    }

    // Xử lý profile_image
    if (req.files.profile_image && req.files.profile_image[0]) {
        const profileFilename = `shipper-profile-${req.body.citizen_id || Date.now()}.jpeg`;
        await sharp(req.files.profile_image[0].buffer)
            .resize(400, 400)
            .toFormat("jpeg")
            .jpeg({ quality: 80 })
            .toFile(`${process.env.FILES_UPLOADS_PATH}/shippers/${profileFilename}`);
        req.body.profile_image = profileFilename;
    }

    // Xử lý health_image
    if (req.files.health_image && req.files.health_image[0]) {
        const healthFilename = `shipper-health-${req.body.citizen_id || Date.now()}.jpeg`;
        await sharp(req.files.health_image[0].buffer)
            .resize(400, 400)
            .toFormat("jpeg")
            .jpeg({ quality: 80 })
            .toFile(`${process.env.FILES_UPLOADS_PATH}/shippers/${healthFilename}`);
        req.body.health_image = healthFilename;
    }
    // Xử lý profile_image
  if (req.files.profile_image && req.files.profile_image[0]) {
      const profileImageFilename = `profile-${req.body.citizen_id || Date.now()}.jpeg`;
      await sharp(req.files.profile_image[0].buffer)
          .resize(400, 400)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(`${process.env.FILES_UPLOADS_PATH}/shippers/${profileImageFilename}`);
      req.body.profile_image = profileImageFilename;
  }
    // Xử lý health_image
  if (req.files.health_image && req.files.health_image[0]) {
      const healthImageFilename = `health-${req.body.citizen_id || Date.now()}.jpeg`;
      await sharp(req.files.health_image[0].buffer)
          .resize(400, 400)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(`${process.env.FILES_UPLOADS_PATH}/shippers/${healthImageFilename}`);
      req.body.health_image = healthImageFilename;
  }
  next();
});

export const register = asyncHandler(async (req, res, next) => {
    const {
        citizen_id,
        id_image,
        phone,
        email,
        password,
        confirmPassword,
        fullname,
        vehicle_name,
        license_plate,
        work_area_city,
        work_area_village,
        image,
        profile_image,
        health_image,
        bank_name,
        bank_account_number,
        bank_account_holder_name
    } = req.body;
    // 1) If all data entered
    if (
        !citizen_id ||
        !id_image ||
        !phone ||
        !email ||
        !password ||
        !confirmPassword ||
        !fullname ||
        !vehicle_name ||
        !license_plate ||
        !work_area_city ||
        !work_area_village ||
        !bank_name ||
        !bank_account_number ||
        !bank_account_holder_name || 
        !image || 
        !profile_image ||
        !health_image
    ) {
        return next(new APIError("Vui lòng nhập đầy đủ thông tin", 400));
    }
    // Kiểm tra trùng phone, email hoặc citizen_id
    const isShipperExist = await Shipper.findOne({
        where: {
            [Op.or]: [
                { phone },
                { email },
                { citizen_id }
            ]
        }
    });
    if (isShipperExist) {
        return next(new APIError("Số điện thoại, email hoặc CCCD của shipper đã tồn tại", 400));
    }

    // CREATE_NEW_SHIPPER
    const newShipper = await Shipper.create({
        citizen_id,
        id_image,
        fullname,
        phone,
        email,
        password,
        bank_name,
        vehicle_name,
        license_plate,
        bank_account_number,
        bank_account_holder_name,
        work_area_city,
        work_area_village,
        image,
        profile_image,
        health_image
    });
    generateSendToken(res, newShipper, 201);
});

export const login = asyncHandler(async (req, res, next) => {
    const { emailOrPhone, password } = req.body;
    // 1) If all data entered
    if (!emailOrPhone || !password) {
        return next(new APIError("Vui lòng nhập đầy đủ thông tin", 400));
    }

    // 2) If shipper exist && password is correct
    const shipper = await Shipper.findOne({
        where: {
            [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }]
        }
    });
    if (!shipper || !await shipper.isCorrectPassword(password)) {
        return next(new APIError("Email hoặc mật khẩu không đúng, vui lòng kiểm tra lại", 401));
    }

    if(shipper.status !== SHIPPER_STATUS.ACTIVE) {
        return next(new APIError("Tài khoản của bạn hiện không hoạt động, vui lòng liên hệ quản trị viên", 403));
    }

    generateSendToken(res, shipper, 200);
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

export const updateShipper = updateOne(Shipper);

export const getAllShippers = getAll(Shipper);

export const getSingleShipper = getOne(Shipper);