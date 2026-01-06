-- MySQL dump for ecommerce1 - SIMPLIFIED VERSION
-- 5-10 records per table for easy testing

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- =============================================
-- SUPERCATEGORIES (10 records)
-- =============================================
DELETE FROM `supercategories`;
INSERT INTO `supercategories` (`id`, `name`, `image`, `createdAt`, `updatedAt`) VALUES
(1, 'Điện tử', 'supercategory-dien-tu.jpg', '2025-08-01 09:00:00', '2025-08-01 09:00:00'),
(2, 'Thời trang', 'supercategory-thoi-trang.jpg', '2025-08-02 10:00:00', '2025-08-02 10:00:00'),
(3, 'Gia dụng', 'supercategory-gia-dung.jpg', '2025-08-03 11:00:00', '2025-08-03 11:00:00'),
(4, 'Đời sống', 'supercategory-doi-song.jpg', '2025-08-04 12:00:00', '2025-08-04 12:00:00'),
(5, 'Xe cộ & Phụ kiện', 'supercategory-xe-phu-kien.jpg', '2025-08-05 13:00:00', '2025-08-05 13:00:00'),
(6, 'Thể thao', 'supercategory-the-thao.jpg', '2025-08-06 14:00:00', '2025-08-06 14:00:00'),
(7, 'Sức khỏe & Làm đẹp', 'supercategory-suc-khoe.jpg', '2025-08-07 15:00:00', '2025-08-07 15:00:00'),
(8, 'Mẹ & Bé', 'supercategory-me-be.jpg', '2025-08-08 16:00:00', '2025-08-08 16:00:00'),
(9, 'Thực phẩm', 'supercategory-thuc-pham.jpg', '2025-08-09 17:00:00', '2025-08-09 17:00:00'),
(10, 'Văn phòng phẩm', 'supercategory-van-phong.jpg', '2025-08-10 18:00:00', '2025-08-10 18:00:00');

-- =============================================
-- CATEGORIES (20 records)
-- =============================================
DELETE FROM `categories`;
INSERT INTO `categories` (`id`, `name`, `image`, `superCategoryId`, `createdAt`, `updatedAt`) VALUES
(1, 'Điện thoại di động', 'dienthoai1.png', 1, '2025-08-05 10:00:00', '2025-08-05 10:00:00'),
(2, 'Laptop', 'laptop1.png', 1, '2025-08-10 11:30:00', '2025-08-10 11:30:00'),
(3, 'Tivi', 'tivi1.png', 1, '2025-08-15 14:20:00', '2025-08-15 14:20:00'),
(4, 'Thời trang nam', 'thoitrangnam1.png', 2, '2025-08-20 09:45:00', '2025-08-20 09:45:00'),
(5, 'Thời trang nữ', 'thoitrangnu1.png', 2, '2025-08-25 16:10:00', '2025-08-25 16:10:00'),
(6, 'Giày dép', 'giaydepnam1.png', 2, '2025-09-03 08:30:00', '2025-09-03 08:30:00'),
(7, 'Đồ gia dụng', 'giadung1.png', 3, '2025-09-10 13:15:00', '2025-09-10 13:15:00'),
(8, 'Nội thất', 'banghe1.png', 3, '2025-09-18 15:40:00', '2025-09-18 15:40:00'),
(9, 'Phụ kiện điện tử', 'phukien1.png', 1, '2025-09-25 10:55:00', '2025-09-25 10:55:00'),
(10, 'Sách vở', 'sachvo1.png', 4, '2025-10-02 12:25:00', '2025-10-02 12:25:00'),
(11, 'Xe máy', 'xe1.png', 5, '2025-10-05 09:00:00', '2025-10-05 09:00:00'),
(12, 'Đồ thể thao', 'thethao1.png', 6, '2025-10-08 10:30:00', '2025-10-08 10:30:00'),
(13, 'Mỹ phẩm', 'thethao1.png', 7, '2025-10-12 11:45:00', '2025-10-12 11:45:00'),
(14, 'Đồ trẻ em', 'treem1.png', 8, '2025-10-15 14:00:00', '2025-10-15 14:00:00'),
(15, 'Thực phẩm khô', 'doan1.png', 9, '2025-10-18 15:30:00', '2025-10-18 15:30:00'),
(16, 'Túi xách', 'tuixach1.png', 2, '2025-10-22 08:15:00', '2025-10-22 08:15:00'),
(17, 'Đồng hồ', 'phukien1.png', 2, '2025-10-25 09:45:00', '2025-10-25 09:45:00'),
(18, 'Dụng cụ nhà bếp', 'dungcu1.png', 3, '2025-10-28 11:00:00', '2025-10-28 11:00:00'),
(19, 'Máy ảnh', 'phukien1.png', 1, '2025-11-01 13:20:00', '2025-11-01 13:20:00'),
(20, 'Bút viết', 'sachvo1.png', 10, '2025-11-05 14:50:00', '2025-11-05 14:50:00');

-- =============================================
-- ATTRIBUTES (60 records) - 3 attributes per category
-- name_attributes for each category
-- =============================================
DELETE FROM `attributes` WHERE `id` > 6;
INSERT INTO `attributes` (`id`, `name`, `categoryId`, `createdAt`, `updatedAt`) VALUES
-- Category 1: Điện thoại di động (Dung lượng, Màu sắc, RAM)
(7, 'Dung lượng', 1, '2025-08-05 10:00:00', '2025-08-05 10:00:00'),
(8, 'Màu sắc', 1, '2025-08-05 10:00:00', '2025-08-05 10:00:00'),
(9, 'RAM', 1, '2025-08-05 10:00:00', '2025-08-05 10:00:00'),
-- Category 2: Laptop (RAM, Ổ cứng, Màu sắc)
(10, 'RAM', 2, '2025-08-10 11:30:00', '2025-08-10 11:30:00'),
(11, 'Ổ cứng', 2, '2025-08-10 11:30:00', '2025-08-10 11:30:00'),
(12, 'Màu sắc', 2, '2025-08-10 11:30:00', '2025-08-10 11:30:00'),
-- Category 3: Tivi (Kích thước, Độ phân giải, Công nghệ)
(13, 'Kích thước', 3, '2025-08-15 14:20:00', '2025-08-15 14:20:00'),
(14, 'Độ phân giải', 3, '2025-08-15 14:20:00', '2025-08-15 14:20:00'),
(15, 'Công nghệ', 3, '2025-08-15 14:20:00', '2025-08-15 14:20:00'),
-- Category 4: Thời trang nam (Size, Màu sắc, Chất liệu)
(16, 'Size', 4, '2025-08-20 09:45:00', '2025-08-20 09:45:00'),
(17, 'Màu sắc', 4, '2025-08-20 09:45:00', '2025-08-20 09:45:00'),
(18, 'Chất liệu', 4, '2025-08-20 09:45:00', '2025-08-20 09:45:00'),
-- Category 5: Thời trang nữ (Size, Màu sắc, Chất liệu)
(19, 'Size', 5, '2025-08-25 16:10:00', '2025-08-25 16:10:00'),
(20, 'Màu sắc', 5, '2025-08-25 16:10:00', '2025-08-25 16:10:00'),
(21, 'Chất liệu', 5, '2025-08-25 16:10:00', '2025-08-25 16:10:00'),
-- Category 6: Giày dép (Size, Màu sắc, Chất liệu)
(22, 'Size', 6, '2025-09-03 08:30:00', '2025-09-03 08:30:00'),
(23, 'Màu sắc', 6, '2025-09-03 08:30:00', '2025-09-03 08:30:00'),
(24, 'Chất liệu', 6, '2025-09-03 08:30:00', '2025-09-03 08:30:00'),
-- Category 7: Đồ gia dụng (Dung tích, Màu sắc, Công suất)
(25, 'Dung tích', 7, '2025-09-10 13:15:00', '2025-09-10 13:15:00'),
(26, 'Màu sắc', 7, '2025-09-10 13:15:00', '2025-09-10 13:15:00'),
(27, 'Công suất', 7, '2025-09-10 13:15:00', '2025-09-10 13:15:00'),
-- Category 8: Nội thất (Kích thước, Màu sắc, Chất liệu)
(28, 'Kích thước', 8, '2025-09-18 15:40:00', '2025-09-18 15:40:00'),
(29, 'Màu sắc', 8, '2025-09-18 15:40:00', '2025-09-18 15:40:00'),
(30, 'Chất liệu', 8, '2025-09-18 15:40:00', '2025-09-18 15:40:00'),
-- Category 9: Phụ kiện điện tử (Màu sắc, Loại kết nối, Phiên bản)
(31, 'Màu sắc', 9, '2025-09-25 10:55:00', '2025-09-25 10:55:00'),
(32, 'Loại kết nối', 9, '2025-09-25 10:55:00', '2025-09-25 10:55:00'),
(33, 'Phiên bản', 9, '2025-09-25 10:55:00', '2025-09-25 10:55:00'),
-- Category 10: Sách vở (Ngôn ngữ, Loại bìa, Số trang)
(34, 'Ngôn ngữ', 10, '2025-10-02 12:25:00', '2025-10-02 12:25:00'),
(35, 'Loại bìa', 10, '2025-10-02 12:25:00', '2025-10-02 12:25:00'),
(36, 'Số trang', 10, '2025-10-02 12:25:00', '2025-10-02 12:25:00'),
-- Category 11: Xe máy (Phân khối, Màu sắc, Loại xe)
(37, 'Phân khối', 11, '2025-10-05 09:00:00', '2025-10-05 09:00:00'),
(38, 'Màu sắc', 11, '2025-10-05 09:00:00', '2025-10-05 09:00:00'),
(39, 'Loại xe', 11, '2025-10-05 09:00:00', '2025-10-05 09:00:00'),
-- Category 12: Đồ thể thao (Size, Màu sắc, Thương hiệu)
(40, 'Size', 12, '2025-10-08 10:30:00', '2025-10-08 10:30:00'),
(41, 'Màu sắc', 12, '2025-10-08 10:30:00', '2025-10-08 10:30:00'),
(42, 'Thương hiệu', 12, '2025-10-08 10:30:00', '2025-10-08 10:30:00'),
-- Category 13: Mỹ phẩm (Dung tích, Loại da, Xuất xứ)
(43, 'Dung tích', 13, '2025-10-12 11:45:00', '2025-10-12 11:45:00'),
(44, 'Loại da', 13, '2025-10-12 11:45:00', '2025-10-12 11:45:00'),
(45, 'Xuất xứ', 13, '2025-10-12 11:45:00', '2025-10-12 11:45:00'),
-- Category 14: Đồ trẻ em (Size, Màu sắc, Độ tuổi)
(46, 'Size', 14, '2025-10-15 14:00:00', '2025-10-15 14:00:00'),
(47, 'Màu sắc', 14, '2025-10-15 14:00:00', '2025-10-15 14:00:00'),
(48, 'Độ tuổi', 14, '2025-10-15 14:00:00', '2025-10-15 14:00:00'),
-- Category 15: Thực phẩm khô (Khối lượng, Hạn sử dụng, Xuất xứ)
(49, 'Khối lượng', 15, '2025-10-18 15:30:00', '2025-10-18 15:30:00'),
(50, 'Hạn sử dụng', 15, '2025-10-18 15:30:00', '2025-10-18 15:30:00'),
(51, 'Xuất xứ', 15, '2025-10-18 15:30:00', '2025-10-18 15:30:00'),
-- Category 16: Túi xách (Size, Màu sắc, Chất liệu)
(52, 'Size', 16, '2025-10-22 08:15:00', '2025-10-22 08:15:00'),
(53, 'Màu sắc', 16, '2025-10-22 08:15:00', '2025-10-22 08:15:00'),
(54, 'Chất liệu', 16, '2025-10-22 08:15:00', '2025-10-22 08:15:00'),
-- Category 17: Đồng hồ (Loại máy, Màu sắc, Chất liệu dây)
(55, 'Loại máy', 17, '2025-10-25 09:45:00', '2025-10-25 09:45:00'),
(56, 'Màu sắc', 17, '2025-10-25 09:45:00', '2025-10-25 09:45:00'),
(57, 'Chất liệu dây', 17, '2025-10-25 09:45:00', '2025-10-25 09:45:00'),
-- Category 18: Dụng cụ nhà bếp (Kích thước, Màu sắc, Chất liệu)
(58, 'Kích thước', 18, '2025-10-28 11:00:00', '2025-10-28 11:00:00'),
(59, 'Màu sắc', 18, '2025-10-28 11:00:00', '2025-10-28 11:00:00'),
(60, 'Chất liệu', 18, '2025-10-28 11:00:00', '2025-10-28 11:00:00'),
-- Category 19: Máy ảnh (Độ phân giải, Màu sắc, Loại ống kính)
(61, 'Độ phân giải', 19, '2025-11-01 13:20:00', '2025-11-01 13:20:00'),
(62, 'Màu sắc', 19, '2025-11-01 13:20:00', '2025-11-01 13:20:00'),
(63, 'Loại ống kính', 19, '2025-11-01 13:20:00', '2025-11-01 13:20:00'),
-- Category 20: Bút viết (Loại bút, Màu mực, Thương hiệu)
(64, 'Loại bút', 20, '2025-11-05 14:50:00', '2025-11-05 14:50:00'),
(65, 'Màu mực', 20, '2025-11-05 14:50:00', '2025-11-05 14:50:00'),
(66, 'Thương hiệu', 20, '2025-11-05 14:50:00', '2025-11-05 14:50:00');

-- =============================================
-- ADMINS (3 records - keep existing + 2 new)
-- =============================================
-- Keep existing admins, add if needed

-- =============================================
-- CLIENTS (15 records)
-- =============================================
DELETE FROM `clients` WHERE `id` LIKE 'CLIENT2025%' OR `id` LIKE 'CLIENT2026%';
INSERT INTO `clients` (`id`, `phone`, `password`, `email`, `username`, `date_of_birth`, `gender`, `scores`, `type`, `status`, `main_address`, `image`, `bank_name`, `bank_account_number`, `bank_account_holder_name`, `wallet`, `is_verified_email`, `passwordChangedAt`, `createdAt`, `updatedAt`) VALUES
('CLIENT2025001', '0901234567', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'nguyenvana@gmail.com', 'Nguyễn Văn An', '1995-03-15', 'male', 150, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'Vietcombank', '0123456789', 'Nguyen Van An', 5000000, 1, '2025-08-05 09:30:00', '2025-08-05 09:30:00', '2025-08-05 09:30:00'),
('CLIENT2025002', '0902345678', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'tranthib@gmail.com', 'Trần Thị Bình', '1998-07-22', 'female', 200, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'Techcombank', '9876543210', 'Tran Thi Binh', 3500000, 1, '2025-08-10 14:20:00', '2025-08-10 14:20:00', '2025-08-10 14:20:00'),
('CLIENT2025003', '0903456789', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'levanc@gmail.com', 'Lê Văn Cường', '1992-11-08', 'male', 320, 'VIP', 'ACTIVE', NULL, 'default-client.jpg', 'MB', '1122334455', 'Le Van Cuong', 8500000, 1, '2025-08-15 10:45:00', '2025-08-15 10:45:00', '2025-08-15 10:45:00'),
('CLIENT2025004', '0904567890', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'phamthid@gmail.com', 'Phạm Thị Dung', '2000-01-30', 'female', 100, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'ACB', '5566778899', 'Pham Thi Dung', 2000000, 1, '2025-08-20 16:10:00', '2025-08-20 16:10:00', '2025-08-20 16:10:00'),
('CLIENT2025005', '0905678901', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'hoangvane@gmail.com', 'Hoàng Văn Em', '1997-05-12', 'male', 180, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'Sacombank', '6677889900', 'Hoang Van Em', 4200000, 1, '2025-08-28 08:55:00', '2025-08-28 08:55:00', '2025-08-28 08:55:00'),
('CLIENT2025006', '0906789012', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'vuthif@gmail.com', 'Vũ Thị Phương', '1994-09-20', 'female', 250, 'VIP', 'ACTIVE', NULL, 'default-client.jpg', 'VPBank', '7788990011', 'Vu Thi Phuong', 6500000, 1, '2025-09-01 10:00:00', '2025-09-01 10:00:00', '2025-09-01 10:00:00'),
('CLIENT2025007', '0907890123', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'dangvang@gmail.com', 'Đặng Văn Giang', '1990-12-05', 'male', 400, 'VIP', 'ACTIVE', NULL, 'default-client.jpg', 'TPBank', '8899001122', 'Dang Van Giang', 12000000, 1, '2025-09-05 11:30:00', '2025-09-05 11:30:00', '2025-09-05 11:30:00'),
('CLIENT2025008', '0908901234', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'buithih@gmail.com', 'Bùi Thị Hương', '1999-04-18', 'female', 120, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'OCB', '9900112233', 'Bui Thi Huong', 2800000, 1, '2025-09-10 13:45:00', '2025-09-10 13:45:00', '2025-09-10 13:45:00'),
('CLIENT2025009', '0909012345', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'ngovanh@gmail.com', 'Ngô Văn Hải', '1996-06-25', 'male', 160, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'SHB', '0011223344', 'Ngo Van Hai', 3800000, 1, '2025-09-15 15:00:00', '2025-09-15 15:00:00', '2025-09-15 15:00:00'),
('CLIENT2025010', '0910123456', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'dothik@gmail.com', 'Đỗ Thị Kim', '2001-02-14', 'female', 90, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'Vietinbank', '1122334455', 'Do Thi Kim', 1500000, 1, '2025-09-20 16:30:00', '2025-09-20 16:30:00', '2025-09-20 16:30:00'),
('CLIENT2025011', '0911234567', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'trinhvanl@gmail.com', 'Trịnh Văn Long', '1993-08-10', 'male', 280, 'VIP', 'ACTIVE', NULL, 'default-client.jpg', 'BIDV', '2233445566', 'Trinh Van Long', 7200000, 1, '2025-09-25 08:15:00', '2025-09-25 08:15:00', '2025-09-25 08:15:00'),
('CLIENT2025012', '0912345678', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'lyethim@gmail.com', 'Lý Thị Mai', '1997-11-28', 'female', 140, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'Agribank', '3344556677', 'Ly Thi Mai', 3200000, 1, '2025-10-01 09:45:00', '2025-10-01 09:45:00', '2025-10-01 09:45:00'),
('CLIENT2025013', '0913456789', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'maivann@gmail.com', 'Mai Văn Nam', '1988-05-05', 'male', 500, 'VIP', 'ACTIVE', NULL, 'default-client.jpg', 'Vietcombank', '4455667788', 'Mai Van Nam', 15000000, 1, '2025-10-05 11:00:00', '2025-10-05 11:00:00', '2025-10-05 11:00:00'),
('CLIENT2025014', '0914567890', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'caothio@gmail.com', 'Cao Thị Oanh', '2002-09-15', 'female', 80, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'MB', '5566778899', 'Cao Thi Oanh', 1200000, 1, '2025-10-10 14:20:00', '2025-10-10 14:20:00', '2025-10-10 14:20:00'),
('CLIENT2025015', '0915678901', '$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e', 'lamvanp@gmail.com', 'Lâm Văn Phúc', '1991-01-22', 'male', 220, 'NORMAL', 'ACTIVE', NULL, 'default-client.jpg', 'Techcombank', '6677889900', 'Lam Van Phuc', 5500000, 1, '2025-10-15 16:00:00', '2025-10-15 16:00:00', '2025-10-15 16:00:00');

-- =============================================
-- SHIPPERS (15 records)
-- =============================================
DELETE FROM `shippers` WHERE `id` LIKE 'SHIPPER2025%' OR `id` LIKE 'SHIPPER2026%';
INSERT INTO `shippers` (`id`, `citizen_id`, `id_image`, `image`, `profile_image`, `health_image`, `email`, `phone`, `password`, `fullname`, `status`, `is_available`, `vehicle_name`, `license_plate`, `rating`, `total_deliveries`, `work_area_city`, `work_area_village`, `wallet`, `bank_name`, `bank_account_number`, `bank_account_holder_name`, `is_verified_email`, `createdAt`, `updatedAt`) VALUES
('SHIPPER2025001', '038201234567', 'citizen_id-1.jpeg', 'vehicle-1.jpeg', 'profile-1.jpeg', 'health-1.jpeg', 'shipper.tuan@gmail.com', '0931234567', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Nguyễn Văn Tuấn', 'ACTIVE', 1, 'motorcycle', '59A1-12345', 45, 120, 'Hà Nội', 'Cầu Giấy', 2500000, 'Vietcombank', '0011223344', 'Nguyen Van Tuan', 1, '2025-08-05 08:30:00', '2025-08-05 08:30:00'),
('SHIPPER2025002', '039302345678', 'citizen_id-2.jpeg', 'vehicle-2.jpeg', 'profile-2.jpeg', 'health-2.jpeg', 'shipper.hoa@gmail.com', '0932345678', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Trần Thị Hoa', 'ACTIVE', 1, 'motorcycle', '30A2-23456', 42, 95, 'TP. Hồ Chí Minh', 'Quận 1', 1800000, 'Techcombank', '1122334455', 'Tran Thi Hoa', 1, '2025-08-12 10:15:00', '2025-08-12 10:15:00'),
('SHIPPER2025003', '040403456789', 'citizen_id-3.jpeg', 'vehicle-3.jpeg', 'profile-3.jpeg', 'health-3.jpeg', 'shipper.minh@gmail.com', '0933456789', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Lê Văn Minh', 'ACTIVE', 0, 'motorcycle', '43A3-34567', 48, 150, 'Đà Nẵng', 'Hải Châu', 3200000, 'MB', '2233445566', 'Le Van Minh', 1, '2025-08-20 14:45:00', '2025-08-20 14:45:00'),
('SHIPPER2025004', '041504567890', 'citizen_id-4.jpeg', 'vehicle-4.jpeg', 'profile-4.jpeg', 'health-4.jpeg', 'shipper.lan@gmail.com', '0934567890', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Phạm Thị Lan', 'ACTIVE', 1, 'motorcycle', '51B4-45678', 50, 200, 'TP. Hồ Chí Minh', 'Quận 7', 4500000, 'ACB', '3344556677', 'Pham Thi Lan', 1, '2025-09-05 09:20:00', '2025-09-05 09:20:00'),
('SHIPPER2025005', '042605678901', 'citizen_id-5.jpeg', 'vehicle-5.jpeg', 'profile-5.jpeg', 'health-5.jpeg', 'shipper.duc@gmail.com', '0935678901', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Hoàng Văn Đức', 'ACTIVE', 1, 'motorcycle', '29B5-56789', 46, 110, 'Hà Nội', 'Đống Đa', 2100000, 'BIDV', '4455667788', 'Hoang Van Duc', 1, '2025-09-15 11:30:00', '2025-09-15 11:30:00'),
('SHIPPER2025006', '043706789012', 'citizen_id-6.jpeg', 'vehicle-6.jpeg', 'profile-6.jpeg', 'health-6.jpeg', 'shipper.hung@gmail.com', '0936789012', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Vũ Văn Hùng', 'ACTIVE', 1, 'motorcycle', '92A6-67890', 44, 85, 'Hải Phòng', 'Lê Chân', 1600000, 'VPBank', '5566778899', 'Vu Van Hung', 1, '2025-09-20 08:00:00', '2025-09-20 08:00:00'),
('SHIPPER2025007', '044807890123', 'citizen_id-7.jpeg', 'vehicle-7.jpeg', 'profile-7.jpeg', 'health-7.jpeg', 'shipper.nga@gmail.com', '0937890123', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Đặng Thị Nga', 'ACTIVE', 1, 'motorcycle', '36B7-78901', 47, 130, 'TP. Hồ Chí Minh', 'Quận 3', 2900000, 'TPBank', '6677889900', 'Dang Thi Nga', 1, '2025-09-25 09:30:00', '2025-09-25 09:30:00'),
('SHIPPER2025008', '045908901234', 'citizen_id-8.jpeg', 'vehicle-8.jpeg', 'profile-8.jpeg', 'health-8.jpeg', 'shipper.khanh@gmail.com', '0938901234', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Bùi Văn Khánh', 'ACTIVE', 0, 'motorcycle', '29C8-89012', 49, 180, 'Hà Nội', 'Hoàng Mai', 3800000, 'OCB', '7788990011', 'Bui Van Khanh', 1, '2025-10-01 10:45:00', '2025-10-01 10:45:00'),
('SHIPPER2025009', '046009012345', 'citizen_id-9.jpeg', 'vehicle-9.jpeg', 'profile-9.jpeg', 'health-9.jpeg', 'shipper.thao@gmail.com', '0939012345', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Ngô Thị Thảo', 'ACTIVE', 1, 'motorcycle', '51D9-90123', 43, 70, 'TP. Hồ Chí Minh', 'Bình Thạnh', 1400000, 'SHB', '8899001122', 'Ngo Thi Thao', 1, '2025-10-05 11:15:00', '2025-10-05 11:15:00'),
('SHIPPER2025010', '047110123456', 'citizen_id-10.jpeg', 'vehicle-10.jpeg', 'profile-10.jpeg', 'health-10.jpeg', 'shipper.phong@gmail.com', '0940123456', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Đỗ Văn Phong', 'ACTIVE', 1, 'motorcycle', '43E0-01234', 50, 220, 'Đà Nẵng', 'Thanh Khê', 5200000, 'Vietinbank', '9900112233', 'Do Van Phong', 1, '2025-10-10 13:00:00', '2025-10-10 13:00:00'),
('SHIPPER2025011', '048211234567', 'citizen_id-11.jpeg', 'vehicle-11.jpeg', 'profile-11.jpeg', 'health-11.jpeg', 'shipper.linh@gmail.com', '0941234567', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Trịnh Thị Linh', 'ACTIVE', 1, 'motorcycle', '30F1-12345', 46, 100, 'TP. Hồ Chí Minh', 'Tân Bình', 2200000, 'Agribank', '0011223344', 'Trinh Thi Linh', 1, '2025-10-15 14:30:00', '2025-10-15 14:30:00'),
('SHIPPER2025012', '049312345678', 'citizen_id-12.jpeg', 'vehicle-12.jpeg', 'profile-12.jpeg', 'health-12.jpeg', 'shipper.son@gmail.com', '0942345678', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Lý Văn Sơn', 'ACTIVE', 0, 'motorcycle', '92G2-23456', 41, 55, 'Hải Phòng', 'Ngô Quyền', 1100000, 'Vietcombank', '1122334455', 'Ly Van Son', 1, '2025-10-20 15:45:00', '2025-10-20 15:45:00'),
('SHIPPER2025013', '050413456789', 'citizen_id-13.jpeg', 'vehicle-13.jpeg', 'profile-13.jpeg', 'health-13.jpeg', 'shipper.huyen@gmail.com', '0943456789', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Mai Thị Huyền', 'ACTIVE', 1, 'motorcycle', '29H3-34567', 48, 160, 'Hà Nội', 'Thanh Xuân', 3500000, 'MB', '2233445566', 'Mai Thi Huyen', 1, '2025-10-25 08:15:00', '2025-10-25 08:15:00'),
('SHIPPER2025014', '051514567890', 'citizen_id-14.jpeg', 'vehicle-14.jpeg', 'profile-14.jpeg', 'health-14.jpeg', 'shipper.quang@gmail.com', '0944567890', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Cao Văn Quang', 'ACTIVE', 1, 'motorcycle', '51I4-45678', 45, 90, 'TP. Hồ Chí Minh', 'Gò Vấp', 1900000, 'Techcombank', '3344556677', 'Cao Van Quang', 1, '2025-11-01 09:30:00', '2025-11-01 09:30:00'),
('SHIPPER2025015', '052615678901', 'citizen_id-15.jpeg', 'vehicle-15.jpeg', 'profile-15.jpeg', 'health-15.jpeg', 'shipper.tam@gmail.com', '0945678901', '$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.', 'Lâm Văn Tâm', 'ACTIVE', 1, 'motorcycle', '36J5-56789', 47, 140, 'Đà Nẵng', 'Sơn Trà', 3100000, 'ACB', '4455667788', 'Lam Van Tam', 1, '2025-11-05 10:45:00', '2025-11-05 10:45:00');

-- =============================================
-- STORES (15 records)
-- =============================================
DELETE FROM `stores` WHERE `id` LIKE 'STORE2025%' OR `id` LIKE 'STORE2026%';
INSERT INTO `stores` (`id`, `citizen_id`, `id_image`, `name`, `phone`, `password`, `email`, `bank_name`, `bank_account_number`, `bank_account_holder_name`, `rating`, `total_sales`, `number_of_products`, `status`, `followers`, `wallet`, `city`, `village`, `detail_address`, `is_mall`, `image`, `description`, `is_verified_email`, `passwordChangedAt`, `createdAt`, `updatedAt`) VALUES
('STORE2025001', '038123456789', 'citizen_id-s1.jpeg', 'Thời Trang Việt', '0951234567', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'thoitrangviet@gmail.com', 'Vietcombank', '1234567890', 'Tran Van A', 45, 15000000, 120, 'ACTIVE', 2500, 8500000, 'Hà Nội', 'Cầu Giấy', '123 Xuân Thủy', 1, 'store-s1.jpeg', 'Chuyên thời trang nam nữ cao cấp', 1, '2025-08-05 09:00:00', '2025-08-05 09:00:00', '2025-08-05 09:00:00'),
('STORE2025002', '039234567890', 'citizen_id-s2.jpeg', 'Điện Tử Số', '0952345678', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'dientuso@gmail.com', 'Techcombank', '2345678901', 'Le Thi B', 48, 25000000, 85, 'ACTIVE', 3200, 12500000, 'TP. Hồ Chí Minh', 'Quận 1', '456 Nguyễn Huệ', 1, 'store-s2.jpeg', 'Thiết bị điện tử chính hãng', 1, '2025-08-10 11:30:00', '2025-08-10 11:30:00', '2025-08-10 11:30:00'),
('STORE2025003', '040345678901', 'citizen_id-s3.jpeg', 'Gia Dụng Pro', '0953456789', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'giadungpro@gmail.com', 'MB', '3456789012', 'Pham Van C', 42, 18000000, 200, 'ACTIVE', 4100, 9800000, 'Hà Nội', 'Đống Đa', '789 Thái Hà', 0, 'store-s3.jpeg', 'Đồ gia dụng chất lượng', 1, '2025-08-18 14:20:00', '2025-08-18 14:20:00', '2025-08-18 14:20:00'),
('STORE2025004', '041456789012', 'citizen_id-s4.jpeg', 'Sách Hay Online', '0954567890', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'sachhay@gmail.com', 'ACB', '4567890123', 'Nguyen Thi D', 46, 12000000, 150, 'ACTIVE', 1800, 6200000, 'Đà Nẵng', 'Hải Châu', '101 Trần Phú', 1, 'store-s4.jpeg', 'Sách hay giá tốt', 1, '2025-08-25 16:45:00', '2025-08-25 16:45:00', '2025-08-25 16:45:00'),
('STORE2025005', '042567890123', 'citizen_id-s5.jpeg', 'Giày Dép Fashion', '0955678901', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'giaydep@gmail.com', 'BIDV', '5678901234', 'Hoang Van E', 40, 8000000, 500, 'ACTIVE', 5500, 4500000, 'TP. Hồ Chí Minh', 'Quận 3', '202 Võ Văn Tần', 0, 'store-s5.jpeg', 'Giày dép thời trang', 1, '2025-09-03 10:15:00', '2025-09-03 10:15:00', '2025-09-03 10:15:00'),
('STORE2025006', '043678901234', 'citizen_id-s6.jpeg', 'Thể Thao 360', '0956789012', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'thethao360@gmail.com', 'VPBank', '6789012345', 'Vu Van F', 44, 10000000, 180, 'ACTIVE', 2800, 5800000, 'Hà Nội', 'Hoàng Mai', '303 Giải Phóng', 0, 'store-s6.jpeg', 'Đồ thể thao đa dạng', 1, '2025-09-08 08:30:00', '2025-09-08 08:30:00', '2025-09-08 08:30:00'),
('STORE2025007', '044789012345', 'citizen_id-s7.jpeg', 'Mỹ Phẩm Hàn Quốc', '0957890123', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'myphamhq@gmail.com', 'TPBank', '7890123456', 'Dang Thi G', 47, 20000000, 300, 'ACTIVE', 6200, 11000000, 'TP. Hồ Chí Minh', 'Quận 5', '404 Trần Hưng Đạo', 1, 'store-s7.jpeg', 'Mỹ phẩm nhập khẩu chính hãng', 1, '2025-09-15 09:45:00', '2025-09-15 09:45:00', '2025-09-15 09:45:00'),
('STORE2025008', '045890123456', 'citizen_id-s8.jpeg', 'Baby World', '0958901234', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'babyworld@gmail.com', 'OCB', '8901234567', 'Bui Van H', 43, 9000000, 250, 'ACTIVE', 3500, 7200000, 'Hà Nội', 'Ba Đình', '505 Kim Mã', 0, 'store-s8.jpeg', 'Đồ dùng cho mẹ và bé', 1, '2025-09-22 11:00:00', '2025-09-22 11:00:00', '2025-09-22 11:00:00'),
('STORE2025009', '046901234567', 'citizen_id-s9.jpeg', 'Thực Phẩm Sạch', '0959012345', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'thucphamsach@gmail.com', 'SHB', '9012345678', 'Ngo Thi I', 46, 15000000, 400, 'ACTIVE', 4800, 8900000, 'Đà Nẵng', 'Ngũ Hành Sơn', '606 Lê Văn Hiến', 1, 'store-s9.jpeg', 'Thực phẩm organic', 1, '2025-09-28 13:15:00', '2025-09-28 13:15:00', '2025-09-28 13:15:00'),
('STORE2025010', '047012345678', 'citizen_id-s10.jpeg', 'Túi Xách Luxury', '0960123456', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'tuixachluxury@gmail.com', 'Vietinbank', '0123456789', 'Do Van J', 49, 30000000, 80, 'ACTIVE', 7500, 16000000, 'TP. Hồ Chí Minh', 'Quận 7', '707 Nguyễn Văn Linh', 1, 'store-s10.jpeg', 'Túi xách cao cấp', 1, '2025-10-05 14:30:00', '2025-10-05 14:30:00', '2025-10-05 14:30:00'),
('STORE2025011', '048123456789', 'citizen_id-s11.jpeg', 'Đồng Hồ Chính Hãng', '0961234567', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'dongho@gmail.com', 'Agribank', '1234567890', 'Trinh Van K', 48, 35000000, 60, 'ACTIVE', 5000, 18000000, 'Hà Nội', 'Hai Bà Trưng', '808 Bà Triệu', 1, 'store-s11.jpeg', 'Đồng hồ nam nữ chính hãng', 1, '2025-10-12 15:45:00', '2025-10-12 15:45:00', '2025-10-12 15:45:00'),
('STORE2025012', '049234567890', 'citizen_id-s12.jpeg', 'Bếp Việt', '0962345678', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'bepviet@gmail.com', 'Vietcombank', '2345678901', 'Ly Thi L', 41, 7000000, 350, 'ACTIVE', 2200, 4200000, 'TP. Hồ Chí Minh', 'Bình Tân', '909 Kinh Dương Vương', 0, 'store-s12.jpeg', 'Dụng cụ nhà bếp đa dạng', 1, '2025-10-18 08:00:00', '2025-10-18 08:00:00', '2025-10-18 08:00:00'),
('STORE2025013', '050345678901', 'citizen_id-s13.jpeg', 'Camera Pro', '0963456789', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'camerapro@gmail.com', 'MB', '3456789012', 'Mai Van M', 50, 40000000, 45, 'ACTIVE', 4200, 22000000, 'Hà Nội', 'Tây Hồ', '1010 Lạc Long Quân', 1, 'store-s13.jpeg', 'Máy ảnh và phụ kiện', 1, '2025-10-25 09:15:00', '2025-10-25 09:15:00', '2025-10-25 09:00:00'),
('STORE2025014', '051456789012', 'citizen_id-s14.jpeg', 'Văn Phòng Phẩm ABC', '0964567890', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'vanphongphamabc@gmail.com', 'Techcombank', '4567890123', 'Cao Thi N', 44, 5000000, 600, 'ACTIVE', 1500, 3000000, 'Đà Nẵng', 'Liên Chiểu', '1111 Nguyễn Lương Bằng', 0, 'store-s14.jpeg', 'Văn phòng phẩm giá rẻ', 1, '2025-11-01 10:30:00', '2025-11-01 10:30:00', '2025-11-01 10:30:00'),
('STORE2025015', '052567890123', 'citizen_id-s15.jpeg', 'Xe Máy Phú Thọ', '0965678901', '$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS', 'xemayphutho@gmail.com', 'ACB', '5678901234', 'Lam Van O', 47, 50000000, 30, 'ACTIVE', 3800, 28000000, 'TP. Hồ Chí Minh', 'Phú Nhuận', '1212 Phan Xích Long', 1, 'store-s15.jpeg', 'Xe máy chính hãng', 1, '2025-11-08 11:45:00', '2025-11-08 11:45:00', '2025-11-08 11:45:00');

-- =============================================
-- PRODUCTS (20 records) - with correct storeId
-- =============================================
DELETE FROM `products` WHERE `id` > 4;
INSERT INTO `products` (`id`, `name`, `description`, `origin`, `sold`, `discount`, `min_price`, `rating_average`, `review_numbers`, `main_image`, `status`, `categoryId`, `storeId`, `createdAt`, `updatedAt`) VALUES
(5, 'iPhone 15 Pro Max 256GB', 'Điện thoại iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch.', 'Mỹ', 150, 10, 32990000, 48, 120, 'dienthoai1.png', 'ACTIVE', 1, 'STORE2025002', '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
(6, 'Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24 Ultra 5G, camera 200MP, S Pen tích hợp, màn hình Dynamic AMOLED 2X 6.8 inch.', 'Hàn Quốc', 120, 15, 29990000, 46, 95, 'dienthoai2.png', 'ACTIVE', 1, 'STORE2025002', '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
(7, 'MacBook Pro 14 M3 Pro', 'Laptop MacBook Pro 14 inch chip M3 Pro, 18GB RAM, 512GB SSD. Màn hình Liquid Retina XDR.', 'Mỹ', 65, 8, 52990000, 49, 45, 'laptop1.png', 'ACTIVE', 2, 'STORE2025002', '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
(8, 'Sony Bravia XR 65 inch', 'Tivi Sony Bravia XR 65 inch 4K HDR, công nghệ Cognitive Processor XR.', 'Nhật Bản', 30, 15, 35990000, 48, 25, 'tivi1.png', 'ACTIVE', 3, 'STORE2025002', '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
(9, 'Áo sơ mi nam Oxford', 'Áo sơ mi nam vải Oxford cao cấp, form regular fit, cổ button-down.', 'Việt Nam', 200, 5, 450000, 44, 180, 'thoitrangnam1.png', 'ACTIVE', 4, 'STORE2025001', '2025-09-10 08:45:00', '2025-09-10 08:45:00'),
(10, 'Đầm nữ dự tiệc', 'Đầm nữ dự tiệc thiết kế sang trọng, chất liệu lụa cao cấp.', 'Việt Nam', 120, 20, 890000, 47, 95, 'thoitrangnu1.png', 'ACTIVE', 5, 'STORE2025001', '2025-09-18 09:50:00', '2025-09-18 09:50:00'),
(11, 'Giày thể thao Nike Air', 'Giày thể thao Nike Air Max, đệm khí êm ái, thiết kế năng động.', 'Việt Nam', 180, 25, 2890000, 47, 142, 'giaydepnam1.png', 'ACTIVE', 6, 'STORE2025005', '2025-09-25 08:30:00', '2025-09-25 08:30:00'),
(12, 'Nồi chiên không dầu 5.5L', 'Nồi chiên không dầu 5.5L, công suất 1800W, 8 chức năng nấu.', 'Trung Quốc', 140, 12, 1890000, 45, 112, 'giadung1.png', 'ACTIVE', 7, 'STORE2025003', '2025-10-02 13:45:00', '2025-10-02 13:45:00'),
(13, 'Ghế gaming cao cấp', 'Ghế gaming có gác chân, đệm mút D cao cấp, lưng ngả 180 độ.', 'Trung Quốc', 70, 20, 2990000, 46, 55, 'banghe1.png', 'ACTIVE', 8, 'STORE2025003', '2025-10-10 14:15:00', '2025-10-10 14:15:00'),
(14, 'Tai nghe Bluetooth Sony', 'Tai nghe Sony WH-1000XM5, chống ồn chủ động, pin 30 giờ.', 'Nhật Bản', 100, 15, 8490000, 48, 82, 'phukien1.png', 'ACTIVE', 9, 'STORE2025002', '2025-10-18 16:30:00', '2025-10-18 16:30:00'),
(15, 'Honda Vision 2025', 'Xe máy Honda Vision phiên bản mới, tiết kiệm xăng, thiết kế thời trang.', 'Việt Nam', 45, 5, 35000000, 49, 30, 'xe1.png', 'ACTIVE', 11, 'STORE2025015', '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
(16, 'Bộ đồ thể thao Adidas', 'Bộ quần áo thể thao Adidas, chất liệu thấm hút mồ hôi, co giãn tốt.', 'Việt Nam', 95, 30, 1290000, 46, 68, 'thethao1.png', 'ACTIVE', 12, 'STORE2025006', '2025-10-25 10:15:00', '2025-10-25 10:15:00'),
(17, 'Serum Vitamin C Klairs', 'Serum vitamin C làm sáng da, mờ thâm, dưỡng ẩm. Phù hợp mọi loại da.', 'Hàn Quốc', 220, 15, 450000, 47, 185, 'phukien2.png', 'ACTIVE', 13, 'STORE2025007', '2025-10-28 11:30:00', '2025-10-28 11:30:00'),
(18, 'Bộ quần áo trẻ em cotton', 'Bộ quần áo trẻ em 100% cotton, mềm mại, an toàn cho bé từ 1-5 tuổi.', 'Việt Nam', 300, 10, 189000, 45, 210, 'treem1.png', 'ACTIVE', 14, 'STORE2025008', '2025-11-01 08:45:00', '2025-11-01 08:45:00'),
(19, 'Gạo ST25 cao cấp 5kg', 'Gạo ST25 đặc sản Sóc Trăng, hạt dài, thơm dẻo, ngon nhất thế giới.', 'Việt Nam', 500, 8, 180000, 48, 320, 'doan1.png', 'ACTIVE', 15, 'STORE2025009', '2025-11-03 09:30:00', '2025-11-03 09:30:00'),
(20, 'Túi xách nữ Charles & Keith', 'Túi xách nữ thiết kế sang trọng, chất liệu da PU cao cấp.', 'Singapore', 85, 20, 1590000, 46, 72, 'tuixach1.png', 'ACTIVE', 16, 'STORE2025010', '2025-11-05 10:45:00', '2025-11-05 10:45:00'),
(21, 'Đồng hồ Casio G-Shock', 'Đồng hồ nam Casio G-Shock chống sốc, chống nước 200m, pin 10 năm.', 'Nhật Bản', 60, 15, 3500000, 48, 48, 'phukien3.png', 'ACTIVE', 17, 'STORE2025011', '2025-11-08 11:00:00', '2025-11-08 11:00:00'),
(22, 'Bộ nồi inox 5 chiếc', 'Bộ nồi inox 304 cao cấp 5 chiếc, đáy từ, dùng được trên mọi loại bếp.', 'Việt Nam', 110, 25, 890000, 44, 88, 'dungcu1.png', 'ACTIVE', 18, 'STORE2025012', '2025-11-10 13:15:00', '2025-11-10 13:15:00'),
(23, 'Máy ảnh Sony Alpha A7 IV', 'Máy ảnh full-frame Sony A7 IV, 33MP, quay video 4K 60fps, IBIS 5 trục.', 'Nhật Bản', 25, 10, 54990000, 50, 22, 'phukien4.png', 'ACTIVE', 19, 'STORE2025013', '2025-11-12 14:30:00', '2025-11-12 14:30:00'),
(24, 'Bút bi Thiên Long TL-027', 'Hộp 20 bút bi Thiên Long TL-027, nét đều, viết êm, giá rẻ.', 'Việt Nam', 1000, 5, 45000, 43, 150, 'sachvo1.png', 'ACTIVE', 20, 'STORE2025014', '2025-11-15 15:45:00', '2025-11-15 15:45:00');

-- =============================================
-- PRODUCT_VARIANTS (40 records) - 2 variants per product
-- =============================================
DELETE FROM `product_variants` WHERE `id` > 14;
INSERT INTO `product_variants` (`id`, `price`, `stock_quantity`, `productId`, `createdAt`, `updatedAt`) VALUES
-- iPhone 15 Pro Max (productId: 5)
(15, 32990000, 50, 5, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
(16, 38990000, 30, 5, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
-- Samsung Galaxy S24 Ultra (productId: 6)
(17, 29990000, 45, 6, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
(18, 34990000, 25, 6, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
-- MacBook Pro 14 (productId: 7)
(19, 52990000, 25, 7, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
(20, 62990000, 15, 7, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
-- Sony Bravia XR (productId: 8)
(21, 35990000, 28, 8, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
(22, 42990000, 15, 8, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
-- Áo sơ mi nam (productId: 9)
(23, 450000, 150, 9, '2025-09-10 08:45:00', '2025-09-10 08:45:00'),
(24, 520000, 100, 9, '2025-09-10 08:45:00', '2025-09-10 08:45:00'),
-- Đầm nữ dự tiệc (productId: 10)
(25, 890000, 80, 10, '2025-09-18 09:50:00', '2025-09-18 09:50:00'),
(26, 990000, 50, 10, '2025-09-18 09:50:00', '2025-09-18 09:50:00'),
-- Giày Nike Air (productId: 11)
(27, 2890000, 45, 11, '2025-09-25 08:30:00', '2025-09-25 08:30:00'),
(28, 3290000, 30, 11, '2025-09-25 08:30:00', '2025-09-25 08:30:00'),
-- Nồi chiên không dầu (productId: 12)
(29, 1890000, 90, 12, '2025-10-02 13:45:00', '2025-10-02 13:45:00'),
(30, 2290000, 60, 12, '2025-10-02 13:45:00', '2025-10-02 13:45:00'),
-- Ghế gaming (productId: 13)
(31, 2990000, 40, 13, '2025-10-10 14:15:00', '2025-10-10 14:15:00'),
(32, 3490000, 25, 13, '2025-10-10 14:15:00', '2025-10-10 14:15:00'),
-- Tai nghe Sony (productId: 14)
(33, 8490000, 30, 14, '2025-10-18 16:30:00', '2025-10-18 16:30:00'),
(34, 9490000, 20, 14, '2025-10-18 16:30:00', '2025-10-18 16:30:00'),
-- Honda Vision (productId: 15)
(35, 35000000, 20, 15, '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
(36, 37500000, 15, 15, '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
-- Bộ đồ thể thao Adidas (productId: 16)
(37, 1290000, 80, 16, '2025-10-25 10:15:00', '2025-10-25 10:15:00'),
(38, 1490000, 60, 16, '2025-10-25 10:15:00', '2025-10-25 10:15:00'),
-- Serum Vitamin C (productId: 17)
(39, 450000, 200, 17, '2025-10-28 11:30:00', '2025-10-28 11:30:00'),
(40, 520000, 150, 17, '2025-10-28 11:30:00', '2025-10-28 11:30:00'),
-- Bộ quần áo trẻ em (productId: 18)
(41, 189000, 300, 18, '2025-11-01 08:45:00', '2025-11-01 08:45:00'),
(42, 219000, 250, 18, '2025-11-01 08:45:00', '2025-11-01 08:45:00'),
-- Gạo ST25 (productId: 19)
(43, 180000, 500, 19, '2025-11-03 09:30:00', '2025-11-03 09:30:00'),
(44, 350000, 300, 19, '2025-11-03 09:30:00', '2025-11-03 09:30:00'),
-- Túi xách Charles & Keith (productId: 20)
(45, 1590000, 50, 20, '2025-11-05 10:45:00', '2025-11-05 10:45:00'),
(46, 1890000, 35, 20, '2025-11-05 10:45:00', '2025-11-05 10:45:00'),
-- Đồng hồ Casio (productId: 21)
(47, 3500000, 40, 21, '2025-11-08 11:00:00', '2025-11-08 11:00:00'),
(48, 4200000, 25, 21, '2025-11-08 11:00:00', '2025-11-08 11:00:00'),
-- Bộ nồi inox (productId: 22)
(49, 890000, 100, 22, '2025-11-10 13:15:00', '2025-11-10 13:15:00'),
(50, 1190000, 70, 22, '2025-11-10 13:15:00', '2025-11-10 13:15:00'),
-- Máy ảnh Sony (productId: 23)
(51, 54990000, 15, 23, '2025-11-12 14:30:00', '2025-11-12 14:30:00'),
(52, 64990000, 10, 23, '2025-11-12 14:30:00', '2025-11-12 14:30:00'),
-- Bút bi Thiên Long (productId: 24)
(53, 45000, 1000, 24, '2025-11-15 15:45:00', '2025-11-15 15:45:00'),
(54, 65000, 800, 24, '2025-11-15 15:45:00', '2025-11-15 15:45:00');

-- =============================================
-- VARIANT_OPTIONS (120 records) - 3 options per variant
-- Maps ProductVariant to Attributes
-- =============================================
DELETE FROM `variant_options` WHERE `id` > 42;
INSERT INTO `variant_options` (`id`, `value`, `product_variantId`, `attributeId`, `createdAt`, `updatedAt`) VALUES
-- iPhone 15 Pro Max - Variant 15 (256GB, Titan Đen, 8GB)
(43, '256GB', 15, 7, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
(44, 'Titan Đen', 15, 8, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
(45, '8GB', 15, 9, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
-- iPhone 15 Pro Max - Variant 16 (512GB, Titan Trắng, 8GB)
(46, '512GB', 16, 7, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
(47, 'Titan Trắng', 16, 8, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
(48, '8GB', 16, 9, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
-- Samsung Galaxy S24 Ultra - Variant 17 (256GB, Đen, 12GB)
(49, '256GB', 17, 7, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
(50, 'Đen', 17, 8, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
(51, '12GB', 17, 9, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
-- Samsung Galaxy S24 Ultra - Variant 18 (512GB, Tím, 12GB)
(52, '512GB', 18, 7, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
(53, 'Tím', 18, 8, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
(54, '12GB', 18, 9, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
-- MacBook Pro 14 - Variant 19 (18GB, 512GB SSD, Xám)
(55, '18GB', 19, 10, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
(56, '512GB SSD', 19, 11, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
(57, 'Xám', 19, 12, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
-- MacBook Pro 14 - Variant 20 (36GB, 1TB SSD, Bạc)
(58, '36GB', 20, 10, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
(59, '1TB SSD', 20, 11, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
(60, 'Bạc', 20, 12, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
-- Sony Bravia XR - Variant 21 (55 inch, 4K, OLED)
(61, '55 inch', 21, 13, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
(62, '4K', 21, 14, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
(63, 'OLED', 21, 15, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
-- Sony Bravia XR - Variant 22 (65 inch, 4K HDR, Mini LED)
(64, '65 inch', 22, 13, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
(65, '4K HDR', 22, 14, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
(66, 'Mini LED', 22, 15, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
-- Áo sơ mi nam - Variant 23 (M, Trắng, Cotton)
(67, 'M', 23, 16, '2025-09-10 08:45:00', '2025-09-10 08:45:00'),
(68, 'Trắng', 23, 17, '2025-09-10 08:45:00', '2025-09-10 08:45:00'),
(69, 'Cotton', 23, 18, '2025-09-10 08:45:00', '2025-09-10 08:45:00'),
-- Áo sơ mi nam - Variant 24 (XL, Xanh dương, Oxford)
(70, 'XL', 24, 16, '2025-09-10 08:45:00', '2025-09-10 08:45:00'),
(71, 'Xanh dương', 24, 17, '2025-09-10 08:45:00', '2025-09-10 08:45:00'),
(72, 'Oxford', 24, 18, '2025-09-10 08:45:00', '2025-09-10 08:45:00'),
-- Đầm nữ dự tiệc - Variant 25 (S, Đỏ, Lụa)
(73, 'S', 25, 19, '2025-09-18 09:50:00', '2025-09-18 09:50:00'),
(74, 'Đỏ', 25, 20, '2025-09-18 09:50:00', '2025-09-18 09:50:00'),
(75, 'Lụa', 25, 21, '2025-09-18 09:50:00', '2025-09-18 09:50:00'),
-- Đầm nữ dự tiệc - Variant 26 (M, Đen, Nhung)
(76, 'M', 26, 19, '2025-09-18 09:50:00', '2025-09-18 09:50:00'),
(77, 'Đen', 26, 20, '2025-09-18 09:50:00', '2025-09-18 09:50:00'),
(78, 'Nhung', 26, 21, '2025-09-18 09:50:00', '2025-09-18 09:50:00'),
-- Giày Nike Air - Variant 27 (41, Đen/Trắng, Da tổng hợp)
(79, '41', 27, 22, '2025-09-25 08:30:00', '2025-09-25 08:30:00'),
(80, 'Đen/Trắng', 27, 23, '2025-09-25 08:30:00', '2025-09-25 08:30:00'),
(81, 'Da tổng hợp', 27, 24, '2025-09-25 08:30:00', '2025-09-25 08:30:00'),
-- Giày Nike Air - Variant 28 (43, Đỏ/Đen, Vải lưới)
(82, '43', 28, 22, '2025-09-25 08:30:00', '2025-09-25 08:30:00'),
(83, 'Đỏ/Đen', 28, 23, '2025-09-25 08:30:00', '2025-09-25 08:30:00'),
(84, 'Vải lưới', 28, 24, '2025-09-25 08:30:00', '2025-09-25 08:30:00'),
-- Nồi chiên không dầu - Variant 29 (5.5L, Đen, 1800W)
(85, '5.5L', 29, 25, '2025-10-02 13:45:00', '2025-10-02 13:45:00'),
(86, 'Đen', 29, 26, '2025-10-02 13:45:00', '2025-10-02 13:45:00'),
(87, '1800W', 29, 27, '2025-10-02 13:45:00', '2025-10-02 13:45:00'),
-- Nồi chiên không dầu - Variant 30 (7L, Trắng, 2200W)
(88, '7L', 30, 25, '2025-10-02 13:45:00', '2025-10-02 13:45:00'),
(89, 'Trắng', 30, 26, '2025-10-02 13:45:00', '2025-10-02 13:45:00'),
(90, '2200W', 30, 27, '2025-10-02 13:45:00', '2025-10-02 13:45:00'),
-- Ghế gaming - Variant 31 (Full size, Đen/Đỏ, Da PU)
(91, 'Full size', 31, 28, '2025-10-10 14:15:00', '2025-10-10 14:15:00'),
(92, 'Đen/Đỏ', 31, 29, '2025-10-10 14:15:00', '2025-10-10 14:15:00'),
(93, 'Da PU', 31, 30, '2025-10-10 14:15:00', '2025-10-10 14:15:00'),
-- Ghế gaming - Variant 32 (Full size, Xanh/Đen, Vải lưới)
(94, 'Full size', 32, 28, '2025-10-10 14:15:00', '2025-10-10 14:15:00'),
(95, 'Xanh/Đen', 32, 29, '2025-10-10 14:15:00', '2025-10-10 14:15:00'),
(96, 'Vải lưới', 32, 30, '2025-10-10 14:15:00', '2025-10-10 14:15:00'),
-- Tai nghe Sony - Variant 33 (Đen, Bluetooth 5.3, 2024)
(97, 'Đen', 33, 31, '2025-10-18 16:30:00', '2025-10-18 16:30:00'),
(98, 'Bluetooth 5.3', 33, 32, '2025-10-18 16:30:00', '2025-10-18 16:30:00'),
(99, '2024', 33, 33, '2025-10-18 16:30:00', '2025-10-18 16:30:00'),
-- Tai nghe Sony - Variant 34 (Bạc, Bluetooth 5.3, Limited)
(100, 'Bạc', 34, 31, '2025-10-18 16:30:00', '2025-10-18 16:30:00'),
(101, 'Bluetooth 5.3', 34, 32, '2025-10-18 16:30:00', '2025-10-18 16:30:00'),
(102, 'Limited Edition', 34, 33, '2025-10-18 16:30:00', '2025-10-18 16:30:00'),
-- Honda Vision - Variant 35 (110cc, Trắng ngọc, Tay ga)
(103, '110cc', 35, 37, '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
(104, 'Trắng ngọc', 35, 38, '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
(105, 'Tay ga', 35, 39, '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
-- Honda Vision - Variant 36 (110cc, Đen mờ, Tay ga cao cấp)
(106, '110cc', 36, 37, '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
(107, 'Đen mờ', 36, 38, '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
(108, 'Tay ga cao cấp', 36, 39, '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
-- Bộ đồ thể thao - Variant 37 (M, Đen, Adidas)
(109, 'M', 37, 40, '2025-10-25 10:15:00', '2025-10-25 10:15:00'),
(110, 'Đen', 37, 41, '2025-10-25 10:15:00', '2025-10-25 10:15:00'),
(111, 'Adidas', 37, 42, '2025-10-25 10:15:00', '2025-10-25 10:15:00'),
-- Bộ đồ thể thao - Variant 38 (L, Xanh navy, Adidas)
(112, 'L', 38, 40, '2025-10-25 10:15:00', '2025-10-25 10:15:00'),
(113, 'Xanh navy', 38, 41, '2025-10-25 10:15:00', '2025-10-25 10:15:00'),
(114, 'Adidas', 38, 42, '2025-10-25 10:15:00', '2025-10-25 10:15:00'),
-- Serum Vitamin C - Variant 39 (35ml, Mọi loại da, Hàn Quốc)
(115, '35ml', 39, 43, '2025-10-28 11:30:00', '2025-10-28 11:30:00'),
(116, 'Mọi loại da', 39, 44, '2025-10-28 11:30:00', '2025-10-28 11:30:00'),
(117, 'Hàn Quốc', 39, 45, '2025-10-28 11:30:00', '2025-10-28 11:30:00'),
-- Serum Vitamin C - Variant 40 (50ml, Da dầu, Hàn Quốc)
(118, '50ml', 40, 43, '2025-10-28 11:30:00', '2025-10-28 11:30:00'),
(119, 'Da dầu', 40, 44, '2025-10-28 11:30:00', '2025-10-28 11:30:00'),
(120, 'Hàn Quốc', 40, 45, '2025-10-28 11:30:00', '2025-10-28 11:30:00'),
-- Bộ quần áo trẻ em - Variant 41 (80cm, Hồng, 1-2 tuổi)
(121, '80cm', 41, 46, '2025-11-01 08:45:00', '2025-11-01 08:45:00'),
(122, 'Hồng', 41, 47, '2025-11-01 08:45:00', '2025-11-01 08:45:00'),
(123, '1-2 tuổi', 41, 48, '2025-11-01 08:45:00', '2025-11-01 08:45:00'),
-- Bộ quần áo trẻ em - Variant 42 (100cm, Xanh, 3-4 tuổi)
(124, '100cm', 42, 46, '2025-11-01 08:45:00', '2025-11-01 08:45:00'),
(125, 'Xanh', 42, 47, '2025-11-01 08:45:00', '2025-11-01 08:45:00'),
(126, '3-4 tuổi', 42, 48, '2025-11-01 08:45:00', '2025-11-01 08:45:00'),
-- Gạo ST25 - Variant 43 (5kg, 12 tháng, Việt Nam)
(127, '5kg', 43, 49, '2025-11-03 09:30:00', '2025-11-03 09:30:00'),
(128, '12 tháng', 43, 50, '2025-11-03 09:30:00', '2025-11-03 09:30:00'),
(129, 'Việt Nam', 43, 51, '2025-11-03 09:30:00', '2025-11-03 09:30:00'),
-- Gạo ST25 - Variant 44 (10kg, 12 tháng, Việt Nam)
(130, '10kg', 44, 49, '2025-11-03 09:30:00', '2025-11-03 09:30:00'),
(131, '12 tháng', 44, 50, '2025-11-03 09:30:00', '2025-11-03 09:30:00'),
(132, 'Việt Nam', 44, 51, '2025-11-03 09:30:00', '2025-11-03 09:30:00'),
-- Túi xách Charles & Keith - Variant 45 (Medium, Đen, Da PU)
(133, 'Medium', 45, 52, '2025-11-05 10:45:00', '2025-11-05 10:45:00'),
(134, 'Đen', 45, 53, '2025-11-05 10:45:00', '2025-11-05 10:45:00'),
(135, 'Da PU', 45, 54, '2025-11-05 10:45:00', '2025-11-05 10:45:00'),
-- Túi xách Charles & Keith - Variant 46 (Large, Nâu, Da thật)
(136, 'Large', 46, 52, '2025-11-05 10:45:00', '2025-11-05 10:45:00'),
(137, 'Nâu', 46, 53, '2025-11-05 10:45:00', '2025-11-05 10:45:00'),
(138, 'Da thật', 46, 54, '2025-11-05 10:45:00', '2025-11-05 10:45:00'),
-- Đồng hồ Casio - Variant 47 (Quartz, Đen, Nhựa)
(139, 'Quartz', 47, 55, '2025-11-08 11:00:00', '2025-11-08 11:00:00'),
(140, 'Đen', 47, 56, '2025-11-08 11:00:00', '2025-11-08 11:00:00'),
(141, 'Nhựa', 47, 57, '2025-11-08 11:00:00', '2025-11-08 11:00:00'),
-- Đồng hồ Casio - Variant 48 (Quartz, Xanh, Kim loại)
(142, 'Quartz', 48, 55, '2025-11-08 11:00:00', '2025-11-08 11:00:00'),
(143, 'Xanh', 48, 56, '2025-11-08 11:00:00', '2025-11-08 11:00:00'),
(144, 'Kim loại', 48, 57, '2025-11-08 11:00:00', '2025-11-08 11:00:00'),
-- Bộ nồi inox - Variant 49 (5 chiếc, Bạc, Inox 304)
(145, '5 chiếc', 49, 58, '2025-11-10 13:15:00', '2025-11-10 13:15:00'),
(146, 'Bạc', 49, 59, '2025-11-10 13:15:00', '2025-11-10 13:15:00'),
(147, 'Inox 304', 49, 60, '2025-11-10 13:15:00', '2025-11-10 13:15:00'),
-- Bộ nồi inox - Variant 50 (7 chiếc, Bạc, Inox 304)
(148, '7 chiếc', 50, 58, '2025-11-10 13:15:00', '2025-11-10 13:15:00'),
(149, 'Bạc', 50, 59, '2025-11-10 13:15:00', '2025-11-10 13:15:00'),
(150, 'Inox 304', 50, 60, '2025-11-10 13:15:00', '2025-11-10 13:15:00'),
-- Máy ảnh Sony - Variant 51 (33MP, Đen, Kit 28-70mm)
(151, '33MP', 51, 61, '2025-11-12 14:30:00', '2025-11-12 14:30:00'),
(152, 'Đen', 51, 62, '2025-11-12 14:30:00', '2025-11-12 14:30:00'),
(153, 'Kit 28-70mm', 51, 63, '2025-11-12 14:30:00', '2025-11-12 14:30:00'),
-- Máy ảnh Sony - Variant 52 (33MP, Đen, Kit 24-105mm)
(154, '33MP', 52, 61, '2025-11-12 14:30:00', '2025-11-12 14:30:00'),
(155, 'Đen', 52, 62, '2025-11-12 14:30:00', '2025-11-12 14:30:00'),
(156, 'Kit 24-105mm', 52, 63, '2025-11-12 14:30:00', '2025-11-12 14:30:00'),
-- Bút bi Thiên Long - Variant 53 (Bi, Xanh, Thiên Long)
(157, 'Bi', 53, 64, '2025-11-15 15:45:00', '2025-11-15 15:45:00'),
(158, 'Xanh', 53, 65, '2025-11-15 15:45:00', '2025-11-15 15:45:00'),
(159, 'Thiên Long', 53, 66, '2025-11-15 15:45:00', '2025-11-15 15:45:00'),
-- Bút bi Thiên Long - Variant 54 (Bi, Đen, Thiên Long)
(160, 'Bi', 54, 64, '2025-11-15 15:45:00', '2025-11-15 15:45:00'),
(161, 'Đen', 54, 65, '2025-11-15 15:45:00', '2025-11-15 15:45:00'),
(162, 'Thiên Long', 54, 66, '2025-11-15 15:45:00', '2025-11-15 15:45:00');

-- =============================================
-- ORDERS (15 records)
-- =============================================
DELETE FROM `orders` WHERE `id` > 8;
INSERT INTO `orders` (`id`, `qr_code`, `payment_method`, `total_price`, `order_date`, `status`, `shipping_address`, `shipping_fee`, `cancel_reason`, `paid_at`, `delivered_at`, `image_shipping`, `clientId`, `shipperId`, `storeId`, `coupons`, `shipping_code`, `createdAt`, `updatedAt`) VALUES
(9, 'order-9-qr.jpg', 'wallet', 33490000, '2025-10-20', 'DELIVERED', '123 Nguyễn Huệ, Quận 1, HCM', 30000, NULL, '2025-10-20', '2025-10-22', 'Order-9.jpeg', 'CLIENT2025001', 'SHIPPER2025001', 'STORE2025002', NULL, NULL, '2025-10-20 10:00:00', '2025-10-22 15:30:00'),
(10, 'order-10-qr.jpg', 'cash', 30490000, '2025-10-25', 'CLIENT_CONFIRMED', '456 Lê Lợi, Quận 5, HCM', 30000, NULL, '2025-10-27', '2025-10-27', 'Order-10.jpeg', 'CLIENT2025002', 'SHIPPER2025002', 'STORE2025002', NULL, NULL, '2025-10-25 14:30:00', '2025-10-27 10:00:00'),
(11, 'order-11-qr.jpg', 'wallet', 53490000, '2025-11-01', 'IN_TRANSIT', '789 Trần Phú, Đống Đa, HN', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT2025003', 'SHIPPER2025003', 'STORE2025002', NULL, 1, '2025-11-01 09:15:00', '2025-11-02 08:00:00'),
(12, 'order-12-qr.jpg', 'cash', 950000, '2025-11-05', 'PENDING', '101 Kim Mã, Ba Đình, HN', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT2025004', 'SHIPPER2025004', 'STORE2025001', NULL, NULL, '2025-11-05 11:45:00', '2025-11-05 11:45:00'),
(13, 'order-13-qr.jpg', 'wallet', 3190000, '2025-11-10', 'CONFIRMED', '202 Nguyễn Thái Học, Q3, HCM', 30000, NULL, '2025-11-10', NULL, 'Order-13.jpeg', 'CLIENT2025005', 'SHIPPER2025005', 'STORE2025005', NULL, NULL, '2025-11-10 16:20:00', '2025-11-11 09:00:00'),
-- 10 new orders
(14, 'order-14-qr.jpg', 'wallet', 37500000, '2025-11-12', 'DELIVERED', '55 Nguyễn Trãi, Thanh Xuân, HN', 18000, NULL, '2025-11-12', '2025-11-14', 'Order-14.jpeg', 'CLIENT2025006', 'SHIPPER2025006', 'STORE2025006', NULL, 2, '2025-11-12 08:30:00', '2025-11-14 17:00:00'),
(15, 'order-15-qr.jpg', 'cash', 890000, '2025-11-14', 'CLIENT_CONFIRMED', '78 Lý Thường Kiệt, Đà Nẵng', 25000, NULL, '2025-11-16', '2025-11-16', 'Order-15.jpeg', 'CLIENT2025007', 'SHIPPER2025007', 'STORE2025007', NULL, NULL, '2025-11-14 10:15:00', '2025-11-16 11:30:00'),
(16, 'order-16-qr.jpg', 'wallet', 490000, '2025-11-15', 'IN_TRANSIT', '234 Hai Bà Trưng, Quận 1, HCM', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT2025008', 'SHIPPER2025008', 'STORE2025008', NULL, NULL, '2025-11-15 14:45:00', '2025-11-16 09:00:00'),
(17, 'order-17-qr.jpg', 'cash', 185000, '2025-11-16', 'PENDING', '89 Trần Đại Nghĩa, Hai Bà Trưng, HN', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT2025009', 'SHIPPER2025009', 'STORE2025009', NULL, NULL, '2025-11-16 16:20:00', '2025-11-16 16:20:00'),
(18, 'order-18-qr.jpg', 'wallet', 1250000, '2025-11-17', 'CONFIRMED', '567 Nguyễn Văn Linh, Quận 7, HCM', 30000, NULL, '2025-11-17', NULL, 'Order-18.jpeg', 'CLIENT2025010', 'SHIPPER2025010', 'STORE2025010', NULL, NULL, '2025-11-17 09:00:00', '2025-11-18 08:00:00'),
(19, 'order-19-qr.jpg', 'cash', 2590000, '2025-11-18', 'DELIVERED', '123 Phan Xích Long, Phú Nhuận, HCM', 30000, NULL, '2025-11-18', '2025-11-20', 'Order-19.jpeg', 'CLIENT2025011', 'SHIPPER2025011', 'STORE2025005', NULL, 3, '2025-11-18 11:30:00', '2025-11-20 15:00:00'),
(20, 'order-20-qr.jpg', 'wallet', 1890000, '2025-11-19', 'CLIENT_CONFIRMED', '456 Cầu Giấy, HN', 18000, NULL, '2025-11-21', '2025-11-21', 'Order-20.jpeg', 'CLIENT2025012', 'SHIPPER2025012', 'STORE2025006', NULL, NULL, '2025-11-19 13:45:00', '2025-11-21 10:30:00'),
(21, 'order-21-qr.jpg', 'cash', 45000000, '2025-11-20', 'IN_TRANSIT', '789 Lê Văn Việt, Thủ Đức, HCM', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT2025013', 'SHIPPER2025013', 'STORE2025002', NULL, NULL, '2025-11-20 15:00:00', '2025-11-21 09:00:00'),
(22, 'order-22-qr.jpg', 'wallet', 750000, '2025-11-21', 'PENDING', '101 Hoàng Quốc Việt, Cầu Giấy, HN', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT2025014', 'SHIPPER2025014', 'STORE2025007', NULL, 4, '2025-11-21 10:20:00', '2025-11-21 10:20:00'),
(23, 'order-23-qr.jpg', 'cash', 35000, '2025-11-22', 'CONFIRMED', '202 Nguyễn Xiển, Thanh Trì, HN', 18000, NULL, '2025-11-22', NULL, 'Order-23.jpeg', 'CLIENT2025015', 'SHIPPER2025015', 'STORE2025010', NULL, NULL, '2025-11-22 08:45:00', '2025-11-23 09:15:00');

-- =============================================
-- ORDER_ITEMS (18 records)
-- =============================================
DELETE FROM `order_items` WHERE `id` > 8;
INSERT INTO `order_items` (`id`, `title`, `image`, `quantity`, `price`, `orderId`, `product_variantId`, `createdAt`, `updatedAt`) VALUES
(9, 'iPhone 15 Pro Max 256GB', 'dienthoai1.png', 1, 32990000, 9, 15, '2025-10-20 10:00:00', '2025-10-20 10:00:00'),
(10, 'Samsung Galaxy S24 Ultra', 'dienthoai2.png', 1, 29990000, 10, 17, '2025-10-25 14:30:00', '2025-10-25 14:30:00'),
(11, 'MacBook Pro 14 M3 Pro', 'laptop1.png', 1, 52990000, 11, 19, '2025-11-01 09:15:00', '2025-11-01 09:15:00'),
(12, 'Áo sơ mi nam Oxford', 'thoitrangnam1.png', 2, 450000, 12, 23, '2025-11-05 11:45:00', '2025-11-05 11:45:00'),
(13, 'Giày Nike Air Max', 'giaydepnam1.png', 1, 2890000, 13, 27, '2025-11-10 16:20:00', '2025-11-10 16:20:00'),
-- 13 new order items
(14, 'Honda Vision 2025', 'xe1.png', 1, 37000000, 14, 35, '2025-11-12 08:30:00', '2025-11-12 08:30:00'),
(15, 'Bộ đồ thể thao Adidas', 'thethao1.png', 2, 420000, 15, 37, '2025-11-14 10:15:00', '2025-11-14 10:15:00'),
(16, 'Serum Vitamin C', 'phukien2.png', 1, 450000, 16, 39, '2025-11-15 14:45:00', '2025-11-15 14:45:00'),
(17, 'Gạo ST25 5kg', 'doan1.png', 1, 150000, 17, 43, '2025-11-16 16:20:00', '2025-11-16 16:20:00'),
(18, 'Túi xách Charles & Keith', 'tuixach1.png', 1, 1200000, 18, 45, '2025-11-17 09:00:00', '2025-11-17 09:00:00'),
(19, 'Đồng hồ Casio', 'phukien3.png', 1, 2550000, 19, 47, '2025-11-18 11:30:00', '2025-11-18 11:30:00'),
(20, 'Bộ nồi inox 5 chiếc', 'dungcu1.png', 1, 1850000, 20, 49, '2025-11-19 13:45:00', '2025-11-19 13:45:00'),
(21, 'Máy ảnh Sony A7 IV', 'phukien4.png', 1, 44500000, 21, 51, '2025-11-20 15:00:00', '2025-11-20 15:00:00'),
(22, 'Bộ quần áo trẻ em', 'treem1.png', 3, 230000, 22, 41, '2025-11-21 10:20:00', '2025-11-21 10:20:00'),
(23, 'Bút bi Thiên Long hộp 10', 'sachvo1.png', 1, 35000, 23, 53, '2025-11-22 08:45:00', '2025-11-22 08:45:00'),
-- Extra items for some orders
(24, 'Nồi chiên không dầu 5.5L', 'giadung1.png', 1, 2500000, 14, 29, '2025-11-12 08:30:00', '2025-11-12 08:30:00'),
(25, 'Đầm nữ dự tiệc', 'thoitrangnu1.png', 1, 890000, 15, 25, '2025-11-14 10:15:00', '2025-11-14 10:15:00'),
(26, 'Tai nghe Sony WH-1000XM5', 'phukien1.png', 1, 7500000, 21, 33, '2025-11-20 15:00:00', '2025-11-20 15:00:00');

-- =============================================
-- REVIEWS (15 records)
-- =============================================
DELETE FROM `reviews` WHERE `id` > 2;
INSERT INTO `reviews` (`id`, `text`, `rating`, `clientId`, `productId`, `orderId`, `createdAt`, `updatedAt`) VALUES
(3, 'Điện thoại rất đẹp, chụp ảnh sắc nét. Giao hàng nhanh!', 5, 'CLIENT2025001', 5, 9, '2025-10-23 10:00:00', '2025-10-23 10:00:00'),
(4, 'Samsung xài mượt, màn hình đẹp. Rất hài lòng!', 5, 'CLIENT2025002', 6, 10, '2025-10-28 14:30:00', '2025-10-28 14:30:00'),
(5, 'MacBook Pro chạy rất nhanh, pin trâu. Đáng tiền!', 5, 'CLIENT2025003', 7, 11, '2025-11-03 09:15:00', '2025-11-03 09:15:00'),
(6, 'Áo đẹp, vải mát. Sẽ ủng hộ tiếp!', 4, 'CLIENT2025004', 9, 12, '2025-11-06 11:45:00', '2025-11-06 11:45:00'),
(7, 'Giày đẹp, êm chân. Giao hàng nhanh!', 5, 'CLIENT2025005', 11, 13, '2025-11-12 16:20:00', '2025-11-12 16:20:00'),
-- 10 new reviews
(8, 'Xe Vision 2025 tiết kiệm xăng, chạy êm. Rất ưng!', 5, 'CLIENT2025006', 15, 14, '2025-11-15 08:30:00', '2025-11-15 08:30:00'),
(9, 'Đồ thể thao Adidas chất lượng tốt, thoáng mát', 4, 'CLIENT2025007', 16, 15, '2025-11-17 10:15:00', '2025-11-17 10:15:00'),
(10, 'Serum dưỡng da rất hiệu quả, da sáng hơn sau 2 tuần', 5, 'CLIENT2025008', 17, 16, '2025-11-18 14:45:00', '2025-11-18 14:45:00'),
(11, 'Gạo ST25 thơm ngon, nấu cơm dẻo', 5, 'CLIENT2025009', 19, 17, '2025-11-19 16:20:00', '2025-11-19 16:20:00'),
(12, 'Túi xách đẹp, chất da tốt. Shop đóng gói cẩn thận', 4, 'CLIENT2025010', 20, 18, '2025-11-20 09:00:00', '2025-11-20 09:00:00'),
(13, 'Đồng hồ Casio bền đẹp, chính hãng 100%', 5, 'CLIENT2025011', 21, 19, '2025-11-21 11:30:00', '2025-11-21 11:30:00'),
(14, 'Bộ nồi inox sáng bóng, nấu ăn rất nhanh', 4, 'CLIENT2025012', 22, 20, '2025-11-22 13:45:00', '2025-11-22 13:45:00'),
(15, 'Máy ảnh Sony chụp đẹp, quay video 4K mượt', 5, 'CLIENT2025013', 23, 21, '2025-11-23 15:00:00', '2025-11-23 15:00:00'),
(16, 'Quần áo trẻ em mềm mại, con mặc rất thích', 5, 'CLIENT2025014', 18, 22, '2025-11-24 10:20:00', '2025-11-24 10:20:00'),
(17, 'Bút Thiên Long viết mượt, giá rẻ', 4, 'CLIENT2025015', 24, 23, '2025-11-25 08:45:00', '2025-11-25 08:45:00');

-- =============================================
-- COUPONS (15 records)
-- =============================================
DELETE FROM `coupons` WHERE `id` > 11;
INSERT INTO `coupons` (`id`, `code`, `description`, `discount`, `quantity`, `expire`, `storeId`, `createdAt`, `updatedAt`) VALUES
(12, 'NEWUSER2025', 'Giảm 10% cho khách hàng mới', 10, 100, '2026-06-30 23:59:59', NULL, '2025-08-01 00:00:00', '2025-08-01 00:00:00'),
(13, 'SUMMER50K', 'Giảm 50.000đ đơn từ 500.000đ', 50000, 200, '2026-03-31 23:59:59', 'STORE2025001', '2025-08-15 00:00:00', '2025-08-15 00:00:00'),
(14, 'TECH20', 'Giảm 20% cho sản phẩm công nghệ', 20, 50, '2026-02-28 23:59:59', 'STORE2025002', '2025-09-01 00:00:00', '2025-09-01 00:00:00'),
(15, 'FREESHIP', 'Miễn phí vận chuyển', 30000, 500, '2026-12-31 23:59:59', NULL, '2025-09-15 00:00:00', '2025-09-15 00:00:00'),
(16, 'GIADUNG100K', 'Giảm 100.000đ cho đồ gia dụng', 100000, 80, '2026-04-30 23:59:59', 'STORE2025003', '2025-10-01 00:00:00', '2025-10-01 00:00:00'),
-- 10 new coupons
(17, 'XEMAY500K', 'Giảm 500.000đ khi mua xe máy', 500000, 30, '2026-06-30 23:59:59', 'STORE2025006', '2025-10-15 00:00:00', '2025-10-15 00:00:00'),
(18, 'SPORT15', 'Giảm 15% đồ thể thao', 15, 100, '2026-05-31 23:59:59', 'STORE2025006', '2025-10-20 00:00:00', '2025-10-20 00:00:00'),
(19, 'BEAUTY30K', 'Giảm 30.000đ mỹ phẩm đơn từ 200.000đ', 30000, 150, '2026-04-30 23:59:59', 'STORE2025007', '2025-10-25 00:00:00', '2025-10-25 00:00:00'),
(20, 'BABY20', 'Giảm 20% đồ trẻ em', 20, 80, '2026-07-31 23:59:59', 'STORE2025008', '2025-11-01 00:00:00', '2025-11-01 00:00:00'),
(21, 'THUCPHAM10', 'Giảm 10% thực phẩm', 10, 200, '2026-03-31 23:59:59', 'STORE2025009', '2025-11-05 00:00:00', '2025-11-05 00:00:00'),
(22, 'TUIXACH100K', 'Giảm 100.000đ túi xách cao cấp', 100000, 50, '2026-05-31 23:59:59', 'STORE2025010', '2025-11-10 00:00:00', '2025-11-10 00:00:00'),
(23, 'DONGHO200K', 'Giảm 200.000đ đồng hồ chính hãng', 200000, 40, '2026-06-30 23:59:59', NULL, '2025-11-12 00:00:00', '2025-11-12 00:00:00'),
(24, 'NHAHANG15', 'Giảm 15% dụng cụ nhà bếp', 15, 100, '2026-08-31 23:59:59', 'STORE2025003', '2025-11-15 00:00:00', '2025-11-15 00:00:00'),
(25, 'CAMERA1M', 'Giảm 1.000.000đ máy ảnh Sony', 1000000, 20, '2026-04-30 23:59:59', 'STORE2025002', '2025-11-18 00:00:00', '2025-11-18 00:00:00'),
(26, 'VANPHONG20K', 'Giảm 20.000đ văn phòng phẩm đơn từ 100.000đ', 20000, 300, '2026-09-30 23:59:59', 'STORE2025010', '2025-11-20 00:00:00', '2025-11-20 00:00:00');

-- =============================================
-- SHIPPING_CODES (13 records)
-- =============================================
DELETE FROM `shipping_codes` WHERE `id` > 1;
INSERT INTO `shipping_codes` (`id`, `code`, `description`, `discount`, `quantity`, `expire`, `adminId`, `createdAt`, `updatedAt`) VALUES
(2, 'FREESHIP50K', 'Miễn phí ship đơn từ 500.000đ', 30000, 1000, '2026-06-30 23:59:59', 'ADMIN1766313158298', '2025-08-01 00:00:00', '2025-08-01 00:00:00'),
(3, 'SHIPGIAM20K', 'Giảm 20.000đ phí ship', 20000, 500, '2026-03-31 23:59:59', 'ADMIN1766313158298', '2025-09-01 00:00:00', '2025-09-01 00:00:00'),
(4, 'SHIPHN', 'Miễn phí ship nội thành Hà Nội', 18000, 300, '2026-12-31 23:59:59', 'ADMIN1766313158298', '2025-10-01 00:00:00', '2025-10-01 00:00:00'),
-- 10 new shipping codes
(5, 'SHIPHCM', 'Miễn phí ship nội thành HCM', 30000, 400, '2026-12-31 23:59:59', 'ADMIN1766313158298', '2025-10-10 00:00:00', '2025-10-10 00:00:00'),
(6, 'SHIPDN', 'Miễn phí ship nội thành Đà Nẵng', 25000, 200, '2026-12-31 23:59:59', 'ADMIN1766313158298', '2025-10-15 00:00:00', '2025-10-15 00:00:00'),
(7, 'SHIP10K', 'Giảm 10.000đ phí ship mọi đơn', 10000, 2000, '2026-06-30 23:59:59', 'ADMIN1766313158298', '2025-10-20 00:00:00', '2025-10-20 00:00:00'),
(8, 'SHIPTET', 'Giảm 50% phí ship dịp Tết', 15000, 1500, '2025-02-28 23:59:59', 'ADMIN1766313158298', '2025-10-25 00:00:00', '2025-10-25 00:00:00'),
(9, 'SHIP1M', 'Miễn phí ship đơn từ 1.000.000đ', 30000, 800, '2026-09-30 23:59:59', 'ADMIN1766313158298', '2025-11-01 00:00:00', '2025-11-01 00:00:00'),
(10, 'SHIPVIP', 'Miễn phí ship khách VIP', 30000, 500, '2026-12-31 23:59:59', 'ADMIN1766313158298', '2025-11-05 00:00:00', '2025-11-05 00:00:00'),
(11, 'SHIPHP', 'Miễn phí ship nội thành Hải Phòng', 22000, 150, '2026-12-31 23:59:59', 'ADMIN1766313158298', '2025-11-10 00:00:00', '2025-11-10 00:00:00'),
(12, 'SHIPCT', 'Miễn phí ship nội thành Cần Thơ', 28000, 150, '2026-12-31 23:59:59', 'ADMIN1766313158298', '2025-11-15 00:00:00', '2025-11-15 00:00:00'),
(13, 'SHIP500', 'Giảm 500đ/km phí ship ngoại thành', 5000, 3000, '2026-08-31 23:59:59', 'ADMIN1766313158298', '2025-11-18 00:00:00', '2025-11-18 00:00:00'),
(14, 'SHIPXE', 'Miễn phí vận chuyển xe máy', 200000, 50, '2026-06-30 23:59:59', 'ADMIN1766313158298', '2025-11-20 00:00:00', '2025-11-20 00:00:00');

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
