import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import left from "../assets/fill-left.svg";
import right from "../assets/fill-right.svg";

const categories = [
  { id: 1, name: "Điện thoại", icon: "/src/assets/product/dienthoai2.png" },
  { id: 2, name: "Tivi", icon: "src/assets/product/tivi1.png" },
  { id: 3, name: "Máy giặt", icon: "/src/assets/product/maygiat2.png" },
  { id: 4, name: "Tủ lạnh", icon: "/src/assets/product/tulanh3.png" },
  { id: 5, name: "Điều hòa", icon: "/src/assets/product/dieuhoa1.png" },
  { id: 6, name: "Laptop", icon: "/src/assets/product/laptop5.png" },
  { id: 7, name: "Thời trang nam", icon: "/src/assets/product/thoitrangnam2.png" },
  { id: 8, name: "Giày dép nam", icon: "/src/assets/product/giaydepnam2.png" },
  { id: 9, name: "Túi xách", icon: "/src/assets/product/tuixach3.png" },
  { id: 10, name: "Đồ ăn", icon: "/src/assets/product/doan3.png" },
  { id: 11, name: "Gia dụng", icon: "/src/assets/product/khac3.png" },
  { id: 12, name: "Bàn ghế", icon: "/src/assets/product/banghe2.png" },
  { id: 13, name: "Thời trang nữ", icon: "/src/assets/product/thoitrangnu2.png" },
  { id: 14, name: "Giày dép nữ", icon: "/src/assets/product/giaydepnu1.png" },
  { id: 15, name: "Phụ kiện & Trang sức", icon: "/src/assets/product/phukien5.png" },
  { id: 16, name: "Sách vở", icon: "/src/assets/product/sachvo1.png" },
  { id: 17, name: "Đồ trẻ em", icon: "/src/assets/product/treem4.png" },
  { id: 18, name: "Đồ thể thao", icon: "/src/assets/product/thethao4.png" },
  { id: 19, name: "Ô tô & Xe máy & Xe đạp", icon: "/src/assets/product/xe5.png" },
  { id: 20, name: "Dụng cụ & Thiết bị", icon: "/src/assets/product/dungcu1.png" },
  { id: 21, name: "Khác", icon: "/src/assets/product/khac1.png" },
];

const Categories = () => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  const scroll = (dir) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth;
      containerRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Danh mục</h2>
      </div>
      <div className="relative mt-6">
        {/* Nút trái */}
        {canScrollLeft && (
          <img
            src={left}
            alt="Prev"
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 p-1.5 
             bg-white rounded-full shadow cursor-pointer 
             transition-transform duration-200 hover:scale-110"
          />
        )}

        {/* Container chính */}
        <div ref={containerRef} className="overflow-hidden scroll-smooth">
          <div className="grid grid-rows-2 grid-flow-col gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className="w-[140px] bg-white rounded-xl border hover:shadow-lg transition flex flex-col items-center p-6"
              >
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full flex-shrink-0">
                  <img
                    src={c.icon}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 text-base font-medium text-center leading-snug line-clamp-2">
                  {c.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Nút phải */}
        {canScrollRight && (
          <img
            src={right}
            alt="Next"
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 p-1.5 
             bg-white rounded-full shadow cursor-pointer 
             transition-transform duration-200 hover:scale-110"
          />
        )}
      </div>
    </div>
  );
};

export default Categories;
