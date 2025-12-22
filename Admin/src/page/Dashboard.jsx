import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

const Stat = ({ label, value, color }) => (
  <div className="flex flex-col bg-white rounded-lg border p-4 shadow-sm">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`text-2xl font-semibold ${color || 'text-gray-800'}`}>{value}</span>
  </div>
)

const USER_TYPES = ['ADMIN', 'STORE', 'CLIENT', 'SHIPPER']
const USER_TYPE_LABELS = {
  ADMIN: 'Admin',
  STORE: 'Cửa hàng',
  CLIENT: 'Khách hàng',
  SHIPPER: 'Shipper',
  ALL: 'Tất cả'
}
const COLORS = {
  ADMIN: '#8884d8',
  STORE: '#82ca9d',
  CLIENT: '#ffc658',
  SHIPPER: '#ff7300'
}

// Helper để lấy headers với token
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken')
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

const Dashboard = () => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const currentYear = new Date().getFullYear()

  // States cho thống kê thành viên mới trong ngày
  const [userDayType, setUserDayType] = useState('ALL')
  const [userDayStartDate, setUserDayStartDate] = useState(today)
  const [userDayEndDate, setUserDayEndDate] = useState(today)
  const [userDayData, setUserDayData] = useState([])
  const [loadingUserDay, setLoadingUserDay] = useState(false)

  // States cho thống kê thành viên theo năm
  const [userYearType, setUserYearType] = useState('ALL')
  const [userYear, setUserYear] = useState(currentYear)
  const [userYearData, setUserYearData] = useState([])
  const [loadingUserYear, setLoadingUserYear] = useState(false)

  // States cho thống kê đơn hàng theo ngày
  const [orderStartDate, setOrderStartDate] = useState(today)
  const [orderEndDate, setOrderEndDate] = useState(today)
  const [orderDayData, setOrderDayData] = useState([])
  const [loadingOrderDay, setLoadingOrderDay] = useState(false)

  // States cho thống kê doanh thu theo ngày
  const [revenueStartDate, setRevenueStartDate] = useState(today)
  const [revenueEndDate, setRevenueEndDate] = useState(today)
  const [revenueDayData, setRevenueDayData] = useState([])
  const [loadingRevenueDay, setLoadingRevenueDay] = useState(false)

  // States cho thống kê doanh thu theo năm
  const [revenueYear, setRevenueYear] = useState(currentYear)
  const [revenueYearData, setRevenueYearData] = useState([])
  const [loadingRevenueYear, setLoadingRevenueYear] = useState(false)

  // Fetch thành viên mới trong ngày
  const fetchUserDay = async () => {
    setLoadingUserDay(true)
    try {
      const authHeaders = getAuthHeaders()
      if (userDayType === 'ALL') {
        // Gọi API 4 lần với 4 type
        const results = await Promise.all(
          USER_TYPES.map(type =>
            axios.get(`${API_BASE}/statistics/admin/user/day`, {
              params: { status: 'ACTIVE', type, startDate: userDayStartDate, endDate: userDayEndDate },
              ...authHeaders
            })
          )
        )
        const data = USER_TYPES.map((type, index) => ({
          name: USER_TYPE_LABELS[type],
          value: results[index].data?.data?.total || 0,
          type
        }))
        setUserDayData(data)
      } else {
        const res = await axios.get(`${API_BASE}/statistics/admin/user/day`, {
          params: { status: 'ACTIVE', type: userDayType, startDate: userDayStartDate, endDate: userDayEndDate },
          ...authHeaders
        })
        setUserDayData([{
          name: USER_TYPE_LABELS[userDayType],
          value: res.data?.data?.total || 0,
          type: userDayType
        }])
      }
    } catch (error) {
      console.error('Error fetching user day stats:', error)
    }
    setLoadingUserDay(false)
  }

  // Fetch thành viên theo năm
  const fetchUserYear = async () => {
    setLoadingUserYear(true)
    try {
      const authHeaders = getAuthHeaders()
      if (userYearType === 'ALL') {
        // Gọi API 4 lần với 4 type
        const results = await Promise.all(
          USER_TYPES.map(type =>
            axios.get(`${API_BASE}/statistics/admin/user/year`, {
              params: { year: userYear, type },
              ...authHeaders
            })
          )
        )
        // Chuyển đổi dữ liệu để hiển thị 4 cột cho mỗi tháng
        // API trả về: { data: { monthly: [...], total: number } }
        const monthlyData = []
        for (let i = 1; i <= 12; i++) {
          const monthData = { name: `T${i}` }
          USER_TYPES.forEach((type, index) => {
            const monthlyArr = results[index].data?.data?.monthly || []
            const monthItem = Array.isArray(monthlyArr) 
              ? monthlyArr.find(item => item.month === i)
              : null
            monthData[type] = monthItem?.count || 0
          })
          monthlyData.push(monthData)
        }
        setUserYearData(monthlyData)

        // Trường hợp không truyền type (comment lại theo yêu cầu)
        // const res = await axios.get(`${API_BASE}/statistics/admin/user/year`, {
        //   params: { year: userYear },
        //   ...authHeaders
        // })
        // setUserYearData(res.data)
      } else {
        const res = await axios.get(`${API_BASE}/statistics/admin/user/year`, {
          params: { year: userYear, type: userYearType },
          ...authHeaders
        })
        // API trả về: { data: { monthly: [...], total: number } }
        const monthlyArr = res.data?.data?.monthly || []
        const monthlyData = []
        for (let i = 1; i <= 12; i++) {
          const monthItem = Array.isArray(monthlyArr) ? monthlyArr.find(item => item.month === i) : null
          monthlyData.push({
            name: `T${i}`,
            [userYearType]: monthItem?.count || 0
          })
        }
        setUserYearData(monthlyData)
      }
    } catch (error) {
      console.error('Error fetching user year stats:', error)
      setUserYearData([])
    }
    setLoadingUserYear(false)
  }

  // Fetch đơn hàng theo ngày
  const fetchOrderDay = async () => {
    setLoadingOrderDay(true)
    try {
      const res = await axios.get(`${API_BASE}/statistics/admin/order/day`, {
        params: { startdate: orderStartDate, enddate: orderEndDate },
        ...getAuthHeaders()
      })
      // API trả về: { data: { daily: [...], total: number } }
      const dailyData = res.data?.data?.daily || []
      const formattedData = Array.isArray(dailyData) ? dailyData.map(item => {
        const dateStr = item.date || item.day
        // Chỉ hiển thị ngày/tháng (dd/MM) để tránh bị đè trên trục X
        const shortDate = dateStr ? format(new Date(dateStr), 'dd/MM') : dateStr
        return {
          name: shortDate,
          'Đơn hàng': item.orders_count || item.total || 0
        }
      }) : []
      setOrderDayData(formattedData)
    } catch (error) {
      console.error('Error fetching order day stats:', error)
      setOrderDayData([])
    }
    setLoadingOrderDay(false)
  }

  // Fetch doanh thu theo ngày
  const fetchRevenueDay = async () => {
    setLoadingRevenueDay(true)
    try {
      const res = await axios.get(`${API_BASE}/statistics/admin/revenue/day`, {
        params: { startdate: revenueStartDate, enddate: revenueEndDate },
        ...getAuthHeaders()
      })
      // API trả về: { data: { daily: [...], total: number } }
      const dailyData = res.data?.data?.daily || []
      const formattedData = Array.isArray(dailyData) ? dailyData.map(item => {
        const dateStr = item.date || item.day
        // Chỉ hiển thị ngày/tháng (dd/MM) để tránh bị đè trên trục X
        const shortDate = dateStr ? format(new Date(dateStr), 'dd/MM') : dateStr
        return {
          name: shortDate,
          'Doanh thu': item.revenue || item.total || 0
        }
      }) : []
      setRevenueDayData(formattedData)
    } catch (error) {
      console.error('Error fetching revenue day stats:', error)
      setRevenueDayData([])
    }
    setLoadingRevenueDay(false)
  }

  // Fetch doanh thu theo năm
  const fetchRevenueYear = async () => {
    setLoadingRevenueYear(true)
    try {
      const res = await axios.get(`${API_BASE}/statistics/admin/revenue/year`, {
        params: { year: revenueYear },
        ...getAuthHeaders()
      })
      // API trả về: { data: { monthly: [...], total: number } }
      const monthlyArr = res.data?.data?.monthly || []
      const monthlyData = []
      for (let i = 1; i <= 12; i++) {
        const monthItem = Array.isArray(monthlyArr) ? monthlyArr.find(item => item.month === i) : null
        monthlyData.push({
          name: `T${i}`,
          'Doanh thu': monthItem?.revenue || monthItem?.total || 0
        })
      }
      setRevenueYearData(monthlyData)
    } catch (error) {
      console.error('Error fetching revenue year stats:', error)
      setRevenueYearData([])
    }
    setLoadingRevenueYear(false)
  }

  useEffect(() => { fetchUserDay() }, [userDayType, userDayStartDate, userDayEndDate])
  useEffect(() => { fetchUserYear() }, [userYearType, userYear])
  useEffect(() => { fetchOrderDay() }, [orderStartDate, orderEndDate])
  useEffect(() => { fetchRevenueDay() }, [revenueStartDate, revenueEndDate])
  useEffect(() => { fetchRevenueYear() }, [revenueYear])


  // Tính tổng thành viên mới trong ngày
  const totalUserDay = userDayData.reduce((sum, item) => sum + (item.value || 0), 0)

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Tổng quan</h2>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Thành viên mới hôm nay" value={totalUserDay} color="text-blue-600" />
        <Stat label="Đơn hàng hôm nay" value={orderDayData.reduce((sum, item) => sum + (item['Đơn hàng'] || 0), 0)} color="text-green-600" />
        <Stat label="Doanh thu hôm nay" value={`${revenueDayData.reduce((sum, item) => sum + (item['Doanh thu'] || 0), 0).toLocaleString()}đ`} color="text-orange-600" />
        <Stat label="Doanh thu năm" value={`${revenueYearData.reduce((sum, item) => sum + (item['Doanh thu'] || 0), 0).toLocaleString()}đ`} color="text-purple-600" />
      </div>

      {/* Biểu đồ thành viên mới trong ngày */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold text-gray-700">Thành viên mới trong ngày</h3>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={userDayStartDate}
              onChange={(e) => setUserDayStartDate(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={userDayEndDate}
              onChange={(e) => setUserDayEndDate(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm"
            />
            <select
              value={userDayType}
              onChange={(e) => setUserDayType(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm"
            >
              <option value="ALL">Tất cả</option>
              {USER_TYPES.map(type => (
                <option key={type} value={type}>{USER_TYPE_LABELS[type]}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="h-64">
          {loadingUserDay ? (
            <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Số lượng" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Biểu đồ thành viên theo năm */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold text-gray-700">Thành viên theo năm</h3>
          <div className="flex gap-2">
            <select
              value={userYearType}
              onChange={(e) => setUserYearType(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm"
            >
              <option value="ALL">Tất cả</option>
              {USER_TYPES.map(type => (
                <option key={type} value={type}>{USER_TYPE_LABELS[type]}</option>
              ))}
            </select>
            <input
              type="number"
              value={userYear}
              onChange={(e) => setUserYear(Number(e.target.value))}
              className="border rounded px-3 py-1.5 text-sm w-24"
              min="2020"
              max="2030"
            />
          </div>
        </div>
        <div className="h-72">
          {loadingUserYear ? (
            <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userYearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {userYearType === 'ALL' ? (
                  USER_TYPES.map(type => (
                    <Bar key={type} dataKey={type} name={USER_TYPE_LABELS[type]} fill={COLORS[type]} />
                  ))
                ) : (
                  <Bar dataKey={userYearType} name={USER_TYPE_LABELS[userYearType]} fill={COLORS[userYearType]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>


      {/* Biểu đồ đơn hàng theo ngày */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold text-gray-700">Đơn hàng theo ngày</h3>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Từ:</label>
            <input
              type="date"
              value={orderStartDate}
              onChange={(e) => setOrderStartDate(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm"
            />
            <label className="text-sm text-gray-600">Đến:</label>
            <input
              type="date"
              value={orderEndDate}
              onChange={(e) => setOrderEndDate(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm"
            />
          </div>
        </div>
        <div className="h-64">
          {loadingOrderDay ? (
            <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Đơn hàng" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Biểu đồ doanh thu theo ngày */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold text-gray-700">Doanh thu theo ngày</h3>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Từ:</label>
            <input
              type="date"
              value={revenueStartDate}
              onChange={(e) => setRevenueStartDate(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm"
            />
            <label className="text-sm text-gray-600">Đến:</label>
            <input
              type="date"
              value={revenueEndDate}
              onChange={(e) => setRevenueEndDate(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm"
            />
          </div>
        </div>
        <div className="h-64">
          {loadingRevenueDay ? (
            <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()}đ`} />
                <Legend />
                <Bar dataKey="Doanh thu" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Biểu đồ doanh thu theo năm */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold text-gray-700">Doanh thu theo năm</h3>
          <input
            type="number"
            value={revenueYear}
            onChange={(e) => setRevenueYear(Number(e.target.value))}
            className="border rounded px-3 py-1.5 text-sm w-24"
            min="2020"
            max="2030"
          />
        </div>
        <div className="h-72">
          {loadingRevenueYear ? (
            <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueYearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()}đ`} />
                <Legend />
                <Bar dataKey="Doanh thu" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
