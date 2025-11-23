import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import Home from "./page/customer/Home";
import Register from "./page/customer/Register";
import Login from "./page/customer/Login";
import RegisterToSeller from "./page/customer/RegisterToSeller";
import ProductDetail from "./page/customer/ProductDetail";
import Cart from "./page/customer/Cart";
import PlaceOrder from "./page/customer/PlaceOrder";
import Payment from "./page/customer/Payment";
import Orders from "./page/customer/Orders";
import Profile from "./page/customer/Profile";
import UserProfile from "./page/customer/UserProfile";
import StoreProfile from "./page/customer/StoreProfile";
import EditProfile from "./page/customer/EditProfile";
import FollowedShops from "./page/customer/FollowedShops";
import ExchangeRequest from "./page/customer/ExchangeRequest";
import Contact from "./page/customer/Contact";
import About from "./page/customer/About";
import OrderDetail from "./page/customer/OrderDetail";
import PrivacyPolicy from "./page/customer/PrivacyPolicy";
import TermsOfUse from "./page/customer/TermsOfUse";
import ForgotPassword from "./page/customer/ForgotPassword";
import Wallet from "./page/customer/Wallet"
import PaymentSuccess from "./page/customer/paymentsuccess";

import ListProduct from "./page/seller/ListProduct";
import AddProduct from "./page/seller/AddProduct";
import EditProduct from "./page/seller/EditProduct";
import EditProfileSeller from "./page/seller/EditProfileSeller";
import EditUser from "./page/seller/EditUser";
import Finance from "./page/seller/Finance";
import OrdersSeller from "./page/seller/OrdersSeller";
import Rating from "./page/seller/Rating";
import SalesReport from "./page/seller/SalesReport";
import OrderDetailSeller from "./page/seller/OrderDetailSeller";
import AddCoupon from "./page/seller/AddCoupon";
import LoginSeller from "./page/seller/LoginSeller";
import SellerHeader from "./component-seller-page/SellerHeader";
import SellerSidebar from "./component-seller-page/SellerSidebar";
import WalletSeller from "./page/seller/Wallet"
import Chat from "./page/seller/Chat";

import { ToastContainer } from "react-toastify";
import ShopContextProvider from "./context/ShopContext";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    JSON.parse(localStorage.getItem("isSidebarOpen")) ?? true
  );

  // Lưu trạng thái sidebar mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Route bảo vệ cho seller
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("sellerToken");
    return token ? children : <Navigate to="/seller/login" replace />;
  };

  return (
    <>
      <Routes>
        {/* ---------- CUSTOMER ROUTES ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-to-seller" element={<RegisterToSeller />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/store/:storeId" element={<StoreProfile />} />
        <Route path="/update-profile" element={<EditProfile />} />
        <Route path="/followed-shops" element={<FollowedShops />} />
        <Route path="/exchange-request" element={<ExchangeRequest />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/order-detail" element={<OrderDetail />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/wallet/success" element={<PaymentSuccess />} />


        {/* ---------- SELLER ROUTES ---------- */}
        {/* Nếu đã đăng nhập, chặn truy cập lại trang login */}
        <Route
          path="/seller/login"
          element={
            localStorage.getItem("sellerToken") ? (
              <Navigate to="/seller/orders" replace />
            ) : (
              <LoginSeller />
            )
          }
        />

        {/* Layout chính cho Seller */}
        <Route
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-100 overflow-hidden">
                {/* Sidebar */}
                <SellerSidebar
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Nội dung chính */}
                <div
                  className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-16"
                    }`}
                >
                  <SellerHeader
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                  <main className="flex-1 px-2 py-4">
                    <Outlet />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        >
          <Route path="/seller/orders" element={<OrdersSeller />} />
          <Route path="/seller/list-product" element={<ListProduct />} />
          <Route path="/seller/add-product" element={<AddProduct />} />
          <Route path="/seller/add-coupon" element={<AddCoupon />} />
          <Route path="/seller/update-product" element={<EditProduct />} />
          <Route path="/seller/edit-profile" element={<EditProfileSeller />} />
          <Route path="/seller/edit-user" element={<EditUser />} />
          <Route path="/seller/finance" element={<Finance />} />
          <Route path="/seller/rating" element={<Rating />} />
          <Route path="/seller/sales-report" element={<SalesReport />} />
          <Route path="/seller/wallet" element={<WalletSeller />} />
          <Route path="/seller/order-detail" element={<OrderDetailSeller />} />
          <Route path="/seller/chat" element={<Chat />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
