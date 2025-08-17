import React from 'react'
import Header from '../../component/Header'
import Footer from '../../component/Footer'
import Banner from '../../component/Banner'

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

const format = (v) => v.toLocaleString('vi-VN')

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <Banner />

        <div className="max-w-6xl mx-auto mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Deal nổi bật hôm nay</h2>
            <a href="#" className="text-[#116AD1] text-sm">Xem tất cả</a>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <a key={p.id} href="/product" className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
                <div className="aspect-[1/1] bg-gray-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-sm">{p.name}</div>
                  <div className="mt-2 text-[#116AD1] font-semibold">{format(p.price)}₫</div>
                  <div className="mt-1 text-xs text-gray-500">Đã bán 1,2k</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10">
          <h2 className="text-xl font-semibold">Gợi ý hôm nay</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.concat(products).slice(0,12).map((p, i) => (
              <a key={i} href="/product" className="bg-white rounded-lg overflow-hidden border hover:border-[#116AD1] transition">
                <img src={p.image} alt={p.name} className="w-full h-36 object-cover" loading="lazy" />
                <div className="p-2">
                  <div className="line-clamp-2 text-xs">{p.name}</div>
                  <div className="mt-1 text-[#116AD1] font-semibold text-sm">{format(p.price)}₫</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home