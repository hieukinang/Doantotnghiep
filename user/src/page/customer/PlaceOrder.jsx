// import React from 'react'
// import { Link } from 'react-router-dom'
// import Header from '../../component/Header'
// import Footer from '../../component/Footer'

// const items = [
//   { id: 1, name: 'Tai nghe Bluetooth Pro', price: 399000, qty: 1 },
//   { id: 2, name: 'Bàn phím cơ', price: 899000, qty: 2 },
// ]

// const format = (v) => v.toLocaleString('vi-VN')

// const PlaceOrder = () => {
//   const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
//       <main className="pt-32 px-5 flex-1">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white rounded-lg p-5 shadow">
//               <div className="font-semibold">Địa chỉ nhận hàng</div>
//               <div className="mt-3 text-sm">
//                 <div className="font-medium">Nguyễn Văn A • 0909xxxxxx</div>
//                 <div>12 Nguyễn Trãi, Phường 5, Q.5, TP.HCM</div>
//               </div>
//               <button className="mt-3 px-3 py-1 border rounded text-sm text-[#116AD1] border-[#116AD1]">Thay đổi</button>
//             </div>

//             <div className="bg-white rounded-lg p-5 shadow">
//               <div className="font-semibold">Phương thức thanh toán</div>
//               <div className="mt-3 grid grid-cols-2 gap-3">
//                 <label className="flex items-center gap-2 border rounded px-3 py-2">
//                   <input name="pm" type="radio" defaultChecked className="accent-[#116AD1]" />
//                   Ví KOHI
//                 </label>
//                 <label className="flex items-center gap-2 border rounded px-3 py-2">
//                   <input name="pm" type="radio" className="accent-[#116AD1]" />
//                   Thẻ tín dụng/Ghi nợ
//                 </label>
//                 <label className="flex items-center gap-2 border rounded px-3 py-2">
//                   <input name="pm" type="radio" className="accent-[#116AD1]" />
//                   COD - Thanh toán khi nhận
//                 </label>
//                 <label className="flex items-center gap-2 border rounded px-3 py-2">
//                   <input name="pm" type="radio" className="accent-[#116AD1]" />
//                   Chuyển khoản
//                 </label>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg p-5 shadow">
//               <div className="font-semibold mb-3">Sản phẩm</div>
//               <div className="divide-y">
//                 {items.map((i) => (
//                   <div key={i.id} className="flex items-center justify-between py-3">
//                     <div>{i.name} x{i.qty}</div>
//                     <div className="font-semibold">{format(i.price * i.qty)}₫</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-5 h-fit">
//             <div className="flex justify-between">
//               <span>Tạm tính</span>
//               <span className="font-semibold">{format(subtotal)}₫</span>
//             </div>
//             <div className="flex justify-between mt-2">
//               <span>Vận chuyển</span>
//               <span className="font-semibold">Miễn phí</span>
//             </div>
//             <div className="h-px bg-gray-200 my-3" />
//             <div className="flex justify-between text-lg">
//               <span>Tổng thanh toán</span>
//               <span className="text-[#116AD1] font-bold">{format(subtotal)}₫</span>
//             </div>
//             <Link to="/payment" className="mt-4 block text-center bg-[#116AD1] text-white py-2 rounded hover:bg-[#0e57aa]">
//               Đặt hàng
//             </Link>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default PlaceOrder

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/Footer";

const items = [
  { id: 1, name: "Tai nghe Bluetooth Pro", price: 399000, qty: 1 },
  { id: 2, name: "Bàn phím cơ", price: 899000, qty: 2 },
];

const format = (v) => v.toLocaleString("vi-VN");

const PlaceOrder = () => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  // Giả lập lưu địa chỉ mặc định (trong thực tế sẽ lấy từ DB / localStorage)
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    ward: "",
    address: "",
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    setDefaultAddress(formData);
    setShowForm(false);

    if (formData.isDefault) {
      // 🔹 Giả lập lưu vào localStorage
      localStorage.setItem("defaultAddress", JSON.stringify(formData));
    }
  };

  // Lấy địa chỉ mặc định từ localStorage khi vào lại trang
  React.useEffect(() => {
    const saved = localStorage.getItem("defaultAddress");
    if (saved) {
      setDefaultAddress(JSON.parse(saved));
      setShowForm(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold">Địa chỉ nhận hàng</div>

              {/* Nếu có địa chỉ mặc định + không ở chế độ thay đổi */}
              {defaultAddress && !showForm ? (
                <div className="mt-3 text-sm">
                  <div className="font-medium">
                    {defaultAddress.name} • {defaultAddress.phone}
                  </div>
                  <div>
                    {defaultAddress.address}, {defaultAddress.ward},{" "}
                    {defaultAddress.city}
                  </div>
                  <button
                    className="mt-3 px-3 py-1 border rounded text-sm text-[#116AD1] border-[#116AD1] hover:bg-[#116AD1] hover:text-white transition-colors"
                    onClick={() => setShowForm(true)}
                  >
                    Thay đổi
                  </button>
                </div>
              ) : (
                // Form nhập địa chỉ
                <div className="mt-3 space-y-3 text-sm">
                  <input
                    name="name"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    name="city"
                    placeholder="Tỉnh/Thành phố"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    name="ward"
                    placeholder="Xã/Phường"
                    value={formData.ward}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    name="address"
                    placeholder="Số nhà, tên đường"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="accent-[#116AD1]"
                    />
                    Đặt làm địa chỉ mặc định
                  </label>

                  <button
                    onClick={handleSave}
                    className="mt-2 px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]"
                  >
                    Lưu địa chỉ
                  </button>
                </div>
              )}
            </div>

            {/* Products */}
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold mb-3">Sản phẩm</div>
              <div className="divide-y">
                {items.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      {i.name} x{i.qty}
                    </div>
                    <div className="font-semibold">
                      {format(i.price * i.qty)}₫
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Payment */}
            <div className="bg-white rounded-lg p-5 shadow">
              <div className="font-semibold">Phương thức thanh toán</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 border rounded px-3 py-2">
                  <input name="pm" type="radio" defaultChecked className="accent-[#116AD1]" />
                  Ví KOHI
                </label>
                <label className="flex items-center gap-2 border rounded px-3 py-2">
                  <input name="pm" type="radio" className="accent-[#116AD1]" />
                  Thẻ tín dụng/Ghi nợ
                </label>
                <label className="flex items-center gap-2 border rounded px-3 py-2">
                  <input name="pm" type="radio" className="accent-[#116AD1]" />
                  COD - Thanh toán khi nhận
                </label>
                <label className="flex items-center gap-2 border rounded px-3 py-2">
                  <input name="pm" type="radio" className="accent-[#116AD1]" />
                  Chuyển khoản
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-5 h-fit">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold">{format(subtotal)}₫</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Vận chuyển</span>
              <span className="font-semibold">Miễn phí</span>
            </div>
            <div className="h-px bg-gray-200 my-3" />
            <div className="flex justify-between text-lg">
              <span>Tổng thanh toán</span>
              <span className="text-[#116AD1] font-bold">
                {format(subtotal)}₫
              </span>
            </div>
            <Link
              to="/payment"
              className="mt-4 block text-center bg-[#116AD1] text-white py-2 rounded hover:bg-[#0e57aa]"
            >
              Đặt hàng
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlaceOrder;
