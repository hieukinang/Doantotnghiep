import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route
        element={
          <div className="min-h-screen">
            <AdminHeader
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />

            <AdminSidebar isSidebarOpen={isSidebarOpen} />

            <main
              style={{
                marginLeft: isSidebarOpen ? "16rem" : "4rem",
                marginTop: "0rem",
                minHeight: "calc(100vh - 4rem)",
                padding: "1.5rem",
              }}
            >
              <Outlet />
            </main>
          </div>
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
      </Route>
    </Routes>
  );
}

export default App;
