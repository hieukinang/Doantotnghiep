import React, { useState } from 'react'
import Header from '../../component/Header'
import Footer from '../../component/Footer'

const gallery = [
  'https://images.unsplash.com/photo-1518442573684-9ac6e1f9c2b0?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519204923167-1a9c3a83d0b0?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
]

const ProductDetail = () => {
  const [active, setActive] = useState(0)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow">
              <img src={gallery[active]} alt="product" className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((src, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-square rounded overflow-hidden border ${i===active?'border-[#116AD1]':'border-gray-200'}`}>
                  <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <h1 className="text-xl font-semibold">Tai nghe Bluetooth Pro</h1>
            <div className="mt-2 text-sm text-gray-500">4.8 • Đã bán 2,3k • Kho: 125</div>
            <div className="mt-3 bg-[#116AD1]/10 text-[#116AD1] inline-block px-3 py-1 rounded">Miễn phí vận chuyển</div>

            <div className="mt-4">
              <div className="text-2xl font-bold text-[#116AD1]">399.000₫</div>
              <div className="text-sm line-through text-gray-400">599.000₫</div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <input type="number" min="1" defaultValue={1} className="w-16 border rounded px-2 py-1" />
              <button className="px-4 py-2 border border-[#116AD1] text-[#116AD1] rounded hover:bg-[#116AD1]/5">Thêm vào giỏ</button>
              <button className="px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]">Mua ngay</button>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Mô tả sản phẩm</h3>
              <p className="mt-2 text-sm text-gray-700 leading-6">
                Tai nghe Bluetooth Pro cho âm thanh sống động, pin 24h, sạc nhanh Type-C, chống ồn chủ động.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8">
          <h3 className="font-semibold text-lg">Sản phẩm tương tự</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {gallery.concat(gallery).slice(0,6).map((src, i) => (
              <a key={i} href="#" className="bg-white rounded-lg overflow-hidden border hover:border-[#116AD1]">
                <img src={src} alt={`rel-${i}`} className="w-full h-36 object-cover" />
                <div className="p-2">
                  <div className="text-sm font-medium">Phụ kiện âm thanh</div>
                  <div className="text-[#116AD1] font-semibold text-sm mt-1">199.000₫</div>
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

export default ProductDetail