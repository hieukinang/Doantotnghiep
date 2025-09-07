import React from 'react'

const Stat = ({ label, value }) => (
  <div className="flex flex-col bg-white rounded-lg border p-4">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-2xl font-semibold text-gray-800">{value}</span>
  </div>
)

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Tổng quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Người dùng" value="12,340" />
        <Stat label="Đơn hàng" value="3,210" />
        <Stat label="Khiếu nại" value="27" />
        <Stat label="Sản phẩm chờ duyệt" value="58" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg border p-4 h-64">Biểu đồ doanh thu (placeholder)</div>
        <div className="bg-gray-50 rounded-lg border p-4 h-64">Biểu đồ đơn hàng (placeholder)</div>
      </div>
    </div>
  )
}

export default Dashboard


