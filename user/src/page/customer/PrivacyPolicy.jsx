import React from "react";
import HeaderPolicy from "../../component-home-page/HeaderPolicy";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderPolicy />

      {/* Main Content */}
      <main className="flex justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 space-y-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-[#116AD1]">
            Chính sách bảo mật Shopee
          </h1>

          {/* Sections */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 pl-3 border-l-4 border-[#116AD1]">
              1. Khi nào Shopee thu thập thông tin?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Khi bạn đăng ký, đăng nhập, mua hàng, thanh toán.</li>
              <li>Khi bạn gửi biểu mẫu, khiếu nại, phản hồi.</li>
              <li>Khi bạn dùng app, cookie, mạng xã hội.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 pl-3 border-l-4 border-[#116AD1]">
              2. Shopee thu thập thông tin gì?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Thông tin cá nhân: tên, email, số điện thoại, địa chỉ.</li>
              <li>Thông tin giao dịch: tài khoản, thanh toán, đơn hàng.</li>
              <li>Dữ liệu khác: vị trí, IP, thiết bị, hình ảnh, giọng nói.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 pl-3 border-l-4 border-[#116AD1]">
              3. Shopee dùng thông tin để làm gì?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Xử lý đơn hàng, giao dịch.</li>
              <li>Xác minh, ngăn gian lận.</li>
              <li>Thông báo, CSKH.</li>
              <li>Nghiên cứu, cải thiện dịch vụ.</li>
              <li>Quảng cáo, khuyến mãi (nếu đồng ý).</li>
              <li>Tuân thủ pháp luật.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 pl-3 border-l-4 border-[#116AD1]">
              4. Bảo vệ và lưu trữ thông tin
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Bảo mật bằng biện pháp kỹ thuật.</li>
              <li>Lưu trữ theo luật.</li>
              <li>Chia sẻ khi bạn đồng ý hoặc khi luật yêu cầu.</li>
              <li>Bạn có quyền sửa, xóa dữ liệu.</li>
            </ul>
          </section>

          {/* Footer note */}
          <p className="text-sm text-gray-500 text-center">
            Nếu cần hỗ trợ, vui lòng liên hệ với trung tâm hỗ <a href="/login" className="underline">KOHI MALL</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
