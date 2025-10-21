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
    supercategories,
    categories,
    allProducts,
    allProductsbyStore,
    product,
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
