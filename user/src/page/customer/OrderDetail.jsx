import React from "react";
import { Link } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";

const OrderDetail = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4 md:p-5">
          {/* Trạng thái đơn */}
          <div className="border-b pb-3 mb-4">
            <h2 className="text-base md:text-lg font-semibold text-[#116AD1]">
              Đơn hàng đã hoàn thành
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Hoàn thành lúc: 11-09-2025 19:26
            </p>
          </div>

          {/* Thông tin nhận hàng */}
          <div className="mb-4 md:mb-5">
            <h3 className="font-semibold text-gray-700 mb-1 text-sm md:text-base">Địa chỉ nhận hàng</h3>
            <p className="text-xs md:text-sm text-gray-800">
              Nguyễn Văn A - 0123456789
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              10000000 Hà Nội
            </p>
          </div>

          {/* Sản phẩm */}
          <div className="border rounded-lg overflow-hidden mb-4 md:mb-5">
            <div className="flex p-3 md:p-4 border-b">
              <img
                src="https://cf.shopee.vn/file/sg-11134201-22110-8f2t4ksj0kjv2e"
                alt="product"
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded"
              />
              <div className="ml-3 md:ml-4 flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-sm md:text-base line-clamp-2">
                  [VB] Combo 2 Sữa rửa mặt dưỡng trắng Hada Labo
                </h4>
                <p className="text-xs md:text-sm text-gray-500 mt-1">x1</p>
              </div>
              <div className="text-right ml-2 flex-shrink-0">
                <div className="text-xs md:text-sm line-through text-gray-400">₫191.000</div>
                <div className="text-[#116AD1] font-semibold text-sm md:text-base">₫155.000</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 md:p-4 text-xs md:text-sm gap-1">
              <span className="text-gray-500">[QUÀ TẶNG KHÔNG BÁN] Hada Labo Lotion 20ml</span>
              <span className="text-gray-400">Quà tặng</span>
            </div>
          </div>

          {/* Thành tiền */}
          <div className="flex justify-between items-center border-t pt-3 pb-4 mb-4">
            <span className="font-medium text-gray-600 text-sm md:text-base">Thành tiền</span>
            <span className="text-base md:text-lg font-bold text-[#116AD1]">₫65.950</span>
          </div>

          {/* Mã đơn */}
          <div className="border-t pt-4 text-xs md:text-sm text-gray-600 space-y-1">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span>Mã đơn hàng</span>
              <span className="font-medium">2509091EYKXW8U</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span>Phương thức thanh toán</span>
              <span className="font-medium">Thanh toán khi nhận hàng</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span>Thời gian đặt hàng</span>
              <span>09-09-2025 00:07</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span>Thời gian thanh toán</span>
              <span>11-09-2025 16:42</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span>Thời gian hoàn thành đơn</span>
              <span>11-09-2025 19:26</span>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
            <Link
              to="/product/:productId"
              className="px-4 py-2 border border-[#116AD1] text-[#116AD1] rounded hover:bg-[#116AD1]/10 text-center text-sm md:text-base"
            >
              Xem đánh giá
            </Link>
            <Link
              to="/exchange-request"
              className="px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa] text-center text-sm md:text-base"
            >
              Yêu cầu Trả hàng / Hoàn tiền
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
