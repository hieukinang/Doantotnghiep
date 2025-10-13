import express from "express";
import {isAuth} from "../../middleware/auth.middleware.js";
import {
  getMyCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  applyCoupon,
} from "../../controller/cartController.js";
import {
  addToCartValidator,
  removeFromCartValidator,
  updateCartItemQuantityValidator,
  applyCouponValidator,
} from "../../validators/cart.validator.js";
import Client from "../../model/clientModel.js";

const router = express.Router();

router.use(isAuth(Client));

router
  .route("/")
  .get(getMyCart)
  .post(addToCartValidator, addToCart)
  .delete(clearCart);

router.route("/apply-coupon").patch(applyCouponValidator, applyCoupon);

router
  .route("/:product_variantId")
  .patch(updateCartItemQuantityValidator, updateCartItemQuantity)
  .delete(removeFromCartValidator, removeFromCart);

export default router;
