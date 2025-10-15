import express from "express";
import {
  createSupercategory,
  getAllSupercategories,
  getSingleSupercategory,
  updateSingleSupercategory,
  deleteSingleSupercategory,
  getAllCategoriesOfSupercategory,
  uploadCategoryImage,
  resizeCategoryImage,
} from "../../controller/superCategoryController.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { checkAdminStatus } from "../../validators/status.validator.js";
import Admin from "../../model/adminModel.js";

const router = express.Router();

// CRUD cho supercategory
router
  .route("/")
  .get(getAllSupercategories)
  .post(
    isAuth(Admin),
    checkAdminStatus,
    uploadCategoryImage,
    resizeCategoryImage,
    createSupercategory
  );

router
  .route("/:id")
  .get(getSingleSupercategory)
  .patch(
    isAuth(Admin),
    checkAdminStatus,
    uploadCategoryImage,
    resizeCategoryImage,
    updateSingleSupercategory
  )
  .delete(isAuth(Admin), checkAdminStatus, deleteSingleSupercategory);

// Lấy tất cả category con của một supercategory
router
  .route("/:id/categories")
  .get(getAllCategoriesOfSupercategory);

export default router;