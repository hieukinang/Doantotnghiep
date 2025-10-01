
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/home/logo.svg";
import cartIcon from "../assets/home/cart.svg";
import languageIcon from "../assets/language.svg";
import searchIcon from "../assets/home/search.svg";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  React.useEffect(() => {
    // Kiểm tra token đăng nhập client
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    setIsLoggedIn(!!token);
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setUsername(user.username || "Người dùng");
      } catch {
        setUsername("Người dùng");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/products?search=${searchQuery}`
      );
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Lỗi khi tìm sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-[#116AD1]">
      {/* Top Header Bar */}
      <div className="py-2">
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
          <div className="flex gap-5">
            <Link to="/seller" className="text-white text-sm hover:opacity-80">
              Vào kênh người bán
            </Link>
            <Link
              to="/register-to-seller"
              className="text-white text-sm hover:opacity-80 transition-opacity"
            >
              Đăng ký là người bán
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <img src={languageIcon} alt="Language" className="h-4 w-auto" />
              <select
                defaultValue="vi"
                className="bg-transparent text-white text-sm rounded px-2 py-1 focus:outline-none "
              >
                <option value="vi" className="text-black border-0">
                  Tiếng Việt
                </option>
                <option value="en" className="text-black border-0">
                  English
                </option>
              </select>
            </div>
            {!isLoggedIn ? (
              <>
                <Link
                  to="/register"
                  className="text-white text-sm hover:opacity-80 transition-opacity"
                >
                  Đăng ký
                </Link>
                <Link
                  to="/login"
                  className="text-white text-sm hover:opacity-80 transition-opacity"
                >
                  Đăng nhập
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="text-white text-sm hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
                >
                  Đăng xuất
                </button>
                <Link
                  to="/update-profile"
                  className="text-white text-sm hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
                >
                  Tôi
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="py-4 shadow-md pt-0 pb-[10px] relative">
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="KOHI MALL Logo" className="h-8 w-auto" />
              <h1 className="text-2xl font-bold text-white tracking-wide m-0">
                KOHI MALL
              </h1>
            </Link>
          </div>

          {/* Search Box */}
          <div className="flex-1 bg-white max-w-4xl h-auto border border-gray-300 rounded-lg p-1 items-center relative">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                placeholder="Tìm kiếm ngay"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border-none rounded-l-md text-base outline-none bg-white placeholder-gray-400"
              />
              <button type="submit" className="px-4 bg-[#116AD1] rounded-r-md">
                <img
                  src={searchIcon}
                  alt="Search"
                  className="h-5 w-5 text-white"
                />
              </button>
            </form>

            {/* Hiển thị kết quả tìm kiếm */}
            {searchQuery && (
              <div className="absolute left-0 top-full w-full bg-white border rounded-lg shadow-md mt-1 max-h-80 overflow-y-auto z-50">
                {loading ? (
                  <p className="p-3 text-gray-500 text-sm">Đang tìm...</p>
                ) : products.length === 0 ? (
                  <p className="p-3 text-gray-500 text-sm">
                    Không tìm thấy sản phẩm
                  </p>
                ) : (
                  products.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 transition"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-sm font-medium">{p.name}</h3>
                        <p className="text-[#116AD1] font-semibold text-sm">
                          ₫{p.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <Link to="/cart">
              <img
                src={cartIcon}
                alt="Shopping Cart"
                className="h-6 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
