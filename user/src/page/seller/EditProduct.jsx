import React from 'react'
import SellerLayout from '../../component-seller-page/SellerLayout'

const EditProduct = () => {
  return (
    <SellerLayout title="Chỉnh sửa sản phẩm">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-5">
          <div className="font-semibold mb-4">Thông tin cơ bản</div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Tên sản phẩm</span>
              <input className="border rounded px-3 py-2" defaultValue="Tai nghe Bluetooth Pro" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Danh mục</span>
              <input className="border rounded px-3 py-2" defaultValue="Âm thanh" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Giá (VND)</span>
              <input type="number" className="border rounded px-3 py-2" defaultValue={399000} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Tồn kho</span>
              <input type="number" className="border rounded px-3 py-2" defaultValue={120} />
            </label>
            <label className="md:col-span-2 flex flex-col gap-1">
              <span className="text-sm text-gray-600">Mô tả</span>
              <textarea className="border rounded px-3 py-2" rows="5" defaultValue="Tai nghe cho âm thanh sống động, pin 24h, chống ồn chủ động."></textarea>
            </label>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-5 h-fit">
          <div className="font-semibold mb-3">Hình ảnh</div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded" />
            ))}
          </div>
          <button className="mt-3 px-4 py-2 border rounded text-sm">Tải ảnh lên</button>

          <div className="h-px bg-gray-200 my-4" />
          <button className="w-full bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa]">Lưu thay đổi</button>
        </div>
      </div>
    </SellerLayout>
  )
}

export default EditProduct