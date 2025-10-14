import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₫ ";
  const delivery_fee = 10000;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // ✅ Thêm sản phẩm vào giỏ
  const addToCart = async (itemId, brand, quantity = 1) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + quantity;

    setCartItems(cartData);
    console.log("Cart:", cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, quantity },
          { headers: { token } }
        );
        toast.success("Thêm vào giỏ thành công");
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  // ✅ Xóa 1 sản phẩm khỏi giỏ
  const removeFromCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    delete cartData[itemId];
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
        toast.info("Đã xóa sản phẩm khỏi giỏ");
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  // ✅ Xóa toàn bộ giỏ
  const clearCart = async () => {
    setCartItems({});
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/clear`,
          {},
          { headers: { token } }
        );
        toast.info("Đã xóa toàn bộ giỏ hàng");
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  // ✅ Cập nhật số lượng sản phẩm
  const updateQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  // ✅ Đếm tổng số sản phẩm trong giỏ
  const getCartCount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) total += cartItems[itemId];
    }
    return total;
  };

  // ✅ Tính tổng tiền giỏ hàng
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((p) => p._id === itemId);
      if (!itemInfo) continue;
      if (cartItems[itemId] > 0) {
        totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  // ✅ Lấy danh sách sản phẩm
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/products");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ✅ Lấy giỏ hàng người dùng từ backend
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
