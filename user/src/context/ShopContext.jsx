import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";

  const sellertoken = localStorage.getItem("sellerToken");
  const [sellerToken, setSellerToken] = useState(sellertoken);
  const [clientToken, setClientToken] = useState(
    localStorage.getItem("clientToken")
  );
  const [clientUsername, setClientUsername] = useState(
    localStorage.getItem("clientUsername")
  );
  const [isLoggedIn, setIsLoggedIn] = useState(!!clientToken);

  const [supercategories, setSupercategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allProductsbyStore, setAllProductsbyStore] = useState([]);
  const [product, setProduct] = useState([]);

  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  // ================== 🛒 GIỎ HÀNG ==================

  const fetchMyCart = async () => {
    if (!clientToken) return;

    try {
      const res = await axios.get(`${backendURL}/carts`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      });

      if (res.data.status !== "success" || !res.data.data?.doc) {
        toast.error("Không thể tải giỏ hàng!");
        return;
      }

      const doc = res.data.data.doc;
      const rawItems = doc.CartItems || [];

      // 🔹 Gọi song song API lấy chi tiết variant cho từng product_variantId
      const enrichedItems = await Promise.all(
        rawItems.map(async (item) => {
          const variantId = item.product_variantId;
          try {
            const variantRes = await axios.get(
              `${backendURL}/product-variants/variant/${variantId}`
            );
            const variant = variantRes.data?.data?.variant;

            return {
              ...item,
              CartItemProductVariant: {
                ...item.CartItemProductVariant,
                price: variant?.price ?? 0,
                stock_quantity: variant?.stock_quantity ?? 0,
                options: variant?.options ?? [],
                name: variant?.name,
                value: variant?.value,
              },
            };
          } catch (err) {
            console.warn(`⚠️ Không thể tải variant ${variantId}:`, err);
            return item;
          }
        })
      );

      // ✅ Cập nhật toàn bộ state
      setCart(doc);
      setCartItems(enrichedItems);
      setCartTotal(doc.total_amount || 0);
      setShippingFee(doc.total_shipping_fee || 0);
      setCartCount(enrichedItems.length);

      console.log("🛒 CART DATA:", enrichedItems);
    } catch (error) {
      console.error("❌ Lỗi khi tải giỏ hàng:", error);
      toast.error("Không thể tải giỏ hàng!");
    }
  };

  // ➕ Thêm sản phẩm vào giỏ
  const addToCart = async (productId, quantity = 1) => {
    if (!clientToken) {
      toast.warning("⚠️ Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    try {
      const res = await axios.post(
        `${backendURL}/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${clientToken}` } }
      );

      if (res.data.status === "success") {
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        await fetchMyCart();
      } else {
        toast.error(res.data.message || "Không thể thêm sản phẩm!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào giỏ:", error);
      toast.error("Không thể thêm sản phẩm!");
    }
  };

  // ❌ Xóa sản phẩm khỏi giỏ
  const removeFromCart = async (productId) => {
    if (!clientToken) return;
    try {
      const res = await axios.delete(`${backendURL}/carts/${productId}`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      });

      if (res.data.status === "success") {
        toast.success("Đã xoá sản phẩm khỏi giỏ hàng!");
        await fetchMyCart();
      } else {
        toast.error(res.data.message || "Không thể xoá sản phẩm!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi xoá sản phẩm:", error);
      toast.error("Không thể xoá sản phẩm khỏi giỏ hàng!");
    }
  };

  // 🔁 Tự động tải giỏ hàng khi đăng nhập
  useEffect(() => {
    if (clientToken) fetchMyCart();
  }, [clientToken]);

  // ================== 👤 LOGIN / LOGOUT ==================

  const authLogin = async (emailOrPhone, password) => {
    try {
      const res = await axios.post(
        `${backendURL}/clients/login`,
        { emailOrPhone, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.token) {
        const token = res.data.token;
        const username =
          res.data?.data?.user?.username ||
          res.data?.data?.user?.email ||
          "Client";

        localStorage.setItem("clientToken", token);
        localStorage.setItem("clientUsername", username);

        setClientToken(token);
        setClientUsername(username);
        setIsLoggedIn(true);
        await fetchMyCart();
        toast.success("Đăng nhập thành công!");
        return { success: true, username };
      } else {
        toast.error(res.data?.message || "Đăng nhập thất bại!");
        return { success: false };
      }
    } catch (err) {
      console.error("❌ Lỗi khi đăng nhập:", err);
      toast.error(err.response?.data?.message || "Đăng nhập thất bại!");
      return { success: false };
    }
  };

  const handleClientLogout = async () => {
    try {
      await axios.post(
        `${backendURL}/clients/logout`,
        {},
        {
          headers: clientToken
            ? { Authorization: `Bearer ${clientToken}` }
            : {},
          withCredentials: true,
        }
      );
    } catch (error) {
      console.warn("⚠️ Lỗi khi logout:", error);
    } finally {
      localStorage.removeItem("clientToken");
      localStorage.removeItem("clientUsername");
      setClientToken(null);
      setClientUsername(null);
      setIsLoggedIn(false);
      toast.info("Đã đăng xuất");
    }
  };

  // ================== 🧩 DANH MỤC / SẢN PHẨM ==================

  const getAllSuperCategories = async () => {
    try {
      const res = await axios.get(`${backendURL}/supercategories`);
      const data = res.data?.data?.docs || res.data?.data || [];
      setSupercategories(data);
      return data;
    } catch (error) {
      console.error("❌ Lỗi khi tải supercategories:", error);
      toast.error("Không thể tải danh mục cha!");
      return [];
    }
  };

  const getAllCategories = async () => {
    try {
      const res = await axios.get(`${backendURL}/categories`);
      const data = res.data?.data?.docs || res.data?.data || [];
      setCategories(data);
      return data;
    } catch (error) {
      console.error("❌ Lỗi khi tải categories:", error);
      toast.error("Không thể tải danh mục con!");
      return [];
    }
  };

  const createProduct = async (formData) => {
    try {
      const res = await axios.post(`${backendURL}/products/store`, formData, {
        headers: { Authorization: `Bearer ${sellertoken}` },
      });
      if (res.data.status === "success") {
        toast.success("Thêm sản phẩm thành công!");
        return res.data;
      } else {
        toast.error(res.data.message || "Thêm sản phẩm thất bại!");
        return null;
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo sản phẩm:", error);
      toast.error("Không thể thêm sản phẩm!");
      return null;
    }
  };

  const getProduct = async (id) => {
    try {
      const res = await axios.get(`${backendURL}/products/${id}`);
      if (res.data.status === "success") {
        setProduct(res.data.data.doc);
      } else {
        toast.error(res.data.message || "❌ Lấy sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải product:", error);
      toast.error("Không thể tải sản phẩm!");
    }
  };

  const getAllProducts = async () => {
    try {
      const res = await axios.get(`${backendURL}/products`);
      if (res.data.status === "success") {
        setAllProducts(res.data.data.docs);
        return res.data;
      } else {
        toast.error(res.data.message || "❌ Lấy sản phẩm thất bại!");
        return null;
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải products:", error);
      toast.error("Không thể tải danh sách sản phẩm!");
      return [];
    }
  };

  const getAllProductsByStore = async () => {
    if (!sellertoken) {
      toast.warning("⚠️ Bạn cần đăng nhập để xem sản phẩm của cửa hàng!");
      return [];
    }

    try {
      const res = await axios.get(`${backendURL}/products/store`, {
        headers: { Authorization: `Bearer ${sellertoken}` },
      });
      if (res.data.status === "success") {
        setAllProductsbyStore(res.data.data.docs || []);
        return res.data;
      } else {
        toast.error(
          res.data.message || "❌ Không thể lấy sản phẩm của cửa hàng!"
        );
        return null;
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải products by store:", error);
      toast.error("Không thể tải sản phẩm của cửa hàng!");
      return [];
    }
  };

  // 🔁 Tải danh mục cha khi khởi động
  useEffect(() => {
    getAllSuperCategories();
  }, []);

  const value = {
    backendURL,
    clientToken,
    clientUsername,
    isLoggedIn,
    supercategories,
    categories,
    allProducts,
    allProductsbyStore,
    product,
    cart,
    cartItems,
    cartCount,
    cartTotal,
    shippingFee,
    fetchMyCart,
    removeFromCart,
    addToCart,
    authLogin,
    handleClientLogout,
    getAllSuperCategories,
    getAllCategories,
    createProduct,
    getProduct,
    getAllProducts,
    getAllProductsByStore,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
