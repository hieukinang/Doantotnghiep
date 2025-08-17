import React from 'react'
import Header from './component/Header'
import Footer from './component/Footer'
import Home from './pages/customer/Home'
import Register from './pages/customer/Register'
import Login from './pages/customer/Login'
import RegisterToSeller from './pages/customer/RegisterToSeller'
import ProductDetail from './pages/customer/ProductDetail'
import Cart from './pages/customer/Cart'
import PlaceOrder from './pages/customer/PlaceOrder'
import Payment from './pages/customer/Payment'
import Orders from './pages/customer/Orders'
import Profile from './pages/customer/Profile'
import EditProfile from './pages/customer/EditProfile'
import FollowedShops from './pages/customer/FollowedShops'
import ExchangeRequest from './pages/customer/ExchangeRequest'
import Contact from './pages/customer/Contact'
import About from './pages/customer/About'
import AddDeleteProduct from './pages/seller/AddDeleteProduct'
import EditProduct from './pages/seller/EditProduct'
import EditProfileSeller from './pages/seller/EditProfileSeller'
import EditUser from './pages/seller/EditUser'
import Finance from './pages/seller/Finance'
import OrdersSeller from './pages/seller/OrdersSeller'
import Rating from './pages/seller/Rating'
import SalesReport from './pages/seller/SalesReport'

function App() {
  return (
    <div>
      {/* <ProductDetail /> */}
      {/* <main className="pt-32 px-5 flex-1">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome to KOHI MALL
        </h1>
        <p className="text-center text-gray-600 mt-4">
          Header đã được hiển thị thành công!
        </p>
      </main> */}
      <Home />
      {/* <Register />
      <Login />
      <RegisterToSeller /> */}
      {/* <Cart /> */}
      {/* <PlaceOrder /> */}
      {/* <Payment /> */}
      {/* <Orders /> */}
      {/* <Profile /> */}
      {/* <EditProfile /> */}
      {/* <FollowedShops /> */}
      {/* <ExchangeRequest /> */}
      {/* <Contact /> */}
      {/* <About /> */}


      {/* Cho Seller */}
      {/* <AddDeleteProduct /> */}
      {/* <EditProduct /> */}
      {/* <EditProfileSeller /> */}
      {/* <EditUser /> */}
      {/* <Finance /> */}
      {/* <OrdersSeller /> */}
      {/* <Rating /> */}
      {/* <SalesReport /> */}
    </div>
  )
}

export default App;