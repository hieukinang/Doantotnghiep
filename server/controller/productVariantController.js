import Product from "../model/productModel.js";
import ProductVariant from "../model/productVariantModel.js";
import CartItem from "../model/cartItemModel.js";
import VariantOption from "../model/variantOptionModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";

export const createProductVariant = asyncHandler(async (req, res, next) => {

  const productId = req.params.id;
  const { price, stock_quantity, variant_options } = req.body;

  // Validate
  if (!productId || !variant_options || !Array.isArray(variant_options)) {
    return res.status(400).json({ message: "Missing productId or variant_options" });
  }

  // 1. Tạo ProductVariant
  const productVariant = await ProductVariant.create({
    productId,
    price,
    stock_quantity
  });

  // 3. Kiểm tra và cập nhật min_price nếu cần
  const product = await Product.findByPk(productId);
  if (product && (product.min_price === 0 || price < product.min_price)) {
    product.min_price = price;
    await product.save();
  }

  // 2. Tạo VariantOption cho từng biến thể
  for (const option of variant_options) {
    const { attributeIds, values } = option;
    if (
      !Array.isArray(attributeIds) ||
      !Array.isArray(values) ||
      attributeIds.length !== values.length
    ) {
      return res.status(400).json({ message: "attributeIds và values phải là mảng và có cùng độ dài" });
    }

    // Tạo từng VariantOption cho biến thể này
    for (let i = 0; i < attributeIds.length; i++) {
      await VariantOption.create({
        product_variantId: productVariant.id,
        attributeId: attributeIds[i],
        value: values[i]
      });
    }
  }

  // 3. Lấy lại ProductVariant kèm các VariantOption vừa tạo
  const variantWithOptions = await ProductVariant.findByPk(productVariant.id, {
    include: [{ model: VariantOption, as: "ProductVariantOptions" }],
  });

  res.status(201).json({
    status: "success",
    data: {
      productVariant: variantWithOptions,
    },
  });
});

export const getProductVariantOptions = asyncHandler(async (req, res, next) => {
  const { product_variant_id } = req.params;
  if (!product_variant_id) {
    return res.status(400).json({ message: "Missing product_variant_id" });
  }

  // Tìm ProductVariant theo product_variant_id
  const productVariant = await ProductVariant.findOne({ where: { id: product_variant_id } });
  if (!productVariant) {
    return res.status(404).json({ message: "ProductVariant not found" });
  }

  // Lấy các VariantOption theo product_variantId
  const variantOptions = await VariantOption.findAll({
    where: { product_variantId: productVariant.id },
      attributes: { exclude: ["__v"] },
      include: [{ model: Attribute, as: "VariantOptionAttribute" }],
  });

  // Map lại thành [{name: value}]
  const mappedOptions = variantOptions.map(opt => ({
    [opt.VariantOptionAttribute?.name]: opt.value
  }));

  res.status(200).json({
    status: "success",
    data: {
      variantOptions: mappedOptions,
    },
  });
});

// GET all variants for a product (public)
export const getVariantsByProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findByPk(productId);
  if (!product) return next(new APIError(`Product ${productId} not found`, 404));

  const variants = await ProductVariant.findAll({
    where: { productId },
    include: [{ model: VariantOption, as: "ProductVariantOptions" }],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: variants.length,
    data: { variants },
  });
});

// GET single variant (with options) - public
export const getVariantById = asyncHandler(async (req, res, next) => {
  const { variantId } = req.params;
  const variant = await ProductVariant.findByPk(variantId, {
    include: [{ model: VariantOption, as: "ProductVariantOptions" }],
  });
  if (!variant) return next(new APIError(`ProductVariant ${variantId} not found`, 404));

  res.status(200).json({
    status: "success",
    data: { variant },
  });
});

// Update product variant (Store auth) - ensure belongs to store
export const updateProductVariant = asyncHandler(async (req, res, next) => {
  const { variantId } = req.params;
  const store = req.user; // isAuth(Store) ensures this is a Store
  const variant = await ProductVariant.findByPk(variantId, { include: [{ model: Product, as: "ProductVariantProduct" }] });
  if (!variant) return next(new APIError(`ProductVariant ${variantId} not found`, 404));

  const product = variant.ProductVariantProduct;
  if (!product || product.storeId !== store.id) {
    return next(new APIError("You are not authorized to update this product variant", 403));
  }

  // allow updating price, stock_quantity (others as needed)
  const allowed = {};
  if (req.body.price !== undefined) allowed.price = req.body.price;
  if (req.body.stock_quantity !== undefined) allowed.stock_quantity = req.body.stock_quantity;

  await variant.update(allowed);
  const updated = await ProductVariant.findByPk(variantId, { include: [{ model: VariantOption, as: "ProductVariantOptions" }] });

  res.status(200).json({ status: "success", data: { variant: updated } });
});

export const deleteProductVariant = asyncHandler(async (req, res, next) => {
  const { variantId } = req.params;
  const store = req.user;
  const variant = await ProductVariant.findByPk(variantId, { include: [{ model: Product, as: "ProductVariantProduct" }] });
  if (!variant) return next(new APIError(`ProductVariant ${variantId} not found`, 404));

  const product = variant.ProductVariantProduct;
  if (!product || product.storeId !== store.id) {
    return next(new APIError("You are not authorized to delete this product variant", 403));
  }

  // Xóa tất cả CartItem liên quan trước
  await CartItem.destroy({ where: { product_variantId: variantId } });

  // Xóa các VariantOption liên quan
  await VariantOption.destroy({ where: { product_variantId: variantId } });

  // Xóa ProductVariant
  await variant.destroy();

  res.status(204).json({ status: "success" });
});

// Update variant option (Store auth) - ensure variant belongs to store
export const updateVariantOption = asyncHandler(async (req, res, next) => {
  const { variantId, optionId } = req.params;
  const store = req.user;

  const variant = await ProductVariant.findByPk(variantId, { include: [{ model: Product, as: "ProductVariantProduct" }] });
  if (!variant) return next(new APIError(`ProductVariant ${variantId} not found`, 404));
  if (!variant.ProductVariantProduct || variant.ProductVariantProduct.storeId !== store.id) {
    return next(new APIError("You are not authorized to modify this variant option", 403));
  }

  const option = await VariantOption.findByPk(optionId);
  if (!option || option.product_variantId !== variant.id) {
    return next(new APIError(`VariantOption ${optionId} not found for variant ${variantId}`, 404));
  }

  const allowed = {};
  if (req.body.value !== undefined) allowed.value = req.body.value;
  if (req.body.attributeId !== undefined) allowed.attributeId = req.body.attributeId;

  await option.update(allowed);

  res.status(200).json({ status: "success", data: { option } });
});
