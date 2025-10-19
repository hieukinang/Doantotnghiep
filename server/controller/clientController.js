import Client from "../model/clientModel.js";
import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import {generateSendToken} from "../utils/tokenHandler.utils.js";

import { CLIENT_STATUS } from "../constants/index.js";

import { Op } from "sequelize";

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