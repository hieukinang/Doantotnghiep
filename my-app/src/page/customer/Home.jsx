import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../component/Header'
import Footer from '../../component/Footer'
import Banner from '../../component/Banner'
import left from '../../assets/fill-left.svg'
import right from '../../assets/fill-right.svg'
import { useRef } from 'react'
import { useEffect, useState } from 'react'
const products = [
  { id: 1, name: 'Tai nghe Bluetooth Pro', price: 399000, image: 'https://images.unsplash.com/photo-1518442573684-9ac6e1f9c2b0?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, name: 'Giày chạy bộ', price: 599000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, name: 'Bình giữ nhiệt', price: 159000, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31b?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, name: 'Bàn phím cơ', price: 899000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop' },
  { id: 5, name: 'Áo khoác thể thao', price: 329000, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop' },
  { id: 6, name: 'Đồng hồ thông minh', price: 1299000, image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop' },
  { id: 7, name: 'Chuột gaming', price: 249000, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200&auto=format&fit=crop' },
  { id: 8, name: 'Sạc dự phòng 20.000mAh', price: 349000, image: 'https://images.unsplash.com/photo-1609599006353-9fd4d73b5562?q=80&w=1200&auto=format&fit=crop' },
]
const categories = [
  { id: 1, name: "Điện thoại", icon: "/icons/phone.svg" },
  { id: 2, name: "Tivi", icon: "/icons/tv.svg" },
  { id: 3, name: "Máy giặt", icon: "/icons/wash.svg" },
  { id: 4, name: "Tủ lạnh", icon: "/icons/fridge.svg" },
  { id: 5, name: "Điều hòa", icon: "/icons/air.svg" },
  { id: 6, name: "Laptop", icon: "/icons/laptop.svg" },
  { id: 7, name: "Thời trang nam", icon: "/icons/clothes.svg" },
  { id: 8, name: "Giày dép nam", icon: "/icons/shoes.svg" },
  { id: 9, name: "Túi xách", icon: "/icons/bag.svg" },
  { id: 10, name: "Đồ ăn", icon: "/icons/food.svg" },
  { id: 11, name: "Gia dụng", icon: "/icons/home.svg" },
  { id: 12, name: "Bàn ghế", icon: "/icons/furniture.svg" },
  { id: 13, name: "Thời trang nữ", icon: "/icons/bag.svg" },
  { id: 14, name: "Giày dép nữ", icon: "/icons/food.svg" },
  { id: 15, name: "Phụ kiện & Trang sức", icon: "/icons/home.svg" },
  { id: 16, name: "Sách vở", icon: "/icons/furniture.svg" },
  { id: 17, name: "Đồ trẻ em", icon: "/icons/furniture.svg" },
  { id: 18, name: "Đồ thể thao", icon: "/icons/furniture.svg" },
  { id: 19, name: "Ô tô & Xe máy & Xe đạp", icon: "/icons/furniture.svg" },
  { id: 20, name: "Dụng cụ & Thiết bị", icon: "/icons/furniture.svg" },
  { id: 21, name: "Khác", icon: "/icons/furniture.svg" },

];

const format = (v) => v.toLocaleString('vi-VN')



const Home = () => {
  const containerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    if (!containerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth)
  }

  const scroll = (dir) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth // cuộn đúng 1 khung
      containerRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    updateScrollButtons()
    const el = containerRef.current
    if (!el) return

    // lắng nghe khi cuộn
    el.addEventListener("scroll", updateScrollButtons)
    // lắng nghe khi resize
    window.addEventListener("resize", updateScrollButtons)

    return () => {
      el.removeEventListener("scroll", updateScrollButtons)
      window.removeEventListener("resize", updateScrollButtons)
    }
  }, [])
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <Banner />
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
            <div
              ref={containerRef}
              className="overflow-hidden scroll-smooth"
            >
              <div className="grid grid-rows-2 grid-flow-col gap-4">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.id}`}
                    className="w-[140px] bg-white rounded-xl border hover:shadow-lg transition flex flex-col items-center p-6"
                  >
                    {/* Icon giữ cố định */}
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full flex-shrink-0">
                      <img src={c.icon} alt={c.name} className="w-10 h-10" />
                    </div>

                    {/* Text không đẩy icon */}
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



        <div className="max-w-7xl mx-auto mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Deal nổi bật hôm nay</h2>
            <Link to="/products" className="text-[#116AD1] text-sm">Xem tất cả</Link>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {products.map((p) => (
              <Link key={p.id} to="/product-detail" className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
                <div className="aspect-[1/1] bg-gray-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-2">
                  <div className="line-clamp-2 text-sm">{p.name}</div>
                  <div className="mt-1 text-sm text-gray-500 line-through">{format(p.price * 1.1)}₫</div>
                  <div className="mt-1 text-[#116AD1] font-semibold">{format(p.price)}₫</div>
                  <div className="mt-1 text-xs text-gray-500">Đã bán 1,2k</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10">
          <h2 className="text-xl font-semibold">Gợi ý hôm nay</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.concat(products).slice(0, 12).map((p, i) => (
              <Link key={i} to="/product-detail" className="bg-white rounded-lg overflow-hidden border hover:border-[#116AD1] transition">
                <img src={p.image} alt={p.name} className="w-full h-36 object-cover" loading="lazy" />
                <div className="p-2">
                  <div className="line-clamp-2 text-xs">{p.name}</div>
                  <div className="mt-1 text-[#116AD1] font-semibold text-sm">{format(p.price)}₫</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
