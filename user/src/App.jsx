import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './component/Header'
import Footer from './component/Footer'
import Home from './page/customer/Home'
import Register from './page/customer/Register'
import Login from './page/customer/Login'
import RegisterToSeller from './page/customer/RegisterToSeller'
import ProductDetail from './page/customer/ProductDetail'
import Cart from './page/customer/Cart'
import PlaceOrder from './page/customer/PlaceOrder'
import Payment from './page/customer/Payment'
import Orders from './page/customer/Orders'
import Profile from './page/customer/Profile'
import EditProfile from './page/customer/EditProfile'
import FollowedShops from './page/customer/FollowedShops'
import ExchangeRequest from './page/customer/ExchangeRequest'
import Contact from './page/customer/Contact'
import About from './page/customer/About'
import AddDeleteProduct from './page/seller/AddDeleteProduct'
import EditProduct from './page/seller/EditProduct'
import EditProfileSeller from './page/seller/EditProfileSeller'
import EditUser from './page/seller/EditUser'
import Finance from './page/seller/Finance'
import OrdersSeller from './page/seller/OrdersSeller'
import Rating from './page/seller/Rating'
import SalesReport from './page/seller/SalesReport'
import ForgotPassword from './page/customer/ForgotPassword'
import  ShopContextProvider  from './context/ShopContext'

function App() {
  return (
    <ShopContextProvider>
    <div>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-to-seller" element={<RegisterToSeller />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/followed-shops" element={<FollowedShops />} />
        <Route path="/exchange-request" element={<ExchangeRequest />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route  path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Seller Routes */}
        <Route path="/seller" element={<AddDeleteProduct />} />
        <Route path="/seller/add-delete-product" element={<AddDeleteProduct />} />
        <Route path="/seller/edit-product" element={<EditProduct />} />
        <Route path="/seller/edit-profile" element={<EditProfileSeller />} />
        <Route path="/seller/edit-user" element={<EditUser />} />
        <Route path="/seller/finance" element={<Finance />} />
        <Route path="/seller/orders" element={<OrdersSeller />} />
        <Route path="/seller/rating" element={<Rating />} />
        <Route path="/seller/sales-report" element={<SalesReport />} />
      </Routes>
    </div>
    </ShopContextProvider>
  )
}

export default App;