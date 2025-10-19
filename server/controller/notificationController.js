import Notification from "../model/notificationModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

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