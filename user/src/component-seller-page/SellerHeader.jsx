// import React from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Logo from "../assets/home/logo.svg";
// import {
//   Search as SearchIcon,
//   // Menu as MenuIcon,
//   Logout as LogoutIcon,
// } from "@mui/icons-material";

// const SellerHeader = () => {
//   const PRIMARY_COLOR = "#116AD1";
//   const url = `${import.meta.env.VITE_BACKEND_URL}/stores/logout`;
//   ;


//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem("sellerToken");
//       await axios.post(
//         url,
//         {},
//         {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//           withCredentials: true,
//         }
//       );
//     } catch (error) {
//       console.error("Lỗi khi đăng xuất:", error);
//     } finally {
//       localStorage.removeItem("sellerToken");
//       localStorage.removeItem("storeName");
//       window.location.href = "/";
//     }
//   };

//   return (
//     <header
//       className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-6 z-50"
//       style={{ backgroundColor: PRIMARY_COLOR }}
//     >
//       {/* Left Section - Logo & Toggle Menu Button */}
//       <div className="flex items-center">
//         {/* <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 mr-4 transition duration-200 text-white"
//         >
//           <MenuIcon style={{ fontSize: 24 }} />
//         </button> */}

//         {/* Logo and Brand Name */}
//         <div className="flex items-center gap-2 text-white text-xl font-bold">
//           <img src={Logo} alt="KOHI Logo" className="h-8 w-auto" />
//           <span>KOHI SELLER</span>
//         </div>
//       </div>

//       {/* Center Section - Search Bar */}
//       <div className="flex-1 flex justify-center">
//         <div className="w-full max-w-md">
//           <div className="flex rounded-lg overflow-hidden border border-white">
//             <input
//               type="text"
//               placeholder="Tìm kiếm trong hệ thống..."
//               className="w-full px-4 py-2 text-gray-800 focus:outline-none"
//             />
//             <button
//               className="px-4 py-2 text-white hover:bg-blue-800 transition duration-200"
//               style={{ backgroundColor: PRIMARY_COLOR }}
//             >
//               <SearchIcon />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Right Section - User Info & Logout */}
//       <div className="flex items-center text-white space-x-4">
//         <span className="text-sm font-medium">
//           {`Xin chào ${localStorage.getItem("storeName") || "Store"}`}
//         </span>
//         <button
//           onClick={handleLogout}
//           className="flex items-center px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-150"
//         >
//           <span className="font-medium text-sm hidden sm:inline mr-2">
//             Đăng xuất
//           </span>
//           <LogoutIcon style={{ fontSize: 18 }} />
//         </button>
//       </div>
//     </header>
//   );
// };

// export default SellerHeader;

import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/home/logo.svg";
import {
  Search as SearchIcon,
  // Menu as MenuIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const SellerHeader = () => {
  const PRIMARY_COLOR = "#116AD1";
  const url = `${import.meta.env.VITE_BACKEND_URL}/stores/logout`;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("sellerToken");
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
      localStorage.removeItem("sellerToken");
      localStorage.removeItem("storeName");
      window.location.href = "/";
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-6 z-50"
      style={{ backgroundColor: PRIMARY_COLOR }}
    >
      {/* Left Section - Logo & Brand Name */}
      <div className="flex items-center">
        {/* <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 mr-4 transition duration-200 text-white"
        >
          <MenuIcon style={{ fontSize: 24 }} />
        </button> */}
        <div className="flex items-center gap-2 text-white text-xl font-bold">
          <img src={Logo} alt="KOHI Logo" className="h-8 w-auto" />
          <span>KOHI SELLER</span>
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
          {`Xin chào ${localStorage.getItem("storeName") || "Seller"}`}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-150"
        >
          <span className="font-medium text-sm hidden sm:inline mr-2">
            Đăng xuất
          </span>
          <LogoutIcon style={{ fontSize: 18 }} />
        </button>
      </div>
    </header>
  );
};

export default SellerHeader;