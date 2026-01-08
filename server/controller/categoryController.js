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

  // Xử lý superCategoryId: nếu không truyền hoặc là chuỗi rỗng/null thì set null
  let { superCategoryId } = req.body;
  if (superCategoryId === undefined || superCategoryId === "" || superCategoryId === "null" || superCategoryId === null) {
    req.body.superCategoryId = null;
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
  const { name } = req.body;

  // Validate
  if (!name || typeof name !== "string" || name.trim().length < 3 || name.trim().length > 30) {
    return res.status(400).json({ message: "Vui lòng nhập tên danh mục từ 3 đến 30 ký tự" });
  }

  // Update only name
  const [affectedRows] = await Category.update(
    { name },
    {
      where: { id },
      individualHooks: true,
    }
  );

  if (!affectedRows) {
    return res.status(404).json({ message: "Không tìm thấy danh mục" });
  }

  // Lấy lại category mới
  const updatedCategory = await Category.findByPk(id, {
    include: [{ model: Attribute, as: "CategoryAttributes" }],
  });

  res.status(200).json({
    status: "success",
    data: {
      category: updatedCategory,
    },
  });
});
// @desc    DELETE Single Category
// @route   DELETE /api/categories/:id
// @access  Private("ADMIN")
export const deleteSingleCategory = deleteOne(Category, {
  include: [{ model: Attribute, as: "CategoryAttributes" }],
});
