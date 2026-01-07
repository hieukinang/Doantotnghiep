import React from "react";
import { Link } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";
import Banner from "../../component-home-page/Banner";
import Categories from "../../component-home-page/Category";
import DealsToday from "../../component-home-page/DealsToday";
import TopSold from "../../component-home-page/TopSold";
import TopDiscount from "../../component-home-page/TopDiscount";
import RanDom from "../../component-home-page/RandomProduct";
import ChatBox from "../../component-home-page/ChatBox";
// import Suggestions from "../../component-home-page/Suggestions";


const format = (v) => v.toLocaleString("vi-VN");

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <Banner />

        {/* Danh mục */}
        <Categories />

        {/* Deal nổi bật */}
        <DealsToday />

        <TopSold />

        <TopDiscount />

        <RanDom />

      </main>
      <Footer />
      <ChatBox />
    </div>
  );
};

export default Home;
