import { createContext, useState, useEffect } from "react";
import axios, { all } from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000/api";
  const sellertoken = localStorage.getItem("sellerToken");
  const [supercategories, setSupercategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allProductsbyStore, setAllProductsbyStore] = useState([]);
  const [product, setProduct] = useState([]);

  const [sellerToken, setSellerToken] = useState(localStorage.getItem("sellerToken"));
  const [clientToken, setClientToken] = useState(localStorage.getItem("clientToken"));
  const [clientUsername, setClientUsername] = useState(localStorage.getItem("clientUsername"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("clientToken"));
  const [cart, setCart] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);

  const [cartItems, setCartItems] = useState([]);     // Danh sách sản phẩm
  const [cartCount, setCartCount] = useState(0);      // Tổng số lượng
  const [cartTotal, setCartTotal] = useState(0);      // Tổng giá trị

  // ================== 🔹 API GIỎ HÀNG 🔹 ==================

  // 🛒 GỌI API LẤY GIỎ HÀNG
  const fetchMyCart = async () => {
    if (!clientToken) return;

    try {
      const res = await axios.get(`${backendURL}/carts`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      });

      if (res.data.status === "success" && res.data.data?.doc) {
        const doc = res.data.data.doc;

        // ✅ Cập nhật toàn bộ state liên quan
        setCart(doc);
        setCartItems(doc.CartItems || []);
        setCartTotal(doc.total_amount || 0);
        setShippingFee(doc.total_shipping_fee || 0);

        // Nếu chỉ muốn đếm số loại sản phẩm:
        setCartCount((doc.CartItems || []).length);


        console.log("🛒 CART DATA:", doc);
      } else {
        toast.error("Không thể tải giỏ hàng!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải giỏ hàng:", error);
      toast.error("Không thể tải giỏ hàng!");
    }
  };

  // 🧩 THÊM SẢN PHẨM VÀO GIỎ
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
        await fetchMyCart(); // Cập nhật lại context
      } else {
        toast.error(res.data.message || "Không thể thêm sản phẩm!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào giỏ:", error);
      toast.error("Không thể thêm sản phẩm!");
    }
  };

  // ❌ XOÁ SẢN PHẨM KHỎI GIỎ
  const removeFromCart = async (productId) => {
    if (!clientToken) return;

    try {
      const res = await axios.delete(`${backendURL}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      });

      if (res.data.status === "success") {
        toast.success("Đã xoá sản phẩm khỏi giỏ hàng!");
        await fetchMyCart(); // cập nhật lại
      } else {
        toast.error(res.data.message || "Không thể xoá sản phẩm!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi xoá sản phẩm:", error);
      toast.error("Không thể xoá sản phẩm khỏi giỏ hàng!");
    }
  };

  // 🔁 TỰ ĐỘNG GỌI GIỎ HÀNG KHI LOGIN
  useEffect(() => {
    if (clientToken) {
      fetchMyCart();
    }
  }, [clientToken]);

  const authLogin = async (emailOrPhone, password) => {
    try {
      const url = `${backendURL}/clients/login`;
      const res = await axios.post(
        url,
        { emailOrPhone, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.token) {
        const token = res.data.token;
        const username =
          res.data?.data?.user?.username ||
          res.data?.data?.user?.email ||
          "Client";

        // Lưu vào localStorage
        localStorage.setItem("tokenClient", token);
        localStorage.setItem("clientUsername", username);

        // Cập nhật state context
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
      toast.error(
        err.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!"
      );
      return { success: false };
    }
  };

  const handleClientLogout = async () => {
    try {
      const token = localStorage.getItem("tokenClient");
      await axios.post(
        `${backendURL}/clients/logout`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
    } catch (error) {
      console.warn("⚠️ Lỗi khi logout:", error);
    } finally {
      // 🧹 Xóa dữ liệu cục bộ
      localStorage.removeItem("tokenClient");
      localStorage.removeItem("clientUsername");

      // 🧠 Cập nhật context
      setClientToken(null);
      setClientUsername(null);
      setIsLoggedIn(false);

      toast.info("Đã đăng xuất");
    }
  };



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
      console.log("📂 Categories:", data);
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
        toast.success(" Thêm sản phẩm thành công");
        return res.data;
      } else {
        toast.error(res.data.message || "Thêm sản phẩm thất bại");
        return null;
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo sản phẩm:", error);
      toast.error("Không thể thêm sản phẩm");
      return null;
    }
  };

  const getProduct = async (id) => {
    try {
      const res = await axios.get(`${backendURL}/products/${id}`);
      if (res.data.status === "success") {
        const productData = res.data.data.doc; // ✅ Lấy đúng trường doc
        setProduct(productData);
        console.log("📦 Product:", productData);
      } else {
        toast.error(res.data.message || "❌ Lấy sản phẩm thất bại!");
        return null;
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải product:", error);
      toast.error("Không thể tải sản phẩm!");
      return null;
    }
  };


  const getAllProducts = async () => {
    try {
      const res = await axios.get(`${backendURL}/products`);
      setAllProducts(res.data.data.docs);
      if (res.data.status === "success") {
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
