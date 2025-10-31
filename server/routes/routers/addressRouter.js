import express from "express";
import {
  getAllAddresses,
  getMainAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  updateMainAddress,
} from "../../controller/addressController.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import Client from "../../model/clientModel.js";
import { createAddressValidator, updateAddressValidator } from "../../validators/address.validator.js";
import { checkClientStatus } from "../../validators/status.validator.js";

const router = express.Router();

// All routes require Client authentication
router.use(isAuth(Client), checkClientStatus);

router
  .route("/")
  .get(getAllAddresses)
  .post(createAddressValidator, createAddress);

router
  .route("/:id")
  .patch(updateAddressValidator, updateAddress)
  .delete(deleteAddress);

router
  .route("/main")
  .get(getMainAddress);

router.patch("/main/:addressId", updateMainAddress);

export default router;