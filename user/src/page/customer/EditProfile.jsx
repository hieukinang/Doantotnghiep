import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Header from '../../component-home-page/Header'
import Footer from '../../component-home-page/Footer'
import { ShopContext } from '../../context/ShopContext'

const EditProfile = () => {
  const { backendURL, clientToken, clientUser, setClientUser } = useContext(ShopContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: '',
    main_address: '',
    bank_name: '',
    bank_account_number: '',
    bank_account_holder_name: '',
  })
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Load user data from context/localStorage (data already saved when login)
  useEffect(() => {
    if (!clientToken) {
      toast.warning('Vui lòng đăng nhập để chỉnh sửa hồ sơ')
      navigate('/login')
      return
    }

    // Get user data from context or localStorage
    let user = clientUser
    if (!user) {
      const saved = localStorage.getItem('clientUser')
      if (saved) {
        try {
          user = JSON.parse(saved)
          setClientUser(user)
        } catch (e) {
          console.error('Error parsing saved user data:', e)
        }
      }
    }

    if (!user) {
      toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.')
      navigate('/login')
      return
    }

    // Set user data and form values
    setUserData(user)
    setFormData({
      username: user.username || '',
      phone: user.phone || '',
      email: user.email || '',
      date_of_birth: user.date_of_birth || '',
      gender: user.gender || '',
      main_address: user.main_address || '',
      bank_name: user.bank_name || '',
      bank_account_number: user.bank_account_number || '',
      bank_account_holder_name: user.bank_account_holder_name || '',
    })

    // Set image preview
    if (user.image) {
      const imageUrl = user.image.startsWith('http') 
        ? user.image 
        : user.image.startsWith('/')
        ? `http://127.0.0.1:5000${user.image}`
        : `http://127.0.0.1:5000/${user.image}`
      setImagePreview(imageUrl)
    }
  }, [clientToken, clientUser, setClientUser, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!clientToken) {
      toast.error('Vui lòng đăng nhập để cập nhật hồ sơ')
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData()

      // Always send required fields (username, email, phone)
      formDataToSend.append('username', formData.username)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)

      // Add optional fields that have values
      const optionalFields = ['date_of_birth', 'gender', 'main_address', 'bank_name', 'bank_account_number', 'bank_account_holder_name']
      optionalFields.forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key])
        }
      })

      // Handle password change
      if (passwordData.password) {
        if (passwordData.password !== passwordData.confirmPassword) {
          toast.error('Mật khẩu và xác nhận mật khẩu không khớp')
          setLoading(false)
          return
        }
        formDataToSend.append('password', passwordData.password)
        formDataToSend.append('confirmPassword', passwordData.confirmPassword)
      }

      // Handle image upload
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      // Send PATCH request
      const res = await axios.patch(
        `${backendURL}/clients/update-profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${clientToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (res.data?.status === 'success') {
        toast.success('Cập nhật hồ sơ thành công!')
        
        // Update context with new user data
        const updatedUser = res.data?.data?.client || res.data?.data?.user
        if (updatedUser) {
          localStorage.setItem('clientUser', JSON.stringify(updatedUser))
          setClientUser(updatedUser)
          setUserData(updatedUser)
          
          // Update image preview if new image URL is returned
          if (updatedUser.image) {
            const imageUrl = updatedUser.image.startsWith('http') 
              ? updatedUser.image 
              : updatedUser.image.startsWith('/')
              ? `http://127.0.0.1:5000${updatedUser.image}`
              : `http://127.0.0.1:5000/${updatedUser.image}`
            setImagePreview(imageUrl)
          }
          
          // Clear image file since it's been uploaded
          setImageFile(null)
        }

        // Reset password fields
        setPasswordData({ password: '', confirmPassword: '' })
        
        // Navigate back to profile
        setTimeout(() => {
          navigate('/profile')
        }, 1000)
      } else {
        toast.error(res.data?.message || 'Cập nhật hồ sơ thất bại')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ')
    } finally {
      setLoading(false)
    }
  }

  if (!userData && clientToken) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="pt-32 px-5 flex-1 flex items-center justify-center">
          <div className="text-gray-500">Đang tải thông tin...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pt-28 md:pt-32 px-3 md:px-5 flex-1 pb-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-4 md:p-6 shadow">
          <div className="font-semibold text-lg md:text-xl mb-4 md:mb-6">Chỉnh sửa hồ sơ</div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img 
                    src={imagePreview || "https://i.pravatar.cc/160"} 
                    alt="Avatar" 
                    className="w-24 md:w-32 h-24 md:h-32 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
                <label className="mt-3 px-3 md:px-4 py-2 border rounded text-xs md:text-sm text-[#116AD1] border-[#116AD1] cursor-pointer hover:bg-[#116AD1] hover:text-white transition">
                  Đổi ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imageFile && (
                  <p className="mt-2 text-xs text-gray-500">{imageFile.name}</p>
                )}
              </div>

              {/* Form Fields */}
              <div className="md:col-span-2 grid grid-cols-1 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Tên người dùng *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="main_address"
                    value={formData.main_address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ của bạn"
                    className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                  />
                </div>

                {/* Password Change Section */}
                <div className="border-t pt-3 md:pt-4 mt-2">
                  <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                    Đổi mật khẩu (để trống nếu không muốn đổi)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Information Section */}
                <div className="border-t pt-3 md:pt-4 mt-2">
                  <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                    Thông tin ngân hàng
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Tên ngân hàng
                      </label>
                      <input
                        type="text"
                        name="bank_name"
                        value={formData.bank_name}
                        onChange={handleInputChange}
                        placeholder="VD: Vietcombank"
                        className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Số tài khoản
                      </label>
                      <input
                        type="text"
                        name="bank_account_number"
                        value={formData.bank_account_number}
                        onChange={handleInputChange}
                        placeholder="Nhập số tài khoản"
                        className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Tên chủ tài khoản
                      </label>
                      <input
                        type="text"
                        name="bank_account_holder_name"
                        value={formData.bank_account_holder_name}
                        onChange={handleInputChange}
                        placeholder="Nhập tên chủ tài khoản"
                        className="w-full border rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0d5bb8] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <Link
                    to="/profile"
                    className="px-6 py-2 border rounded hover:bg-gray-50 text-center text-sm md:text-base"
                  >
                    Hủy
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default EditProfile