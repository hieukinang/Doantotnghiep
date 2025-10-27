import express from "express";
import {isAuth} from "../../middleware/auth.middleware.js";
import {
  createCashOrder,
  getAllOrdersByClient,
  getSingleOrder,
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
  OrderIdValidator,
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

router.route("/client").get(isAuth(Client), checkClientStatus, getAllOrdersByClient);

router.route("/client/:id").get(isAuth(Client), checkClientStatus, OrderIdValidator, getSingleOrder);

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
