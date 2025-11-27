import Follow from "../model/followModel.js";
import Store from "../model/storeModel.js";
import Client from "../model/clientModel.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import { sequelize } from "../config/db.js";

// @desc Client follow a store
// @route POST /api/stores/:storeId/follow
// @access Protected(Client)
export const followStore = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const storeId = req.params.storeId

  if (!storeId) return next(new APIError("storeId is required", 400));

  // check store exists
  const store = await Store.findByPk(storeId);
  if (!store) return next(new APIError(`No store match with id: ${storeId}`, 404));

  // check already following
  const existing = await Follow.findOne({ where: { storeId, clientId } });
  if (existing) return next(new APIError("You already follow this store", 400));

  // create follow and increment followers in transaction
  const t = await sequelize.transaction();
  try {
    await Follow.create({ storeId, clientId }, { transaction: t });
    await store.increment("followers", { by: 1, transaction: t });
    await t.commit();
  } catch (err) {
    await t.rollback();
    return next(err);
  }

  res.status(201).json({ status: "success", message: "Followed store successfully" });
});

// @desc Client unfollow a store
// @route DELETE /api/stores/:storeId/unfollow
// @access Protected(Client)
export const unfollowStore = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  const storeId = req.params.storeId;

  if (!clientId) return next(new APIError("Authentication required", 401));
  if (!storeId) return next(new APIError("storeId is required", 400));

  const follow = await Follow.findOne({ where: { storeId, clientId } });
  if (!follow) return next(new APIError("You do not follow this store", 404));

  const store = await Store.findByPk(storeId);
  if (!store) return next(new APIError(`No store match with id: ${storeId}`, 404));

  const t = await sequelize.transaction();
  try {
    await follow.destroy({ transaction: t });
    // decrement but ensure not negative
    const newFollowers = Math.max(0, (store.followers || 0) - 1);
    await store.update({ followers: newFollowers }, { transaction: t });
    await t.commit();
  } catch (err) {
    await t.rollback();
    return next(err);
  }

  res.status(200).json({ status: "success", message: "Unfollowed store successfully" });
});

// @desc Get all clients who followed a store (id, username, image)
// @route GET /api/stores/:storeId/followers
// @access Public
export const getAllfollowedClientByStore = asyncHandler(async (req, res, next) => {
  const storeId = req.params.storeId;
  if (!storeId) return next(new APIError("storeId is required", 400));

  const follows = await Follow.findAll({
    where: { storeId },
    include: [{ model: Client, as: "FollowClient", attributes: ["id", "username", "image"] }],
    order: [["createdAt", "DESC"]],
  });

  const clients = follows
    .map((f) => f.FollowClient)
    .filter(Boolean);

  res.status(200).json({ status: "success", results: clients.length, data: { clients } });
});

export const getAllFollowedStore = asyncHandler(async (req, res, next) => {
  const clientId = req.user && req.user.id;
  if (!clientId) return next(new APIError("Authentication required", 401));

  const follows = await Follow.findAll({
    where: { clientId },
    include: [{ model: Store, as: "FollowStore", attributes: ["id", "name", "image"] }],
    order: [["createdAt", "DESC"]],
  });

  const stores = follows
    .map((f) => f.FollowStore)
    .filter(Boolean);

  res.status(200).json({ status: "success", results: stores.length, data: { stores } });
});
