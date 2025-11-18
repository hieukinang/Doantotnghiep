import Client from "../model/clientModel.js";
import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import {generateSendToken} from "../utils/tokenHandler.utils.js";

import { CLIENT_STATUS } from "../constants/index.js";

import { Op } from "sequelize";
import { uploadSingleImage } from "../middleware/imgUpload.middleware.js";

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer) - upload image
export const uploadClientImage = uploadSingleImage("image");

// 2) PROCESSING(Sharp)
export const resizeClientImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  // console.log(req.file);

  let filename = `${req.body.username}-${req.body.job_title}.jpeg`;
  if(req.user){
    filename = `Client-${req.user.id}.jpeg`;
  }

  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`${process.env.FILES_UPLOADS_PATH}/clients/${filename}`);
  // put it in req.body to access it when we access updateMyProfile or updateSingleUser to save the filename into database
  req.body.image = filename;
  next();
});

export const register = asyncHandler(async (req, res, next) => {
    const {username, phone, email, password, confirmPassword} = req.body;
    // 1) If all data entered
    if(!username || !phone || !email || !password || !confirmPassword){
        return next(new APIError("Vui lòng nhập đầy đủ thông tin", 400));
    }
    // 2) If phone is already exist
    const isPhoneExist = await Client.findOne({where: {phone}});
    if(isPhoneExist){
        return next(new APIError("Số điện thoại đã tồn tại, vui lòng nhập số điện thoại mới", 400));
    }

    // CREATE_NEW_CLIENT
    const newClient = await Client.create({
        username,
        phone,
        email,
        password,
    })
    generateSendToken(res, newClient, 201);
})

export const login = asyncHandler(async (req, res, next) => {
    const {emailOrPhone, password} = req.body;
    // 1) If all data entered
    if(!emailOrPhone || !password) {
        return next(new APIError("Vui lòng nhập đầy đủ thông tin", 400));
    }

    // 2) If client exist && password is correct
    const client = await Client.findOne({
        where: {
            [Op.or]: [{email: emailOrPhone}, {phone: emailOrPhone}]
        }
    });
    if(!client || !await client.isCorrectPassword(password)){
        return next(new APIError("Email hoặc mật khẩu không đúng, vui lòng kiểm tra lại", 401));
    }

    if(client.status !== CLIENT_STATUS.ACTIVE) {
        return next(new APIError("Tài khoản của bạn hiện không trong trạng thái hoạt động, vui lòng liên hệ quản trị viên", 403));
    }
    generateSendToken(res, client, 200);
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

export const updateProfile = asyncHandler(async (req, res, next) => {
    const clientId = req.user && req.user.id;
    if (!clientId) return next(new APIError("Authentication required", 401));

    const client = await Client.findByPk(clientId);
    if (!client) return next(new APIError("Client not found", 404));
    req.body.image = `Client-${client.id}.jpeg`;

    // Build allowed update set dynamically from req.body keys that match model attributes
    const modelAttrs = Object.keys(Client.rawAttributes || {});
    const forbidden = ["id", "passwordChangedAt"]; // fields we don't allow updating directly

    const bodyKeys = Object.keys(req.body || {});
    if (bodyKeys.length === 0) return next(new APIError("No fields to update", 400));

    const allowed = {};

    for (const key of bodyKeys) {
        if (forbidden.includes(key)) continue;
        if (!modelAttrs.includes(key)) continue; // skip unknown fields

        const value = req.body[key];

        // special handling for unique fields (phone, email)
        if (key === "phone" || key === "email") {
            if (value !== undefined && value !== client[key]) {
                const exists = await Client.findOne({ where: { [key]: value } });
                if (exists && String(exists.id) !== String(client.id)) {
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

        // default: allow field
        allowed[key] = value;
    }

    if (Object.keys(allowed).length === 0) return next(new APIError("No valid fields to update", 400));

    await client.update(allowed);

    res.status(200).json({ status: "success", data: { client } });
});