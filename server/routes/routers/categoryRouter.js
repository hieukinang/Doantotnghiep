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
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../../validators/category.validator.js";
import Admin from "../../model/adminModel.js";
const router = express.Router();

router
  .route("/")
  .get(getAllCategories);
  
router.use(isAuth(Admin), checkAdminStatus, allowedTo(ADMIN_ROLES.MANAGER));

router
  .post(
    uploadCategoryImage,
    createCategoryValidator,
    resizeCategoryImage,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getSingleCategory)
  .patch(
    uploadCategoryImage,
    updateCategoryValidator,
    resizeCategoryImage,
    updateSingleCategory
  )
  .delete(
    deleteCategoryValidator,
    deleteSingleCategory
  );

export default router;
