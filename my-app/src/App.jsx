import React from 'react'
import Header from './component/Header'
import Footer from './component/Footer'
import Home from './page/customer/Home'
import Register from './page/customer/Register'
import Login from './page/customer/Login'

function App() {
  return (
    <div>
      {/* <Header />
      <main className="pt-32 px-5 flex-1">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome to KOHI MALL
        </h1>
        <p className="text-center text-gray-600 mt-4">
          Header đã được hiển thị thành công!
        </p>
      </main>
      <Footer /> */}
      {/* <Home /> */}
      {/* <Register /> */}
      <Login />
    </div>
  )
}

export default App
