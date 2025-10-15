import Category from "../model/categoryModel.js";
import SuperCategory from "../model/superCategoryModel.js";
import {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import {uploadSingleImage} from "../middleware/imgUpload.middleware.js";
import sharp from "sharp";

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer)
export const uploadCategoryImage = uploadSingleImage("image");

// 2) PROCESSING(Sharp)
export const resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `supercategory-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(1250, 1600)
    .toFormat("jpeg")
    .jpeg({quality: 90})
    .toFile(`${process.env.FILES_UPLOADS_PATH}/supercategories/${filename}`);
  req.body.image = filename;
  next();
});

// @desc    CREATE A Supercategory
// @route   POST /api/supercategories
// @access  Private("ADMIN")
export const createSupercategory = createOne(SuperCategory);
// @desc    GET All Supercategories
// @route   GET /api/supercategories
// @access  Public
export const getAllSupercategories = getAll(SuperCategory);
// @desc    GET Single Supercategory
// @route   GET /api/supercategories/:id
// @access  Public
export const getSingleSupercategory = getOne(SuperCategory);
// @desc    UPDATE Single Supercategory
// @route   PATCH /api/supercategories/:id
// @access  Private("ADMIN")
export const updateSingleSupercategory = updateOne(SuperCategory);
// @desc    DELETE Single Supercategory
// @route   DELETE /api/supercategories/:id
// @access  Private("ADMIN")
export const deleteSingleSupercategory = deleteOne(SuperCategory);

// @desc    GET All Categories of a Supercategory
// @route   GET /api/supercategories/:id/categories
// @access  Public
export const getAllCategoriesOfSupercategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const supercategory = await SuperCategory.findByPk(id, {
    include: {
      model: Category,
      as: "SuperCategoryCategories",
    },
  });
  if (!supercategory) {
    return next(new ErrorResponse("Supercategory not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: supercategory.SuperCategoryCategories,
  });
});
