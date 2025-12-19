import React, { useState, useEffect } from 'react'
import SellerLayout from '../../component-seller-page/SellerLayout'

const EditProfileSeller = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    description: '',
    detail_address: '',
    city: '',
    village: '',
    bank_name: '',
    bank_account_number: '',
    bank_account_holder_name: '',
    id_image: null,
    image: null
  })

  const [loading, setLoading] = useState(false)
  const [previewImages, setPreviewImages] = useState({
    id_image: '',
    image: ''
  })

  useEffect(() => {
    // Lấy thông tin seller từ localStorage
    const sellerUser = JSON.parse(localStorage.getItem('sellerUser') || '{}')
    
    if (sellerUser) {
      setFormData({
        name: sellerUser.name || '',
        phone: sellerUser.phone || '',
        email: sellerUser.email || '',
        description: sellerUser.description || '',
        detail_address: sellerUser.detail_address || '',
        city: sellerUser.city || '',
        village: sellerUser.village || '',
        bank_name: sellerUser.bank_name || '',
        bank_account_number: sellerUser.bank_account_number || '',
        bank_account_holder_name: sellerUser.bank_account_holder_name || '',
        id_image: null,
        image: null
      })

      setPreviewImages({
        id_image: sellerUser.id_image || '',
        image: sellerUser.image || ''
      })
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }))

      // Tạo preview cho ảnh
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImages(prev => ({
          ...prev,
          [name]: reader.result
        }))
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const sellerUser = JSON.parse(localStorage.getItem('sellerUser') || '{}')
      const citizen_id = sellerUser.citizen_id

      // Tạo FormData để gửi file
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('phone', formData.phone)
       submitData.append('phone', formData.email)
      submitData.append('description', formData.description)
      submitData.append('detail_address', formData.detail_address)
      submitData.append('city', formData.city)
      submitData.append('village', formData.village)
      submitData.append('bank_name', formData.bank_name)
      submitData.append('bank_account_number', formData.bank_account_number)
      submitData.append('bank_account_holder_name', formData.bank_account_holder_name)

      // Thêm file nếu có
      if (formData.id_image) {
        submitData.append('id_image', formData.id_image)
      }
      if (formData.image) {
        submitData.append('image', formData.image)
      }

      const response = await fetch(`http://127.0.0.1:5000/api/stores/update-profile`, {
        method: 'PATCH',
        body: submitData
      })

      if (response.ok) {
        const data = await response.json()
        
        // Cập nhật localStorage với thông tin mới
        localStorage.setItem('sellerUser', JSON.stringify(data))
        
        alert('Cập nhật thông tin thành công!')
      } else {
        const error = await response.json()
        alert('Lỗi: ' + (error.message || 'Không thể cập nhật thông tin'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-14 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5 lg:col-span-2">
          <div className="font-semibold mb-4">Thông tin cửa hàng</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Tên cửa hàng</span>
                <input 
                  className="border rounded px-3 py-2" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Số điện thoại</span>
                <input 
                  className="border rounded px-3 py-2" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1">
                <span className="text-sm text-gray-600">Mô tả</span>
                <textarea 
                  className="border rounded px-3 py-2" 
                  rows="2"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Email</span>
                <input 
                  className="border rounded px-3 py-2" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
               <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Địa chỉ chi tiết</span>
                <input 
                  className="border rounded px-3 py-2" 
                  name="detail_address"
                  value={formData.detail_address}
                  onChange={handleInputChange}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Thành phố</span>
                <input 
                  className="border rounded px-3 py-2" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Quận/Huyện</span>
                <input 
                  className="border rounded px-3 py-2" 
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1">
                <span className="text-sm text-gray-600">Ảnh CCCD</span>
                <input 
                  type="file"
                  className="border rounded px-3 py-2" 
                  name="id_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewImages.id_image && (
                  <img src={previewImages.id_image} alt="CCCD" className="mt-2 w-40 h-auto rounded" />
                )}
              </label>
              <label className="md:col-span-2 flex flex-col gap-1">
                <span className="text-sm text-gray-600">Ảnh đại diện cửa hàng</span>
                <input 
                  type="file"
                  className="border rounded px-3 py-2" 
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewImages.image && (
                  <img src={previewImages.image} alt="Avatar" className="mt-2 w-40 h-auto rounded" />
                )}
              </label>
            </div>
            <div className="mt-4">
              <button 
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#116AD1] text-white rounded hover:bg-[#0e57aa] disabled:bg-gray-400"
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-5 h-fit">
          <div className="font-semibold mb-3">Tài khoản ngân hàng</div>
          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Tên ngân hàng</span>
              <input 
                className="border rounded px-3 py-2" 
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Số tài khoản</span>
              <input 
                className="border rounded px-3 py-2" 
                name="bank_account_number"
                value={formData.bank_account_number}
                onChange={handleInputChange}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Chủ tài khoản</span>
              <input 
                className="border rounded px-3 py-2" 
                name="bank_account_holder_name"
                value={formData.bank_account_holder_name}
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfileSeller