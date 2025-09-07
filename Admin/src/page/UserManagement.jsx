import React, { useState } from 'react'

const roles = [
  { key: 'customer', label: 'Khách hàng' },
  { key: 'vendor', label: 'Người bán' },
  { key: 'shipper', label: 'Shipper' },
]

const Row = ({ item }) => (
  <tr className="border-b last:border-0">
    <td className="px-3 py-2 text-sm text-gray-700">{item.name}</td>
    <td className="px-3 py-2 text-sm text-gray-700">{item.email}</td>
    <td className="px-3 py-2 text-sm text-gray-700 capitalize">{item.role}</td>
    <td className="px-3 py-2">
      <button className="text-blue-600 hover:underline text-sm">Sửa</button>
    </td>
  </tr>
)

const UserManagement = () => {
  const [role, setRole] = useState('customer')
  const data = Array.from({ length: 8 }).map((_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@mail.com`,
    role,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Quản lý người dùng</h2>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          {roles.map((r) => (
            <option key={r.key} value={r.key}>{r.label}</option>
          ))}
        </select>
      </div>
      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-sm text-gray-600">
              <th className="px-3 py-2 font-medium">Tên</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Vai trò</th>
              <th className="px-3 py-2 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => <Row key={idx} item={item} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement


