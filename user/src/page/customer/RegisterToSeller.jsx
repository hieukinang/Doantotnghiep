import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../component/Footer";
import logo from "../../assets/home/logo.svg";
import { TextField, Button } from "@mui/material";

const RegisterToSeller = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Logic gửi dữ liệu lên backend sẽ thêm ở đây
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
      <div className="flex flex-1 justify-center items-center p-10 bg-gray-100">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#116AD1] mb-6">
            Thông tin đăng ký Người bán
          </h2>

          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            <TextField
              label="Căn cước công dân"
              name="cccd"
              value={formData.cccd}
              onChange={handleChange}
              required
            />
            <TextField
              label="Ảnh mặt trước căn cước công dân"
              name="cccd_front"
              type="file"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              required
            />
            <TextField
              label="Ảnh đại diện"
              name="avatar"
              type="file"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              required
            />
            <TextField
              label="Tên cửa hàng"
              name="store_name"
              value={formData.store_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              label="Xác nhận mật khẩu"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
            <TextField
              label="Ngân hàng"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Số tài khoản"
              name="bank_account_number"
              value={formData.bank_account_number}
              onChange={handleChange}
              required
            />
            <TextField
              label="Chủ tài khoản"
              name="bank_account_holder_name"
              value={formData.bank_account_holder_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Thành phố"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <TextField
              label="Xã/Phường"
              name="village"
              value={formData.village}
              onChange={handleChange}
              required
            />
            <TextField
              label="Địa chỉ chi tiết"
              name="detail_address"
              value={formData.detail_address}
              onChange={handleChange}
              required
            />
            <TextField
              label="Mô tả cửa hàng"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />

            {/* Button submit spanning 2 columns */}
            <div className="col-span-2 flex justify-end gap-4 mt-4">
              <Button
                type="reset"
                variant="outlined"
                color="error"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#116AD1" }}
              >
                Đăng ký
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterToSeller;