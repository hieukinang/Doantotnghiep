// import React from 'react'
// import { Link } from 'react-router-dom'
// import Header from '../../component/Header'
// import Footer from '../../component/Footer'

// const items = [
//   { id: 1, name: 'Tai nghe Bluetooth Pro', price: 399000, qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop' },
//   { id: 2, name: 'Bàn phím cơ', price: 899000, qty: 2, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop' },
// ]

// const format = (v) => v.toLocaleString('vi-VN')

// const Cart = () => {
//   const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
//       <main className="pt-32 px-5 flex-1">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 bg-white rounded-lg shadow">
//             <div className="px-5 py-4 border-b font-semibold">Giỏ hàng</div>
//             <div className="divide-y">
//               {items.map((it) => (
//                 <div key={it.id} className="flex items-center gap-4 p-4">
//                   <input type="checkbox" className="accent-[#116AD1]" defaultChecked />
//                   <img src={it.image} alt={it.name} className="w-20 h-20 rounded object-cover" />
//                   <div className="flex-1">
//                     <div className="font-medium">{it.name}</div>
//                     <div className="text-[#116AD1] font-semibold mt-1">{format(it.price)}₫</div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button className="w-8 h-8 border rounded">-</button>
//                     <input defaultValue={it.qty} className="w-12 text-center border rounded h-8" />
//                     <button className="w-8 h-8 border rounded">+</button>
//                   </div>
//                   <button className="text-red-500 text-sm ml-2">Xóa</button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-5 h-fit">
//             <div className="flex justify-between">
//               <span>Tạm tính</span>
//               <span className="font-semibold">{format(subtotal)}₫</span>
//             </div>
//             <div className="flex justify-between mt-2">
//               <span>Phí vận chuyển</span>
//               <span className="font-semibold">Miễn phí</span>
//             </div>
//             <div className="h-px bg-gray-200 my-3" />
//             <div className="flex justify-between text-lg">
//               <span>Tổng</span>
//               <span className="text-[#116AD1] font-bold">{format(subtotal)}₫</span>
//             </div>
//             <Link to="/place-order" className="mt-4 block text-center bg-[#116AD1] text-white py-2 rounded hover:bg-[#0e57aa]">
//               Mua hàng
//             </Link>

//             <div className="mt-4 space-y-2">
//               <Link to="/" className="block text-center text-[#116AD1] py-2 border border-[#116AD1] rounded hover:bg-[#116AD1] hover:text-white transition-colors">
//                 Tiếp tục mua sắm
//               </Link>
//               <Link to="/profile" className="block text-center text-gray-600 py-2 border border-gray-300 rounded hover:bg-gray-50">
//                 Xem hồ sơ
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default Cart

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/Footer";

const initialItems = [
  {
    id: 1,
    name: "Tai nghe Bluetooth Pro",
    price: 399000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Bàn phím cơ",
    price: 899000,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
  },
];

const format = (v) => v.toLocaleString("vi-VN");

const Cart = () => {
  const [items, setItems] = useState(initialItems);

  const handleQtyChange = (id, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: value } : it))
    );
  };

  const handleQtyBlur = (id, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 1) num = 1;
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: num } : it))
    );
  };

  const increment = (id) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Number(it.qty) + 1 } : it))
    );
  };

  const decrement = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id && it.qty > 1 ? { ...it, qty: Number(it.qty) - 1 } : it
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const subtotal = items.reduce((s, i) => s + i.price * Number(i.qty || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="px-5 py-4 border-b font-semibold">Giỏ hàng</div>
            <div className="divide-y">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-4 p-4">
                  <input
                    type="checkbox"
                    className="accent-[#116AD1]"
                    defaultChecked
                  />
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-[#116AD1] font-semibold mt-1">
                      {format(it.price)}₫
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrement(it.id)}
                      className="w-8 h-8 border rounded"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={it.qty}
                      onChange={(e) => handleQtyChange(it.id, e.target.value)}
                      onBlur={(e) => handleQtyBlur(it.id, e.target.value)}
                      className="w-12 text-center border rounded h-8"
                    />
                    <button
                      onClick={() => increment(it.id)}
                      className="w-8 h-8 border rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="w-8 h-8 text-white text-sm ml-2 border rounded bg-[#116AD1]  hover:bg-[#FF4500] transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 h-fit">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold">{format(subtotal)}₫</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Phí vận chuyển</span>
              <span className="font-semibold">Miễn phí</span>
            </div>
            <div className="h-px bg-gray-200 my-3" />
            <div className="flex justify-between text-lg">
              <span>Tổng</span>
              <span className="text-[#116AD1] font-bold">
                {format(subtotal)}₫
              </span>
            </div>
            <Link
              to="/place-order"
              className="mt-4 block text-center bg-[#116AD1] text-white py-2 rounded hover:bg-[#0e57aa]"
            >
              Mua hàng
            </Link>

            <div className="mt-4 space-y-2">
              <Link
                to="/"
                className="block text-center text-[#116AD1] py-2 border border-[#116AD1] rounded hover:bg-[#116AD1] hover:text-white transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                to="/profile"
                className="block text-center text-[#116AD1] py-2 border border-[#116AD1] rounded hover:bg-[#116AD1] hover:text-white transition-colors"
              >
                Xem hồ sơ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
