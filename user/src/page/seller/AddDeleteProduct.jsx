import React from 'react'
import SellerLayout from '../../component/SellerLayout'

const mockProducts = [
  { id: 'SP001', name: 'Tai nghe Bluetooth Pro', price: 399000, stock: 120, category: 'Âm thanh' },
  { id: 'SP002', name: 'Bàn phím cơ RGB', price: 899000, stock: 45, category: 'PC Gear' },
  { id: 'SP003', name: 'Giày chạy bộ Ultra', price: 599000, stock: 80, category: 'Thể thao' },
]

const format = (v) => v.toLocaleString('vi-VN')

const AddDeleteProduct = () => {
  return (
    <SellerLayout title="Sản phẩm">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form thêm sản phẩm */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <div className="font-semibold mb-3">Thêm sản phẩm</div>
          <form className="grid grid-cols-1 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Tên sản phẩm" />
            <input type="number" className="border rounded px-3 py-2" placeholder="Giá (VND)" />
            <input type="number" className="border rounded px-3 py-2" placeholder="Tồn kho" />
            <input className="border rounded px-3 py-2" placeholder="Danh mục" />
            <input className="border rounded px-3 py-2" placeholder="Ảnh (URL)" />
            <textarea className="border rounded px-3 py-2" rows="3" placeholder="Mô tả"></textarea>
            <button type="button" className="bg-[#116AD1] text-white rounded px-4 py-2 hover:bg-[#0e57aa]">Thêm</button>
          </form>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4 flex items-center justify-between border-b">
            <div className="font-semibold">Danh sách sản phẩm</div>
            <input className="border rounded px-3 py-1 text-sm" placeholder="Tìm theo tên / mã" />
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-4 py-2">Mã</th>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Danh mục</th>
                  <th className="px-4 py-2">Giá</th>
                  <th className="px-4 py-2">Tồn kho</th>
                  <th className="px-4 py-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 font-medium">{p.id}</td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.category}</td>
                    <td className="px-4 py-2 text-[#116AD1] font-semibold">{format(p.price)}₫</td>
                    <td className="px-4 py-2">{p.stock}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-2">
                        <a href="/seller/edit-product" className="px-3 py-1 border rounded text-[#116AD1] border-[#116AD1]">Sửa</a>
                        <button className="px-3 py-1 border rounded text-red-600 border-red-300">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

export default AddDeleteProduct