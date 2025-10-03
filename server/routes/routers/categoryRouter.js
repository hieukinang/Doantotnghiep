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
  .get(getAllCategories)
  .post(
    isAuth(Admin),
    allowedTo(ADMIN_ROLES.MANAGER),
    uploadCategoryImage,
    createCategoryValidator,
    resizeCategoryImage,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getSingleCategory)
  .patch(
    isAuth(Admin),
    allowedTo(ADMIN_ROLES.MANAGER),
    uploadCategoryImage,
    updateCategoryValidator,
    resizeCategoryImage,
    updateSingleCategory
  )
  .delete(
    isAuth(Admin),
    allowedTo(ADMIN_ROLES.MANAGER),
    deleteCategoryValidator,
    deleteSingleCategory
  );

export default router;
