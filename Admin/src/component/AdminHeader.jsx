import React, {useState, useEffect, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/home/logo.svg";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const AdminHeader = () => {
  const PRIMARY_COLOR = "#116AD1";
  const url = `${import.meta.env.VITE_BACKEND_URL}/admins/logout`;
  ;

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen);
  };


  const handleDetailProfile = () => {
    navigate("/profile-detail");
    setIsToggleOpen(false);
  };



  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        url,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUsername");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsToggleOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-6 z-50"
      style={{ backgroundColor: PRIMARY_COLOR }}
    >
      {/* Left Section - Logo & Toggle Menu Button */}
      <div className="flex items-center">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-2 text-white text-xl font-bold">
          <img src={Logo} alt="KOHI Logo" className="h-8 w-auto" />
          <span>KOHI ADMIN</span>
        </div>
      </div>

      {/* Center Section - Search Bar */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-md">
          <div className="flex rounded-lg overflow-hidden border border-white">
            <input
              type="text"
              placeholder="Tìm kiếm trong hệ thống..."
              className="w-full px-4 py-2 text-gray-800 focus:outline-none"
            />
            <button
              className="px-4 py-2 text-white hover:bg-blue-800 transition duration-200"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <SearchIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - User Info & Logout */}
      <div className="flex items-center text-white space-x-4">
        <span className="text-sm font-medium">
          {`Xin chào ${localStorage.getItem("adminUsername") || "Admin"}`}
        </span>
        <div ref={menuRef} className="relative">
          <button onClick={handleToggle} className="flex items-center">
            <HomeIcon />
          </button>

          {isToggleOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg text-gray-700 z-50">
              {/* <button
                onClick={handleDetailProfile}
                className="block w-full text-center px-4 py-2 hover:bg-[#116AD1] hover:text-white hover:rounded-t-lg"
              >
                Trang cá nhân
              </button> */}

              <button
                onClick={handleLogout}
                className="block w-full text-center px-4 py-2 hover:bg-[#116AD1] hover:text-white hover:rounded-b-lg"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;