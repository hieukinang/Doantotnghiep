# KOHI MALL - Shipper Application

Ứng dụng quản lý giao hàng dành cho Shipper của KOHI MALL.

## Tính năng

### 🔐 Xác thực
- **Đăng nhập Shipper**: Đăng nhập bằng Gmail và mật khẩu
- **Đăng ký Shipper**: Đăng ký tài khoản shipper với thông tin cá nhân và tỉnh thành nhận đơn

### 📦 Quản lý đơn hàng
- **Danh sách đơn hàng**: Xem các đơn hàng cần giao trong khu vực của shipper
- **Chi tiết đơn hàng**: Xem thông tin chi tiết về đơn hàng, khách hàng và sản phẩm
- **Cập nhật trạng thái**: Cập nhật trạng thái giao hàng (đã nhận, đang giao, đã giao, thất bại)
- **Lịch sử giao hàng**: Xem lịch sử các đơn hàng đã giao và đánh giá từ khách hàng

### 👤 Quản lý hồ sơ
- **Hồ sơ cá nhân**: Xem và chỉnh sửa thông tin cá nhân
- **Thống kê**: Xem thống kê về số đơn hàng đã giao, tỷ lệ thành công, đánh giá trung bình

## Cấu trúc dự án

```
Shipper/
├── src/
│   ├── component/
│   │   ├── ShipperHeader.jsx      # Header chung cho tất cả trang
│   │   └── ShipperSidebar.jsx     # Sidebar navigation
│   ├── page/
│   │   ├── ShipperLogin.jsx       # Trang đăng nhập
│   │   ├── ShipperRegister.jsx    # Trang đăng ký
│   │   ├── ShipperOrders.jsx      # Danh sách đơn hàng
│   │   ├── ShipperOrderDetail.jsx # Chi tiết đơn hàng
│   │   ├── ShipperUpdateStatus.jsx # Cập nhật trạng thái
│   │   ├── ShipperDeliveryHistory.jsx # Lịch sử giao hàng
│   │   └── ShipperProfile.jsx     # Hồ sơ cá nhân
│   ├── App.jsx                    # Main app với routing
│   └── main.jsx                   # Entry point
```

## Cài đặt và chạy

1. **Cài đặt dependencies:**
```bash
cd Shipper
npm install
```

2. **Chạy ứng dụng:**
```bash
npm run dev
```

3. **Truy cập ứng dụng:**
- Mở trình duyệt và truy cập `http://localhost:5173`
- Ứng dụng sẽ tự động chuyển hướng đến trang đăng nhập

## Routes

- `/shipper/login` - Trang đăng nhập
- `/shipper/register` - Trang đăng ký
- `/shipper/orders` - Danh sách đơn hàng (trang chính)
- `/shipper/order-detail/:orderId` - Chi tiết đơn hàng
- `/shipper/update-status/:orderId` - Cập nhật trạng thái đơn hàng
- `/shipper/history` - Lịch sử giao hàng
- `/shipper/profile` - Hồ sơ cá nhân

## Tính năng chính

### 🎨 Giao diện
- Thiết kế responsive với Tailwind CSS
- Giao diện tương tự như customer và seller
- Màu sắc chủ đạo: #116AD1 (xanh dương)
- Icons và emoji để tăng tính trực quan

### 📱 Responsive Design
- Tối ưu cho desktop, tablet và mobile
- Layout linh hoạt với grid system
- Navigation sidebar có thể thu gọn

### 🔍 Tìm kiếm và lọc
- Tìm kiếm đơn hàng theo mã đơn hoặc tên khách hàng
- Lọc theo trạng thái đơn hàng
- Lọc theo thời gian (hôm nay, tuần này, tháng này)

### 📊 Thống kê
- Hiển thị số liệu tổng quan về đơn hàng
- Tỷ lệ thành công giao hàng
- Đánh giá trung bình từ khách hàng

### 📞 Liên hệ khách hàng
- Gọi điện trực tiếp từ ứng dụng
- Gửi SMS
- Xem địa chỉ trên bản đồ

## Công nghệ sử dụng

- **React 19** - Framework chính
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **ESLint** - Code linting

## Ghi chú

- Tất cả dữ liệu hiện tại là mock data để demo
- Cần tích hợp với API backend thực tế
- Có thể mở rộng thêm tính năng như bản đồ, thông báo push, v.v.