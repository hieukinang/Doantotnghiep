import express from "express";
import {
  createProductVariant,
  getVariantsByProduct,
  getVariantById,
  updateProductVariant,
  deleteProductVariant,
  updateVariantOption,
} from "../../controller/productVariantController.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import Store from "../../model/storeModel.js";

import {
  ProductIdValidator,
  VariantIdValidator,
  VariantOptionIdValidator,
} from "../../validators/productVariant.validator.js";

const router = express.Router();

/**
 * Public
 */
// list variants for a product
router.route("/:productId/variants").get(ProductIdValidator, getVariantsByProduct);

// get single variant with options
router.route("/variant/:variantId").get(VariantIdValidator, getVariantById);

/**
 * Store protected - create variant for a product (existing)
 * Note: createProductVariant route kept (POST /:id) where :id is productId
 */
router
  .route("/:id")
  .post(isAuth(Store), createProductVariant);

/**
 * Store protected operations on variant
 */
router
  .route("/variant/:variantId")
  .patch(isAuth(Store), VariantIdValidator, updateProductVariant)
  .delete(isAuth(Store), VariantIdValidator, deleteProductVariant);

/**
 * Variant option operations (store)
 */
router
  .route("/variant/:variantId/options/:optionId")
  .patch(isAuth(Store), VariantIdValidator, VariantOptionIdValidator, updateVariantOption);

export default router;
