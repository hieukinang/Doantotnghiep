import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../component-home-page/Header'
import Footer from '../../component-home-page/Footer'

const shops = [
  { id: 1, name: 'KOHI Official', followers: '120k', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, name: 'Tech Station', followers: '80k', avatar: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, name: 'Sport Max', followers: '45k', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1200&auto=format&fit=crop' },
]

const FollowedShops = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold">Shop đang theo dõi</h1>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.map(s => (
              <div key={s.id} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img src={s.avatar} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.followers} người theo dõi</div>
                </div>
                <button className="px-3 py-1 border rounded text-sm text-[#116AD1] border-[#116AD1]">Hủy theo dõi</button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-block px-6 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]">
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default FollowedShops