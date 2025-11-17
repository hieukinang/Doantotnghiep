import express from "express";
import {isAuth} from "../../middleware/auth.middleware.js";
import {
  createCashOrder,
  getAllOrdersByClient,
  getSingleOrder,
  getAllOrdersByStore,
  confirmOrderByStore,
  shipperFindOrderById,
  shipperReceiveOrder,
  cancelOrderByClient,
  shipperDeliverOrder,
  clientConfirmedOrderIsDeliveried,
  getAllOrdersByShipper,
  createWalletOrder,
} from "../../controller/orderController.js";

import {
  returnOrderByClient,
  uploadReturnImages,
  resizeReturnImages,
  getReturnRequest,
  confirmReturnOrder,
} from "../../controller/returnController.js";

import {
  OrderIdValidator,
} from "../../validators/order.validator.js";
import Client from "../../model/clientModel.js";
import { 
  checkClientStatus, 
  checkShipperStatus, 
  checkStoreStatus,
} from "../../validators/status.validator.js";
import Store from "../../model/storeModel.js";
import Shipper from "../../model/shipperModel.js";

const router = express.Router();

router.route("/checkout-cash").post(
    isAuth(Client), 
    checkClientStatus,
    createCashOrder);

router.route("/checkout-wallet").post(
    isAuth(Client), 
    checkClientStatus,
    createWalletOrder);

router.route("/client").get(isAuth(Client), checkClientStatus, getAllOrdersByClient);

router.route("/client/:id").get(isAuth(Client), checkClientStatus, OrderIdValidator, getSingleOrder);

router.route("/client/:id/cancel-order").post(isAuth(Client), checkClientStatus, OrderIdValidator, cancelOrderByClient);

router.route("/client/:id/confirmed-order-is-deliveried").post(isAuth(Client), checkClientStatus, OrderIdValidator, clientConfirmedOrderIsDeliveried);

router.route("/client/:id/return-order")
  .post(
    isAuth(Client), 
    checkClientStatus, 
    OrderIdValidator,
    uploadReturnImages,
    resizeReturnImages,
    returnOrderByClient
);

router.route("/store").get(isAuth(Store), checkStoreStatus, getAllOrdersByStore);

router.route("/store/:id").post(isAuth(Store), checkStoreStatus, OrderIdValidator, confirmOrderByStore);

router.route("/store/:id/get-return").get(isAuth(Store), checkStoreStatus, OrderIdValidator, getReturnRequest);

router.route("/store/:id/confirm-return-order").post(isAuth(Store), checkStoreStatus, OrderIdValidator, confirmReturnOrder);

router.route("/shipper").get(isAuth(Shipper), checkShipperStatus, getAllOrdersByShipper);

router.route("/shipper/:id").get(isAuth(Shipper), checkShipperStatus, shipperFindOrderById);

router.route("/shipper/:id").post(isAuth(Shipper), checkShipperStatus, OrderIdValidator, shipperReceiveOrder);

router.route("/shipper/:id/deliver-order").post(isAuth(Shipper), checkShipperStatus, OrderIdValidator, shipperDeliverOrder);

export default router;
