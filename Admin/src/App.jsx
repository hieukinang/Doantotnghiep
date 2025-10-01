import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import AdminLogin from './page/AdminLogin'
import AdminLayout from './component/AdminLayout'
import Dashboard from './page/Dashboard'
import UserManagement from './page/UserManagement'
import ProductApproval from './page/ProductApproval'
import Complaints from './page/Complaints'
import Violations from './page/Violations'
import CreateAccount from './page/CreateAccount'
import ShipperManagement from './page/ShipperManagement'
import StoreManagement from './page/StoreManagement'
import ShipperProfileDetail from './page/ShipperProfileDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route element={<AdminLayout />}> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/product-approval" element={<ProductApproval />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/violations" element={<Violations />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/shippers-management" element={<ShipperManagement />}/>
        <Route path="/stores-management" element={<StoreManagement />}/>
        <Route path="/shipper/profile-detail/:id" element={<ShipperProfileDetail />} />
      </Route>
    </Routes>
  )
}

export default App
