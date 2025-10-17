import Product from "../model/productModel.js";
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import {uploadMixOfImages} from "../middleware/imgUpload.middleware.js";
import sharp from "sharp";

import ProductImage from "../model/productImageModel.js";
import ProductVariant from "../model/productVariantModel.js";
import Category from "../model/categoryModel.js";

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
    main_image: req.body.main_image,
    categoryId: req.body.categoryId,
    storeId: req.user.id
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
  const storeId  = req.user.id;

  if (!storeId) {
    return res.status(400).json({
      status: "fail",
      message: "Missing storeId in query params",
    });
  }

  const products = await Product.findAll({
    where: { storeId },
    include: [{ model: ProductImage, as: "ProductImages" }],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

export const getAllProducts = getAll(Product, {
  include: [{ model: ProductImage, as: "ProductImages" }, { model: ProductVariant, as: "ProductVariants" }],
  order: [["createdAt", "DESC"]],
});

// @desc    GET Single Product
// @route   GET /api/products/:id
// @access  Public
export const getSingleProduct = getOne(Product, {
  include: [
    { model: ProductImage, as: "ProductImages" },
    { model: ProductVariant, as: "ProductVariants"},
  ]
});

// @desc    UPDATE Single Product
// @route   PATCH /api/products/:id
// @access  Private("ADMIN")
export const updateSingleProduct = updateOne(Product);

// @desc    DELETE Single Product
// @route   DELETE /api/products/:id
// @access  Private("ADMIN")
export const deleteSingleProduct = deleteOne(Product, {
  include: [{ model: ProductImage, as: "ProductImages" },
            { model: ProductVariant, as: "ProductVariants" },
  ],
});
