import express from "express";
import {
  createProduct,
  uploadProductImages,
  resizeProductImages,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  getAllProductsByStore,
  getAllProducts,
} from "../../controller/productController.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import {
  createProductValidator,
  IdValidator,
} from "../../validators/product.validator.js";

import { checkStoreStatus } from "../../validators/status.validator.js";

import Store from "../../model/storeModel.js";

const router = express.Router();

router.route("/:id", IdValidator).get(getSingleProduct);

router.route("/").get(getAllProducts);

router.post("/", // Store tạo sản phẩm
    isAuth(Store),
    checkStoreStatus,
    uploadProductImages,
    createProductValidator,
    resizeProductImages,
    createProduct
  );

router.route("/").get(isAuth(Store), checkStoreStatus, getAllProductsByStore); // lay tat ca san phan theo store

router.route("/:id", IdValidator).get(getSingleProduct); // Lấy từng sản phẩm

router
  .route("/:id", isAuth(Store), checkStoreStatus, IdValidator) // Cập nhật, xóa sản phẩm
  .patch(
    uploadProductImages,
    createProductValidator,
    resizeProductImages,
    updateSingleProduct
  )
  .delete(
    deleteSingleProduct
  );
export default router;
