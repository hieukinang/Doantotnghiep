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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/product-approval" element={<ProductApproval />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/violations" element={<Violations />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
