import express from "express";
import {allowedTo, isAuth} from "../../middleware/auth.middleware.js";
import {ADMIN_ROLES} from "../../constants/index.js";
import {
  getAllBanners,
  deleteSingleBanner,
  createBanner,
  updateSingleBanner,
  getSingleBanner,
  uploadBannerImage,
  resizeBannerImage,
} from "../../controller/bannerController.js";
import Admin from "../../model/adminModel.js";

const router = express.Router();

router.route("/").get(getAllBanners);
router.use(isAuth(Admin), allowedTo(ADMIN_ROLES.MANAGER));
router.route("/create").post(uploadBannerImage, resizeBannerImage, createBanner);
// router
//   .route("/:id")
//   .get(getSingleBanner)
//   .patch(uploadBannerImage, resizeBannerImage, updateSingleBanner)
//   .delete(deleteSingleBanner);

export default router;
