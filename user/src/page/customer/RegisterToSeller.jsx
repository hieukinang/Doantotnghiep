import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../component-home-page/Footer";
import logo from "../../assets/home/logo.svg";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import chatService from "../../services/chatService";

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

  const [errors, setErrors] = useState({});

  // Validation functions
  const validateField = (name, value, file = null) => {
    switch (name) {
      case "cccd":
        if (!value.trim()) return "Căn cước công dân không được để trống";
        if (!/^[0-9]{12}$/.test(value)) return "CCCD phải là số và có 12 chữ số";
        return "";
      case "cccd_front":
        if (!file) return "Vui lòng chọn ảnh mặt trước CCCD";
        return "";
      case "avatar":
        if (!file) return "Vui lòng chọn ảnh đại diện";
        return "";
      case "store_name":
        if (!value.trim()) return "Tên cửa hàng không được để trống";
        if (value.length < 3) return "Tên cửa hàng phải có ít nhất 3 ký tự";
        return "";
      case "phone":
        if (!value.trim()) return "Số điện thoại không được để trống";
        if (!/^[0-9]{10}$/.test(value)) return "Số điện thoại phải là số và có 10 chữ số";
        return "";
      case "email":
        if (!value.trim()) return "Email không được để trống";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Email không hợp lệ";
        return "";
      case "password":
        if (!value) return "Mật khẩu không được để trống";
        if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
        return "";
      case "confirm_password":
        if (!value) return "Xác nhận mật khẩu không được để trống";
        if (formData.password !== value) return "Mật khẩu xác nhận không khớp";
        return "";
      case "bank_name":
        if (!value.trim()) return "Tên ngân hàng không được để trống";
        return "";
      case "bank_account_number":
        if (!value.trim()) return "Số tài khoản không được để trống";
        return "";
      case "bank_account_holder_name":
        if (!value.trim()) return "Tên chủ tài khoản không được để trống";
        return "";
      case "city":
        if (!value.trim()) return "Thành phố không được để trống";
        return "";
      case "village":
        if (!value.trim()) return "Xã/Phường không được để trống";
        return "";
      case "detail_address":
        if (!value.trim()) return "Địa chỉ chi tiết không được để trống";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      // Validate file
      const error = validateField(name, "", file);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      if (error) {
        toast.error(error);
      }
    } else {
      setFormData({ ...formData, [name]: value });

      // Real-time validation for text fields
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      // Re-validate confirm_password if password changes
      if (name === "password" && formData.confirm_password) {
        const confirmError = validateField("confirm_password", formData.confirm_password);
        setErrors((prev) => ({
          ...prev,
          confirm_password: confirmError,
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value, files } = e.target;
    const error = validateField(name, value, files?.[0] || null);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
      toast.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      cccd: validateField("cccd", formData.cccd),
      cccd_front: validateField("cccd_front", "", formData.cccd_front),
      avatar: validateField("avatar", "", formData.avatar),
      store_name: validateField("store_name", formData.store_name),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirm_password: validateField("confirm_password", formData.confirm_password),
      bank_name: validateField("bank_name", formData.bank_name),
      bank_account_number: validateField("bank_account_number", formData.bank_account_number),
      bank_account_holder_name: validateField("bank_account_holder_name", formData.bank_account_holder_name),
      city: validateField("city", formData.city),
      village: validateField("village", formData.village),
      detail_address: validateField("detail_address", formData.detail_address),
    };

    setErrors(newErrors);

    // Check
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      // hiển thị lỗi đầu tiên
      const firstError = Object.values(newErrors).find((error) => error !== "");
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

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
    form.append("description", formData.description || "");
    form.append("image", formData.avatar);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/stores/register`;
      const res = await axios.post(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.status === "success") {
        // Tạo user trong chat system ngay sau khi đăng ký thành công
        if (res.data?.token && res.data?.data?.user) {
          const storeData = res.data.data.user;
          const storeName = storeData.name || storeData.email || "Store";
          const storeId = storeData.id;

          try {
            await chatService.createUser(storeId, storeName);
            console.log("Store đã được tạo trong chat system");
          } catch (chatError) {
            console.warn(
              "Không thể tạo store trong chat system:",
              chatError
            );
            // Không hiển thị lỗi cho user vì đây không phải lỗi critical
          }
        }

        toast.success("Đăng ký thành công!");
        setTimeout(() => {
          navigate("/seller/login");
        }, 1500);
      } else {
        toast.error(res.data?.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      toast.error(errorMessage);
      console.log(err?.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#116AD1] text-white flex flex-col sm:flex-row items-center justify-between px-4 md:px-10 py-4 md:py-6 gap-2 sm:gap-0">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <img src={logo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="font-bold text-xl md:text-2xl">KOHI MALL</span>
        </Link>
        <h1 className="text-base md:text-xl font-semibold text-center">ĐĂNG KÝ LÀ NGƯỜI BÁN</h1>
        <Link to="/contact" className="cursor-pointer hover:underline text-xs md:text-sm">
          Hỗ trợ?
        </Link>
      </header>

      {/* Form container */}
      <div className="flex flex-1 justify-center items-center p-3 md:p-6 bg-gray-100">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-4 md:p-8">

          <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>

            <div>
              <TextField
                label="Căn cước công dân"
                name="cccd"
                value={formData.cccd}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.cccd}
                helperText={errors.cccd}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Ảnh mặt trước căn cước công dân"
                name="cccd_front"
                type="file"
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.cccd_front}
                helperText={errors.cccd_front}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Ảnh đại diện"
                name="avatar"
                type="file"
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.avatar}
                helperText={errors.avatar}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Tên cửa hàng"
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.store_name}
                helperText={errors.store_name}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Xác nhận mật khẩu"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.confirm_password}
                helperText={errors.confirm_password}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Ngân hàng"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.bank_name}
                helperText={errors.bank_name}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Số tài khoản"
                name="bank_account_number"
                value={formData.bank_account_number}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.bank_account_number}
                helperText={errors.bank_account_number}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Chủ tài khoản"
                name="bank_account_holder_name"
                value={formData.bank_account_holder_name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.bank_account_holder_name}
                helperText={errors.bank_account_holder_name}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Thành phố"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.city}
                helperText={errors.city}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Xã/Phường"
                name="village"
                value={formData.village}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.village}
                helperText={errors.village}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Địa chỉ chi tiết"
                name="detail_address"
                value={formData.detail_address}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                size="small"
                error={!!errors.detail_address}
                helperText={errors.detail_address}
                fullWidth
              />
            </div>
            <TextField
              label="Mô tả cửa hàng"
              className="col-span-2"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              size="small"
              sx={{
                    '& .MuiInputBase-inputMultiline': {
                  // Cho phép ngắt dòng khi nội dung vượt quá chiều rộng
                      wordBreak: 'break-word',
                  // Disable thuộc tính white-space nếu nó đang ngăn cản ngắt dòng
                      whiteSpace: 'pre-wrap',
                    }
              }}
            />

            {/* Button submit spanning 2 columns */}
            <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-4">
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterToSeller;