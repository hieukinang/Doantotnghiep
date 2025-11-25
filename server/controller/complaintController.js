import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import Complaint from "../model/complaintModel.js";
import ComplaintImage from "../model/complaintImageModel.js";
import { Op } from "sequelize";
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

// Get all complaints (admin only)
export const getAllComplaints = asyncHandler(async (req, res, next) => {

  const {status, type_user, page, type} = req.query;

  const where = {};

  // filter by status if provided
  if (status && String(status).trim().length > 0) {
    where.status = status;
  }

  if(type && String(type).trim().length > 0){
    where.type = type;
  }

  // filter by type_user: client | store | shipper | admin
  if (type_user && String(type_user).trim().length > 0) {
    const t = String(type_user).toLowerCase();
    switch (t) {
      case "client":
        where.clientId = { [Op.not]: null };
        break;
      case "store":
        where.storeId = { [Op.not]: null };
        break;
      case "shipper":
        where.shipperId = { [Op.not]: null };
        break;
      case "admin":
        where.adminId = { [Op.not]: null };
        break;
      default:
        // ignore unknown type_user and return all
        break;
    }
  }

  const perPage = 10;
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const offset = (pageNum - 1) * perPage;

  console.log(where);

  const { count, rows } = await Complaint.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: perPage,
    offset,
  });

  res.status(200).json({
    status: "success",
    results: count,
    page: pageNum,
    perPage,
    data: rows,
  });
});

export const getComplaintbyId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const complaint = await Complaint.findByPk(id, {
    include: [{ model: ComplaintImage, as: "ComplaintImages" }],
  });
  if (!complaint) return next(new APIError("Complaint not found", 404));

  res.status(200).json({
    status: "success",
    data: { complaint },
  });
});

// Reply to a complaint (admin only)
export const replyComplaint = asyncHandler(async (req, res, next) => {
  const { complaintId } = req.params;
  const { answer } = req.body;

  const complaint = await Complaint.findByPk(complaintId);
  if (!complaint) return next(new APIError("Complaint not found", 404));

  complaint.answer = answer || null;
  complaint.status = "resolved";
  complaint.resolved_at = new Date();
  await complaint.save();

  res.status(200).json({
    status: "success",
  });
});