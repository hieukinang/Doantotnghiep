// import React from "react";
// import { Link } from "react-router-dom";

// const format = (v) => v.toLocaleString("vi-VN");

// const Suggestions = ({ products }) => {
//   return (
//     <div className="max-w-7xl mx-auto mt-10">
//       <h2 className="text-xl font-semibold">Gợi ý hôm nay</h2>
//       <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
//         {products.map((p) => (
//           <Link
//             key={p.id}
//             to="/product-detail"
//             className="bg-white rounded-lg overflow-hidden border hover:border-[#116AD1] transition"
//           >
//             <img
//               src={p.image}
//               alt={p.name}
//               className="w-full h-36 object-cover"
//               loading="lazy"
//             />
//             <div className="p-2">
//               <div className="line-clamp-2 text-xs">{p.name}</div>
//               <div className="mt-1 text-[#116AD1] font-semibold text-sm">
//                 {format(p.price)}₫
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Suggestions;
