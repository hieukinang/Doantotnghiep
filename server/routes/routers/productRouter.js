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
  getAllProcessingProduct,
} from "../../controller/productController.js";

import { isAuth } from "../../middleware/auth.middleware.js";
import {
  createProductValidator,
  IdValidator,
} from "../../validators/product.validator.js";

import { checkAdminStatus, checkStoreStatus } from "../../validators/status.validator.js";

import Store from "../../model/storeModel.js";
import Admin from "../../model/adminModel.js";

const router = express.Router();

router.get("/processing", isAuth(Admin), checkAdminStatus, getAllProcessingProduct);

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

router.patch("/update-status/:id", isAuth(Admin), checkAdminStatus, IdValidator, updateSingleProduct); // Admin cập nhật trạng thái sản phẩm

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
