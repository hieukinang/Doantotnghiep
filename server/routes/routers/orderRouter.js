import express from "express";
import {allowedTo, isAuth} from "../../middleware/auth.middleware.js";
import {CLIENT_STATUS} from "../../constants/index.js";
import {
  createCashOrder,
//   updateOrderToPaid,
//   updateOrderToDelivered,
//   getAllOrders,
//   getSingleOrder,
//   updateSingleOrder,
//   deleteSingleOrder,
//   filterUserOrders,
//   createCheckoutSession,
} from "../../controller/orderController.js";
import {
//   getOrderValidator,
//   deleteOrderValidator,
//   updateOrderStatusValidator,
//   createCashOrderValidator,
} from "../../validators/order.validator.js";
import Client from "../../model/clientModel.js";
import { checkClientStatus } from "../../validators/status.validator.js";

const router = express.Router();

// router.route("/checkout-session").post(createCheckoutSession);
router.route("/checkout-cash").post(
    isAuth(Client), 
    checkClientStatus,
    // createCashOrderValidator, 
    createCashOrder);

// router.route("/").get(filterUserOrders, getAllOrders);

// router.route("/:id").get(getOrderValidator, getSingleOrder);

// router.use(allowedTo(USER_ROLES.ADMIN));
// router
//   .route("/:id")
//   .patch(updateSingleOrder)
//   .delete(deleteOrderValidator, deleteSingleOrder);

// router
//   .route("/:orderId/is-paid")
//   .patch(updateOrderStatusValidator, updateOrderToPaid);
// router
//   .route("/:orderId/is-delivered")
//   .patch(updateOrderStatusValidator, updateOrderToDelivered);

export default router;
