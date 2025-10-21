import express from "express";
import {
  followStore,
  unfollowStore,
  getAllfollowedClientByStore,
  getAllFollowedStore
} from "../../controller/followController.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import Client from "../../model/clientModel.js";

const router = express.Router();

// Client follow a store
router.post("/:storeId", isAuth(Client), followStore);

// Client unfollow a store
router.delete("/:storeId", isAuth(Client), unfollowStore);

// Get all clients who followed store (public)
router.get("/:storeId/followers", getAllfollowedClientByStore);

// Get all stores followed by a client (protected)
router.get("/client/followed-stores", isAuth(Client), getAllFollowedStore);

export default router;
