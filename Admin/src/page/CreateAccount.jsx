import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminChatService from "../services/chatService";
import {
  AccountCircle,
  Lock,
  Email,
  Phone,
  Person,
  Work,
  CalendarToday,
  AttachMoney,
  MonetizationOn,
  Savings,
  LocationOn,
  AccountBalance,
  Image,
  VpnKey,
  AccountBalanceWallet,
} from "@mui/icons-material";

const roles = [
  { value: "staff", label: "Nhân viên" },
  { value: "manager", label: "Quản lý" },
];

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
    fullName: "",
    role: "staff",
    job_title: "",
    hire_date: "",
    salary: "",
    address: "",
    image: null,
    bank_name: "",
    bank_account_number: "",
    bank_account_holder_name: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setSelectedImageName(file ? file.name : "");
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    if (!formData.username) { newErrors.username = "Tên đăng nhập bắt buộc."; isValid = false; }
    if (!formData.password) { newErrors.password = "Mật khẩu bắt buộc."; isValid = false; }
    if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = "Mật khẩu xác nhận không khớp."; isValid = false; }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = "Email không hợp lệ."; isValid = false; }
    if (!formData.fullName) { newErrors.fullName = "Họ và tên bắt buộc."; isValid = false; }
    if (!formData.role) { newErrors.role = "Vai trò bắt buộc."; isValid = false; }
    if (!formData.job_title) { newErrors.job_title = "Chức danh bắt buộc."; isValid = false; }
    if (!formData.hire_date) { newErrors.hire_date = "Ngày thuê bắt buộc."; isValid = false; }
    if (!formData.bank_name) { newErrors.bank_name = "Tên ngân hàng bắt buộc."; isValid = false; }
    if (!formData.bank_account_number) { newErrors.bank_account_number = "Số tài khoản bắt buộc."; isValid = false; }
    if (!formData.bank_account_holder_name) { newErrors.bank_account_holder_name = "Tên chủ tài khoản ngân hàng bắt buộc."; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validate()) return;
    try {

      const url = `${import.meta.env.VITE_BACKEND_URL}/admins/register`
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "fullName") data.append("fullname", value);
        else if (value !== undefined && value !== null && value !== "") data.append(key, value);
      });

      const adminToken = localStorage.getItem("adminToken");
      const res = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res?.status === "success" || res.status === "success") {
        // Tạo user trong chat system ngay sau khi tạo tài khoản thành công
        if (res.data?.newAdmin) {
          console.log("cdscd", res.data?.newAdmin)
          const adminData = res.data.newAdmin;
          const username = adminData.username || adminData.email || "Admin";
          const userId = adminData.id;

          try {
            await AdminChatService.createUser(userId, username);
            console.log("Admin đã được tạo trong chat system");
          } catch (chatError) {
            console.warn(
              "Không thể tạo admin trong chat system:",
              chatError
            );
          }
        }
        else {
          console.log("lỗi")
        }
      }

      toast.success(`Tạo tài khoản "${formData.username}" thành công`);

      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        phone: "",
        email: "",
        fullName: "",
        role: "staff",
        job_title: "",
        hire_date: "",
        salary: "",
        address: "",
        image: null,
        bank_name: "",
        bank_account_number: "",
        bank_account_holder_name: "",
      });
      setSelectedImageName("");
      setErrors({});
    } catch (err) {
      setSuccessMessage("");
      setErrors({});

      // Nếu backend trả về mảng errors
      if (err.response?.data?.errors?.length) {
        const firstError = err.response.data.errors[0];

        toast.error(firstError.msg);
        return;
      }

      // Fallback nếu không có errors[]
      const message =
        err.response?.data?.message ||
        err.message ||
        "Đăng ký thất bại";

      toast.error(message);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="w-full max-w-4xl bg-gray-100 rounded-xl shadow-lg p-4 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Tạo Tài Khoản Quản Lý Mới</h2>
          <p className="text-gray-600">Dùng cho Admin tạo tài khoản nhân viên có vai trò thấp hơn.</p>
        </div>

        {/* {successMessage && <div className="text-green-600">{successMessage}</div>} */}
        {/* {errors.api && <div className="text-red-600">{errors.api}</div>} */}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Thông tin đăng nhập */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-600">1. Thông tin Đăng nhập</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Username */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><AccountCircle /></span>
                <input
                  type="text"
                  name="username"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.username && <div className="text-red-600 mt-1">{errors.username}</div>}
              </div>

              {/* Email */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><Email /></span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <div className="text-red-600 mt-1">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><Lock /></span>
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <div className="text-red-600 mt-1">{errors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><VpnKey /></span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && <div className="text-red-600 mt-1">{errors.confirmPassword}</div>}
              </div>

            </div>
          </div>

          {/* Cá nhân & công việc */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-600">2. Thông tin Cá nhân & Công việc</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Full Name */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><Person /></span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fullName && <div className="text-red-600 mt-1">{errors.fullName}</div>}
              </div>

              {/* Phone */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><Phone /></span>
                <input
                  type="text"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800">🔹</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              {/* Job title */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><Work /></span>
                <input
                  type="text"
                  name="job_title"
                  placeholder="Chức danh"
                  value={formData.job_title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Hire date */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><CalendarToday /></span>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Salary */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><Savings /></span>
                <input
                  type="number"
                  min={0}
                  name="salary"
                  placeholder="Mức lương (VNĐ)"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div className="relative sm:col-span-2">
                <span className="absolute inset-y-0 left-0 flex items-start pt-2 pl-3 text-gray-800"><LocationOn /></span>
                <textarea
                  name="address"
                  placeholder="Địa chỉ"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>
          </div>

          {/* Ngân hàng & hình ảnh */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-600">3. Ngân hàng & Hình ảnh</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Bank name */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><AccountBalance /></span>
                <input
                  type="text"
                  name="bank_name"
                  placeholder="Tên ngân hàng"
                  value={formData.bank_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bank_name && (
                  <div className="text-red-600 mt-1">{errors.bank_name}</div>
                )}
              </div>

              {/* Bank account number */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><AccountBalanceWallet /></span>
                <input
                  type="text"
                  name="bank_account_number"
                  placeholder="Số tài khoản"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bank_account_number && (
                  <div className="text-red-600 mt-1">
                    {errors.bank_account_number}
                  </div>
                )}
              </div>

              {/* Bank account holder */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800"><Person /></span>
                <input
                  type="text"
                  name="bank_account_holder_name"
                  placeholder="Chủ tài khoản"
                  value={formData.bank_account_holder_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bank_account_holder_name && (
                  <div className="text-red-600 mt-1">
                    {errors.bank_account_holder_name}
                  </div>
                )}
              </div>

              {/* Upload image */}
              <div className="sm:col-span-3 mt-2">
                <label className="flex items-center gap-2 cursor-pointer border p-2 rounded">
                  <Image />
                  {selectedImageName ? selectedImageName : "Tải lên hình ảnh"}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="mt-4 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Tạo tài khoản
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default CreateAccount;