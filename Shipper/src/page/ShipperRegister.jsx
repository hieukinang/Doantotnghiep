import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/react.svg";

const ShipperRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idCard: '',
    city: '',
    district: '',
    address: '',
    vehicleType: 'motorcycle',
    licensePlate: '',
    password: '',
    confirmPassword: ''
  });

  const cities = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
    'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
    'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    console.log('Shipper registration:', formData);
    // Xử lý đăng ký shipper
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#116AD1] text-white flex items-center justify-between px-10 py-6">
        {/* Logo + tên */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-2xl">KOHI MALL</span>
        </Link>

        {/* Chữ ĐĂNG KÝ */}
        <h1 className="text-2xl font-bold">ĐĂNG KÝ SHIPPER</h1>

        {/* Hỗ trợ */}
        <Link to="/contact" className="cursor-pointer hover:underline text-base">
          Hỗ trợ
        </Link>
      </header>

      {/* Container chính */}
      <div className="flex flex-1 mt-5 justify-center items-center px-4">
        <div className="flex flex-col md:flex-row w-full md:w-[80%] max-w-5xl border border-gray-300 shadow-lg">
          {/* Left side - Hình ảnh */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4">
            <div className="text-center">
              <div className="text-8xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Trở thành Shipper</h3>
              <p className="text-gray-600">Tham gia đội ngũ giao hàng chuyên nghiệp</p>
            </div>
          </div>

          {/* Right side - Form đăng ký */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 border-t md:border-t-0 md:border-l border-gray-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Đăng ký tài khoản Shipper
            </h2>
            <p className="text-gray-500 mb-6">Điền thông tin chi tiết bên dưới</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Họ và tên"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="idCard"
                value={formData.idCard}
                onChange={handleChange}
                placeholder="Số CMND/CCCD"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Quận/Huyện"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Địa chỉ chi tiết"
                rows="3"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="motorcycle">Xe máy</option>
                <option value="bicycle">Xe đạp</option>
                <option value="car">Ô tô</option>
              </select>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                placeholder="Biển số xe"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
                className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700"
              >
                Đăng ký Shipper
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản shipper?{" "}
                <Link
                  to="/shipper/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Hoặc{" "}
                <Link
                  to="/"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Về trang chủ
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperRegister;