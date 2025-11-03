import Address from "../model/addressModel.js";
import Client from "../model/clientModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import {
  getAll,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";

// @desc    Get All Addresses for Logged Client
// @route   GET /api/addresses
// @access  Protected (Client)
export const getAllAddresses = asyncHandler(async (req, res, next) => {
  req.filterObj = { clientId: req.user.id };
  getAll(Address)(req, res, next);
});

export const getMainAddress = asyncHandler(async (req, res, next) => {
  const mainAddress = await Address.findByPk(req.user.main_address);
  if (!mainAddress) {
    return next(new APIError("Main address not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doc: mainAddress,
    },
  });
});

// @desc    Create Address for Logged Client
// @route   POST /api/addresses
// @access  Protected (Client)
export const createAddress = asyncHandler(async (req, res, next) => {
  const clientId = req.user.id;

  // Kiểm tra số lượng address hiện tại của client
  const addressCount = await Address.count({ where: { clientId } });

  // Tạo address mới
  const address = await Address.create({ ...req.body, clientId });

  // Nếu đây là address đầu tiên, set làm main_address
  if (addressCount === 0) {
    await Client.update({ main_address: address.id }, { where: { id: clientId } });
  }

  res.status(201).json({
    status: "success",
    data: {
      doc: address,
    },
  });
});

// @desc    Update Address for Logged Client
// @route   PATCH /api/addresses/:id
// @access  Protected (Client)
export const updateAddress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findByPk(id);
  if (!address || address.clientId !== req.user.id) {
    return next(new APIError("Address not found or not owned by you", 404));
  }
  updateOne(Address)(req, res, next);
});

// @desc    Delete Address for Logged Client
// @route   DELETE /api/addresses/:id
// @access  Protected (Client)
export const deleteAddress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findByPk(id);
  if (!address || address.clientId !== req.user.id) {
    return next(new APIError("Address not found or not owned by you", 404));
  }

  // Kiểm tra đây có phải là main_address không
  if (address.id === req.user.main_address) {
    return next(new APIError("Cannot delete the main address", 400));
  }

  deleteOne(Address)(req, res, next);
});

// @desc    Update Main Address for Logged Client
// @route   PATCH /api/addresses/main/:addressId
// @access  Protected (Client)
export const updateMainAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;
  const address = await Address.findByPk(addressId);
  if (!address || address.clientId !== req.user.id) {
    return next(new APIError("Address not found or not owned by you", 404));
  }
  await Client.update(
    { main_address: addressId },
    { where: { id: req.user.id } }
  );
  res.status(200).json({
    status: "success",
    message: "Main address updated successfully",
  });
});

