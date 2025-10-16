import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [categories, setCategories] = useState([]);

  // ✅ Lấy danh mục sản phẩm
  const getAllCategories = async () => {
    try {
      const res = await axios.get(`${backendURL}/categories`);
      const data = res.data?.data?.docs || res.data?.data || [];
      setCategories(data);
      console.log("📂 Danh mục:", data);
      return data;
    } catch (error) {
      console.error("❌ Lỗi khi tải danh mục:", error);
      toast.error("Không thể tải danh mục");
      return [];
    }
  };

  // ✅ Tạo sản phẩm mới
  const createProduct = async (formData) => {
    try {
      const res = await axios.post(`${backendURL}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("✅ Thêm sản phẩm thành công");
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

  useEffect(() => {
    getAllCategories();
  }, []);

  const value = {
    backendURL,
    categories,
    getAllCategories,
    createProduct,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
