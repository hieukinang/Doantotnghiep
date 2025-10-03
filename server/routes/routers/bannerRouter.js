import express from "express";
import {allowedTo, isAuth} from "../../middleware/auth.middleware.js";
import {ADMIN_ROLES} from "../../constants/index.js";
import {
  getAllBanners,
  deleteSingleBanner,
  createManyBanners,
  getSingleBanner,
  resizeBannerImages,
} from "../../controller/bannerController.js";
import {uploadManyImages} from "../../middleware/imgUpload.middleware.js";
import Admin from "../../model/adminModel.js";

const router = express.Router();

router.route("/").get(getAllBanners);
router.use(isAuth(Admin), allowedTo(ADMIN_ROLES.MANAGER));
router.route("/create").post(uploadManyImages("images"), resizeBannerImages, createManyBanners);
router
  .route("/:id")
  .get(getSingleBanner)
  .delete(deleteSingleBanner);

export default router;
