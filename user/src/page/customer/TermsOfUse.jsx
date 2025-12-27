import React from "react";
import HeaderPolicy from "../../component-home-page/HeaderPolicy";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderPolicy />

      {/* Main Content */}
      <main className="flex justify-center px-3 md:px-4 pt-20 md:pt-24 pb-8 md:pb-12">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl md:rounded-2xl p-4 md:p-8 space-y-6 md:space-y-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[#116AD1]">
            Điều khoản sử dụng KOHI MALL
          </h1>

          {/* General Rules */}
          <section className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 pl-3 border-l-4 border-[#116AD1]">
              1. Quy định chung
            </h2>
            <p className="text-gray-700 text-sm md:text-base">
              Khi tham gia sử dụng KOHI MALL, mọi người dùng đồng ý tuân thủ điều
              khoản và chính sách của hệ thống. KOHI MALL có quyền cập nhật điều
              khoản khi cần thiết và sẽ thông báo cho người dùng.
            </p>
          </section>

          {/* Customer Rules */}
          <section className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 pl-3 border-l-4 border-[#116AD1]">
              2. Quy định đối với Khách hàng (Customer)
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
              <li>Cung cấp thông tin chính xác, đầy đủ khi đăng ký tài khoản.</li>
              <li>Thanh toán đúng phương thức đã chọn khi đặt hàng.</li>
              <li>
                Kiểm tra sản phẩm khi nhận hàng, có quyền khiếu nại nếu sản phẩm
                không đúng mô tả.
              </li>
              <li>
                Không lợi dụng hệ thống để gian lận hoặc thực hiện hành vi vi phạm
                pháp luật.
              </li>
            </ul>
          </section>

          {/* Seller Rules */}
          <section className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 pl-3 border-l-4 border-[#116AD1]">
              3. Quy định đối với Người bán (Seller)
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
              <li>
                Cung cấp thông tin hợp lệ về doanh nghiệp/cá nhân khi đăng ký gian
                hàng.
              </li>
              <li>
                Niêm yết sản phẩm với thông tin chính xác, không đăng hàng cấm hoặc
                hàng giả.
              </li>
              <li>Xử lý đơn hàng đúng thời gian, đảm bảo chất lượng sản phẩm.</li>
              <li>Tuân thủ chính sách đổi trả, bảo hành theo quy định KOHI MALL.</li>
            </ul>
          </section>

          {/* Shipper Rules */}
          <section className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 pl-3 border-l-4 border-[#116AD1]">
              4. Quy định đối với Người giao hàng (Shipper)
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
              <li>Cung cấp thông tin cá nhân hợp lệ khi đăng ký tài khoản.</li>
              <li>Nhận và giao hàng đúng địa điểm, thời gian đã thỏa thuận.</li>
              <li>
                Không được tự ý mở hoặc thay đổi hàng hóa trong quá trình vận
                chuyển.
              </li>
              <li>
                Tuân thủ luật giao thông và chịu trách nhiệm với hàng hóa trong quá
                trình vận chuyển.
              </li>
            </ul>
          </section>

          {/* KOHI MALL Responsibility */}
          <section className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 pl-3 border-l-4 border-[#116AD1]">
              5. Trách nhiệm của KOHI MALL
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
              <li>Cung cấp nền tảng minh bạch, an toàn cho các bên tham gia.</li>
              <li>
                Hỗ trợ giải quyết tranh chấp giữa khách hàng, người bán và shipper.
              </li>
              <li>
                Bảo vệ quyền lợi hợp pháp của người dùng theo quy định pháp luật.
              </li>
            </ul>
          </section>

          {/* Footer note */}
          <p className="text-xs md:text-sm text-gray-500 text-center">
            Nếu cần hỗ trợ, vui lòng liên hệ với trung tâm hỗ{" "}
            <a href="/login" className="underline">
              KOHI MALL
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUse;
