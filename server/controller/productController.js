import Product from "../model/productModel.js";
import {
  getOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import {uploadMixOfImages} from "../middleware/imgUpload.middleware.js";
import sharp from "sharp";
import Fuse from "fuse.js";

import { Op } from "sequelize";

import ProductImage from "../model/productImageModel.js";
import ProductVariant from "../model/productVariantModel.js";
import VariantOption from "../model/variantOptionModel.js";
import Attribute from "../model/attributeModel.js";
import APIError from "../utils/apiError.utils.js";
import OrderItem from "../model/orderItemModel.js";

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer)
export const uploadProductImages = uploadMixOfImages([
  {name: "main_image", maxCount: 1},
  {name: "slide_images", maxCount: 20},
]);

// 2) PROCESSING(Sharp)
export const resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();
  // a) main_image field
  if (req.files.main_image) {
    const mainImageFilename = `product-${req.user.id}-${Date.now()}-main.jpeg`;
    // console.log(req.files);
    await sharp(req.files.main_image[0].buffer)
      .resize(800, 800)
      .toFormat("jpeg")
      .jpeg({quality: 90})
      .toFile(
        `${process.env.FILES_UPLOADS_PATH}/products/${mainImageFilename}`
      );
    // put it in req.body to access it when we access createProduct, updateSingleProduct to save the filename into database
    req.body.main_image = mainImageFilename;
  }

  // b) slide_images field
  if (req.files.slide_images) {
    req.body.slide_images = [];
    await Promise.all(
      req.files.slide_images.map(async (img, idx) => {
        const sliderImageName = `product-${req.user.id}-${Date.now()}-slide-${
          idx + 1
        }.jpeg`;

        await sharp(img.buffer)
          .resize(800, 800)
          .toFormat("jpeg")
          .jpeg({quality: 90})
          .toFile(
            `${process.env.FILES_UPLOADS_PATH}/productSliceImages/${sliderImageName}`
          );

        // put it in req.body to access it when we access createProduct, updateSingleProduct to save the filename into database
        req.body.slide_images.push(sliderImageName);
      })
    );
  }

  next();
});

// @desc    CREATE A Product
// @route   POST /api/products
// @access  Private("ADMIN")
export const createProduct = asyncHandler(async (req, res, next) => {
  // 1. Tạo product
  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    origin: req.body.origin,
    main_image: req.body.main_image,
    categoryId: req.body.categoryId,
    storeId: req.user.id,
    discount: req.body.discount || 0,
  });

  // 2. Nếu có slide_images (tên file đã được resizeProductImages gán vào req.body.slide_images)
  if (Array.isArray(req.body.slide_images) && req.body.slide_images.length > 0) {
    const productImages = req.body.slide_images.map((img) => ({
      image_url: img,
      productId: product.id,
    }));
    await ProductImage.bulkCreate(productImages);
  }

  // 3. Lấy lại product kèm các ProductImages vừa tạo
  const productWithImages = await Product.findByPk(product.id, {
    include: [{ model: ProductImage, as: "ProductImages" }],
  });

  res.status(201).json({
    status: "success",
    data: {
      product: productWithImages,
    },
  });
});

// @desc    GET All Products
// @route   GET /api/products
// @access  Public
export const getAllProductsByStore = asyncHandler(async (req, res, next) => {
  const storeId = req.user.id;
  if (!storeId) {
    return res.status(400).json({
      status: "fail",
      message: "Missing storeId in query params",
    });
  }

  // Lấy các query filter
  const { name, status, sortBy } = req.query;
  const where = { storeId };
  if (name && name.trim()) {
    // Tìm gần đúng tên (không phân biệt hoa thường)
    where.name = { [Op.like]: `%${name.trim()}%` }; // Sử dụng Op.iLike
  }
  if (status && status.trim()) {
    where.status = status;
  }

  // Sắp xếp
  let order = [["createdAt", "DESC"]];
  if (sortBy && sortBy.trim()) {
    // sortBy: field_ASC, field_DESC
    const [field, direction] = sortBy.split("_");
    if (field && direction && ["ASC", "DESC"].includes(direction.toUpperCase())) {
      order = [[field, direction.toUpperCase()]];
    }
  }

  const products = await Product.findAll({
    where,
    include: [{ model: ProductImage, as: "ProductImages" }],
    order,
  });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

export const getAllProductsForAdmin = asyncHandler(async (req, res, next) => {
  // Lấy các query filter
  const { name, status, sortBy } = req.query;
  const where = {};
  if (name && name.trim()) {
    // Tìm gần đúng tên (không phân biệt hoa thường)
    where.name = { [Op.like]: `%${name.trim()}%` };
  }
  if (status && status.trim()) {
    where.status = status;
  }

  // Sắp xếp
  let order = [["createdAt", "DESC"]];
  if (sortBy && sortBy.trim()) {
    // sortBy: field_ASC, field_DESC
    const [field, direction] = sortBy.split("_");
    if (field && direction && ["ASC", "DESC"].includes(direction.toUpperCase())) {
      order = [[field, direction.toUpperCase()]];
    }
  }

  const products = await Product.findAll({
    where,
    include: [
      { model: ProductImage, as: "ProductImages" },
      { model: ProductVariant, as: "ProductVariants" }
    ],
    order,
  });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

export const getAllProductsForClient = asyncHandler(async (req, res, next) => {
  const nameString = req.query.nameString || "";
  const category = req.query.category; // category id or 'null'

  // Phân trang
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10; // mặc định 10 sản phẩm/trang
  const offset = (page - 1) * limit;

  // Lấy toàn bộ sản phẩm ACTIVE hoặc theo category nếu truyền category
  const where = { status: "ACTIVE" };
  if (typeof category !== "undefined" && category !== null && String(category).toLowerCase() !== "null" && String(category).trim() !== "") {
    where.categoryId = category;
  }

  const products = await Product.findAll({
    where,
    include: [
      { model: ProductImage, as: "ProductImages" },
      { model: ProductVariant, as: "ProductVariants" }
    ],
    order: [["createdAt", "DESC"]],
  });

  // Nếu không truyền nameString, trả về toàn bộ (có phân trang)
  if (!nameString.trim()) {
    const paginated = products.slice(offset, offset + limit);
    return res.status(200).json({
      status: "success",
      results: paginated.length,
      page,
      total: products.length,
      data: { products: paginated },
    });
  }

  // Fuse.js search
  const fuse = new Fuse(products, {
    keys: ["name"],
    threshold: 0.3,
  });

  const result = fuse.search(nameString);
  const filteredProducts = result.map(r => r.item);
  const paginated = filteredProducts.slice(offset, offset + limit);

  res.status(200).json({
    status: "success",
    results: paginated.length,
    page,
    total: filteredProducts.length,
    data: { products: paginated },
  });
});

// @desc    GET Single Product
// @route   GET /api/products/:id
// @access  Public
export const getSingleProduct = getOne(Product, {
  include: [
    { model: ProductImage, as: "ProductImages" },
    { 
      model: ProductVariant, 
      as: "ProductVariants",
      include: [
        { 
          model: VariantOption, 
          as: "ProductVariantOptions",
          include: [
            { model: Attribute, as: "VariantOptionAttribute", attributes: ["name"] }
          ]
        }
      ]
    }
  ]
});

// @desc    UPDATE Single Product
// @route   PATCH /api/products/:id
// @access  Private("ADMIN", "STORE")
export const updateSingleProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  // 1. Tìm product
  const product = await Product.findByPk(productId);
  if (!product) {
    return next(new APIError("Không tìm thấy sản phẩm", 404));
  }

  // 2. Nếu là Store user -> kiểm tra quyền sở hữu
  const userId = String(req.user?.id || "");
  const isStoreUser = userId.startsWith("STORE");
  if (isStoreUser && String(product.storeId) !== userId) {
    return next(new APIError("Sản phẩm không thuộc cửa hàng của bạn", 403));
  }

  // 3. Chuẩn bị object update chỉ với các field được gửi và khác null
  const updatableFields = [
    "name",
    "description",
    "origin",
    "discount",
    "min_price",
    "categoryId",
    "status"
  ];

  const updateObj = {};
  updatableFields.forEach((f) => {
    if (
      typeof req.body[f] !== "undefined" &&
      req.body[f] !== null
    ) {
      updateObj[f] = req.body[f];
    }
  });

  // 4. Nếu có main_image thì cập nhật main_image
  if (
    typeof req.body.main_image !== "undefined" &&
    req.body.main_image !== null
  ) {
    updateObj.main_image = req.body.main_image;
  }

  // 5. Nếu có slide_images thì xóa toàn bộ ProductImage cũ và thêm mới
  if (Array.isArray(req.body.slide_images) && req.body.slide_images.length > 0) {
    // Xóa ảnh cũ
    await ProductImage.destroy({ where: { productId: product.id } });
    // Thêm ảnh mới
    const productImages = req.body.slide_images.map((img) => ({
      image_url: img,
      productId: product.id,
    }));
    await ProductImage.bulkCreate(productImages);
  }

  // 6. Cập nhật product (chạy hooks/validators)
  if (Object.keys(updateObj).length > 0) {
    await product.update(updateObj, { individualHooks: true });
  }

  // 7. Lấy lại product kèm quan hệ để trả về
  const updated = await Product.findByPk(productId, {
    include: [
      { model: ProductImage, as: "ProductImages" },
      { model: ProductVariant, as: "ProductVariants" },
    ],
  });

  res.status(200).json({
    status: "success",
    data: { product: updated },
  });
});

// @desc    DELETE Single Product
// @route   DELETE /api/products/:id
// @access  Private("ADMIN")
export const deleteSingleProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  // Kiểm tra xem có ProductVariant nào của sản phẩm này tồn tại trong OrderItem không
  const productVariants = await ProductVariant.findAll({ where: { productId } });
  const variantIds = productVariants.map(v => v.id);
  if (variantIds.length > 0) {
    const orderItem = await OrderItem.findOne({ where: { product_variantId: variantIds } });
    if (orderItem) {
      return next(new APIError("Không thể xóa sản phẩm vì đã tồn tại trong đơn hàng.", 400));
    }
  }

  // Xóa sản phẩm và các liên kết (ảnh, variant)
  await deleteOne(Product, {
    include: [
      { model: ProductImage, as: "ProductImages" },
      { model: ProductVariant, as: "ProductVariants" },
    ],
  })(req, res, (err) => {
    if (err) return next(err);
  })
  return res.status(200).json({message: "success" });
});
