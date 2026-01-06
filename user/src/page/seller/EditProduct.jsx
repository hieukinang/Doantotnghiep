import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SellerLayout from "../../component-seller-page/SellerLayout";
import axios from "axios";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
    origin: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [slideImages, setSlideImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_BACKEND_URL}/products/${id}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data.product;
        setProduct({
          name: data.name,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
          description: data.description,
          origin: data.origin || "",
        });
      } catch (error) {
        toast.error("Không tìm thấy sản phẩm!");
        navigate("/seller/list-product");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleSlideImagesChange = (e) => {
    setSlideImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("categoryId", product.categoryId);
      formData.append("description", product.description);
      formData.append("origin", product.origin);
      if (mainImage) {
        formData.append("main_image", mainImage);
      }
      slideImages.forEach((image) => {
        formData.append("slide_images", image);
      });
      const url = `${import.meta.env.VITE_BACKEND_URL}/products/${id}`;
      await axios.patch(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Cập nhật sản phẩm thành công!");
      navigate("/seller/list-product");
    } catch (error) {
      toast.error("Có lỗi khi cập nhật sản phẩm!");
    }
  };

  return (
    <div className="p-14 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-5">
          <div className="font-semibold mb-4">Thông tin cơ bản</div>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Tên sản phẩm</span>
              <input
                className="border rounded px-3 py-2"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Danh mục</span>
              <input
                className="border rounded px-3 py-2"
                name="categoryId"
                value={product.categoryId}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Giá (VND)</span>
              <input
                type="number"
                className="border rounded px-3 py-2"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Tồn kho</span>
              <input
                type="number"
                className="border rounded px-3 py-2"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-1">
              <span className="text-sm text-gray-600">Mô tả</span>
              <textarea
                className="border rounded px-3 py-2"
                rows={5}
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </label>
            <label className="md:col-span-2 flex flex-col gap-1">
              <span className="text-sm text-gray-600">Xuất xứ</span>
              <input
                className="border rounded px-3 py-2"
                name="origin"
                value={product.origin}
                onChange={handleInputChange}
              />
            </label>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-5 h-fit">
          <div className="font-semibold mb-3">Hình ảnh</div>
          <div className="grid grid-cols-3 gap-3">
            {/* Hiển thị ảnh phụ nếu có */}
            {slideImages.length > 0
              ? slideImages.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 rounded flex items-center justify-center"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt="slide"
                      className="object-cover w-full h-full rounded"
                    />
                  </div>
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded" />
                ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSlideImagesChange}
            className="mt-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="mt-3"
          />

          <div className="h-px bg-gray-200 my-4" />
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa]"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
