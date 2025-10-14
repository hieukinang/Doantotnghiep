import React from 'react'
import SellerLayout from '../../component-seller-page/SellerLayout'

const users = [
  { id: 1, name: 'Nguyễn Văn B', email: 'nvb@example.com', role: 'Nhân viên', active: true },
  { id: 2, name: 'Trần Thị C', email: 'ttc@example.com', role: 'Quản trị', active: true },
  { id: 3, name: 'Lê Văn D', email: 'lvd@example.com', role: 'Nhân viên', active: false },
  { id: 1, name: 'Nguyễn Văn B', email: 'nvb@example.com', role: 'Nhân viên', active: true },
  { id: 2, name: 'Trần Thị C', email: 'ttc@example.com', role: 'Quản trị', active: true },
  { id: 3, name: 'Lê Văn D', email: 'lvd@example.com', role: 'Nhân viên', active: false },
  { id: 1, name: 'Nguyễn Văn B', email: 'nvb@example.com', role: 'Nhân viên', active: true },
  { id: 2, name: 'Trần Thị C', email: 'ttc@example.com', role: 'Quản trị', active: true },
  { id: 3, name: 'Lê Văn D', email: 'lvd@example.com', role: 'Nhân viên', active: false },
  { id: 1, name: 'Nguyễn Văn B', email: 'nvb@example.com', role: 'Nhân viên', active: true },
  { id: 2, name: 'Trần Thị C', email: 'ttc@example.com', role: 'Quản trị', active: true },
  { id: 3, name: 'Lê Văn D', email: 'lvd@example.com', role: 'Nhân viên', active: false },
  { id: 1, name: 'Nguyễn Văn B', email: 'nvb@example.com', role: 'Nhân viên', active: true },
  { id: 2, name: 'Trần Thị C', email: 'ttc@example.com', role: 'Quản trị', active: true },
  { id: 3, name: 'Lê Văn D', email: 'lvd@example.com', role: 'Nhân viên', active: false },
  { id: 1, name: 'Nguyễn Văn B', email: 'nvb@example.com', role: 'Nhân viên', active: true },
  { id: 2, name: 'Trần Thị C', email: 'ttc@example.com', role: 'Quản trị', active: true },
  { id: 3, name: 'Lê Văn D', email: 'lvd@example.com', role: 'Nhân viên', active: false },
  { id: 1, name: 'Nguyễn Văn B', email: 'nvb@example.com', role: 'Nhân viên', active: true },
  { id: 2, name: 'Trần Thị C', email: 'ttc@example.com', role: 'Quản trị', active: true },
  { id: 3, name: 'Lê Văn D', email: 'lvd@example.com', role: 'Nhân viên', active: false },
  { id: 1, name: 'Nguyễn Văn B', email: 'nvb@example.com', role: 'Nhân viên', active: true },
  { id: 2, name: 'Trần Thị C', email: 'ttc@example.com', role: 'Quản trị', active: true },
  { id: 3, name: 'Lê Văn D', email: 'lvd@example.com', role: 'Nhân viên', active: false },
]

const EditUser = () => {
  return (
    <div className="p-14 space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="font-semibold">Danh sách người dùng</div>
          <button className="px-3 py-1 bg-[#116AD1] text-white rounded">Thêm người dùng</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Vai trò</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 font-medium">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <select defaultValue={u.role} className="border rounded px-2 py-1 text-sm">
                      <option>Nhân viên</option>
                      <option>Quản trị</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${u.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.active ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 border rounded">Sửa</button>
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
  )
}

export default EditUser