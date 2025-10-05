import express from "express";
import {
  createProduct,
  getAllProducts,
  uploadProductImages,
  resizeProductImages,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct
} from "../../controller/productController.js";

import {createProductVariant,
  getProductVariantOptions
} from "../../controller/productVariantController.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import {
  createProductValidator,
  IdValidator,
} from "../../validators/product.validator.js";

import { checkStoreStatus } from "../../validators/status.validator.js";

import Store from "../../model/storeModel.js";

const router = express.Router();

// NESTED_ROUTES_[GET reviews which belongs to specific product, CREATE a review on a specific product]

router.use(isAuth(Store), checkStoreStatus);

router
  .route("/")
  .get(getAllProducts)
  .post(
    uploadProductImages,
    createProductValidator,
    resizeProductImages,
    createProduct
  );

router
  .route("/:id")
  .post(
    IdValidator,
    createProductVariant
  );


router
  .route("/:id/sku_code/:sku_code", IdValidator)
  .get(
    getProductVariantOptions
  );

router
  .route("/:id", IdValidator)
  .get(getSingleProduct)
  .patch(
    uploadProductImages,
    createProductValidator,
    resizeProductImages,
    updateSingleProduct
  )
  .delete(
    IdValidator,
    deleteSingleProduct
  );
export default router;
