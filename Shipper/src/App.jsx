import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Import Shipper pages
import ShipperHeader from './component/ShipperHeader'
import ShipperSidebar from './component/ShipperSidebar'
import ShipperLogin from './page/ShipperLogin'
import ShipperRegister from './page/ShipperRegister'
import ShipperOrders from './page/ShipperOrders'
import ShipperUpdateStatus from './page/ShipperUpdateStatus'
import ShipperOrderDetail from './page/ShipperOrderDetail'
import ShipperDeliveryHistory from './page/ShipperDeliveryHistory'
import ShipperProfile from './page/ShipperProfile'

function App() {
  return (
      <div>
       <Routes>
        {/* Shipper Routes */}
        <Route path="/shipper/login" element={<ShipperLogin />} />
        <Route path="/shipper/register" element={<ShipperRegister />} />
        <Route path="/shipper/orders" element={<ShipperOrders />} />
        <Route path="/shipper/update-status/:orderId" element={<ShipperUpdateStatus />} />
        <Route path="/shipper/order-detail/:orderId" element={<ShipperOrderDetail />} />
        <Route path="/shipper/history" element={<ShipperDeliveryHistory />} />
        <Route path="/shipper/profile" element={<ShipperProfile />} />
        
        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/shipper/login" replace />} />
        <Route path="/shipper" element={<Navigate to="/shipper/orders" replace />} />
      </Routes>
      </div>
  )
}

export default App
