import Order from "../model/orderModel.js";
import OrderItem from "../model/orderItemModel.js";
// import Cart from "../model/cartModel.js";
import Product from "../model/productModel.js";
import ProductVariant from "../model/productVariantModel.js";
import Coupon from "../model/couponModel.js";
import Store from "../model/storeModel.js";
import Client from "../model/clientModel.js";
import { sequelize } from "../config/db.js";
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import {PAYMENT_METHODS} from "../constants/index.js";
// import {calcCartTotalPrice} from "./cartController.js";
import dotenv from "dotenv";
dotenv.config();
// import Stripe from "stripe";
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/* [ findById() then save() VS findByIdAndUpdate() ]
The main difference is that when you use findById and save, you first get the object from MongoDB and then update whatever you want to and then save. This is ok when you don't need to worry about parallelism or multiple queries to the same object.

findByIdAndUpdate is atomic. When you execute this multiple times, MongoDB will take care of the parallelism for you. Folllowing your example, if two requests are made at the same time on the same object, passing { $pull: { friends: friendId } }, the result will be the expected: only one friend will be pulled from the array.

But let's say you've a counter on the object, like friendsTotal with starting value at 0. And you hit the endpoint that must increase the counter by one twice, for the same object.

If you use findById, then increase and then save, you'd have some problems because you are setting the whole value. So, you first get the object, increase to 1, and update. But the other request did the same. You'll end up with friendsTotal = 1.

With findByIdAndUpdate you could use { $inc: { friendsTotal: 1 } }. So, even if you execute this query twice, on the same time, on the same object, you would end up with friendsTotal = 2, because MongoDB use these update operators to better handle parallelism, data locking and more.
*/
// @desc    UPDATE Single Order To Paid
// @route   PATCH /api/orders/:orderId/is-paid
// @access  Private("ADMIN")
// export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
//   const {orderId} = req.params;
//   const order = await Order.findById(orderId);
//   if (!order) {
//     return next(new APIError(`No order match with this id : ${orderId}`, 404));
//   }
//   order.isPaid = true;
//   order.paidAt = Date.now();
//   await order.save();
//   res.status(200).json({status: "success", data: order});
// });
// @desc    UPDATE Single Order To Delivered
// @route   PATCH /api/orders/:orderId/is-delivered
// @access  Private("ADMIN")
// export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
//   const {orderId} = req.params;
//   const order = await Order.findById(orderId);
//   if (!order) {
//     return next(new APIError(`No order match with this id : ${orderId}`, 404));
//   }
//   order.isDelivered = true;
//   order.deliveredAt = Date.now();
//   await order.save();
//   res.status(200).json({status: "success", data: order});
// });

// @ desc middleware to filter orders for the logged user
// @access  Protected
// export const filterUserOrders = asyncHandler(async (req, res, next) => {
//   if (req.user.role === USER_ROLES.USER) req.filterObj = {user: req.user._id};
//   next();
// });
// @desc    GET All Orders
// @route   GET /api/orders
// @access  Private("ADMIN")
// export const getAllOrders = getAll(Order);

// @desc    GET Single Order
// @route   GET /api/orders/:id
// @access  Private("ADMIN")
// export const getSingleOrder = getOne(Order, {
//   path: "cartItems.product",
//   select: "name image",
// });

// @desc    UPDATE Single Order
// @route   PATCH /api/orders/:id
// @access  Private("ADMIN")
// export const updateSingleOrder = updateOne(Order);

// @desc    CREATE Cash Order
// @route   POST /api/orders/:cartId
// @access  Protected
export const createCashOrder = asyncHandler(async (req, res, next) => {
  let { products, shipping_address } = req.body;

  // Support form-data where products may be a JSON string
  if (typeof products === "string") {
    try {
      products = JSON.parse(products);
    } catch (err) {
      return next(new APIError("Invalid products payload", 400));
    }
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return next(new APIError("Products array is required", 400));
  }

  // Validate each item and enrich with variant, product and store info
  const enrichedItems = [];
  for (const item of products) {
    const variantId = item.product_variantId || item.variantId || item.productVariantId;
    const quantity = parseInt(item.quantity || item.qty || 1, 10);
    const couponId = item.couponId || item.coupon_id || item.coupon || null;

    if (!variantId) return next(new APIError("product_variantId is required for each item", 400));
    if (!quantity || quantity <= 0) return next(new APIError("quantity must be a positive integer", 400));

    const variant = await ProductVariant.findByPk(variantId, {
      include: [{ model: Product, as: "ProductVariantProduct" }],
    });
    if (!variant) return next(new APIError(`No product variant match with id: ${variantId}`, 404));

    const product = variant.ProductVariantProduct;
    if (!product) return next(new APIError(`Product for variant ${variantId} not found`, 404));

    // Check stock
    if (variant.stock_quantity != null && variant.stock_quantity < quantity) {
      return next(new APIError(`Not enough stock for variant ${variantId}`, 400));
    }

    let coupon = null;
    if (couponId) {
      coupon = await Coupon.findByPk(couponId);
      if (!coupon) return next(new APIError(`No coupon match with id: ${couponId}`, 404));
      // quantity available?
      if (coupon.quantity != null && coupon.quantity <= 0) {
        return next(new APIError(`Coupon ${couponId} is no longer available`, 400));
      }
      // expired?
      if (coupon.expire) {
        const expireDate = new Date(coupon.expire);
        const today = new Date();
        // normalize to date only
        if (expireDate < new Date(today.toDateString())) {
          return next(new APIError(`Coupon ${couponId} has expired`, 400));
        }
      }
      // product match: coupon.productId can be null (global) or must match
      if (coupon.productId && coupon.productId !== product.id) {
        return next(new APIError(`Coupon ${couponId} does not apply to this product`, 400));
      }
    }

    enrichedItems.push({ item, variant, product, quantity, coupon });
  }

  // Group items by storeId
  const groups = {};
  for (const it of enrichedItems) {
    const storeId = it.product.storeId || null;
    if (!groups[storeId]) groups[storeId] = [];
    groups[storeId].push(it);
  }

  const createdOrders = [];

  // Shipping fee fixed
  const SHIPPING_FEE = 30000;

  // Process each store group in a transaction
  for (const storeId of Object.keys(groups)) {
    const items = groups[storeId];
    const t = await sequelize.transaction();
    try {
      // compute subtotal and total discounts
      let subtotal = 0;
      let totalDiscount = 0;

      for (const it of items) {
        const price = parseFloat(it.variant.price || 0);
        subtotal += price * it.quantity;
        if (it.coupon) {
          const discountPercent = parseFloat(it.coupon.discount || 0) / 100;
          totalDiscount += price * it.quantity * discountPercent;
        }
      }

      const shipping_fee = SHIPPING_FEE;
      const total_price = Math.max(0, subtotal + shipping_fee - totalDiscount);

      // Create order
      const order = await Order.create(
        {
          payment_method: PAYMENT_METHODS.CASH,
          total_price,
          order_date: new Date(),
          shipping_address: shipping_address || null,
          shipping_fee,
          clientId: req.user && req.user.id ? req.user.id : null,
          storeId: storeId || null,
        },
        { transaction: t }
      );

      // Prepare order items and perform updates (stock, sold, coupon qty)
      const orderItemsToCreate = [];
      for (const it of items) {
        const unitPrice = parseFloat(it.variant.price || 0);
        orderItemsToCreate.push({
          quantity: it.quantity,
          price: unitPrice,
          orderId: order.id,
          product_variantId: it.variant.id,
        });

        // decrement stock
        if (it.variant.stock_quantity != null) {
          await it.variant.decrement("stock_quantity", { by: it.quantity, transaction: t });
        }

        // increment product sold
        if (it.product) {
          await it.product.increment("sold", { by: it.quantity, transaction: t });
        }

        // decrement coupon quantity if used
        if (it.coupon) {
          await it.coupon.decrement("quantity", { by: 1, transaction: t });
        }
      }

      // bulk create order items
      await OrderItem.bulkCreate(orderItemsToCreate, { transaction: t });

      // update store total_sales (90% of order total)
      if (storeId) {
        const store = await Store.findByPk(storeId, { transaction: t });
        if (store) {
          const storeShare = Math.round(total_price * 0.9);
          await store.increment("total_sales", { by: storeShare, transaction: t });
        }
      }

      await t.commit();
      // reload order with order items
      const created = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: "OrderItems" }, { model: Store, as: "OrderStore" } ] });
      createdOrders.push(created);
    } catch (err) {
      await t.rollback();
      return next(err);
    }
  }

  res.status(201).json({ status: "success", data: createdOrders });
});
//   // 2) Check if user use coupon discount
//   const cartPrice = cart.totalPriceAfterCouponDiscount
//     ? cart.totalPriceAfterCouponDiscount
//     : cart.totalPrice;

//   // 3) Get the total order price
//   const taxPrice = cartPrice * 1 > 500 ? cartPrice * 0.05 : cartPrice;
//   const shippingPrice = cartPrice * 1 > 500 ? 50 : 0;
//   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
//   // console.log(
//   //   `cartPrice: ${cartPrice}, taxPrice: ${taxPrice}, shippingPrice: ${shippingPrice}, totalOrderPrice: ${totalOrderPrice}`
//   // );

//   // 4) Create a new order with cart, user, totalPrice
//   const order = await Order.create({
//     user: req.user._id,
//     cartItems: cart.cartItems,
//     totalOrderPrice,
//     shippingAddress,
//   });

//   // 5) After Creating a new order update the product.quantity(decrease by cartItem.quantity) , product.sold(increase by cartItem.quantity)
//   // bulkWrite[https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/][https://mongoosejs.com/docs/api/model.html#model_Model-bulkWrite]
//   if (order) {
//     const bulkOption = cart.cartItems.map((item) => ({
//       updateOne: {
//         filter: {_id: item.product},
//         update: {$inc: {quantityInStock: -item.quantity, sold: +item.quantity}},
//       },
//     }));
//     await Product.bulkWrite(bulkOption);

//     // 6) Clear Cart
//     cart.cartItems = [];
//     calcCartTotalPrice(cart);
//     await cart.save();
//   }

//   res.status(201).json({
//     status: "success",
//     data: order,
//   });

// (STRIPE_CHECKOUT_SESSION_OBJECT)[https://stripe.com/docs/api/checkout/sessions/create]
// @desc    CREATE Checkout Session
// @route   POST /api/orders/checkout-session
// @access  Protected
// export const createCheckoutSession = asyncHandler(async (req, res, next) => {
//   const {cartId, shippingAddress} = req.body;
//   // // 1) Find the cart to create order with this cart
//   const cart = await Cart.findById(cartId);
//   if (!cart) {
//     return next(new APIError(`No cart match with this id : ${cartId}`, 404));
//   }
//   if (cart.cartItems.length < 1) {
//     return next(new APIError(`Your cart is empty !`, 400));
//   }
//   // // 2) Check if user use coupon discount
//   const cartPrice = cart.totalPriceAfterCouponDiscount
//     ? cart.totalPriceAfterCouponDiscount
//     : cart.totalPrice;

//   // // 3) Get the total order price
//   const taxPrice = cartPrice * 1 > 500 ? cartPrice * 0.05 : 0;
//   const shippingPrice = cartPrice * 1 > 500 ? 50 : 0;
//   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
//   // 4) Create stripe checkout session
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           unit_amount: Math.floor(totalOrderPrice * 100),
//           product_data: {
//             name: req.user.username,
//             description: `Your Cart Is Ready To Payment Process ${
//               taxPrice > 0 || shippingPrice > 0
//                 ? `... The Price implement Tax ($${taxPrice}), Shipping ($${shippingPrice}) and Cart Price ($${cartPrice})`
//                 : ""
//             } ... Click Pay Now To Place Order`,
//             images: [
//               "https://cdn3d.iconscout.com/3d/premium/thumb/full-shopping-cart-5685678-4735048.png?f=webp",
//             ],
//           },
//         },
//         quantity: cart.cartItems.length,
//       },
//     ],
//     mode: "payment",
//     success_url: `${process.env.CLIENT_URL}/orders`,
//     cancel_url: `${process.env.CLIENT_URL}/cart`,
//     customer_email: req.user.email,
//     client_reference_id: cartId,
//     metadata: shippingAddress,
//   });

//   // 5) send session to response
//   res.status(200).json({status: "success", session});
// });

// @desc    CREATE Card Order After checkout session success
// export const createCardOrder = async (session) => {
//   // 1) Get all info from session that created throughout checkout process
//   const cartId = session.client_reference_id;
//   const cart = await Cart.findById(cartId);
//   const user = await User.findOne({email: session.customer_email});
//   const shippingAddress = session.metadata;
//   const totalOrderPrice = session.amount_total / 100;

//   // 2) Create order
//   const order = await Order.create({
//     user: user._id,
//     cartItems: cart.cartItems,
//     shippingAddress,
//     totalOrderPrice,
//     isPaid: true,
//     paidAt: Date.now(),
//     paymentMethod: PAYMENT_METHODS.CARD,
//   });
//   // 3) After Creating a new order update the product.quantity(decrease by cartItem.quantity) , product.sold(increase by cartItem.quantity)
//   // bulkWrite[https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/][https://mongoosejs.com/docs/api/model.html#model_Model-bulkWrite]
//   if (order) {
//     const bulkOption = cart.cartItems.map((item) => ({
//       updateOne: {
//         filter: {_id: item.product},
//         update: {$inc: {quantityInStock: -item.quantity, sold: +item.quantity}},
//       },
//     }));
//     await Product.bulkWrite(bulkOption);

//     // 4) Clear Cart
//     cart.cartItems = [];
//     calcCartTotalPrice(cart);
//     await cart.save();
//   }
// };
// (STRIPE_CHECKOUT_WEBHOOK)[https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local]
// @desc    CREATE Checkout Webhook To Create Order After checkout.session.completed event
// @route   POST /webhook
// @access  Protected
// export const webhookCheckout = asyncHandler(async (req, res, next) => {
//   const sig = req.headers["stripe-signature"];
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     // console.log(err);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
//   // Handle the event
//   if (event.type === "checkout.session.completed") {
//     // console.log(event);
//     createCardOrder(event.data.object);
//   }

//   res.status(200).json({received: true});
// });
