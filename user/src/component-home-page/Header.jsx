import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import logo from "../assets/home/logo.svg";
import cartIcon from "../assets/home/cart.svg";
import languageIcon from "../assets/language.svg";
import searchIcon from "../assets/home/search.svg";
import walletIcon from "../assets/home/icon_wallet.svg";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const {
    backendURL,
    clientToken,
    clientUsername,
    handleClientLogout,
    cartCount,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  const handleDetailProfile = () => {
    navigate("/update-profile");
    setIsToggleOpen(false);
  };

  const handleGetOrder = () => {
    navigate("/my-order");
    setIsToggleOpen(false);
  };

  const handleGetFollowedShop = () => {
    navigate("/followed-shops");
    setIsToggleOpen(false);
  }

  const handleGetFavorites = () => {
    navigate("/favorites");
    setIsToggleOpen(false);
  }

  const handleCreateComplaint = () => {
    navigate("/create-complaint");
    setIsToggleOpen(false);
  }

  // Tìm kiếm và hiển thị dropdown
  const handleSearchInput = async (value) => {
    setSearchQuery(value);
    
    if (!value.trim()) {
      setShowDropdown(false);
      return;
    }

    try {
      setLoading(true);
      setShowDropdown(true);

      const [productRes, storeRes] = await Promise.all([
        axios.get(
          `http://127.0.0.1:5000/api/products?nameString=${value}&page=1`
        ),
        axios.get(
          `http://127.0.0.1:5000/api/stores/search?name=${value}&page=1`
        ),
      ]);

      const productData = productRes.data?.data?.products || [];
      const storeData = storeRes.data?.data || [];

      setProducts(productData.slice(0, 5)); // Hiển thị tối đa 5 kết quả
      setStores(storeData.slice(0, 5));
    } catch (err) {
      console.error("❌ Lỗi khi tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit form -> chuyển sang trang kết quả
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Đóng dropdown khi click ra ngoài
  const handleClickOutside = () => {
    setShowDropdown(false);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-[#116AD1]">
      {/* Thanh trên cùng - Ẩn trên mobile */}
      <div className="py-2 hidden md:block">
        <div className="mx-4 lg:mx-[100px] px-5 flex justify-between items-center">
          <div className="flex gap-5">
            <Link to="/seller/login" className="text-white text-sm hover:opacity-80">
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
                className="bg-transparent text-white text-sm rounded px-2 py-1 focus:outline-none"
              >
                <option value="vi" className="text-black border-0">
                  Tiếng Việt
                </option>
                <option value="en" className="text-black border-0">
                  English
                </option>
              </select>
            </div>

            {!clientToken ? (
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
                  onClick={handleClientLogout}
                  className="text-white text-sm hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
                >
                  Đăng xuất
                </button>

                <div className="relative">
                  <button
                    onClick={handleToggle}
                    className="flex items-center text-white"
                  >
                    Tôi
                  </button>

                  {isToggleOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-white rounded-lg shadow-lg text-gray-700 z-50">
                      <button
                        onClick={handleDetailProfile}
                        className="block w-full text-center px-4 py-2 hover:bg-[#116AD1] hover:text-white hover:rounded-t-lg"
                      >
                        Cập nhật hồ sơ
                      </button>
                      <button
                        onClick={handleGetOrder}
                        className="block w-full text-center px-4 py-2 hover:bg-[#116AD1] hover:text-white hover:rounded-t-lg"
                      >
                        Đơn hàng của tôi
                      </button>
                      <button
                        onClick={handleGetFollowedShop}
                        className="block w-full text-center px-4 py-2 hover:bg-[#116AD1] hover:text-white hover:rounded-t-lg"
                      >
                        Đang theo dõi
                      </button>
                      <button
                        onClick={handleGetFavorites}
                        className="block w-full text-center px-4 py-2 hover:bg-[#116AD1] hover:text-white hover:rounded-t-lg"
                      >
                        Yêu thích
                      </button>
                      <button
                        onClick={handleCreateComplaint}
                        className="block w-full text-center px-4 py-2 hover:bg-[#116AD1] hover:text-white hover:rounded-t-lg"
                      >
                        Khiếu nại
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="py-3 md:py-4 shadow-md pt-2 md:pt-0 pb-[10px] relative">
        <div className="mx-4 lg:mx-[100px] px-2 md:px-5 flex items-center justify-between gap-2 md:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img src={logo} alt="KOHI MALL Logo" className="h-6 md:h-8 w-auto" />
            <h1 className="text-lg md:text-2xl font-bold text-white tracking-wide hidden sm:block">
              KOHI MALL
            </h1>
          </Link>

          {/* SEARCH BAR - Ẩn trên mobile, hiện trên tablet+ */}
          <div className="hidden md:flex flex-1 bg-white max-w-[50%] border rounded-lg p-1 items-center relative">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm hoặc cửa hàng..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => searchQuery && setShowDropdown(true)}
                className="flex-1 px-4 py-2 border-none text-base outline-none bg-white placeholder-gray-400"
              />
              <button type="submit" className="px-4 bg-[#116AD1] rounded-r-md">
                <img src={searchIcon} alt="Search" className="h-5 w-5" />
              </button>
            </form>

            {/* SEARCH RESULT DROPDOWN */}
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={handleClickOutside}
                ></div>
                <div className="absolute left-0 top-full w-full bg-white border rounded-lg shadow-md mt-1 max-h-80 overflow-y-auto z-50">
                  {loading ? (
                    <p className="p-3 text-gray-500 text-sm">Đang tìm...</p>
                  ) : (
                    <>
                      {/* SẢN PHẨM */}
                      <h3 className="px-3 py-2 font-semibold text-gray-700 bg-gray-100 border-b">
                        Sản phẩm
                      </h3>

                      {products.length === 0 ? (
                        <p className="p-3 text-gray-500 text-sm">
                          Không có sản phẩm
                        </p>
                      ) : (
                        <>
                          {products.map((p) => (
                            <Link
                              key={p.id}
                              to={`/product/${p.id}`}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 p-3 hover:bg-gray-100 transition"
                            >
                              <img
                                src={p.main_image}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <h3 className="text-sm font-medium">{p.name}</h3>
                                <p className="text-[#116AD1] font-semibold text-sm">
                                  ₫{p.min_price?.toLocaleString()}
                                </p>
                              </div>
                            </Link>
                          ))}
                          <button
                            onClick={handleSearch}
                            className="w-full p-2 text-center text-[#116AD1] hover:bg-gray-50 text-sm font-medium"
                          >
                            Xem tất cả sản phẩm
                          </button>
                        </>
                      )}

                      {/* CỬA HÀNG */}
                      <h3 className="px-3 py-2 font-semibold text-gray-700 bg-gray-100 border-b mt-2">
                        Cửa hàng
                      </h3>

                      {stores.length === 0 ? (
                        <p className="p-3 text-gray-500 text-sm">
                          Không có cửa hàng
                        </p>
                      ) : (
                        <>
                          {stores.map((s) => (
                            <Link
                              key={s.store.id}
                              to={`/store/${s.store.id}`}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 p-3 hover:bg-gray-100 transition"
                            >
                              <img
                                src={s.store.image || "/default-store.png"}
                                alt={s.store.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <h3 className="text-sm font-medium">{s.store.name}</h3>
                                <p className="text-xs text-gray-500">
                                  {s.store.detail_address}, {s.store.village}
                                </p>
                              </div>
                            </Link>
                          ))}
                          <button
                            onClick={handleSearch}
                            className="w-full p-2 text-center text-[#116AD1] hover:bg-gray-50 text-sm font-medium"
                          >
                            Xem tất cả cửa hàng
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Wallet + Cart */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/wallet">
              <img
                src={walletIcon}
                alt="Wallet"
                className="h-6 md:h-7 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>

            <Link to="/cart" className="relative inline-block">
              <img
                src={cartIcon}
                alt="Shopping Cart"
                className="h-5 md:h-6 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mx-4 mt-2 relative">
          <form onSubmit={handleSearch} className="flex w-full bg-white rounded-lg p-1">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchQuery && setShowDropdown(true)}
              className="flex-1 px-3 py-2 border-none text-sm outline-none bg-white placeholder-gray-400"
            />
            <button type="submit" className="px-3 bg-[#116AD1] rounded-r-md">
              <img src={searchIcon} alt="Search" className="h-4 w-4" />
            </button>
          </form>

          {/* Mobile Search Dropdown */}
          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={handleClickOutside}
              ></div>
              <div className="absolute left-0 top-full w-full bg-white border rounded-lg shadow-md mt-1 max-h-[60vh] overflow-y-auto z-50">
                {loading ? (
                  <p className="p-3 text-gray-500 text-xs">Đang tìm...</p>
                ) : (
                  <>
                    {/* SẢN PHẨM */}
                    <h3 className="px-3 py-2 font-semibold text-gray-700 bg-gray-100 border-b text-xs">
                      Sản phẩm
                    </h3>

                    {products.length === 0 ? (
                      <p className="p-3 text-gray-500 text-xs">
                        Không có sản phẩm
                      </p>
                    ) : (
                      <>
                        {products.map((p) => (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 transition"
                          >
                            <img
                              src={p.main_image}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs font-medium line-clamp-1">{p.name}</h3>
                              <p className="text-[#116AD1] font-semibold text-xs">
                                ₫{p.min_price?.toLocaleString()}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <button
                          onClick={handleSearch}
                          className="w-full p-2 text-center text-[#116AD1] hover:bg-gray-50 text-xs font-medium"
                        >
                          Xem tất cả sản phẩm
                        </button>
                      </>
                    )}

                    {/* CỬA HÀNG */}
                    <h3 className="px-3 py-2 font-semibold text-gray-700 bg-gray-100 border-b mt-1 text-xs">
                      Cửa hàng
                    </h3>

                    {stores.length === 0 ? (
                      <p className="p-3 text-gray-500 text-xs">
                        Không có cửa hàng
                      </p>
                    ) : (
                      <>
                        {stores.map((s) => (
                          <Link
                            key={s.store.id}
                            to={`/store/${s.store.id}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 transition"
                          >
                            <img
                              src={s.store.image || "/default-store.png"}
                              alt={s.store.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs font-medium line-clamp-1">{s.store.name}</h3>
                              <p className="text-[10px] text-gray-500 line-clamp-1">
                                {s.store.detail_address}, {s.store.village}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <button
                          onClick={handleSearch}
                          className="w-full p-2 text-center text-[#116AD1] hover:bg-gray-50 text-xs font-medium"
                        >
                          Xem tất cả cửa hàng
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[120px] bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <nav className="p-4 space-y-2">
              <Link to="/seller/login" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                Vào kênh người bán
              </Link>
              <Link to="/register-to-seller" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                Đăng ký là người bán
              </Link>
              <div className="h-px bg-gray-200 my-2" />
              {!clientToken ? (
                <>
                  <Link to="/register" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                    Đăng ký
                  </Link>
                  <Link to="/login" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/update-profile" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                    Cập nhật hồ sơ
                  </Link>
                  <Link to="/my-order" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                    Đơn hàng của tôi
                  </Link>
                  <Link to="/followed-shops" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                    Đang theo dõi
                  </Link>
                  <Link to="/favorites" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                    Yêu thích
                  </Link>
                  <Link to="/create-complaint" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                    Khiếu nại
                  </Link>
                  <div className="h-px bg-gray-200 my-2" />
                  <button
                    onClick={() => { handleClientLogout(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-2 px-4 text-red-600 hover:bg-gray-100 rounded"
                  >
                    Đăng xuất
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;