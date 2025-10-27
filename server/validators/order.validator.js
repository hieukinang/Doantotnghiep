import validatorMiddleware from "../middleware/validator.middleware.js";
import {check} from "express-validator";
import {isExistInDB} from "./custom.validators.js";
import Order from "../model/orderModel.js";

export const OrderIdValidator = [
  check("id")
    .isInt({ min: 1 })
    .withMessage("Invalid orderId format")
    .bail()
    .custom(async (val) => {
      await isExistInDB(val, Order);
    })
    .withMessage("Order not found"),
  validatorMiddleware,
];


// export const createCashOrderValidator = [
//   check("cartId")
//     .isMongoId()
//     .withMessage("Invalid id format")
//     .custom((val) => isExistInDB(val, Cart)),
//   validatorMiddleware,
// ];
