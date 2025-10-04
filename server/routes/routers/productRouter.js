import express from "express";
import {
  createProduct,
  getAllProducts,
  uploadProductImages,
  resizeProductImages,
  getSingleProduct,
} from "../../controller/productController.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import {
  createProductValidator,
} from "../../validators/product.validator.js";

import { checkStoreStatus } from "../../validators/status.validator.js";

import Store from "../../model/storeModel.js";

const router = express.Router();

// NESTED_ROUTES_[GET reviews which belongs to specific product, CREATE a review on a specific product]

router
  .route("/")
  .get(getAllProducts)
  .post(
    isAuth(Store),
    checkStoreStatus,
    uploadProductImages,
    createProductValidator,
    resizeProductImages,
    createProduct
  );

router
  .route("/:id")
  .get(getSingleProduct);
  // .patch(
  //   isAuth,
  //   allowedTo(USER_ROLES.ADMIN),
  //   uploadProductImages,
  //   resizeProductImages,
  //   updateProductValidator,
  //   updateSingleProduct
  // )
  // .delete(
  //   isAuth,
  //   allowedTo(USER_ROLES.ADMIN),
  //   deleteProductValidator,
  //   deleteSingleProduct
  // );

export default router;
