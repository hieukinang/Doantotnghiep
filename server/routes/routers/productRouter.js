import express from "express";
import {
  createProduct,
  uploadProductImages,
  resizeProductImages,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  getAllProductsByStore,
  getAllProductsForAdmin,
  getAllProductsForClient,
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

// Client
router.route("/").get(getAllProductsForClient);
router.route("/:id", IdValidator).get(getSingleProduct); // Lấy từng sản phẩm

// Admin
router.get("/admin", isAuth(Admin), checkAdminStatus, getAllProductsForAdmin);

router.patch("/admin/update-status/:id", 
  isAuth(Admin), 
  checkAdminStatus, 
  IdValidator, 
  updateSingleProduct); // Admin cập nhật trạng thái sản phẩm

// Store
router.post("/store", 
  isAuth(Store), 
  checkStoreStatus, 
  uploadProductImages, 
  createProductValidator, 
  resizeProductImages, 
  createProduct);

router.route("/store").get(
  isAuth(Store), 
  checkStoreStatus, 
  getAllProductsByStore); // lay tat ca san phan theo store

router
  .route("/store/:id", isAuth(Store), checkStoreStatus, IdValidator) // Cập nhật, xóa sản phẩm
  .patch(
    uploadProductImages,
    createProductValidator,
    resizeProductImages,
    updateSingleProduct)
  .delete(
    deleteSingleProduct);

// Update none image fields of product
router.patch(
  "/store/update-info/:id",
  isAuth(Store),
  checkStoreStatus,
  IdValidator,
  updateSingleProduct);  

export default router;
