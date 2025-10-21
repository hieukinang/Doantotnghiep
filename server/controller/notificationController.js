import Notification from "../model/notificationModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { Op } from "sequelize";

export const adminCreateNotification = asyncHandler(async (req, res, next) => {
  // Lấy thông tin từ body
  const { title, body, receivers, type_of_receiver } = req.body;
  // Lấy thông tin admin gửi từ middleware xác thực
  const senderId = req.user.id;
  const type_of_sender = "ADMIN";
  // Tạo thông báo mới
  const notification = await Notification.create({
    title,
    body,
    receivers : JSON.stringify(receivers),
    type_of_receiver,
    senderId,
    type_of_sender,
  });

  res.status(201).json({
    status: "success",
    data: { notification },
  });
});

export const getUserNotifications = (type_of_receiver) =>
  asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    // Lấy tất cả notification có type_of_receiver và receivers chứa userId
    const notifications = await Notification.findAll({
      where: {
        type_of_receiver,
        receivers: { [Op.like]: `%${userId}%` }
      },
      order: [["createdAt", "DESC"]],
    });

    // Lọc lại cho chính xác (tránh trường hợp 1 trùng với 11)
    const filtered = notifications.filter(n => {
      try {
        const arr = JSON.parse(n.receivers);
        return Array.isArray(arr) && arr.includes(userId);
      } catch {
        return false;
      }
    });

    res.status(200).json({
      status: "success",
      results: filtered.length,
      data: { notifications: filtered },
    });
  });