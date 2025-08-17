import React from 'react'
import Header from '../../component/Header'
import Footer from '../../component/Footer'

const EditProfile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-32 px-5 flex-1">
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-5 shadow">
          <div className="font-semibold text-lg">Chỉnh sửa hồ sơ</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <img src="https://i.pravatar.cc/160" className="w-28 h-28 rounded-full object-cover" />
              <button className="mt-3 px-3 py-1 border rounded text-sm text-[#116AD1] border-[#116AD1]">Đổi ảnh</button>
            </div>
            <form className="md:col-span-2 grid grid-cols-1 gap-3">
              <input className="border rounded px-3 py-2" placeholder="Họ và tên" defaultValue="Nguyễn Văn A" />
              <input className="border rounded px-3 py-2" placeholder="Email" defaultValue="user@example.com" />
              <input className="border rounded px-3 py-2" placeholder="Số điện thoại" defaultValue="0909xxxxxx" />
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#116AD1] text-white rounded">Lưu</button>
                <a href="/profile" className="px-4 py-2 border rounded">Hủy</a>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default EditProfile