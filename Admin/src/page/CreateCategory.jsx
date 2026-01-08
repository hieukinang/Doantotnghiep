import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ExpandMore, ChevronRight } from "@mui/icons-material";

const CreateCategory = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    superCategoryId: "",
  });

  const [attributes, setAttributes] = useState([""]);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("super");
  const [superCategories, setSuperCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [expandedSuper, setExpandedSuper] = useState({});
  const [expandedCat, setExpandedCat] = useState({});

  const fileInputRef = useRef(null);

  const fetchSuper = async () => {
    try {
      const res = await axios.get(`${backendURL}/supercategories`);
      setSuperCategories(res.data?.data?.docs || res.data?.data || []);
    } catch (err) {
      console.error("Loi khi tai super categories:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendURL}/categories`);
      setCategories(res.data?.data?.docs || res.data?.data || []);
    } catch (err) {
      console.error("Loi khi tai categories:", err);
    }
  };

  useEffect(() => {
    fetchSuper();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", image: null, superCategoryId: "" });
    setAttributes([""]);
    setMessage("");
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      if (previewImage) URL.revokeObjectURL(previewImage);
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAttributeChange = (index, value) => {
    const newAttrs = [...attributes];
    newAttrs[index] = value;
    setAttributes(newAttrs);
  };

  const addAttribute = () => setAttributes([...attributes, ""]);
  const removeAttribute = (index) => setAttributes(attributes.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("image", formData.image);

      if (mode === "category") {
        if (!formData.name || !formData.image || attributes.length === 0) {
          setMessage("Vui long nhap day du cac truong bat buoc!");
          return;
        }
        data.append("name_attributes", JSON.stringify(attributes.filter((a) => a.trim() !== "")));
        if (formData.superCategoryId) data.append("superCategoryId", formData.superCategoryId);

        await axios.post(`${backendURL}/categories`, data, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        setMessage("Tao danh muc thanh cong!");
        fetchCategories();
      } else {
        if (!formData.name || !formData.image) {
          setMessage("Vui long nhap ten va hinh anh!");
          return;
        }
        await axios.post(`${backendURL}/supercategories`, data, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        setMessage("Tao danh muc cha thanh cong!");
        fetchSuper();
      }

      setTimeout(() => setMessage(""), 2500);
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || "Loi khi tao!");
    }
  };

  const toggleSuper = (id) => {
    setExpandedSuper((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCat = (id) => {
    setExpandedCat((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoriesBySuper = (superId) => {
    return categories.filter((c) => c.superCategoryId === superId);
  };

  return (
    <div className="p-6 flex gap-4">
      {/* Ben trai - Form tao moi */}
      <div className="flex-1">
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => { setMode("super"); resetForm(); }}
            className={`px-4 py-2 rounded-md font-medium ${mode === "super" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Thêm danh mục cha
          </button>
          <button
            type="button"
            onClick={() => { setMode("category"); resetForm(); }}
            className={`px-4 py-2 rounded-md font-medium ${mode === "category" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Thêm danh mục con
          </button>
        </div>

        <div className="bg-white shadow-md rounded-md p-6 h-[500px] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {mode === "category" ? (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Danh mục cha</label>
                  <select name="superCategoryId" value={formData.superCategoryId} onChange={handleChange} className="w-full border p-2 rounded-md">
                    <option value="">-- Chọn danh mục cha --</option>
                    {superCategories.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Tên danh mục *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="VD: Giay dep" />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Thuộc tính *</label>
                  {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2 items-center mb-2">
                      <input type="text" value={attr} onChange={(e) => handleAttributeChange(index, e.target.value)} placeholder={`Thuoc tinh ${index + 1}`} className="flex-1 border p-2 rounded-md" />
                      {attributes.length > 1 && (
                        <button type="button" onClick={() => removeAttribute(index)} className="bg-red-500 text-white px-3 py-1 rounded-md">X</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addAttribute} className="bg-green-500 text-white px-3 py-1 rounded-md">+ Them thuoc tinh</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Tên danh mục cha *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="VD: Thoi trang" />
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Ảnh</label>
              <div className="border-2 border-dashed w-[150px] h-[150px] rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50" onClick={() => fileInputRef.current?.click()}>
                {previewImage ? (
                  <img src={previewImage} alt="preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-gray-500 text-sm flex items-center justify-center h-full">Chọn ảnh</div>
                )}
              </div>
              <input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
            </div>

            <button type="submit" className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              {mode === "category" ? "Tao danh muc" : "Tao danh muc cha"}
            </button>
          </form>
          {message && <p className="mt-4 text-sm font-medium text-green-600">{message}</p>}
        </div>
      </div>

      {/* Ben phai - Danh sach phan cap */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Danh sách danh mục</h2>
        <div className="bg-white shadow-md rounded-md p-4 h-[500px] overflow-y-auto">
          {superCategories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có danh mục nào</p>
          ) : (
            <div className="space-y-1">
              {superCategories.map((sc) => {
                const childCats = getCategoriesBySuper(sc.id);
                const isExpanded = expandedSuper[sc.id];
                return (
                  <div key={sc.id}>
                    {/* Level 1: Super Category */}
                    <div
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => toggleSuper(sc.id)}
                    >
                      {childCats.length > 0 ? (
                        isExpanded ? <ExpandMore className="text-gray-500" style={{ fontSize: 18 }} /> : <ChevronRight className="text-gray-500" style={{ fontSize: 18 }} />
                      ) : (
                        <span className="w-4" />
                      )}
                      <img src={sc.image || "https://via.placeholder.com/30"} alt={sc.name} className="w-6 h-6 rounded object-cover" />
                      <span className="font-medium text-blue-700">{sc.name}</span>
                      <span className="text-xs text-gray-400 ml-auto">({childCats.length})</span>
                    </div>

                    {/* Level 2: Categories */}
                    {isExpanded && childCats.length > 0 && (
                      <div className="ml-6 border-l border-gray-200">
                        {childCats.map((cat) => {
                          const attrs = cat.CategoryAttributes || [];
                          const isCatExpanded = expandedCat[cat.id];
                          return (
                            <div key={cat.id}>
                              <div
                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer ml-2"
                                onClick={() => toggleCat(cat.id)}
                              >
                                {attrs.length > 0 ? (
                                  isCatExpanded ? <ExpandMore className="text-gray-400" style={{ fontSize: 16 }} /> : <ChevronRight className="text-gray-400" style={{ fontSize: 16 }} />
                                ) : (
                                  <span className="w-4" />
                                )}
                                <img src={cat.image || "https://via.placeholder.com/24"} alt={cat.name} className="w-5 h-5 rounded object-cover" />
                                <span className="text-green-700">{cat.name}</span>
                                <span className="text-xs text-gray-400 ml-auto">({attrs.length})</span>
                              </div>

                              {/* Level 3: Attributes */}
                              {isCatExpanded && attrs.length > 0 && (
                                <div className="ml-10 border-l border-gray-100 py-1">
                                  {attrs.map((attr, i) => (
                                    <div key={attr.id || i} className="flex items-center gap-2 p-1 ml-2 text-sm text-gray-600">
                                      <span className="w-2 h-2 bg-gray-300 rounded-full" />
                                      {attr.name || attr}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
