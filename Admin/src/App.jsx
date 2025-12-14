import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import "./App.css";

import AdminLogin from "./page/AdminLogin";
import AdminHeader from "./component/AdminHeader";
import AdminSidebar from "./component/AdminSidebar";
import Dashboard from "./page/Dashboard";
import UserManagement from "./page/UserManagement";
import ProductApproval from "./page/ProductApproval";
import Complaints from "./page/Complaints";
import Violations from "./page/Violations";
import CreateAccount from "./page/CreateAccount";
import ShipperManagement from "./page/ShipperManagement";
import StoreManagement from "./page/StoreManagement";
import ShipperProfileDetail from "./page/ShipperProfileDetail";
import CreateCoupon from "./page/CreateCoupon";
import CreateCategory from "./page/CreateCategory";
import Banners from "./page/Banners";
import PendingShipperList from "./page/PendingShipperList";
import PendingStoreList from "./page/PendingStoreList";
import StoreProfileDetail from "./page/StoreProfileDetail";
import ProfileDetail from "./page/ProfileDetail";
import ChatManagement from "./page/ChatManagement";
import Wallet from "./page/Wallet";
import PaymentSuccess from "./page/PaymentSuccess";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    JSON.parse(localStorage.getItem("isSidebarOpen")) ?? true
  );

  //  Lưu trạng thái sidebar mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Route bảo vệ
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("adminToken");
    return token ? children : <Navigate to="/" replace />;
  };

  return (
    <Routes>
      {/*  Nếu đã đăng nhập thì chặn quay lại trang login */}
      <Route
        path="/"
        element={
          localStorage.getItem("adminToken") ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AdminLogin />
          )
        }
      />

      {/*  Layout chính */}
      <Route
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen overflow-hidden">
              {/* Sidebar */}
              <AdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />

              {/* Nội dung chính */}
              <div
                className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
                  isSidebarOpen ? "ml-64" : "ml-16"
                }`}
              >
                <AdminHeader
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <main className="flex-1 px-2 py-6">
                  <Outlet />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/product-approval" element={<ProductApproval />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/violations" element={<Violations />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/shippers-management" element={<ShipperManagement />} />
        <Route path="/stores-management" element={<StoreManagement />} />
        <Route
          path="/shipper/profile-detail/:id"
          element={<ShipperProfileDetail />}
        />
        <Route path="/banners" element={<Banners />} />
        <Route path="/create-coupon" element={<CreateCoupon />} />
        <Route path="/create-category" element={<CreateCategory />} />
        <Route path="/list-pending-shipper" element={<PendingShipperList />} />
        <Route path="/list-pending-store" element={<PendingStoreList />} />
        <Route
          path="/store/profile-detail/:id"
          element={<StoreProfileDetail />}
        />
        <Route path="/profile-detail" element={<ProfileDetail />} />
        <Route path="/chat-management" element={<ChatManagement />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Route>
    </Routes>
  );
}

export default App;