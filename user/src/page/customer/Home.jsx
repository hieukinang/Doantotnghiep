import React from "react";
import { Link } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import Banner from "../../component-home-page/Banner";
import Categories from "../../component-home-page/Category";
import DealsToday from "../../component-home-page/DealsToday";
import SystemChatBox from "../../component-home-page/SystemChatBox";
// import Suggestions from "../../component-home-page/Suggestions";


const format = (v) => v.toLocaleString("vi-VN");

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <Banner />

        {/* Danh mục */}
        <Categories />

        {/* Deal nổi bật */}
        <DealsToday />

        {/* Gợi ý hôm nay */}
        {/* <Suggestions products={products} /> */}
      </main>
      <Footer />
      {/* Chat với hệ thống - Floating button */}
      <SystemChatBox />
    </div>
  );
};

export default Home;
