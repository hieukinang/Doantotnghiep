import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import Complaint from "../model/complaintModel.js";
import ComplaintImage from "../model/complaintImageModel.js";
import { uploadManyImages } from "../middleware/imgUpload.middleware.js";
import Sharp from "sharp";

// helper to save uploaded images (stores raw buffer files)
export const uploadComplaintImages = uploadManyImages("images", 5);

export const resizeComplaintImages = asyncHandler(async (req, res, next) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (img, idx) => {
      const complaintImageName = `complaint-${req.user.id}-image-${idx + 1}.jpeg`;

      await Sharp(img.buffer)
        .resize(800, 800)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(
          `${process.env.FILES_UPLOADS_PATH}/complaintImages/${complaintImageName}`
        );
      req.body.images.push(complaintImageName);
    })
  );
  next();
});

export const createComplaint = asyncHandler(async (req, res, next) => {
  // Identify user and set correct foreign key
  const userId = req.user && req.user.id;
  if (!userId) return next(new APIError("Authentication required", 401));

  const { type, details } = req.body;
  // req.model is a Model class (Client, Store, Shipper, Admin)
  let clientId = null, storeId = null, shipperId = null, adminId = null;
  if (req.model && req.model.name) {
    switch (req.model.name) {
      case "Client":
        clientId = userId;
        break;
      case "Store":
        storeId = userId;
        break;
      case "Shipper":
        shipperId = userId;
        break;
      case "Admin":
        adminId = userId;
        break;
      default:
        return next(new APIError("Invalid user role", 401));
    }
  } else {
    return next(new APIError("Invalid user model", 401));
  }

  const complaint = await Complaint.create({
    type: type || null,
    details: details || null,
    status: "pending",
    clientId,
    storeId,
    shipperId,
    adminId,
  });

  // Save uploaded images (if any) from req.body.images (set by resizeComplaintImages)
  const savedImages = [];
  if (Array.isArray(req.body.images) && req.body.images.length > 0) {
    await Promise.all(
      req.body.images.map(async (filename) => {
        const img = await ComplaintImage.create({ path: filename, complaintId: complaint.id });
        savedImages.push(img);
      })
    );
  }

  const result = complaint.toJSON();
  result.images = savedImages;

  res.status(201).json({ status: "success", data: { complaint: result } });
});