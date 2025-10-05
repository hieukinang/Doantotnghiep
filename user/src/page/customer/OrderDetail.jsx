import React from "react";
import { Link } from "react-router-dom";
import Header from "../../component-home-page/Header";
import Footer from "../../component-home-page/Footer";

const OrderDetail = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 px-4 flex-1">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-5">
          {/* Trạng thái đơn */}
          <div className="border-b pb-3 mb-4">
            <h2 className="text-lg font-semibold text-[#116AD1]">
              Đơn hàng đã hoàn thành
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hoàn thành lúc: 11-09-2025 19:26
            </p>
          </div>

          {/* Thông tin nhận hàng */}
          <div className="mb-5">
            <h3 className="font-semibold text-gray-700 mb-1">Địa chỉ nhận hàng</h3>
            <p className="text-sm text-gray-800">
              Nguyễn Văn A - 0123456789
            </p>
            <p className="text-sm text-gray-500">
              10000000 Hà Nội
            </p>
          </div>

          {/* Sản phẩm */}
          <div className="border rounded-lg overflow-hidden mb-5">
            <div className="flex p-4 border-b">
              <img
                src="https://cf.shopee.vn/file/sg-11134201-22110-8f2t4ksj0kjv2e"
                alt="product"
                className="w-20 h-20 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h4 className="font-medium text-gray-800">
                  [VB] Combo 2 Sữa rửa mặt dưỡng trắng Hada Labo
                </h4>
                <p className="text-sm text-gray-500 mt-1">x1</p>
              </div>
              <div className="text-right">
                <div className="text-sm line-through text-gray-400">₫191.000</div>
                <div className="text-[#116AD1] font-semibold">₫155.000</div>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 text-sm">
              <span className="text-gray-500">[QUÀ TẶNG KHÔNG BÁN] Hada Labo Lotion 20ml</span>
              <span className="text-gray-400">Quà tặng</span>
            </div>
          </div>

          {/* Thành tiền */}
          <div className="flex justify-between items-center border-t pt-3 pb-4 mb-4">
            <span className="font-medium text-gray-600">Thành tiền</span>
            <span className="text-lg font-bold text-[#116AD1]">₫65.950</span>
          </div>

          {/* Mã đơn */}
          <div className="border-t pt-4 text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Mã đơn hàng</span>
              <span className="font-medium">2509091EYKXW8U</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Phương thức thanh toán</span>
              <span className="font-medium">Thanh toán khi nhận hàng</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Thời gian đặt hàng</span>
              <span>09-09-2025 00:07</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Thời gian thanh toán</span>
              <span>11-09-2025 16:42</span>
            </div>
            <div className="flex justify-between">
              <span>Thời gian hoàn thành đơn</span>
              <span>11-09-2025 19:26</span>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 mt-6">
            <Link
              to="/product/:productId"
              className="px-4 py-2 border border-[#116AD1] text-[#116AD1] rounded hover:bg-[#116AD1]/10"
            >
              Xem đánh giá
            </Link>
            <Link
              to="/exchange-request"
              className="px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]"
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
