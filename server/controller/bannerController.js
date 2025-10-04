import Banner from "../model/bannerModel.js";
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

import path from "path";
import fs from "fs";
import sharp from "sharp";


// 2) PROCESSING(Sharp)
export const resizeBannerImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  const bannersDir = path.join(process.env.FILES_UPLOADS_PATH, "banners");
  if (!fs.existsSync(bannersDir)) {
    fs.mkdirSync(bannersDir, { recursive: true });
  }

  req.body.images = [];
  for (let i = 0; i < req.files.length; i++) {
    const filename = `banner-${req.user ? req.user.id + "-" : ""}${Date.now()}-${i}.jpeg`;
    await sharp(req.files[i].buffer)
      .resize(1920, 784)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`${bannersDir}/${filename}`);
    req.body.images.push(filename);
  }
  next();
});

// @desc    CREATE A Banner
// @route   POST /api/banners
// @access  Private("ADMIN")
export const createManyBanners = asyncHandler(async (req, res, next) => {
  let { images, types } = req.body;

  // Ép images về mảng nếu chỉ có 1 ảnh
  if (!Array.isArray(images)) images = [images];

  // Parse types nếu là JSON string
  let typesArr = types;

  console.log("images:", images);
  console.log("types:", typesArr);
  
  if (typeof types === "string") {
    try {
      typesArr = JSON.parse(types);
    } catch {
      return res.status(400).json({ message: "Invalid types format" });
    }
  }
  if (!Array.isArray(typesArr)) typesArr = [typesArr];

  // Đảm bảo số lượng khớp
  if (images.length !== typesArr.length) {
    return res.status(400).json({ message: "Số lượng ảnh và types không khớp" });
  }

  // Tạo nhiều banner
  const banners = [];
  for (let i = 0; i < images.length; i++) {
    const banner = await Banner.create({
      image: images[i],
      type: typesArr[i],
      adminId: req.user.id,
    });
    banners.push(banner);
  }

  res.status(201).json({
    status: "success",
    results: banners.length,
    data: banners,
  });
});
// @desc    GET All Banners
// @route   GET /api/banners
// @access  Public
export const getAllBanners = getAll(Banner);
// @desc    GET Single Banner
// @route   GET /api/banners/:id
// @access  Private("ADMIN")
export const getSingleBanner = getOne(Banner);
// @desc    UPDATE Single Banner
// @route   PATCH /api/banners/:id
// @access  Private("ADMIN")
export const updateSingleBanner = updateOne(Banner);
// @desc    DELETE Single Banner
// @route   DELETE /api/banners/:id
// @access  Private("ADMIN")
export const deleteSingleBanner = deleteOne(Banner);
