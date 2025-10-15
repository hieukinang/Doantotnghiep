import express from "express";
import {allowedTo, isAuth} from "../../middleware/auth.middleware.js";
import {ADMIN_ROLES} from "../../constants/index.js";
import {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateSingleCategory,
  deleteSingleCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} from "../../controller/categoryController.js";
import {checkAdminStatus} from "../../validators/status.validator.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../../validators/category.validator.js";
import Admin from "../../model/adminModel.js";
const router = express.Router();

router
  .route("/")
  .get(getAllCategories);
  
// Tạo category mới
router
  .post("/", isAuth(Admin), checkAdminStatus, allowedTo(ADMIN_ROLES.MANAGER),
    uploadCategoryImage,
    createCategoryValidator,
    resizeCategoryImage,
    createCategory
  );
// Các thao tác với category cụ thể
router
  .route("/:id")
  .get(getSingleCategory)
  .patch(isAuth(Admin), checkAdminStatus, allowedTo(ADMIN_ROLES.MANAGER),
    uploadCategoryImage,
    updateCategoryValidator,
    resizeCategoryImage,
    updateSingleCategory
  )
  .delete(isAuth(Admin), checkAdminStatus, allowedTo(ADMIN_ROLES.MANAGER), // Xóa category
    deleteCategoryValidator,
    deleteSingleCategory
  );

export default router;
