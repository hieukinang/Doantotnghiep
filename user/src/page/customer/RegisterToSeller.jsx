import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../component-home-page/Footer";
import logo from "../../assets/home/logo.svg";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterToSeller = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cccd: "",
    cccd_front: null,
    avatar: null,
    store_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_holder_name: "",
    city: "",
    village: "",
    detail_address: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterSuccess(false);
    setRegisterError("");
    const form = new FormData();
    form.append("citizen_id", formData.cccd);
    form.append("id_image", formData.cccd_front);
    form.append("name", formData.store_name);
    form.append("phone", formData.phone);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("confirmPassword", formData.confirm_password);
    form.append("bank_name", formData.bank_name);
    form.append("bank_account_number", formData.bank_account_number);
    form.append("bank_account_holder_name", formData.bank_account_holder_name);
    form.append("city", formData.city);
    form.append("village", formData.village);
    form.append("detail_address", formData.detail_address);
    form.append("description", formData.description);
    form.append("image", formData.avatar);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/stores/register`;
      await axios.post(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRegisterSuccess(true);
    } catch (err) {
      setRegisterError(err?.response?.data?.message || "Đăng ký thất bại!");
      console.log(err?.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#116AD1] text-white flex items-center justify-between px-10 py-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-2xl">KOHI MALL</span>
        </Link>
        <h1 className="text-xl font-semibold">ĐĂNG KÝ LÀ NGƯỜI BÁN</h1>
        <Link to="/contact" className="cursor-pointer hover:underline text-sm">
          Hỗ trợ?
        </Link>
      </header>

      {/* Form container */}
      {/* Đã sửa p-10 thành p-6 để giảm padding ngoài */}
      <div className="flex flex-1 justify-center items-center p-6 bg-gray-100">
        {/* Đã sửa max-w-4xl thành max-w-5xl để form rộng hơn */}
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">

          {registerSuccess ? (
            <div className="text-center py-8">
              <div className="text-green-600 text-2xl font-semibold mb-4">
                Đăng ký thành công!
              </div>
              <Link
                to="/seller/login"
                className="text-blue-600 underline text-lg"
              >
                Quay về trang đăng nhập
              </Link>
            </div>
          ) : (
            <>
              {registerError && (
                <div className="col-span-2 text-center text-red-600 font-semibold mb-4">
                  {registerError}
                </div>
              )}
              {/* Đã sửa gap-4 thành gap-3 để giảm khoảng cách giữa các ô nhập */}
              <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit}>

                {/* Đã thêm size="small" cho tất cả các TextField để giảm chiều cao */}
                <TextField
                  label="Căn cước công dân"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Ảnh mặt trước căn cước công dân"
                  name="cccd_front"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Ảnh đại diện"
                  name="avatar"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Tên cửa hàng"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Xác nhận mật khẩu"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Ngân hàng"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Số tài khoản"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Chủ tài khoản"
                  name="bank_account_holder_name"
                  value={formData.bank_account_holder_name}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Thành phố"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Xã/Phường"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Địa chỉ chi tiết"
                  name="detail_address"
                  value={formData.detail_address}
                  onChange={handleChange}
                  required
                  size="small"
                />
                <TextField
                  label="Mô tả cửa hàng"
                  className="col-span-2"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}

                  required
                  size="small"
                  sx={{
                    // Mục tiêu là thẻ input/textarea bên trong TextField
                    '& .MuiInputBase-inputMultiline': {
                      // Cho phép ngắt dòng khi nội dung vượt quá chiều rộng
                      wordBreak: 'break-word',
                      // Vô hiệu hóa thuộc tính white-space nếu nó đang ngăn cản ngắt dòng
                      whiteSpace: 'pre-wrap',
                    }
                  }}
                />

                {/* Button submit spanning 2 columns */}
                <div className="col-span-2 flex justify-end gap-4 mt-4">
                  <Button
                    component={Link}
                    to="/seller/login"
                    variant="contained"
                    sx={{
                      backgroundColor: "#9CA3AF",
                      color: "white",
                      borderRadius: 2,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#6B7280",
                      },
                    }}
                  >
                    Hủy
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#116AD1",
                      color: "white",
                      borderRadius: 2,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#0E56A0",
                      },
                    }}
                  >
                    Đăng ký
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterToSeller;