import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [supercategories, setSupercategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("sellerToken");
  const getAllSuperCategories = async () => {
    try {
      const res = await axios.get(`${backendURL}/supercategories`);
      const data = res.data?.data?.docs || res.data?.data || [];
      setSupercategories(data);
      console.log("📂 Supercategories:", data);
      return data;
    } catch (error) {
      console.error("❌ Lỗi khi tải supercategories:", error);
      toast.error("Không thể tải danh mục cha");
      return [];
    }
  };
  const getAllCategories = async () => {
    try {
      const res = await axios.get(`${backendURL}/categories`);
      const data = res.data?.data?.docs || res.data?.data || [];
      setCategories(data);
      console.log("📂 categories:", data);
      return data;
    } catch (error) {
      console.error("❌ Lỗi khi tải categories:", error);
      toast.error("Không thể tải danh mục con");
      return [];
    }
  };

  const createProduct = async (formData) => {
    try {
      const res = await axios.post(`${backendURL}/products`, formData, {
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    getAllSuperCategories();
  }, []);

  const value = {
    backendURL,
    supercategories,
    categories,
    getAllSuperCategories,
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
