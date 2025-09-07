import React from 'react'
import SellerLayout from '../../component/SellerLayout'

const EditProfileSeller = () => {
  return (
    <SellerLayout title="Hồ sơ cửa hàng">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5 lg:col-span-2">
          <div className="font-semibold mb-4">Thông tin cửa hàng</div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Tên cửa hàng</span>
              <input className="border rounded px-3 py-2" defaultValue="KOHI Official" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Số điện thoại</span>
              <input className="border rounded px-3 py-2" defaultValue="0909xxxxxx" />
            </label>
            <label className="md:col-span-2 flex flex-col gap-1">
              <span className="text-sm text-gray-600">Mô tả</span>
              <textarea className="border rounded px-3 py-2" rows="4" defaultValue="Cửa hàng chính hãng, sản phẩm chất lượng."></textarea>
            </label>
            <label className="md:col-span-2 flex flex-col gap-1">
              <span className="text-sm text-gray-600">Địa chỉ</span>
              <input className="border rounded px-3 py-2" defaultValue="12 Nguyễn Trãi, Q.5, TP.HCM" />
            </label>
          </form>
          <div className="mt-4">
            <button className="px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa]">Lưu</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 h-fit">
          <div className="font-semibold mb-3">Tài khoản ngân hàng</div>
          <form className="grid grid-cols-1 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Tên ngân hàng" defaultValue="Vietcombank" />
            <input className="border rounded px-3 py-2" placeholder="Số tài khoản" defaultValue="0123456789" />
            <input className="border rounded px-3 py-2" placeholder="Chủ tài khoản" defaultValue="Nguyễn Văn A" />
            <button className="bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa]">Cập nhật</button>
          </form>
        </div>
      </div>
    </SellerLayout>
  )
}

export default EditProfileSeller
