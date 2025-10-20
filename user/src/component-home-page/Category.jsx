import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import left from "../assets/fill-left.svg";
import right from "../assets/fill-right.svg";
import { ShopContext } from "../context/ShopContext";

const Categories = () => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 👉 Lấy dữ liệu từ context
  const { supercategories, getAllSuperCategories } = useContext(ShopContext);

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
    getAllSuperCategories(); // 🔄 Gọi API khi load lần đầu
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
            {supercategories && supercategories.length > 0 ? (
              supercategories.map((c) => (
                <Link
                  key={c._id || c.id}
                  to={`/category/${c._id || c.id}`}
                  className="w-[140px] bg-white rounded-xl border hover:shadow-lg transition flex flex-col items-center p-6"
                >
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden">
                    <img
                      src={c.image || "/src/assets/product/default.png"}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-3 text-base font-medium text-center leading-snug line-clamp-2">
                    {c.name}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-gray-500 p-6 text-center col-span-full">
                Đang tải danh mục...
              </div>
            )}
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
