import Category from "../model/categoryModel.js";
import Attribute from "../model/attributeModel.js";
import {
  getAll,
  getOne,
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

  const filename = `category-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(1250, 1600)
    .toFormat("jpeg")
    .jpeg({quality: 90})
    .toFile(`${process.env.FILES_UPLOADS_PATH}/categories/${filename}`);
  req.body.image = filename;
  next();
});

// @desc    CREATE A Category
// @route   POST /api/categories
// @access  Private("ADMIN")
export const createCategory = asyncHandler(async (req, res, next) => {
  // Parse array fields (nếu là string dạng JSON)
  let { name_attributes } = req.body;

  // Nếu là string, parse sang array
  if (typeof name_attributes === "string") {
    try {
      name_attributes = JSON.parse(name_attributes);
    } catch {
      return res.status(400).json({ message: "name_attributes must be an array or JSON string" });
    }
  }

  // Validate
  if (!Array.isArray(name_attributes) || name_attributes.length === 0) {
    return res.status(400).json({ message: "name_attributes must be a non-empty array" });
  }

  // Tạo category trước
  const category = await Category.create(req.body);

  // Tạo attributes
  const attributes = [];
  for (let i = 0; i < name_attributes.length; i++) {
    attributes.push({
      name: name_attributes[i],
      categoryId: category.id,
    });
  }
  await Attribute.bulkCreate(attributes);

  // Lấy lại category kèm attributes vừa tạo
  const categoryWithAttributes = await Category.findByPk(category.id, {
    include: [{ model: Attribute, as: "CategoryAttributes" }],
  });

  res.status(201).json({
    status: "success",
    data: {
      category: categoryWithAttributes,
    },
  });
});
// @desc    GET All Categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = getAll(Category, {
  include: [{ model: Attribute, as: "CategoryAttributes" }],
});
// @desc    GET Single category
// @route   GET /api/categories/:id
// @access  Public
export const getSingleCategory = getOne(Category, {
  include: [{ model: Attribute, as: "CategoryAttributes" }],
});
// @desc    UPDATE Single Category
// @route   PATCH /api/categories/:id
// @access  Private("ADMIN")
export const updateSingleCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let { name_attributes } = req.body;

  // Nếu là string, parse sang array
  if (typeof name_attributes === "string") {
    try {
      name_attributes = JSON.parse(name_attributes);
    } catch {
      return res.status(400).json({ message: "name_attributes must be an array or JSON string" });
    }
  }

  // Validate
  if (!Array.isArray(name_attributes) || name_attributes.length === 0) {
    return res.status(400).json({ message: "name_attributes must be a non-empty array" });
  }

  // Update category
  const [affectedRows] = await Category.update(req.body, {
    where: { id },
    individualHooks: true,
  });

  if (!affectedRows) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Xóa hết attribute cũ
  await Attribute.destroy({ where: { categoryId: id } });

  // Tạo lại attributes mới
  const attributes = [];
  for (let i = 0; i < name_attributes.length; i++) {
    attributes.push({
      name: name_attributes[i],
      categoryId: id,
    });
  }
  await Attribute.bulkCreate(attributes);

  // Lấy lại category kèm attributes mới
  const categoryWithAttributes = await Category.findByPk(id, {
    include: [{ model: Attribute, as: "CategoryAttributes" }],
  });

  res.status(200).json({
    status: "success",
    data: {
      category: categoryWithAttributes,
    },
  });
});
// @desc    DELETE Single Category
// @route   DELETE /api/categories/:id
// @access  Private("ADMIN")
export const deleteSingleCategory = deleteOne(Category, {
  include: [{ model: Attribute, as: "CategoryAttributes" }],
});
