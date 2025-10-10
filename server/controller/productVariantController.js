import ProductVariant from "../model/productVariantModel.js";
import VariantOption from "../model/variantOptionModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

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
