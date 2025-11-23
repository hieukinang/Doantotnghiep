import Shipper from "../model/shipperModel.js";
import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { generateSendToken } from "../utils/tokenHandler.utils.js";
import { uploadMixOfImages, uploadSingleImage } from "../middleware/imgUpload.middleware.js";

import {sendEmail} from "../utils/sendEmail.utils.js";

import { SHIPPER_STATUS } from "../constants/index.js";

import fs from "fs";
import path from "path";
import sharp from "sharp";

import { Op } from "sequelize";
import { getOne, getAll, deleteOne } from "../utils/refactorControllers.utils.js";

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer) - upload đồng thời 4 ảnh: id_image, image, profile_image, health_image
export const uploadShipperImages = uploadMixOfImages([
    { name: "id_image", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "profile_image", maxCount: 1 },
    { name: "health_image", maxCount: 1 },
]);

export const uploadShipperImage = uploadSingleImage("image");

// 2) PROCESSING(Sharp)
export const resizeShipperImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  // console.log(req.file);

    // safe filename using shipper id (from auth) or timestamp
    const ownerId = req.user && req.user.id ? req.user.id : Date.now();
    const safeName = `Shipper-${ownerId}.jpeg`;

    // ensure shippers directory exists
    const shippersDir = path.join(process.env.FILES_UPLOADS_PATH || "uploads", "shippers");
    try { fs.mkdirSync(shippersDir, { recursive: true }); } catch (err) { }

    const outPath = path.join(shippersDir, safeName);
    await sharp(req.file.buffer)
        .resize(400, 400)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(outPath);

    // set filename for controller to save into DB
    req.body.image = safeName;
    next();
});

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
        return next(new APIError("Tài khoản của bạn hiện chưa được duyệt, vui lòng liên hệ quản trị viên", 403));
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

export const updateStatusShipper = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status === undefined) {
        return next(new APIError("status is required", 400));
    }

    if (!Object.values(SHIPPER_STATUS).includes(status)) {
        return next(new APIError("Invalid status value", 400));
    }

    // Update only the status field
    const [affectedRows] = await Shipper.update(
        { status },
        { where: { id }, individualHooks: true }
    );

    if (!affectedRows) {
        return next(new APIError(`There is no shipper match this id : ${id}`, 404));
    }

    // Retrieve updated shipper
    const shipper = await Shipper.findByPk(id);

    // Send notification email if shipper has email
    if (shipper && shipper.email) {
        try {
            await sendEmail({
                email: shipper.email,
                subject: "Thông báo trạng thái shipper",
                message: `Xin chào ${shipper.fullname || "Shipper"},\n\nTrạng thái tài khoản của bạn đã được cập nhật thành: ${status}.\n\nTrân trọng,\nĐội ngũ hỗ trợ`
            });
        } catch (err) {
            console.error("Send email error:", err.message);
        }
    }

    res.status(200).json({ status: "success", data: { doc: shipper } });
});

export const getAllShippers = getAll(Shipper);

export const getSingleShipper = getOne(Shipper);

export const deleteShipper = deleteOne(Shipper);

export const getAllProcessingShippers = getAll(Shipper, {
    where: { status: SHIPPER_STATUS.PROCESSING }
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    const shipperId = req.user && req.user.id;
    if (!shipperId) return next(new APIError("Authentication required", 401));

    const shipper = await Shipper.findByPk(shipperId);
    req.body.image = `Shipper-${shipper.id}.jpeg`
    
    if (!shipper) return next(new APIError("Shipper not found", 404));

    // Build allowed update set dynamically from req.body keys that match model attributes
    const modelAttrs = Object.keys(Shipper.rawAttributes || {});
    const forbidden = ["id", "passwordChangedAt"]; // fields we don't allow updating directly

    const bodyKeys = Object.keys(req.body || {});
    if (bodyKeys.length === 0) return next(new APIError("No fields to update", 400));

    const allowed = {};

    for (const key of bodyKeys) {
        if (forbidden.includes(key)) continue;
        if (!modelAttrs.includes(key)) continue; // skip unknown fields

        const value = req.body[key];

        // special handling for unique fields
        if (key === "citizen_id" || key === "phone" || key === "email") {
            if (value !== undefined && value !== shipper[key]) {
                const exists = await Shipper.findOne({ where: { [key]: value } });
                if (exists && String(exists.id) !== String(shipper.id)) {
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

        // image fields (id_image, image, profile_image, health_image) are set by resizeShipperImages
        allowed[key] = value;
    }

    if (Object.keys(allowed).length === 0) return next(new APIError("No valid fields to update", 400));

    await shipper.update(allowed);

    res.status(200).json({ status: "success", data: { shipper } });
});

