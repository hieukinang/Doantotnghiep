import ProductVariant from "../model/productVariantModel.js";
import VariantOption from "../model/variantOptionModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const createProductVariant = asyncHandler(async (req, res, next) => {

  const productId = req.params.id;
  const { sku_code, price, variant_options } = req.body;

  // Validate
  if (!productId || !variant_options || !Array.isArray(variant_options)) {
    return res.status(400).json({ message: "Missing productId or variant_options" });
  }

  // 1. Tạo ProductVariant
  const productVariant = await ProductVariant.create({
    productId,
    sku_code,
    price,
  });

  // 2. Tạo VariantOption cho từng biến thể
  for (const option of variant_options) {
    const { attributeIds, values, stock_quantity } = option;
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
        value: values[i],
        stock_quantity: stock_quantity,
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
  const { sku_code } = req.params;
  console.log(req.params);
  if (!sku_code) {
    return res.status(400).json({ message: "Missing sku_code" });
  }

  // Tìm ProductVariant theo sku_code
  const productVariant = await ProductVariant.findOne({ where: { sku_code } });
  if (!productVariant) {
    return res.status(404).json({ message: "ProductVariant not found" });
  }

  // Lấy các VariantOption theo product_variantId
  const variantOptions = await VariantOption.findAll({
    where: { product_variantId: productVariant.id },
  });

  res.status(200).json({
    status: "success",
    data: {
      variantOptions,
    },
  });
});
