import Cart from "../model/cartModel.js";
import CartItem from "../model/cartItemModel.js";
import Product from "../model/productModel.js";
import ProductVariant from "../model/productVariantModel.js";
import VariantOption from "../model/variantOptionModel.js";
import Attribute from "../model/attributeModel.js";
import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import Coupon from "../model/couponModel.js";
import { Op } from "sequelize";

// @desc    Get Logged User Cart (Sequelize version)
// @route   GET /api/cart
// @access  Protected
export const getMyCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({
    where: { clientId: req.user.id },
    include: [
      {
        model: CartItem,
        as: "CartItems",
        include: [
          {
            model: ProductVariant,
            as: "CartItemProductVariant",
            attributes: ["productId"],
            include: [
              {
                model: Product,
                as: "ProductVariantProduct",
                attributes: ["id", "name", "main_image"],
              },
              {
                model: VariantOption,
                as: "ProductVariantOptions",
                attributes: ["value"],
                include: [
                  { model: Attribute, as: "VariantOptionAttribute", attributes: ["name"] },
                ],
              },
            ],
          }
        ]
      },
    ],
  });

  if (!cart) {
    return res.status(200).json({ status: "success", results: 0, data: { doc: null, total_shipping_fee: 0 } });
  }

  // compute totals on-the-fly (Cart model no longer stores total_amount)
  const storeIdSet = new Set();
  const items = cart.CartItems || [];
  for (const item of items) {
    // we don't compute total_amount server-side anymore; frontend will calculate totals
    const prod = item.CartItemProductVariant?.ProductVariantProduct;
    storeIdSet.add(prod ? prod.storeId : null);
  }
  const SHIPPING_FEE_PER_STORE = 30000;
  const totalShippingFee = storeIdSet.size * SHIPPING_FEE_PER_STORE;

  res.status(200).json({
    status: "success",
    results: items.length,
    data: {
      doc: cart,
    },
  });
});

// @desc    Add Product To Cart
// @route   PATCH /api/cart
// @access  Protected
export const addToCart = asyncHandler(async (req, res, next) => {
  const { product_variantId, quantity } = req.body;

  // 1. Kiểm tra ProductVariant tồn tại và còn hàng
  const variant = await ProductVariant.findByPk(product_variantId);
  if (!variant) {
    return next(new APIError(`There is no product variant match this id: ${product_variantId}`, 404));
  }
  if (quantity > variant.stock_quantity) {
    return next(new APIError(`Quantity entered is more than this product variant's stock`, 400));
  }

  // 2. Tìm hoặc tạo Cart cho client
  let cart = await Cart.findOne({ where: { clientId: req.user.id } });
  if (!cart) {
    cart = await Cart.create({ clientId: req.user.id });
  }

  // 3. Tìm CartItem (nếu đã có thì tăng số lượng, chưa có thì tạo mới)
  let cartItem = await CartItem.findOne({
    where: { cartId: cart.id, product_variantId }
  });

  if (cartItem) {
    // Nếu đã có thì tăng số lượng
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    // Nếu chưa có thì tạo mới
    cartItem = await CartItem.create({
      cartId: cart.id,
      product_variantId,
      quantity
    });
  }

  // 4. Cập nhật lại tổng tiền trong Cart
  const allCartItems = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [
      {
        model: ProductVariant,
        as: "CartItemProductVariant",
        include: [{ model: Product, as: "ProductVariantProduct" }],
      },
    ],
  });

  // tính số lượng cửa hàng khác nhau trong giỏ hàng
  // tính phí vận chuyển tổng cho cart
  const storeIdSet = new Set();
  for (const item of allCartItems) {
    const variant = item.CartItemProductVariant || (await ProductVariant.findByPk(item.product_variantId));
    // try to get storeId via included product
    const product = item.CartItemProductVariant?.ProductVariantProduct;
    const storeId = product ? product.storeId : null;
    // normalize undefined to null
    storeIdSet.add(storeId ?? null);
  }
  // Shipping fee: 30000 per unique store
  const SHIPPING_FEE_PER_STORE = 30000;
  cart.total_shipping_fee = storeIdSet.size * SHIPPING_FEE_PER_STORE;
  await cart.save();

  // 5. Lấy lại Cart mới nhất (bao gồm CartItems và ProductVariant)
  const updatedCart = await Cart.findOne({
    where: { clientId: req.user.id },
    include: [
      {
        model: CartItem,
        as: "CartItems",
        include: [
          {
            model: ProductVariant,
            as: "CartItemProductVariant",
            include: [{ model: Product, as: "ProductVariantProduct" }],
          },
        ],
      }
    ]
  });

  res.status(200).json({
    status: "success",
  });
});

// @desc    Update CarItem Quantity
// @route   PATCH /api/cart/:productId
// @access  Protected
export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { product_variantId } = req.params;

  // 1. Kiểm tra Cart của user
  const cart = await Cart.findOne({ where: { clientId: req.user.id } });
  if (!cart) {
    return next(new APIError("There is no cart match this user", 404));
  }

  // 2. Kiểm tra CartItem tồn tại trong Cart
  const cartItem = await CartItem.findOne({
    where: { cartId: cart.id, product_variantId }
  });
  if (!cartItem) {
    return next(
      new APIError(
        `There is no cart item match this product_variantId: ${product_variantId} in your cart`,
        404
      )
    );
  }

  // 3. Kiểm tra số lượng hợp lệ và tồn kho
  if (!quantity || quantity > 1) {
    return next(new APIError("Please enter a valid quantity (>=1)", 400));
  }
  const variant = await ProductVariant.findByPk(product_variantId);
  if (!variant) {
    return next(new APIError(`Product variant not found`, 404));
  }
  if (quantity > variant.stock_quantity) {
    return next(new APIError(`Quantity entered is more than this product variant's stock`, 400));
  }

  // 4. Cập nhật số lượng
  cartItem.quantity = quantity;
  await cartItem.save();

  // 5. Cập nhật lại tổng tiền trong Cart
  const allCartItems = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [
      {
        model: ProductVariant, as: "CartItemProductVariant",
        include: [{ model: Product, as: "ProductVariantProduct" }],
      },
    ],
  });

  let totalAmount = 0;
  // compute total amount and shipping groups
  const storeIdSet = new Set();
  for (const item of allCartItems) {
    const product = item.CartItemProductVariant?.ProductVariantProduct;
    const storeId = product ? product.storeId : null;
    storeIdSet.add(storeId ?? null);
  }
  const SHIPPING_FEE_PER_STORE = 30000;
  cart.total_shipping_fee = storeIdSet.size * SHIPPING_FEE_PER_STORE;
  await cart.save();

  // 6. Lấy lại Cart mới nhất (bao gồm CartItems và ProductVariant)
  const updatedCart = await Cart.findOne({
    where: { clientId: req.user.id },
    include: [
      {
        model: CartItem,
        as: "CartItems",
        include: [
          { model: ProductVariant, as: "CartItemProductVariant" }
        ]
      }
    ]
  });

  res.status(200).json({
    status: "success",
    data: {
      doc: updatedCart,
      total_shipping_fee: cart.total_shipping_fee,
    },
  });
});

// @desc    Clear All CartItems
// @route   DELETE /api/cart
// @access  Protected
export const clearCart = asyncHandler(async (req, res, next) => {
  // 1. Tìm Cart của user
  const cart = await Cart.findOne({ where: { clientId: req.user.id } });
  if (!cart) {
    return next(new APIError("There is no cart match this user", 404));
  }

  // 2. Xóa tất cả CartItem thuộc Cart này
  await CartItem.destroy({ where: { cartId: cart.id } });

  // 3. Cập nhật lại tổng tiền trong Cart
  cart.total_shipping_fee = 0;
  await cart.save();

  res.status(204).json({ status: "success" });
});

// @desc    Apply Coupon Discount On Cart
// @route   PATCH /api/cart/apply-coupon
// @access  Protected
export const applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode, product_variantId } = req.body;

  // 1. Kiểm tra coupon hợp lệ và còn hạn
  const coupon = await Coupon.findOne({
    where: {
      code: couponCode,
      expire: { [Op.gt]: new Date() },
    },
  });
  if (!coupon) {
    return next(new APIError("Invalid or expired coupon", 404));
  }
  // 2. Lấy product variant (từ DB) để biết product -> storeId
  const variant = await ProductVariant.findByPk(product_variantId);
  if (!variant) return next(new APIError("Product variant not found", 404));

  const product = await Product.findByPk(variant.productId);
  if (!product) return next(new APIError("Product not found", 404));

  // 3. Kiểm tra coupon có áp dụng cho store của sản phẩm hay là coupon hệ thống (storeId == null)
  if (coupon.storeId !== null && coupon.storeId !== product.storeId) {
    return next(new APIError("Coupon does not apply to this product/store", 400));
  }

  // 4. Nếu áp dụng được, trả về success và thông tin giảm giá cho frontend xử lý
  const price = variant.price || 0;
  const discountPrice = +(price - coupon.discount).toFixed(2);

  res.status(200).json({
    status: "success",
    data: {
      appliedCoupon: coupon.code,
      discountedItem: {
        product_variantId: Number(product_variantId),
        discount: coupon.discount,
        price_before: price,
        price_after: discountPrice,
      },
    },
  });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  // accept several param names
  const product_variantId =
    req.params.product_variantId ||
    req.params.productVariantId ||
    req.params.productId ||
    req.params.variantId;

  if (!product_variantId) {
    return next(new APIError("product_variantId param is required", 400));
  }

  // 1. Tìm Cart của user
  const cart = await Cart.findOne({ where: { clientId: req.user.id } });
  if (!cart) {
    return next(new APIError("There is no cart match this user", 404));
  }

  // 2. Tìm CartItem tương ứng
  const cartItem = await CartItem.findOne({
    where: { cartId: cart.id, product_variantId: Number(product_variantId) },
  });
  if (!cartItem) {
    return next(
      new APIError(
        `There is no cart item match this product_variantId: ${product_variantId} in your cart`,
        404
      )
    );
  }

  // 3. Xóa CartItem
  await cartItem.destroy();

  // 4. Cập nhật lại tổng tiền trong Cart
  const remainingItems = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [{ model: ProductVariant, as: "CartItemProductVariant" }],
  });

  // Recalculate shipping fee based on remaining items
  const storeIdSet = new Set();
  for (const item of remainingItems) {
    const v = item.CartItemProductVariant || (await ProductVariant.findByPk(item.product_variantId));
    storeIdSet.add(v?.storeId);
  }
  cart.total_shipping_fee = storeIdSet.size > 0 ? 30000 : 0;
  await cart.save();

  // 5. Lấy lại cart mới nhất để trả về
  const updatedCart = await Cart.findOne({
    where: { clientId: req.user.id },
    include: [
      {
        model: CartItem,
        as: "CartItems",
        include: [
          {
            model: ProductVariant,
            as: "CartItemProductVariant",
            include: [{ model: Product, as: "ProductVariantProduct" }],
          },
        ],
      },
    ],
  });

  res.status(200).json({
    status: "success",
    numOfCartItems: updatedCart?.CartItems?.length || 0,
    data: {
      doc: updatedCart,
    },
  });
});
