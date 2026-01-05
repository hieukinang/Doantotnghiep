-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: ecommerce1
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` varchar(100) DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `detail_address` varchar(100) DEFAULT NULL,
  `clientId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'Hà Nội','Mỗ lao','10 Trần phú','CLIENT1766314602202','2025-12-22 06:03:19','2025-12-22 06:03:19'),(3,'Hà Nội','Hà Đông','Học viện Công nghệ Bưu chính Viễn thông, Km 10, Ngõ 5 Trần Phú','CLIENT1766565306888','2025-12-24 08:38:50','2025-12-24 08:38:50');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `role` enum('manager','staff') DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `salary` int DEFAULT NULL,
  `wallet` float DEFAULT '0',
  `address` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `image` varchar(255) DEFAULT 'default-admin.jpg',
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_account_number` varchar(255) DEFAULT NULL,
  `bank_account_holder_name` varchar(255) DEFAULT NULL,
  `passwordChangedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES ('ADMIN1766313158298','0123456789','$2b$12$9YozhzyFvb5IxW4p4kyiNeNYbLqHX8SHEfqBt8CdpIN1zFjYIpyRq','manager@admin.com',NULL,NULL,'manager',NULL,NULL,NULL,0,NULL,1,'default-admin.jpg',NULL,NULL,NULL,NULL,'2025-12-21 10:32:38','2025-12-21 10:32:38'),('ADMIN1766318074075','TriDM24','$2b$12$7r5j8zJD.59suGzL7aJw8ut52O5fJCY/IctJoetKuAa95jQibO8ZC','hieu@gmail.com','0946861622','dinh Hiếu','manager','hehehe','2025-12-24',121221212,0,'qưerqwer',1,'Admin-ADMIN1766313158298.jpeg','1212','1212121','21121','2025-12-21 11:54:34','2025-12-21 11:54:34','2025-12-21 11:54:34'),('ADMIN1766490502023','xxx123','$2b$12$Ml/YYVTr7BTGA.a/5KnbO.cpzGd7sTmcPf2pOFD66IfW6RJYSigAy','hieu1@gmail.com','0946861621','dinh Hiếu','staff','xzgsdf','2025-12-03',1231231231,0,'qưerqwer',1,'Admin-ADMIN1766313158298.jpeg','MB','10122003','Hioeus','2025-12-23 11:48:22','2025-12-23 11:48:22','2025-12-23 11:48:22');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attributes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `categoryId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `attributes_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES (1,'123',1,'2025-12-21 11:21:19','2025-12-21 11:21:19'),(2,'122',1,'2025-12-21 11:21:19','2025-12-21 11:21:19'),(3,'11',1,'2025-12-21 11:21:19','2025-12-21 11:21:19'),(4,'12',2,'2025-12-21 11:23:46','2025-12-21 11:23:46'),(5,'11',2,'2025-12-21 11:23:46','2025-12-21 11:23:46'),(6,'124',2,'2025-12-21 11:23:46','2025-12-21 11:23:46');
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  `type` enum('sidebar','fixed') NOT NULL DEFAULT 'sidebar',
  `adminId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `adminId` (`adminId`),
  CONSTRAINT `banners_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `total_shipping_fee` float DEFAULT NULL,
  `clientId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clientId` (`clientId`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,30000,'CLIENT1766314602202','2025-12-22 06:02:44','2025-12-22 12:14:02'),(2,0,'CLIENT1766565306888','2025-12-29 08:25:32','2025-12-29 08:31:11');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `cartId` int DEFAULT NULL,
  `product_variantId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cartId` (`cartId`),
  KEY `product_variantId` (`product_variantId`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (3,1,1,5,'2025-12-22 12:14:02','2025-12-22 12:14:02');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `superCategoryId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `superCategoryId` (`superCategoryId`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`superCategoryId`) REFERENCES `supercategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'son dior addict glow màu 004','category-ADMIN1766313158298-1766316079501.jpeg',NULL,'2025-12-21 11:21:19','2025-12-21 11:21:19'),(2,'quần áo','category-ADMIN1766313158298-1766316226407.jpeg',NULL,'2025-12-21 11:23:46','2025-12-21 11:23:46'),
(3,'Điện thoại di động','dienthoai1.png',NULL,'2025-08-05 10:00:00','2025-08-05 10:00:00'),
(4,'Laptop - Máy tính xách tay','laptop1.png',NULL,'2025-08-10 11:30:00','2025-08-10 11:30:00'),
(5,'Tivi - Màn hình','tivi1.png',NULL,'2025-08-15 14:20:00','2025-08-15 14:20:00'),
(6,'Tủ lạnh','tulanh1.png',NULL,'2025-08-20 09:45:00','2025-08-20 09:45:00'),
(7,'Máy giặt','maygiat1.png',NULL,'2025-08-25 16:10:00','2025-08-25 16:10:00'),
(8,'Điều hòa - Máy lạnh','dieuhoa1.png',NULL,'2025-09-03 08:30:00','2025-09-03 08:30:00'),
(9,'Thời trang nam','thoitrangnam1.png',NULL,'2025-09-10 13:15:00','2025-09-10 13:15:00'),
(10,'Thời trang nữ','thoitrangnu1.png',NULL,'2025-09-18 15:40:00','2025-09-18 15:40:00'),
(11,'Giày dép nam','giaydepnam1.png',NULL,'2025-09-25 10:55:00','2025-09-25 10:55:00'),
(12,'Giày dép nữ','giaydepnu1.png',NULL,'2025-10-02 12:25:00','2025-10-02 12:25:00'),
(13,'Túi xách - Balo','tuixach1.png',NULL,'2025-10-10 14:50:00','2025-10-10 14:50:00'),
(14,'Đồ dùng gia đình','giadung1.png',NULL,'2025-10-18 09:20:00','2025-10-18 09:20:00'),
(15,'Bàn ghế - Nội thất','banghe1.png',NULL,'2025-10-25 11:35:00','2025-10-25 11:35:00'),
(16,'Dụng cụ nhà bếp','dungcu1.png',NULL,'2025-11-03 16:05:00','2025-11-03 16:05:00'),
(17,'Thể thao - Dã ngoại','thethao1.png',NULL,'2025-11-10 08:45:00','2025-11-10 08:45:00'),
(18,'Đồ chơi trẻ em','treem1.png',NULL,'2025-11-17 13:30:00','2025-11-17 13:30:00'),
(19,'Sách - Văn phòng phẩm','sachvo1.png',NULL,'2025-11-25 15:15:00','2025-11-25 15:15:00'),
(20,'Phụ kiện điện tử','phukien1.png',NULL,'2025-12-03 10:40:00','2025-12-03 10:40:00'),
(21,'Xe máy - Ô tô','xe1.png',NULL,'2025-12-10 12:55:00','2025-12-10 12:55:00'),
(22,'Đồ ăn - Thực phẩm','doan1.png',NULL,'2025-12-17 14:20:00','2025-12-17 14:20:00');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `scores` int DEFAULT '0',
  `type` enum('NORMAL','VIP','PREMIUM') DEFAULT 'NORMAL',
  `status` enum('ACTIVE','INACTIVE','BANNED','PROCESSING','DESTROYED') DEFAULT 'ACTIVE',
  `main_address` int DEFAULT NULL,
  `image` varchar(255) DEFAULT 'default-client.jpg',
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_number` varchar(100) DEFAULT NULL,
  `bank_account_holder_name` varchar(100) DEFAULT NULL,
  `wallet` float DEFAULT '0',
  `is_verified_email` tinyint(1) DEFAULT '0',
  `passwordChangedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_2` (`phone`),
  UNIQUE KEY `email_2` (`email`),
  KEY `main_address` (`main_address`),
  CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`main_address`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES ('CLIENT1766314602202','0946861622','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','hieu@gmail.com','0946861622',NULL,NULL,0,'NORMAL','ACTIVE',1,'default-client.jpg',NULL,NULL,NULL,11157000,0,'2025-12-21 10:56:42','2025-12-21 10:56:42','2025-12-28 14:02:24'),('CLIENT1766565280058','0000000000','$2b$12$h6NRrwNo788HzRT5smnk2.maCjgvByCYoZOMS3bEIBJTIGwaNc6fu','demo@gmail.com','___temp___',NULL,NULL,0,'NORMAL','ACTIVE',NULL,'default-client.jpg',NULL,NULL,NULL,0,0,'2025-12-24 08:34:40','2025-12-24 08:34:40','2025-12-24 08:34:40'),('CLIENT1766565284186','0112233445','$2b$12$f4ujgLl9eji16zs5PAae0.LbpbjhtXQCgmD.JKFVYUo/rabj5pCWm','temp@gmail.com','___temp___',NULL,NULL,0,'NORMAL','ACTIVE',NULL,'default-client.jpg',NULL,NULL,NULL,0,0,'2025-12-24 08:34:44','2025-12-24 08:34:44','2025-12-24 08:34:44'),('CLIENT1766565306888','0011223344','$2b$12$nVjLVH/1iF3K6NFdQRsPs.OgpiFPf..1JLgvfTv8UIxd1um0yIdhC','demoacc@gmail.com','demo user',NULL,NULL,0,'NORMAL','ACTIVE',3,'Client-CLIENT1766565306888.jpeg','MB','123123123','demo user',10741200,0,'2025-12-24 08:35:07','2025-12-24 08:35:06','2025-12-28 14:14:22'),
('CLIENT2025080501001','0901234567','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','nguyenvana@gmail.com','Nguyễn Văn An','1995-03-15','male',150,'NORMAL','ACTIVE',NULL,'default-client.jpg','Vietcombank','0123456789','Nguyen Van An',5000000,1,'2025-08-05 09:30:00','2025-08-05 09:30:00','2025-08-05 09:30:00'),
('CLIENT2025080802002','0902345678','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','tranthib@gmail.com','Trần Thị Bình','1998-07-22','female',200,'NORMAL','ACTIVE',NULL,'default-client.jpg','Techcombank','9876543210','Tran Thi Binh',3500000,1,'2025-08-08 14:20:00','2025-08-08 14:20:00','2025-08-08 14:20:00'),
('CLIENT2025081503003','0903456789','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','levanc@gmail.com','Lê Văn Cường','1992-11-08','male',320,'VIP','ACTIVE',NULL,'default-client.jpg','MB','1122334455','Le Van Cuong',8500000,1,'2025-08-15 10:45:00','2025-08-15 10:45:00','2025-08-15 10:45:00'),
('CLIENT2025082004004','0904567890','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','phamthid@gmail.com','Phạm Thị Dung','2000-01-30','female',100,'NORMAL','ACTIVE',NULL,'default-client.jpg','ACB','5566778899','Pham Thi Dung',2000000,1,'2025-08-20 16:10:00','2025-08-20 16:10:00','2025-08-20 16:10:00'),
('CLIENT2025082805005','0905678901','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','hoangvane@gmail.com','Hoàng Văn Em','1997-05-12','male',180,'NORMAL','ACTIVE',NULL,'default-client.jpg','Sacombank','6677889900','Hoang Van Em',4200000,1,'2025-08-28 08:55:00','2025-08-28 08:55:00','2025-08-28 08:55:00'),
('CLIENT2025090306006','0906789012','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','vuthif@gmail.com','Vũ Thị Phương','1994-09-25','female',450,'VIP','ACTIVE',NULL,'default-client.jpg','BIDV','7788990011','Vu Thi Phuong',12000000,1,'2025-09-03 11:30:00','2025-09-03 11:30:00','2025-09-03 11:30:00'),
('CLIENT2025091007007','0907890123','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','dangvang@gmail.com','Đặng Văn Giang','1990-12-18','male',280,'NORMAL','ACTIVE',NULL,'default-client.jpg','VPBank','8899001122','Dang Van Giang',6800000,1,'2025-09-10 13:45:00','2025-09-10 13:45:00','2025-09-10 13:45:00'),
('CLIENT2025091808008','0908901234','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','ngothih@gmail.com','Ngô Thị Hoa','1999-04-07','female',120,'NORMAL','ACTIVE',NULL,'default-client.jpg','TPBank','9900112233','Ngo Thi Hoa',2800000,1,'2025-09-18 15:20:00','2025-09-18 15:20:00','2025-09-18 15:20:00'),
('CLIENT2025092509009','0909012345','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','buivani@gmail.com','Bùi Văn Inh','1996-08-14','male',350,'VIP','ACTIVE',NULL,'default-client.jpg','Agribank','0011223344','Bui Van Inh',9500000,1,'2025-09-25 09:15:00','2025-09-25 09:15:00','2025-09-25 09:15:00'),
('CLIENT2025100210010','0910123456','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','dothik@gmail.com','Đỗ Thị Kim','1993-02-28','female',220,'NORMAL','ACTIVE',NULL,'default-client.jpg','Vietinbank','1122334455','Do Thi Kim',5500000,1,'2025-10-02 10:40:00','2025-10-02 10:40:00','2025-10-02 10:40:00'),
('CLIENT2025101011011','0911234567','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','truongvanl@gmail.com','Trương Văn Long','1991-06-19','male',400,'VIP','ACTIVE',NULL,'default-client.jpg','HDBank','2233445566','Truong Van Long',11000000,1,'2025-10-10 12:55:00','2025-10-10 12:55:00','2025-10-10 12:55:00'),
('CLIENT2025101812012','0912345678','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','lythim@gmail.com','Lý Thị Mai','1997-10-03','female',160,'NORMAL','ACTIVE',NULL,'default-client.jpg','OCB','3344556677','Ly Thi Mai',3800000,1,'2025-10-18 14:30:00','2025-10-18 14:30:00','2025-10-18 14:30:00'),
('CLIENT2025102513013','0913456789','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','dinhvann@gmail.com','Đinh Văn Nam','1988-11-27','male',500,'PREMIUM','ACTIVE',NULL,'default-client.jpg','SHB','4455667788','Dinh Van Nam',15000000,1,'2025-10-25 16:05:00','2025-10-25 16:05:00','2025-10-25 16:05:00'),
('CLIENT2025110314014','0914567890','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','caothio@gmail.com','Cao Thị Oanh','1995-01-09','female',190,'NORMAL','ACTIVE',NULL,'default-client.jpg','Eximbank','5566778899','Cao Thi Oanh',4500000,1,'2025-11-03 08:20:00','2025-11-03 08:20:00','2025-11-03 08:20:00'),
('CLIENT2025111015015','0915678901','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','sonvanp@gmail.com','Sơn Văn Phú','1992-07-16','male',310,'VIP','ACTIVE',NULL,'default-client.jpg','LienVietPostBank','6677889900','Son Van Phu',8200000,1,'2025-11-10 11:35:00','2025-11-10 11:35:00','2025-11-10 11:35:00'),
('CLIENT2025111716016','0916789012','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','maithiq@gmail.com','Mai Thị Quỳnh','1998-03-24','female',140,'NORMAL','ACTIVE',NULL,'default-client.jpg','VIB','7788990011','Mai Thi Quynh',3200000,1,'2025-11-17 13:50:00','2025-11-17 13:50:00','2025-11-17 13:50:00'),
('CLIENT2025112517017','0917890123','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','luongvanr@gmail.com','Lương Văn Rồng','1989-12-05','male',420,'VIP','ACTIVE',NULL,'default-client.jpg','NCB','8899001122','Luong Van Rong',10500000,1,'2025-11-25 15:15:00','2025-11-25 15:15:00','2025-11-25 15:15:00'),
('CLIENT2025120318018','0918901234','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','tathis@gmail.com','Tạ Thị Sen','1996-05-31','female',230,'NORMAL','ACTIVE',NULL,'default-client.jpg','ABBank','9900112233','Ta Thi Sen',5800000,1,'2025-12-03 09:40:00','2025-12-03 09:40:00','2025-12-03 09:40:00'),
('CLIENT2025121019019','0919012345','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','trinhvant@gmail.com','Trịnh Văn Tuấn','1994-08-20','male',380,'VIP','ACTIVE',NULL,'default-client.jpg','SeABank','0011223355','Trinh Van Tuan',9800000,1,'2025-12-10 12:25:00','2025-12-10 12:25:00','2025-12-10 12:25:00'),
('CLIENT2025121720020','0920123456','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','kieuthu@gmail.com','Kiều Thị Uyên','2001-02-14','female',100,'NORMAL','ACTIVE',NULL,'default-client.jpg','NamABank','1122334466','Kieu Thi Uyen',2500000,1,'2025-12-17 14:50:00','2025-12-17 14:50:00','2025-12-17 14:50:00'),
('CLIENT2025122521021','0921234567','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','lamvanv@gmail.com','Lâm Văn Vũ','1990-10-08','male',550,'PREMIUM','ACTIVE',NULL,'default-client.jpg','PVcomBank','2233445577','Lam Van Vu',18000000,1,'2025-12-25 16:30:00','2025-12-25 16:30:00','2025-12-25 16:30:00'),
('CLIENT2026010122022','0922345678','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','ngothix@gmail.com','Ngô Thị Xuân','1997-04-17','female',170,'NORMAL','ACTIVE',NULL,'default-client.jpg','Bac A Bank','3344556688','Ngo Thi Xuan',4100000,1,'2026-01-01 10:15:00','2026-01-01 10:15:00','2026-01-01 10:15:00'),
('CLIENT2026010223023','0923456789','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','phanvany@gmail.com','Phan Văn Yến','1993-09-11','male',290,'NORMAL','ACTIVE',NULL,'default-client.jpg','Kienlongbank','4455667799','Phan Van Yen',7200000,1,'2026-01-02 13:40:00','2026-01-02 13:40:00','2026-01-02 13:40:00'),
('CLIENT2026010324024','0924567890','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','vothiz@gmail.com','Võ Thị Zara','1999-06-28','female',130,'NORMAL','ACTIVE',NULL,'default-client.jpg','VietABank','5566778800','Vo Thi Zara',3000000,1,'2026-01-03 15:55:00','2026-01-03 15:55:00','2026-01-03 15:55:00'),
('CLIENT2026010425025','0925678901','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','hoangvanaa@gmail.com','Hoàng Văn Anh','1995-11-23','male',340,'VIP','ACTIVE',NULL,'default-client.jpg','OceanBank','6677889911','Hoang Van Anh',8800000,1,'2026-01-04 08:30:00','2026-01-04 08:30:00','2026-01-04 08:30:00');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaint_images`
--

DROP TABLE IF EXISTS `complaint_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaint_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) DEFAULT NULL,
  `complaintId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `complaintId` (`complaintId`),
  CONSTRAINT `complaint_images_ibfk_1` FOREIGN KEY (`complaintId`) REFERENCES `complaints` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint_images`
--

LOCK TABLES `complaint_images` WRITE;
/*!40000 ALTER TABLE `complaint_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaint_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('PRODUCT','STORE','SERVICE','DELIVERY','OTHER') DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `answer` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `resolved_at` date DEFAULT NULL,
  `clientId` varchar(255) DEFAULT NULL,
  `adminId` varchar(255) DEFAULT NULL,
  `storeId` varchar(255) DEFAULT NULL,
  `shipperId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `adminId` (`adminId`),
  KEY `storeId` (`storeId`),
  KEY `shipperId` (`shipperId`),
  CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `complaints_ibfk_2` FOREIGN KEY (`adminId`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `complaints_ibfk_3` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `complaints_ibfk_4` FOREIGN KEY (`shipperId`) REFERENCES `shippers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (1,'PRODUCT','Đơn hàng 1 có chất cấm',NULL,'resolved','2025-12-22',NULL,NULL,NULL,'SHIPPER1766315105177','2025-12-22 06:30:16','2025-12-22 06:30:34');
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user1` int DEFAULT NULL,
  `user2` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount` int NOT NULL,
  `quantity` int NOT NULL,
  `expire` datetime DEFAULT NULL,
  `storeId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`),
  CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'adsfdas','12312',31233,1204,'2026-01-16 11:15:00',NULL,'2025-12-21 11:20:18','2025-12-28 11:02:06'),(2,'adsfdasqưerqwe','qưerqwerqwe',121231,111,'2026-01-01 17:00:00','STORE1766314663632','2025-12-21 12:06:07','2025-12-21 12:06:07'),(3,'ewqr','qưerqwer',1234123,213,'2025-12-25 17:00:00','STORE1766314663632','2025-12-21 12:08:25','2025-12-21 12:08:25'),(4,'sádfadsfa','qăer',12313,12,'2026-01-02 17:00:00','STORE1766314663632','2025-12-21 12:08:39','2025-12-21 12:08:39'),(6,'sádfadsfaẳe','zdxvdf',12342,1210,'2026-01-23 17:00:00','STORE1766314663632','2025-12-21 12:09:07','2025-12-28 11:02:06'),(7,'adsfdass','12121',7,12,'2026-01-03 14:45:00',NULL,'2025-12-28 14:26:48','2025-12-28 14:26:48'),(8,'qưer','qưerqwer',1234,1234,'2026-01-01 17:00:00',NULL,'2025-12-28 14:44:51','2025-12-28 14:44:51'),(9,'sdfgsdfg','sdfgsdfg',1000,321,'2026-01-02 17:00:00',NULL,'2025-12-28 15:50:30','2025-12-28 15:50:30'),(10,'12312','123123',123123,123123,'2026-01-01 17:00:00',NULL,'2025-12-28 15:54:21','2025-12-28 15:54:21'),(11,'demo coupon','demo coupon',29999,100,'2025-12-30 17:00:00','STORE1766314663632','2025-12-28 15:56:38','2025-12-28 15:56:38');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clientId` varchar(255) DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `productId` (`productId`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `storeId` varchar(255) DEFAULT NULL,
  `clientId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `conversationId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `conversationId` (`conversationId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `body` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `receivers` varchar(255) DEFAULT NULL,
  `type_of_receiver` enum('ADMIN','SHIPPER','STORE','CLIENT') DEFAULT NULL,
  `senderId` int DEFAULT NULL,
  `type_of_sender` enum('ADMIN','SHIPPER','STORE','CLIENT') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `adminId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `adminId` (`adminId`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` float DEFAULT NULL,
  `orderId` int DEFAULT NULL,
  `product_variantId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `product_variantId` (`product_variantId`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,NULL,NULL,2,23423,1,5,'2025-12-22 06:05:14','2025-12-22 06:05:14'),(2,NULL,NULL,2,23423,2,5,'2025-12-22 11:56:38','2025-12-22 11:56:38'),(3,NULL,NULL,3,12312,3,1,'2025-12-22 12:04:00','2025-12-22 12:04:00'),(4,NULL,NULL,3,23423,4,5,'2025-12-22 12:07:20','2025-12-22 12:07:20'),(5,NULL,NULL,1,23423,5,5,'2025-12-22 12:13:55','2025-12-22 12:13:55'),(6,NULL,NULL,3,23423,6,5,'2025-12-22 13:03:27','2025-12-22 13:03:27'),(7,NULL,NULL,1,100000,7,11,'2025-12-24 08:46:12','2025-12-24 08:46:12'),(8,NULL,NULL,1,100000,8,11,'2025-12-28 11:02:06','2025-12-28 11:02:06');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `qr_code` varchar(255) DEFAULT 'default-order.jpg',
  `payment_method` varchar(50) DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','IN_TRANSIT','DELIVERED','CLIENT_CONFIRMED','CLIENT_NOT_CONFIRMED','CANCELLED','FAILED','RETURNED','RETURN_CONFIRMED','RETURN_NOT_CONFIRMED') DEFAULT 'PENDING',
  `shipping_address` varchar(255) DEFAULT NULL,
  `shipping_fee` float DEFAULT NULL,
  `cancel_reason` varchar(255) DEFAULT NULL,
  `paid_at` date DEFAULT NULL,
  `delivered_at` date DEFAULT NULL,
  `image_shipping` varchar(255) DEFAULT 'default-order.jpg',
  `clientId` varchar(255) DEFAULT NULL,
  `shipperId` varchar(255) DEFAULT NULL,
  `storeId` varchar(255) DEFAULT NULL,
  `coupons` varchar(255) DEFAULT NULL,
  `shipping_code` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `shipperId` (`shipperId`),
  KEY `storeId` (`storeId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shipperId`) REFERENCES `shippers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'order-1-qr.jpg','wallet',15613,'2025-12-22','RETURN_CONFIRMED','10 Trần phú, Mỗ lao, Hà Nội',30000,NULL,'2025-12-22',NULL,'Order-1.jpeg','CLIENT1766314602202','SHIPPER1766315105177','STORE1766314663632',NULL,NULL,'2025-12-22 06:05:14','2025-12-22 12:58:52'),(2,'order-2-qr.jpg','cash',15613,'2025-12-22','IN_TRANSIT','10 Trần phú, Mỗ lao, Hà Nội',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766314602202','SHIPPER1766315105177','STORE1766314663632','[1]',NULL,'2025-12-22 11:56:38','2025-12-22 12:41:50'),(3,'order-3-qr.jpg','cash',5703,'2025-12-22','IN_TRANSIT','10 Trần phú, Mỗ lao, Hà Nội',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766314602202','SHIPPER1766315105177','STORE1766314663632','[1]',NULL,'2025-12-22 12:04:00','2025-12-22 12:41:53'),(4,'order-4-qr.jpg','cash',39036,'2025-12-22','RETURN_CONFIRMED','10 Trần phú, Mỗ lao, Hà Nội',18000,NULL,'2025-12-22',NULL,'Order-4.jpeg','CLIENT1766314602202','SHIPPER1766315105177','STORE1766314663632','[1]',1,'2025-12-22 12:07:20','2025-12-22 12:56:50'),(5,'order-5-qr.jpg','cash',0,'2025-12-22','IN_TRANSIT','10 Trần phú, Mỗ lao, Hà Nội',18000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766314602202','SHIPPER1766408019380','STORE1766314663632','[1]',1,'2025-12-22 12:13:55','2025-12-22 12:55:52'),(6,'order-6-qr.jpg','wallet',39036,'2025-12-22','RETURN_CONFIRMED','10 Trần phú, Mỗ lao, Hà Nội',18000,NULL,'2025-12-22',NULL,'Order-6.jpeg','CLIENT1766314602202','SHIPPER1766408019380','STORE1766314663632',NULL,NULL,'2025-12-22 13:03:27','2025-12-22 13:06:11'),(7,'order-7-qr.jpg','wallet',56425,'2025-12-24','CLIENT_CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Km 10, Ngõ 5 Trần Phú, Hà Đông, Hà Nội',18000,NULL,'2025-12-24',NULL,'Order-7.jpeg','CLIENT1766565306888','SHIPPER1766408019380','STORE1766314663632',NULL,NULL,'2025-12-24 08:46:12','2025-12-24 12:21:45'),(8,'order-8-qr.jpg','wallet',56425,'2025-12-28','PENDING','Học viện Công nghệ Bưu chính Viễn thông, Km 10, Ngõ 5 Trần Phú, Hà Đông, Hà Nội',18000,NULL,'2025-12-28',NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632',NULL,NULL,'2025-12-28 11:02:06','2025-12-28 11:02:06');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,'product-STORE1766314663632-1766383317781-slide-1.jpeg',2,'2025-12-22 06:01:57','2025-12-22 06:01:57'),(2,'product-STORE1766314663632-1766383317781-slide-2.jpeg',2,'2025-12-22 06:01:57','2025-12-22 06:01:57'),(3,'product-STORE1766314663632-1766563446274-slide-1.jpeg',4,'2025-12-24 08:04:06','2025-12-24 08:04:06');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` float DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES 
-- iPhone 15 Pro Max (productId: 1)
(1, 32990000, 50, 1, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
(2, 34990000, 30, 1, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
(3, 38990000, 20, 1, '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
-- Samsung Galaxy S24 Ultra (productId: 2)
(4, 29990000, 45, 2, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
(5, 32990000, 25, 2, '2025-08-08 14:20:00', '2025-08-08 14:20:00'),
-- Xiaomi 14 Ultra (productId: 3)
(6, 22990000, 60, 3, '2025-08-12 09:45:00', '2025-08-12 09:45:00'),
(7, 24990000, 35, 3, '2025-08-12 09:45:00', '2025-08-12 09:45:00'),
-- MacBook Pro 14 M3 Pro (productId: 4)
(8, 52990000, 25, 4, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
(9, 62990000, 15, 4, '2025-08-15 11:30:00', '2025-08-15 11:30:00'),
-- Dell XPS 15 9530 (productId: 5)
(10, 45990000, 20, 5, '2025-08-20 16:15:00', '2025-08-20 16:15:00'),
(11, 49990000, 12, 5, '2025-08-20 16:15:00', '2025-08-20 16:15:00'),
-- ASUS ROG Strix G16 (productId: 6)
(12, 42990000, 35, 6, '2025-08-25 08:50:00', '2025-08-25 08:50:00'),
(13, 46990000, 20, 6, '2025-08-25 08:50:00', '2025-08-25 08:50:00'),
-- Sony Bravia XR 65 inch (productId: 7)
(14, 35990000, 28, 7, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
(15, 38990000, 15, 7, '2025-09-03 10:20:00', '2025-09-03 10:20:00'),
-- Samsung Neo QLED 55 inch (productId: 8)
(16, 28990000, 40, 8, '2025-09-10 13:45:00', '2025-09-10 13:45:00'),
(17, 31990000, 22, 8, '2025-09-10 13:45:00', '2025-09-10 13:45:00'),
-- LG OLED Evo 55 inch (productId: 9)
(18, 32990000, 32, 9, '2025-09-18 15:30:00', '2025-09-18 15:30:00'),
(19, 35990000, 18, 9, '2025-09-18 15:30:00', '2025-09-18 15:30:00'),
-- Tủ lạnh Samsung Inverter 380L (productId: 10)
(20, 14990000, 25, 10, '2025-09-25 09:15:00', '2025-09-25 09:15:00'),
(21, 16990000, 15, 10, '2025-09-25 09:15:00', '2025-09-25 09:15:00'),
-- Tủ lạnh LG Inverter 394L (productId: 11)
(22, 15990000, 18, 11, '2025-10-02 11:40:00', '2025-10-02 11:40:00'),
(23, 17990000, 10, 11, '2025-10-02 11:40:00', '2025-10-02 11:40:00'),
-- Máy giặt Electrolux 9kg (productId: 12)
(24, 9990000, 40, 12, '2025-10-10 14:25:00', '2025-10-10 14:25:00'),
(25, 10990000, 25, 12, '2025-10-10 14:25:00', '2025-10-10 14:25:00'),
-- Máy giặt Samsung AI 10kg (productId: 13)
(26, 11990000, 30, 13, '2025-10-18 16:50:00', '2025-10-18 16:50:00'),
(27, 13990000, 18, 13, '2025-10-18 16:50:00', '2025-10-18 16:50:00'),
-- Điều hòa Daikin Inverter 1.5HP (productId: 14)
(28, 15490000, 50, 14, '2025-10-25 10:35:00', '2025-10-25 10:35:00'),
(29, 17490000, 30, 14, '2025-10-25 10:35:00', '2025-10-25 10:35:00'),
-- Điều hòa Panasonic 2HP (productId: 15)
(30, 22990000, 38, 15, '2025-11-03 12:20:00', '2025-11-03 12:20:00'),
(31, 25990000, 20, 15, '2025-11-03 12:20:00', '2025-11-03 12:20:00'),
-- Áo sơ mi nam Oxford (productId: 16)
(32, 450000, 150, 16, '2025-11-10 08:45:00', '2025-11-10 08:45:00'),
(33, 520000, 100, 16, '2025-11-10 08:45:00', '2025-11-10 08:45:00'),
-- Áo thun nam Polo (productId: 17)
(34, 350000, 200, 17, '2025-11-15 14:30:00', '2025-11-15 14:30:00'),
(35, 390000, 150, 17, '2025-11-15 14:30:00', '2025-11-15 14:30:00'),
-- Quần jean nam slim fit (productId: 18)
(36, 550000, 120, 18, '2025-11-20 16:15:00', '2025-11-20 16:15:00'),
(37, 620000, 80, 18, '2025-11-20 16:15:00', '2025-11-20 16:15:00'),
-- Đầm nữ dự tiệc (productId: 19)
(38, 890000, 80, 19, '2025-11-25 09:50:00', '2025-11-25 09:50:00'),
(39, 990000, 50, 19, '2025-11-25 09:50:00', '2025-11-25 09:50:00'),
-- Áo kiểu nữ công sở (productId: 20)
(40, 420000, 130, 20, '2025-11-28 11:25:00', '2025-11-28 11:25:00'),
(41, 480000, 90, 20, '2025-11-28 11:25:00', '2025-11-28 11:25:00'),
-- Váy midi nữ xếp ly (productId: 21)
(42, 520000, 100, 21, '2025-12-03 13:40:00', '2025-12-03 13:40:00'),
(43, 590000, 70, 21, '2025-12-03 13:40:00', '2025-12-03 13:40:00'),
-- Giày da nam công sở (productId: 22)
(44, 1290000, 55, 22, '2025-12-08 15:55:00', '2025-12-08 15:55:00'),
(45, 1490000, 35, 22, '2025-12-08 15:55:00', '2025-12-08 15:55:00'),
-- Giày thể thao nam Nike (productId: 23)
(46, 2890000, 45, 23, '2025-12-12 08:30:00', '2025-12-12 08:30:00'),
(47, 3290000, 30, 23, '2025-12-12 08:30:00', '2025-12-12 08:30:00'),
-- Giày cao gót nữ 7cm (productId: 24)
(48, 690000, 85, 24, '2025-12-15 10:45:00', '2025-12-15 10:45:00'),
(49, 790000, 55, 24, '2025-12-15 10:45:00', '2025-12-15 10:45:00'),
-- Sandal nữ đế xuồng (productId: 25)
(50, 450000, 110, 25, '2025-12-18 14:20:00', '2025-12-18 14:20:00'),
(51, 520000, 75, 25, '2025-12-18 14:20:00', '2025-12-18 14:20:00'),
-- Túi xách nữ thời trang (productId: 26)
(52, 650000, 75, 26, '2025-12-22 09:15:00', '2025-12-22 09:15:00'),
(53, 750000, 50, 26, '2025-12-22 09:15:00', '2025-12-22 09:15:00'),
-- Balo laptop nam nữ (productId: 27)
(54, 450000, 120, 27, '2025-12-25 11:30:00', '2025-12-25 11:30:00'),
(55, 520000, 80, 27, '2025-12-25 11:30:00', '2025-12-25 11:30:00'),
-- Nồi chiên không dầu (productId: 28)
(56, 1890000, 90, 28, '2025-12-28 13:45:00', '2025-12-28 13:45:00'),
(57, 2290000, 60, 28, '2025-12-28 13:45:00', '2025-12-28 13:45:00'),
-- Máy hút bụi cầm tay (productId: 29)
(58, 15990000, 35, 29, '2025-12-30 15:20:00', '2025-12-30 15:20:00'),
(59, 17990000, 20, 29, '2025-12-30 15:20:00', '2025-12-30 15:20:00'),
-- Bàn làm việc gỗ công nghiệp (productId: 30)
(60, 1590000, 50, 30, '2026-01-01 10:30:00', '2026-01-01 10:30:00'),
(61, 1890000, 30, 30, '2026-01-01 10:30:00', '2026-01-01 10:30:00'),
-- Ghế gaming cao cấp (productId: 31)
(62, 2990000, 40, 31, '2026-01-02 14:15:00', '2026-01-02 14:15:00'),
(63, 3490000, 25, 31, '2026-01-02 14:15:00', '2026-01-02 14:15:00'),
-- Bộ nồi inox 5 món (productId: 32)
(64, 890000, 95, 32, '2026-01-03 08:45:00', '2026-01-03 08:45:00'),
(65, 1090000, 60, 32, '2026-01-03 08:45:00', '2026-01-03 08:45:00'),
-- Bộ dao làm bếp 7 món (productId: 33)
(66, 1290000, 72, 33, '2026-01-03 11:20:00', '2026-01-03 11:20:00'),
(67, 1490000, 45, 33, '2026-01-03 11:20:00', '2026-01-03 11:20:00'),
-- Xe đạp thể thao Giant (productId: 34)
(68, 8990000, 18, 34, '2026-01-03 14:35:00', '2026-01-03 14:35:00'),
(69, 10990000, 10, 34, '2026-01-03 14:35:00', '2026-01-03 14:35:00'),
-- Máy chạy bộ điện (productId: 35)
(70, 7990000, 32, 35, '2026-01-04 09:50:00', '2026-01-04 09:50:00'),
(71, 9990000, 18, 35, '2026-01-04 09:50:00', '2026-01-04 09:50:00'),
-- Bộ Lego Star Wars (productId: 36)
(72, 1890000, 65, 36, '2026-01-04 11:25:00', '2026-01-04 11:25:00'),
(73, 2290000, 40, 36, '2026-01-04 11:25:00', '2026-01-04 11:25:00'),
-- Xe đồ chơi điều khiển (productId: 37)
(74, 450000, 118, 37, '2026-01-04 13:40:00', '2026-01-04 13:40:00'),
(75, 550000, 80, 37, '2026-01-04 13:40:00', '2026-01-04 13:40:00'),
-- Sách Đắc Nhân Tâm (productId: 38)
(76, 120000, 200, 38, '2026-01-04 15:15:00', '2026-01-04 15:15:00'),
(77, 150000, 150, 38, '2026-01-04 15:15:00', '2026-01-04 15:15:00'),
-- Tai nghe Bluetooth Sony (productId: 39)
(78, 8490000, 30, 39, '2026-01-04 16:30:00', '2026-01-04 16:30:00'),
(79, 9490000, 20, 39, '2026-01-04 16:30:00', '2026-01-04 16:30:00'),
-- Sạc dự phòng Anker 20000mAh (productId: 40)
(80, 890000, 85, 40, '2026-01-04 17:45:00', '2026-01-04 17:45:00'),
(81, 1090000, 55, 40, '2026-01-04 17:45:00', '2026-01-04 17:45:00');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `origin` varchar(100) DEFAULT NULL,
  `sold` int DEFAULT '0',
  `discount` int DEFAULT '0',
  `min_price` float NOT NULL DEFAULT '0',
  `rating_average` int DEFAULT '0',
  `review_numbers` int DEFAULT '0',
  `main_image` varchar(255) NOT NULL,
  `status` enum('ACTIVE','PROCESSING','BANNED') NOT NULL DEFAULT 'PROCESSING',
  `categoryId` int DEFAULT NULL,
  `storeId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  KEY `storeId` (`storeId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES 
(1,'iPhone 15 Pro Max 256GB','Điện thoại iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch. Thiết kế titanium cao cấp, pin dùng cả ngày.','Mỹ',150,10,32990000,48,120,'dienthoai1.png','ACTIVE',3,'STORE1766314663632','2025-08-05 10:30:00','2025-08-05 10:30:00'),
(2,'Samsung Galaxy S24 Ultra','Điện thoại Samsung Galaxy S24 Ultra 5G, camera 200MP, S Pen tích hợp, màn hình Dynamic AMOLED 2X 6.8 inch. AI Galaxy mạnh mẽ.','Hàn Quốc',120,15,29990000,46,95,'dienthoai2.png','ACTIVE',3,'STORE2025081002002','2025-08-08 14:20:00','2025-08-08 14:20:00'),
(3,'Xiaomi 14 Ultra','Điện thoại Xiaomi 14 Ultra với camera Leica chuyên nghiệp, chip Snapdragon 8 Gen 3, sạc nhanh 90W. Hiệu năng đỉnh cao.','Trung Quốc',80,12,22990000,45,68,'dienthoai3.png','ACTIVE',3,'STORE2025080501001','2025-08-12 09:45:00','2025-08-12 09:45:00'),
(4,'MacBook Pro 14 M3 Pro','Laptop MacBook Pro 14 inch chip M3 Pro, 18GB RAM, 512GB SSD. Màn hình Liquid Retina XDR, hiệu năng vượt trội cho công việc sáng tạo.','Mỹ',65,8,52990000,49,45,'laptop1.png','ACTIVE',4,'STORE2025081002002','2025-08-15 11:30:00','2025-08-15 11:30:00'),
(5,'Dell XPS 15 9530','Laptop Dell XPS 15 Intel Core i7-13700H, RTX 4060, 16GB RAM, 512GB SSD. Màn hình OLED 3.5K tuyệt đẹp, thiết kế siêu mỏng.','Mỹ',45,10,45990000,47,38,'laptop2.png','ACTIVE',4,'STORE1766314663632','2025-08-20 16:15:00','2025-08-20 16:15:00'),
(6,'ASUS ROG Strix G16','Laptop gaming ASUS ROG Strix G16, Intel Core i9-13980HX, RTX 4070, 32GB RAM. Màn hình 240Hz, tản nhiệt hiệu quả cho game thủ.','Đài Loan',55,20,42990000,46,52,'laptop3.png','ACTIVE',4,'STORE2025080501001','2025-08-25 08:50:00','2025-08-25 08:50:00'),
(7,'Sony Bravia XR 65 inch','Tivi Sony Bravia XR 65 inch 4K HDR, công nghệ Cognitive Processor XR, Acoustic Surface Audio+. Trải nghiệm điện ảnh tại nhà.','Nhật Bản',30,15,35990000,48,25,'tivi1.png','ACTIVE',5,'STORE2025081002002','2025-09-03 10:20:00','2025-09-03 10:20:00'),
(8,'Samsung Neo QLED 55 inch','Tivi Samsung Neo QLED 55 inch QN90C, công nghệ Quantum Matrix, âm thanh Dolby Atmos. Hình ảnh sống động, chân thực.','Hàn Quốc',40,12,28990000,45,35,'tivi2.png','ACTIVE',5,'STORE1766314663632','2025-09-10 13:45:00','2025-09-10 13:45:00'),
(9,'LG OLED Evo 55 inch','Tivi LG OLED Evo 55 inch C3, chip α9 Gen6 AI, webOS 23. Màu đen tuyệt đối, góc nhìn rộng 178 độ.','Hàn Quốc',35,18,32990000,47,42,'tivi3.png','ACTIVE',5,'STORE2025080501001','2025-09-18 15:30:00','2025-09-18 15:30:00'),
(10,'Tủ lạnh Samsung Inverter 380L','Tủ lạnh Samsung Inverter 380 lít RT38K5982BS/SV, công nghệ Twin Cooling Plus, ngăn đông mềm. Tiết kiệm điện tối ưu.','Việt Nam',60,10,14990000,44,55,'tulanh1.png','ACTIVE',6,'STORE2025081002002','2025-09-25 09:15:00','2025-09-25 09:15:00'),
(11,'Tủ lạnh LG Inverter 394L','Tủ lạnh LG Inverter 394 lít GN-D392PSA, công nghệ DoorCooling+, Linear Cooling. Làm lạnh đều, bảo quản tươi ngon.','Việt Nam',50,15,15990000,46,48,'tulanh2.png','ACTIVE',6,'STORE1766314663632','2025-10-02 11:40:00','2025-10-02 11:40:00'),
(12,'Máy giặt Electrolux 9kg','Máy giặt Electrolux Inverter 9kg EWF9024BDWA, công nghệ UltraMix, giặt hơi nước. Bảo vệ sợi vải, diệt khuẩn 99.9%.','Thái Lan',70,12,9990000,45,62,'maygiat1.png','ACTIVE',7,'STORE2025080501001','2025-10-10 14:25:00','2025-10-10 14:25:00'),
(13,'Máy giặt Samsung AI 10kg','Máy giặt Samsung AI Ecobubble 10kg WW10TP54DSH/SV, AI thông minh, giặt bọt khí. Tiết kiệm nước và điện.','Việt Nam',55,18,11990000,47,45,'maygiat2.png','ACTIVE',7,'STORE2025081002002','2025-10-18 16:50:00','2025-10-18 16:50:00'),
(14,'Điều hòa Daikin Inverter 1.5HP','Điều hòa Daikin Inverter 1.5HP FTKZ35VVMV, công nghệ Streamer, làm lạnh nhanh. Vận hành êm ái, tiết kiệm điện.','Thái Lan',90,20,15490000,46,78,'dieuhoa1.png','ACTIVE',8,'STORE1766314663632','2025-10-25 10:35:00','2025-10-25 10:35:00'),
(15,'Điều hòa Panasonic 2HP','Điều hòa Panasonic Inverter 2HP CU/CS-XU18ZKH-8, nanoe X lọc không khí, Econavi cảm biến thông minh.','Malaysia',75,15,22990000,48,65,'dieuhoa2.png','ACTIVE',8,'STORE2025080501001','2025-11-03 12:20:00','2025-11-03 12:20:00'),
(16,'Áo sơ mi nam Oxford','Áo sơ mi nam vải Oxford cao cấp, form regular fit, cổ button-down. Phong cách lịch lãm, phù hợp công sở.','Việt Nam',200,5,450000,44,180,'thoitrangnam1.png','ACTIVE',9,'STORE2025081002002','2025-11-10 08:45:00','2025-11-10 08:45:00'),
(17,'Áo thun nam Polo','Áo thun nam Polo cotton 100%, logo thêu tinh tế, nhiều màu sắc. Thoáng mát, co giãn tốt.','Việt Nam',350,10,350000,45,285,'thoitrangnam2.png','ACTIVE',9,'STORE1766314663632','2025-11-15 14:30:00','2025-11-15 14:30:00'),
(18,'Quần jean nam slim fit','Quần jean nam slim fit co giãn, chất liệu denim cao cấp. Phom đẹp, tôn dáng, bền màu.','Việt Nam',280,15,550000,46,220,'thoitrangnam3.png','ACTIVE',9,'STORE2025080501001','2025-11-20 16:15:00','2025-11-20 16:15:00'),
(19,'Đầm nữ dự tiệc','Đầm nữ dự tiệc thiết kế sang trọng, chất liệu lụa cao cấp. Tôn dáng, quyến rũ cho các buổi tiệc.','Việt Nam',120,20,890000,47,95,'thoitrangnu1.png','ACTIVE',10,'STORE2025081002002','2025-11-25 09:50:00','2025-11-25 09:50:00'),
(20,'Áo kiểu nữ công sở','Áo kiểu nữ công sở thanh lịch, chất liệu voan mềm mại. Phù hợp môi trường văn phòng.','Việt Nam',180,8,420000,45,145,'thoitrangnu2.png','ACTIVE',10,'STORE1766314663632','2025-11-28 11:25:00','2025-11-28 11:25:00'),
(21,'Váy midi nữ xếp ly','Váy midi nữ xếp ly dáng A, chất liệu vải đũi thoáng mát. Thanh lịch, nữ tính cho mọi dịp.','Việt Nam',150,12,520000,46,118,'thoitrangnu3.png','ACTIVE',10,'STORE2025080501001','2025-12-03 13:40:00','2025-12-03 13:40:00'),
(22,'Giày da nam công sở','Giày da nam công sở thiết kế Oxford, da bò thật 100%. Sang trọng, bền đẹp theo thời gian.','Việt Nam',95,10,1290000,48,72,'giaydepnam1.png','ACTIVE',11,'STORE2025081002002','2025-12-08 15:55:00','2025-12-08 15:55:00'),
(23,'Giày thể thao nam Nike','Giày thể thao nam Nike Air Max, đệm khí êm ái, thiết kế năng động. Phù hợp chạy bộ và thể thao.','Việt Nam',180,25,2890000,47,142,'giaydepnam2.png','ACTIVE',11,'STORE1766314663632','2025-12-12 08:30:00','2025-12-12 08:30:00'),
(24,'Giày cao gót nữ 7cm','Giày cao gót nữ 7cm mũi nhọn, chất liệu da PU cao cấp. Thanh lịch, tôn dáng cho phái đẹp.','Việt Nam',130,15,690000,45,98,'giaydepnu1.png','ACTIVE',12,'STORE2025080501001','2025-12-15 10:45:00','2025-12-15 10:45:00'),
(25,'Sandal nữ đế xuồng','Sandal nữ đế xuồng 5cm, quai chéo thời trang. Thoải mái, dễ phối đồ cho mùa hè.','Việt Nam',160,18,450000,44,125,'giaydepnu2.png','ACTIVE',12,'STORE2025081002002','2025-12-18 14:20:00','2025-12-18 14:20:00'),
(26,'Túi xách nữ thời trang','Túi xách nữ thời trang da tổng hợp, ngăn chứa rộng rãi. Thiết kế hiện đại, phù hợp đi làm đi chơi.','Trung Quốc',110,20,650000,46,88,'tuixach1.png','ACTIVE',13,'STORE1766314663632','2025-12-22 09:15:00','2025-12-22 09:15:00'),
(27,'Balo laptop nam nữ','Balo laptop 15.6 inch chống nước, nhiều ngăn tiện dụng. Quai đeo êm, phù hợp đi học đi làm.','Trung Quốc',200,15,450000,47,165,'tuixach2.png','ACTIVE',13,'STORE2025080501001','2025-12-25 11:30:00','2025-12-25 11:30:00'),
(28,'Nồi chiên không dầu','Nồi chiên không dầu 5.5L, công suất 1800W, 8 chức năng nấu. Ăn ngon, ít dầu mỡ, tốt cho sức khỏe.','Trung Quốc',140,12,1890000,45,112,'giadung1.png','ACTIVE',14,'STORE2025081002002','2025-12-28 13:45:00','2025-12-28 13:45:00'),
(29,'Máy hút bụi cầm tay','Máy hút bụi cầm tay không dây Dyson V15, lực hút mạnh, phát hiện bụi laser. Vệ sinh nhà cửa hiệu quả.','Anh',60,10,15990000,48,48,'giadung2.png','ACTIVE',14,'STORE1766314663632','2025-12-30 15:20:00','2025-12-30 15:20:00'),
(30,'Bàn làm việc gỗ công nghiệp','Bàn làm việc gỗ công nghiệp 120x60cm, chân sắt sơn tĩnh điện. Thiết kế hiện đại, chắc chắn.','Việt Nam',85,8,1590000,44,68,'banghe1.png','ACTIVE',15,'STORE2025080501001','2026-01-01 10:30:00','2026-01-01 10:30:00'),
(31,'Ghế gaming cao cấp','Ghế gaming cao cấp có gác chân, đệm mút D cao cấp, lưng ngả 180 độ. Thoải mái cho game thủ.','Trung Quốc',70,20,2990000,46,55,'banghe2.png','ACTIVE',15,'STORE2025081002002','2026-01-02 14:15:00','2026-01-02 14:15:00'),
(32,'Bộ nồi inox 5 món','Bộ nồi inox 304 cao cấp 5 món, đáy từ 3 lớp. Nấu ăn an toàn, bền đẹp theo thời gian.','Việt Nam',120,10,890000,45,95,'dungcu1.png','ACTIVE',16,'STORE1766314663632','2026-01-03 08:45:00','2026-01-03 08:45:00'),
(33,'Bộ dao làm bếp 7 món','Bộ dao làm bếp 7 món thép không gỉ, tay cầm chống trượt. Sắc bén, an toàn khi sử dụng.','Đức',90,15,1290000,47,72,'dungcu2.png','ACTIVE',16,'STORE2025080501001','2026-01-03 11:20:00','2026-01-03 11:20:00'),
(34,'Xe đạp thể thao Giant','Xe đạp thể thao Giant ATX 830, khung nhôm siêu nhẹ, 21 tốc độ. Phù hợp đường phố và địa hình.','Đài Loan',25,12,8990000,48,18,'thethao1.png','ACTIVE',17,'STORE2025081002002','2026-01-03 14:35:00','2026-01-03 14:35:00'),
(35,'Máy chạy bộ điện','Máy chạy bộ điện đa năng, màn hình LED, 12 chương trình tập. Rèn luyện sức khỏe tại nhà.','Trung Quốc',40,18,7990000,46,32,'thethao2.png','ACTIVE',17,'STORE1766314663632','2026-01-04 09:50:00','2026-01-04 09:50:00'),
(36,'Bộ Lego Star Wars','Bộ Lego Star Wars 1200 mảnh, chi tiết cao, hướng dẫn lắp ráp. Phát triển tư duy sáng tạo cho trẻ.','Đan Mạch',80,10,1890000,45,65,'treem1.png','ACTIVE',18,'STORE2025080501001','2026-01-04 11:25:00','2026-01-04 11:25:00'),
(37,'Xe đồ chơi điều khiển','Xe đồ chơi điều khiển từ xa, pin sạc, tốc độ cao. An toàn, bền đẹp cho trẻ em.','Trung Quốc',150,20,450000,44,118,'treem2.png','ACTIVE',18,'STORE2025081002002','2026-01-04 13:40:00','2026-01-04 13:40:00'),
(38,'Sách Đắc Nhân Tâm','Sách Đắc Nhân Tâm - Dale Carnegie, bản dịch mới nhất. Best seller về kỹ năng giao tiếp và ứng xử.','Việt Nam',500,5,120000,49,420,'sachvo1.png','ACTIVE',19,'STORE1766314663632','2026-01-04 15:15:00','2026-01-04 15:15:00'),
(39,'Tai nghe Bluetooth Sony','Tai nghe Bluetooth Sony WH-1000XM5, chống ồn chủ động, pin 30 giờ. Âm thanh Hi-Res chất lượng cao.','Nhật Bản',100,15,8490000,48,82,'phukien1.png','ACTIVE',20,'STORE2025080501001','2026-01-04 16:30:00','2026-01-04 16:30:00'),
(40,'Sạc dự phòng Anker 20000mAh','Sạc dự phòng Anker PowerCore 20000mAh, sạc nhanh PD 20W. Nhỏ gọn, an toàn cho thiết bị.','Trung Quốc',250,12,890000,46,195,'phukien2.png','ACTIVE',20,'STORE2025081002002','2026-01-04 17:45:00','2026-01-04 17:45:00');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `return_images`
--

DROP TABLE IF EXISTS `return_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `return_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `return_id` int NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `return_id` (`return_id`),
  CONSTRAINT `return_images_ibfk_1` FOREIGN KEY (`return_id`) REFERENCES `returns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `return_images`
--

LOCK TABLES `return_images` WRITE;
/*!40000 ALTER TABLE `return_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `return_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `return_items`
--

DROP TABLE IF EXISTS `return_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `return_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `return_id` int NOT NULL,
  `order_item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `return_id` (`return_id`),
  KEY `order_item_id` (`order_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `return_items`
--

LOCK TABLES `return_items` WRITE;
/*!40000 ALTER TABLE `return_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `return_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `returns`
--

DROP TABLE IF EXISTS `returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `returns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `returns`
--

LOCK TABLES `returns` WRITE;
/*!40000 ALTER TABLE `returns` DISABLE KEYS */;
INSERT INTO `returns` VALUES (1,4,'2025-12-22 12:56:46','Sản phẩm bị lỗi/hỏng',57036.00,'2025-12-22 12:56:46','2025-12-22 12:56:46'),(2,1,'2025-12-22 12:58:04','Sản phẩm không đúng kích thước/màu sắc',45613.00,'2025-12-22 12:58:04','2025-12-22 12:58:04'),(3,6,'2025-12-22 13:05:58','Sản phẩm bị lỗi/hỏng',57036.00,'2025-12-22 13:05:58','2025-12-22 13:05:58');
/*!40000 ALTER TABLE `returns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_images`
--

DROP TABLE IF EXISTS `review_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `reviewId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reviewId` (`reviewId`),
  CONSTRAINT `review_images_ibfk_1` FOREIGN KEY (`reviewId`) REFERENCES `reviews` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_images`
--

LOCK TABLES `review_images` WRITE;
/*!40000 ALTER TABLE `review_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `rating` int NOT NULL,
  `clientId` varchar(255) NOT NULL,
  `productId` int NOT NULL,
  `orderId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `productId` (`productId`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'như loằn',5,'CLIENT1766314602202',2,1,'2025-12-22 12:23:27','2025-12-22 12:23:27'),(2,'sản phẩm oke',4,'CLIENT1766314602202',2,6,'2025-12-22 13:05:50','2025-12-22 13:05:50');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shippers`
--

DROP TABLE IF EXISTS `shippers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shippers` (
  `id` varchar(255) NOT NULL,
  `citizen_id` varchar(255) DEFAULT NULL,
  `id_image` varchar(255) DEFAULT 'default-citizen_id_image.jpg',
  `image` varchar(255) DEFAULT 'default-image.jpg',
  `profile_image` varchar(255) DEFAULT 'default-profile_image.jpg',
  `health_image` varchar(255) DEFAULT 'default-health_image.jpg',
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','BANNED','PROCESSING','DESTROYED') NOT NULL DEFAULT 'PROCESSING',
  `is_available` tinyint(1) DEFAULT '0',
  `vehicle_name` varchar(100) DEFAULT NULL,
  `license_plate` varchar(100) DEFAULT NULL,
  `rating` int DEFAULT '0',
  `total_deliveries` int DEFAULT '0',
  `work_area_city` varchar(100) DEFAULT NULL,
  `work_area_village` varchar(100) DEFAULT NULL,
  `wallet` float DEFAULT '0',
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_number` varchar(100) DEFAULT NULL,
  `bank_account_holder_name` varchar(100) DEFAULT NULL,
  `is_verified_email` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `citizen_id` (`citizen_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `citizen_id_2` (`citizen_id`),
  UNIQUE KEY `phone_2` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippers`
--

LOCK TABLES `shippers` WRITE;
/*!40000 ALTER TABLE `shippers` DISABLE KEYS */;
INSERT INTO `shippers` VALUES ('SHIPPER1766315105177','036181538154','citizen_id-036181538154.jpeg','vehicle-036181538154.jpeg','profile-036181538154.jpeg','health-036181538154.jpeg','Hieu@gmail.com','0123456789','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Hiếu','ACTIVE',0,'motorcycle','B21-29163',0,0,'TP. Hồ Chí Minh','Hehe',986964,'Mb','13456678','Hiếu',0,'2025-12-21 11:05:05','2025-12-22 12:42:27'),('SHIPPER1766408019380','027452815382','citizen_id-027452815382.jpeg','vehicle-027452815382.jpeg','profile-027452815382.jpeg','health-027452815382.jpeg','Check@gmail.com','1234567890','$2b$12$V4WR0.MkVdkDcOBvVSffauRtdn8WYfMfm8ctkRPItNpQmQbxi7miy','Check','ACTIVE',0,'motorcycle','Gv717272',0,0,'Cần Thơ','Hdgd',1039000,'1019272','1518484','16vhsjs',0,'2025-12-22 12:53:39','2025-12-24 10:17:55'),
('SHIPPER2025080501001','038201234567','citizen_id-038201234567.jpeg','vehicle-038201234567.jpeg','profile-038201234567.jpeg','health-038201234567.jpeg','shipper.tuan@gmail.com','0931234567','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Nguyễn Văn Tuấn','ACTIVE',1,'motorcycle','59A1-12345',45,120,'Hà Nội','Cầu Giấy',2500000,'Vietcombank','0011223344','Nguyen Van Tuan',1,'2025-08-05 08:30:00','2025-08-05 08:30:00'),
('SHIPPER2025081202002','039302345678','citizen_id-039302345678.jpeg','vehicle-039302345678.jpeg','profile-039302345678.jpeg','health-039302345678.jpeg','shipper.hoa@gmail.com','0932345678','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Trần Thị Hoa','ACTIVE',1,'motorcycle','30A2-23456',42,95,'TP. Hồ Chí Minh','Quận 1',1800000,'Techcombank','1122334455','Tran Thi Hoa',1,'2025-08-12 10:15:00','2025-08-12 10:15:00'),
('SHIPPER2025082003003','040403456789','citizen_id-040403456789.jpeg','vehicle-040403456789.jpeg','profile-040403456789.jpeg','health-040403456789.jpeg','shipper.minh@gmail.com','0933456789','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Lê Văn Minh','ACTIVE',0,'motorcycle','43A3-34567',48,150,'Đà Nẵng','Hải Châu',3200000,'MB','2233445566','Le Van Minh',1,'2025-08-20 14:45:00','2025-08-20 14:45:00'),
('SHIPPER2025090504004','041504567890','citizen_id-041504567890.jpeg','vehicle-041504567890.jpeg','profile-041504567890.jpeg','health-041504567890.jpeg','shipper.lan@gmail.com','0934567890','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Phạm Thị Lan','ACTIVE',1,'motorcycle','51B4-45678',50,200,'TP. Hồ Chí Minh','Quận 7',4500000,'ACB','3344556677','Pham Thi Lan',1,'2025-09-05 09:20:00','2025-09-05 09:20:00'),
('SHIPPER2025091505005','042605678901','citizen_id-042605678901.jpeg','vehicle-042605678901.jpeg','profile-042605678901.jpeg','health-042605678901.jpeg','shipper.duc@gmail.com','0935678901','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Hoàng Văn Đức','ACTIVE',1,'motorcycle','29B5-56789',46,110,'Hà Nội','Đống Đa',2100000,'BIDV','4455667788','Hoang Van Duc',1,'2025-09-15 11:30:00','2025-09-15 11:30:00'),
('SHIPPER2025092806006','043706789012','citizen_id-043706789012.jpeg','vehicle-043706789012.jpeg','profile-043706789012.jpeg','health-043706789012.jpeg','shipper.nga@gmail.com','0936789012','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Vũ Thị Nga','ACTIVE',0,'motorcycle','92B6-67890',44,88,'Cần Thơ','Ninh Kiều',1600000,'Sacombank','5566778899','Vu Thi Nga',1,'2025-09-28 13:45:00','2025-09-28 13:45:00'),
('SHIPPER2025100307007','044807890123','citizen_id-044807890123.jpeg','vehicle-044807890123.jpeg','profile-044807890123.jpeg','health-044807890123.jpeg','shipper.hung@gmail.com','0937890123','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Đặng Văn Hùng','ACTIVE',1,'motorcycle','36B7-78901',47,135,'Hải Phòng','Ngô Quyền',2800000,'VPBank','6677889900','Dang Van Hung',1,'2025-10-03 08:55:00','2025-10-03 08:55:00'),
('SHIPPER2025101508008','045908901234','citizen_id-045908901234.jpeg','vehicle-045908901234.jpeg','profile-045908901234.jpeg','health-045908901234.jpeg','shipper.thao@gmail.com','0938901234','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Ngô Thị Thảo','ACTIVE',1,'motorcycle','50B8-89012',49,175,'TP. Hồ Chí Minh','Bình Thạnh',3800000,'TPBank','7788990011','Ngo Thi Thao',1,'2025-10-15 15:10:00','2025-10-15 15:10:00'),
('SHIPPER2025102709009','046009012345','citizen_id-046009012345.jpeg','vehicle-046009012345.jpeg','profile-046009012345.jpeg','health-046009012345.jpeg','shipper.long@gmail.com','0939012345','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Bùi Văn Long','ACTIVE',0,'motorcycle','29B9-90123',43,72,'Hà Nội','Ba Đình',1400000,'Agribank','8899001122','Bui Van Long',1,'2025-10-27 10:25:00','2025-10-27 10:25:00'),
('SHIPPER2025110510010','047100123456','citizen_id-047100123456.jpeg','vehicle-047100123456.jpeg','profile-047100123456.jpeg','health-047100123456.jpeg','shipper.mai@gmail.com','0940123456','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Đỗ Thị Mai','ACTIVE',1,'motorcycle','51C1-01234',51,220,'TP. Hồ Chí Minh','Quận 3',5200000,'Vietinbank','9900112233','Do Thi Mai',1,'2025-11-05 12:40:00','2025-11-05 12:40:00'),
('SHIPPER2025111811011','048211234567','citizen_id-048211234567.jpeg','vehicle-048211234567.jpeg','profile-048211234567.jpeg','health-048211234567.jpeg','shipper.nam@gmail.com','0941234567','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Trương Văn Nam','ACTIVE',1,'motorcycle','43C2-12345',45,98,'Đà Nẵng','Thanh Khê',1950000,'HDBank','0011223366','Truong Van Nam',1,'2025-11-18 14:55:00','2025-11-18 14:55:00'),
('SHIPPER2025112812012','049322345678','citizen_id-049322345678.jpeg','vehicle-049322345678.jpeg','profile-049322345678.jpeg','health-049322345678.jpeg','shipper.linh@gmail.com','0942345678','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Lý Thị Linh','ACTIVE',0,'motorcycle','30C3-23456',47,145,'TP. Hồ Chí Minh','Tân Bình',3100000,'OCB','1122334477','Ly Thi Linh',1,'2025-11-28 09:30:00','2025-11-28 09:30:00'),
('SHIPPER2025120813013','050433456789','citizen_id-050433456789.jpeg','vehicle-050433456789.jpeg','profile-050433456789.jpeg','health-050433456789.jpeg','shipper.phong@gmail.com','0943456789','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Đinh Văn Phong','ACTIVE',1,'motorcycle','29C4-34567',48,160,'Hà Nội','Hoàn Kiếm',3500000,'SHB','2233445588','Dinh Van Phong',1,'2025-12-08 11:15:00','2025-12-08 11:15:00'),
('SHIPPER2025121814014','051544567890','citizen_id-051544567890.jpeg','vehicle-051544567890.jpeg','profile-051544567890.jpeg','health-051544567890.jpeg','shipper.yen@gmail.com','0944567890','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Cao Thị Yến','ACTIVE',1,'motorcycle','51C5-45678',50,190,'TP. Hồ Chí Minh','Phú Nhuận',4200000,'Eximbank','3344556699','Cao Thi Yen',1,'2025-12-18 16:35:00','2025-12-18 16:35:00'),
('SHIPPER2025122815015','052655678901','citizen_id-052655678901.jpeg','vehicle-052655678901.jpeg','profile-052655678901.jpeg','health-052655678901.jpeg','shipper.cuong@gmail.com','0945678901','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Sơn Văn Cường','ACTIVE',0,'motorcycle','92C6-56789',44,82,'Cần Thơ','Bình Thủy',1550000,'LienVietPostBank','4455667700','Son Van Cuong',1,'2025-12-28 08:50:00','2025-12-28 08:50:00'),
('SHIPPER2026010116016','053766789012','citizen_id-053766789012.jpeg','vehicle-053766789012.jpeg','profile-053766789012.jpeg','health-053766789012.jpeg','shipper.hanh@gmail.com','0946789012','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Mai Thị Hạnh','ACTIVE',1,'motorcycle','36C7-67890',46,105,'Hải Phòng','Lê Chân',2200000,'VIB','5566778811','Mai Thi Hanh',1,'2026-01-01 10:20:00','2026-01-01 10:20:00'),
('SHIPPER2026010217017','054877890123','citizen_id-054877890123.jpeg','vehicle-054877890123.jpeg','profile-054877890123.jpeg','health-054877890123.jpeg','shipper.khanh@gmail.com','0947890123','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Lương Văn Khánh','ACTIVE',1,'motorcycle','29C8-78901',49,168,'Hà Nội','Thanh Xuân',3650000,'NCB','6677889922','Luong Van Khanh',1,'2026-01-02 13:45:00','2026-01-02 13:45:00'),
('SHIPPER2026010318018','055988901234','citizen_id-055988901234.jpeg','vehicle-055988901234.jpeg','profile-055988901234.jpeg','health-055988901234.jpeg','shipper.thu@gmail.com','0948901234','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Tạ Thị Thu','ACTIVE',1,'motorcycle','51C9-89012',52,245,'TP. Hồ Chí Minh','Gò Vấp',5800000,'ABBank','7788990033','Ta Thi Thu',1,'2026-01-03 15:00:00','2026-01-03 15:00:00'),
('SHIPPER2026010419019','056099012345','citizen_id-056099012345.jpeg','vehicle-056099012345.jpeg','profile-056099012345.jpeg','health-056099012345.jpeg','shipper.binh@gmail.com','0949012345','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Trịnh Văn Bình','ACTIVE',0,'motorcycle','43D1-90123',45,78,'Đà Nẵng','Sơn Trà',1380000,'SeABank','8899001144','Trinh Van Binh',1,'2026-01-04 09:30:00','2026-01-04 09:30:00');
/*!40000 ALTER TABLE `shippers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_codes`
--

DROP TABLE IF EXISTS `shipping_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `expire` datetime DEFAULT NULL,
  `adminId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  KEY `adminId` (`adminId`),
  CONSTRAINT `shipping_codes_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_codes`
--

LOCK TABLES `shipping_codes` WRITE;
/*!40000 ALTER TABLE `shipping_codes` DISABLE KEYS */;
INSERT INTO `shipping_codes` VALUES (1,'check','1231',12000,995,'2026-01-03 10:45:00','ADMIN1766313158298','2025-12-21 11:20:03','2025-12-28 11:02:06');
/*!40000 ALTER TABLE `shipping_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_banners`
--

DROP TABLE IF EXISTS `store_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) DEFAULT NULL,
  `storeId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`),
  CONSTRAINT `store_banners_ibfk_1` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_banners`
--

LOCK TABLES `store_banners` WRITE;
/*!40000 ALTER TABLE `store_banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `store_banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` varchar(255) NOT NULL,
  `citizen_id` varchar(255) DEFAULT NULL,
  `id_image` varchar(255) DEFAULT 'default-store.jpg',
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_number` varchar(100) DEFAULT NULL,
  `bank_account_holder_name` varchar(100) DEFAULT NULL,
  `rating` int DEFAULT '0',
  `total_sales` int DEFAULT '0',
  `number_of_products` int DEFAULT '0',
  `status` enum('ACTIVE','INACTIVE','BANNED','PROCESSING','DESTROYED') NOT NULL DEFAULT 'PROCESSING',
  `followers` int DEFAULT '0',
  `wallet` float DEFAULT '0',
  `city` varchar(100) DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `detail_address` varchar(100) DEFAULT NULL,
  `is_mall` tinyint(1) DEFAULT '0',
  `image` varchar(255) DEFAULT 'default-store.jpg',
  `description` varchar(255) DEFAULT NULL,
  `is_verified_email` tinyint(1) DEFAULT '0',
  `passwordChangedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `citizen_id` (`citizen_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `citizen_id_2` (`citizen_id`),
  UNIQUE KEY `phone_2` (`phone`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES ('STORE1766314663632','037203002473','citizen_id-037203002473.jpeg','xxx','0946861622','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','hieu@gmail.com','MB','10122003','Hioeus',0,206535,0,'ACTIVE',0,5543,'hẹ hẹ','qzfgsdfg','0946861622',0,'avatar-037203002473.jpeg','sdfgsdfgdfsgsdfgsdf',0,'2025-12-21 10:57:43','2025-12-21 10:57:43','2025-12-24 10:17:55'),
('STORE2025080501001','038123456789','citizen_id-038123456789.jpeg','Thời Trang Việt','0951234567','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','thoitrangviet@gmail.com','Vietcombank','1234567890','Tran Van A',45,15000000,120,'ACTIVE',2500,8500000,'Hà Nội','Cầu Giấy','123 Xuân Thủy',1,'store-038123456789.jpeg','Chuyên thời trang nam nữ cao cấp',1,'2025-08-05 09:00:00','2025-08-05 09:00:00','2025-08-05 09:00:00'),
('STORE2025081002002','039234567890','citizen_id-039234567890.jpeg','Điện Tử Số','0952345678','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','dientuso@gmail.com','Techcombank','2345678901','Le Thi B',48,25000000,85,'ACTIVE',3200,12500000,'TP. Hồ Chí Minh','Quận 1','456 Nguyễn Huệ',1,'store-039234567890.jpeg','Thiết bị điện tử chính hãng',1,'2025-08-10 11:30:00','2025-08-10 11:30:00','2025-08-10 11:30:00'),
('STORE2025081803003','040345678901','citizen_id-040345678901.jpeg','Mỹ Phẩm Hàn','0953456789','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','myphamhan@gmail.com','MB','3456789012','Pham Van C',42,18000000,200,'ACTIVE',4100,9800000,'Hà Nội','Đống Đa','789 Thái Hà',0,'store-040345678901.jpeg','Mỹ phẩm Hàn Quốc nhập khẩu',1,'2025-08-18 14:20:00','2025-08-18 14:20:00','2025-08-18 14:20:00'),
('STORE2025082504004','041456789012','citizen_id-041456789012.jpeg','Đồ Gia Dụng Pro','0954567890','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','dogiadungpro@gmail.com','ACB','4567890123','Nguyen Thi D',46,12000000,150,'ACTIVE',1800,6200000,'Đà Nẵng','Hải Châu','101 Trần Phú',1,'store-041456789012.jpeg','Đồ gia dụng thông minh',1,'2025-08-25 16:45:00','2025-08-25 16:45:00','2025-08-25 16:45:00'),
('STORE2025090305005','042567890123','citizen_id-042567890123.jpeg','Sách Hay Online','0955678901','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','sachhay@gmail.com','BIDV','5678901234','Hoang Van E',40,8000000,500,'ACTIVE',5500,4500000,'TP. Hồ Chí Minh','Quận 3','202 Võ Văn Tần',0,'store-042567890123.jpeg','Sách hay giá tốt',1,'2025-09-03 10:15:00','2025-09-03 10:15:00','2025-09-03 10:15:00'),
('STORE2025091206006','043678901234','citizen_id-043678901234.jpeg','Giày Dép Fashion','0956789012','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','giaydep@gmail.com','Sacombank','6789012345','Vu Thi F',44,20000000,180,'ACTIVE',3800,11000000,'Hà Nội','Ba Đình','303 Kim Mã',1,'store-043678901234.jpeg','Giày dép thời trang',1,'2025-09-12 13:30:00','2025-09-12 13:30:00','2025-09-12 13:30:00'),
('STORE2025092007007','044789012345','citizen_id-044789012345.jpeg','Đồ Chơi Trẻ Em','0957890123','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','dochoitrem@gmail.com','VPBank','7890123456','Dang Van G',43,9500000,250,'ACTIVE',2900,5800000,'TP. Hồ Chí Minh','Quận 7','404 Nguyễn Thị Thập',0,'store-044789012345.jpeg','Đồ chơi an toàn cho bé',1,'2025-09-20 15:50:00','2025-09-20 15:50:00','2025-09-20 15:50:00'),
('STORE2025100108008','045890123456','citizen_id-045890123456.jpeg','Phụ Kiện Xe Hơi','0958901234','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','phukienxe@gmail.com','TPBank','8901234567','Ngo Thi H',47,30000000,90,'ACTIVE',2200,15000000,'Hà Nội','Hoàn Kiếm','505 Bà Triệu',1,'store-045890123456.jpeg','Phụ kiện xe hơi cao cấp',1,'2025-10-01 09:40:00','2025-10-01 09:40:00','2025-10-01 09:40:00'),
('STORE2025101509009','046901234567','citizen_id-046901234567.jpeg','Thực Phẩm Sạch','0959012345','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','thucphamsach@gmail.com','Agribank','9012345678','Bui Van I',41,11000000,300,'ACTIVE',4500,7200000,'Cần Thơ','Ninh Kiều','606 Nguyễn Văn Linh',0,'store-046901234567.jpeg','Thực phẩm organic',1,'2025-10-15 12:25:00','2025-10-15 12:25:00','2025-10-15 12:25:00'),
('STORE2025102810010','047012345678','citizen_id-047012345678.jpeg','Nội Thất Đẹp','0960123456','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','noithatdep@gmail.com','Vietinbank','0123456789','Do Thi K',49,45000000,60,'ACTIVE',1500,22000000,'TP. Hồ Chí Minh','Bình Thạnh','707 Xô Viết Nghệ Tĩnh',1,'store-047012345678.jpeg','Nội thất hiện đại',1,'2025-10-28 14:55:00','2025-10-28 14:55:00','2025-10-28 14:55:00'),
('STORE2025110511011','048123456789','citizen_id-048123456789.jpeg','Túi Xách Nữ','0961234567','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','tuixachnu@gmail.com','HDBank','1234567801','Truong Van L',45,16000000,140,'ACTIVE',3100,8800000,'Hà Nội','Thanh Xuân','808 Nguyễn Trãi',1,'store-048123456789.jpeg','Túi xách thời trang',1,'2025-11-05 11:10:00','2025-11-05 11:10:00','2025-11-05 11:10:00'),
('STORE2025111812012','049234567890','citizen_id-049234567890.jpeg','Đồng Hồ Chính Hãng','0962345678','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','dongho@gmail.com','OCB','2345678902','Ly Thi M',50,55000000,45,'ACTIVE',2800,28000000,'TP. Hồ Chí Minh','Quận 1','909 Đồng Khởi',1,'store-049234567890.jpeg','Đồng hồ cao cấp',1,'2025-11-18 16:35:00','2025-11-18 16:35:00','2025-11-18 16:35:00'),
('STORE2025112513013','050345678901','citizen_id-050345678901.jpeg','Thể Thao 365','0963456789','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','thethao365@gmail.com','SHB','3456789013','Dinh Van N',44,22000000,170,'ACTIVE',3600,12000000,'Đà Nẵng','Thanh Khê','111 Điện Biên Phủ',0,'store-050345678901.jpeg','Dụng cụ thể thao',1,'2025-11-25 09:20:00','2025-11-25 09:20:00','2025-11-25 09:20:00'),
('STORE2025120314014','051456789012','citizen_id-051456789012.jpeg','Mẹ và Bé Shop','0964567890','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','mebestore@gmail.com','Eximbank','4567890124','Cao Thi O',42,13000000,220,'ACTIVE',4200,7500000,'Hà Nội','Hà Đông','212 Quang Trung',1,'store-051456789012.jpeg','Đồ dùng mẹ và bé',1,'2025-12-03 13:45:00','2025-12-03 13:45:00','2025-12-03 13:45:00'),
('STORE2025121215015','052567890123','citizen_id-052567890123.jpeg','Laptop Giá Rẻ','0965678901','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','laptopgiare@gmail.com','LienVietPostBank','5678901235','Son Van P',48,65000000,35,'ACTIVE',1900,35000000,'TP. Hồ Chí Minh','Quận 10','313 Ba Tháng Hai',1,'store-052567890123.jpeg','Laptop chính hãng giá tốt',1,'2025-12-12 15:30:00','2025-12-12 15:30:00','2025-12-12 15:30:00'),
('STORE2025122016016','053678901234','citizen_id-053678901234.jpeg','Trang Sức Đẹp','0966789012','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','trangsuc@gmail.com','VIB','6789012346','Mai Thi Q',46,40000000,80,'ACTIVE',2600,18500000,'Hải Phòng','Ngô Quyền','414 Lạch Tray',0,'store-053678901234.jpeg','Trang sức thời trang',1,'2025-12-20 10:55:00','2025-12-20 10:55:00','2025-12-20 10:55:00'),
('STORE2025122817017','054789012345','citizen_id-054789012345.jpeg','Đồ Lưu Niệm VN','0967890123','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','doluuniem@gmail.com','NCB','7890123457','Luong Van R',41,7000000,400,'ACTIVE',5800,4000000,'Hà Nội','Hoàn Kiếm','515 Hàng Bài',1,'store-054789012345.jpeg','Quà lưu niệm Việt Nam',1,'2025-12-28 12:40:00','2025-12-28 12:40:00','2025-12-28 12:40:00'),
('STORE2026010118018','055890123456','citizen_id-055890123456.jpeg','Cafe và Trà','0968901234','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','cafetra@gmail.com','ABBank','8901234568','Ta Thi S',43,10000000,280,'ACTIVE',3900,6500000,'TP. Hồ Chí Minh','Phú Nhuận','616 Phan Xích Long',0,'store-055890123456.jpeg','Cà phê và trà cao cấp',1,'2026-01-01 14:15:00','2026-01-01 14:15:00','2026-01-01 14:15:00'),
('STORE2026010219019','056901234567','citizen_id-056901234567.jpeg','Văn Phòng Phẩm','0969012345','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','vanphongpham@gmail.com','SeABank','9012345679','Trinh Van T',40,6000000,350,'ACTIVE',4800,3800000,'Hà Nội','Cầu Giấy','717 Trần Duy Hưng',1,'store-056901234567.jpeg','Văn phòng phẩm đa dạng',1,'2026-01-02 09:50:00','2026-01-02 09:50:00','2026-01-02 09:50:00'),
('STORE2026010320020','057012345678','citizen_id-057012345678.jpeg','Kính Mắt Thời Trang','0970123456','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','kinhmat@gmail.com','NamABank','0123456780','Kieu Thi U',45,18000000,95,'ACTIVE',2100,9200000,'TP. Hồ Chí Minh','Quận 5','818 Trần Hưng Đạo',1,'store-057012345678.jpeg','Kính mắt thời trang',1,'2026-01-03 11:25:00','2026-01-03 11:25:00','2026-01-03 11:25:00'),
('STORE2026010421021','058123456789','citizen_id-058123456789.jpeg','Đồ Da Cao Cấp','0971234567','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','dodacaocap@gmail.com','PVcomBank','1234567892','Lam Van V',47,35000000,70,'ACTIVE',1700,16000000,'Đà Nẵng','Ngũ Hành Sơn','919 Võ Nguyên Giáp',1,'store-058123456789.jpeg','Đồ da handmade',1,'2026-01-04 08:35:00','2026-01-04 08:35:00','2026-01-04 08:35:00');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supercategories`
--

DROP TABLE IF EXISTS `supercategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supercategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supercategories`
--

LOCK TABLES `supercategories` WRITE;
/*!40000 ALTER TABLE `supercategories` DISABLE KEYS */;
INSERT INTO `supercategories` VALUES (1,'check','supercategory-ADMIN1766313158298-1766316067719.jpeg','2025-12-21 11:21:07','2025-12-21 11:21:07');
/*!40000 ALTER TABLE `supercategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `new_balance` float DEFAULT NULL,
  `amount` decimal(18,2) NOT NULL,
  `type` enum('TOP_UP','PAY_ORDER','REFUND','WITHDRAW') NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `reference_id` int DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'CLIENT1766314602202',1000000,1000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-22 06:04:34','2025-12-22 06:04:34'),(2,'CLIENT1766314602202',954387,-45613.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Wallet payment for order 1','2025-12-22 06:05:14','2025-12-22 06:05:14'),(3,'SHIPPER1766315105177',1000000,1000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-22 06:06:51','2025-12-22 06:06:51'),(4,'STORE1766314663632',12490.4,12490.40,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 1','2025-12-22 06:23:22','2025-12-22 06:23:22'),(5,'SHIPPER1766315105177',1013000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 1','2025-12-22 06:23:22','2025-12-22 06:23:22'),(6,'STORE1766314663632',43719.2,31228.80,'TOP_UP','cash',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 4','2025-12-22 12:42:27','2025-12-22 12:42:27'),(7,'SHIPPER1766315105177',1026000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 4','2025-12-22 12:42:27','2025-12-22 12:42:27'),(8,'SHIPPER1766315105177',986964,-39036.00,'PAY_ORDER','cash',NULL,'SUCCESS','Trừ tiền đơn hàng 4','2025-12-22 12:42:27','2025-12-22 12:42:27'),(9,'CLIENT1766314602202',1011420,57036.00,'REFUND','refund',NULL,'SUCCESS','Refund confirmed for return 1 (order 4)','2025-12-22 12:56:50','2025-12-22 12:56:50'),(10,'STORE1766314663632',-13316.8,-57036.00,'PAY_ORDER','refund',NULL,'SUCCESS','Refund deducted for return 1 (order 4)','2025-12-22 12:56:50','2025-12-22 12:56:50'),(11,'CLIENT1766314602202',1057030,45613.00,'REFUND','refund',NULL,'SUCCESS','Refund confirmed for return 2 (order 1)','2025-12-22 12:58:52','2025-12-22 12:58:52'),(12,'STORE1766314663632',-58929.8,-45613.00,'PAY_ORDER','refund',NULL,'SUCCESS','Refund deducted for return 2 (order 1)','2025-12-22 12:58:52','2025-12-22 12:58:52'),(13,'CLIENT1766314602202',999994,-57036.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Wallet payment for order 6','2025-12-22 13:03:27','2025-12-22 13:03:27'),(14,'STORE1766314663632',-27701,31228.80,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 6','2025-12-22 13:05:01','2025-12-22 13:05:01'),(15,'SHIPPER1766408019380',1013000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 6','2025-12-22 13:05:01','2025-12-22 13:05:01'),(16,'CLIENT1766314602202',1057030,57036.00,'REFUND','refund',NULL,'SUCCESS','Refund confirmed for return 3 (order 6)','2025-12-22 13:06:11','2025-12-22 13:06:11'),(17,'STORE1766314663632',-84737,-57036.00,'PAY_ORDER','refund',NULL,'SUCCESS','Refund deducted for return 3 (order 6)','2025-12-22 13:06:11','2025-12-22 13:06:11'),(18,'CLIENT1766314602202',11057000,10000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-23 16:07:25','2025-12-23 16:07:25'),(19,'CLIENT1766565306888',9925580,-74425.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 7','2025-12-24 08:46:12','2025-12-24 08:46:12'),(20,'STORE1766314663632',-39597,45140.00,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 7','2025-12-24 10:17:54','2025-12-24 10:17:54'),(21,'SHIPPER1766408019380',1026000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 7','2025-12-24 10:17:54','2025-12-24 10:17:54'),(22,'STORE1766314663632',5543,45140.00,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 7','2025-12-24 10:17:55','2025-12-24 10:17:55'),(23,'SHIPPER1766408019380',1039000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 7','2025-12-24 10:17:55','2025-12-24 10:17:55'),(24,'CLIENT1766565306888',10925600,1000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-24 12:35:40','2025-12-24 12:35:40'),(25,'CLIENT1766565306888',10851200,-74425.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 8','2025-12-28 11:02:06','2025-12-28 11:02:06'),(26,'CLIENT1766314602202',11157000,100000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-28 14:02:24','2025-12-28 14:02:24'),(27,'CLIENT1766565306888',11751200,900000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-28 14:03:20','2025-12-28 14:03:20'),(28,'CLIENT1766565306888',12741200,990000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-28 14:05:17','2025-12-28 14:05:17'),(29,'CLIENT1766565306888',10741200,2000000.00,'WITHDRAW','wallet',NULL,'SUCCESS','Rút tiền từ ví','2025-12-28 14:14:22','2025-12-28 14:14:22');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_search_queries`
--

DROP TABLE IF EXISTS `user_search_queries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_search_queries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` varchar(255) DEFAULT NULL,
  `search_text` varchar(500) NOT NULL,
  `filter_data` json DEFAULT NULL,
  `device` varchar(50) DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `user_search_queries_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_search_queries`
--

LOCK TABLES `user_search_queries` WRITE;
/*!40000 ALTER TABLE `user_search_queries` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_search_queries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_view_events`
--

DROP TABLE IF EXISTS `user_view_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_view_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` varchar(255) DEFAULT NULL,
  `product_id` int NOT NULL,
  `duration` int DEFAULT NULL,
  `device` varchar(50) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `user_view_events_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_view_events_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_view_events`
--

LOCK TABLES `user_view_events` WRITE;
/*!40000 ALTER TABLE `user_view_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_view_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant_options`
--

DROP TABLE IF EXISTS `variant_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant_options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(50) DEFAULT NULL,
  `product_variantId` int DEFAULT NULL,
  `attributeId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_variantId` (`product_variantId`),
  KEY `attributeId` (`attributeId`),
  CONSTRAINT `variant_options_ibfk_1` FOREIGN KEY (`product_variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `variant_options_ibfk_2` FOREIGN KEY (`attributeId`) REFERENCES `attributes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_options`
--

LOCK TABLES `variant_options` WRITE;
/*!40000 ALTER TABLE `variant_options` DISABLE KEYS */;
INSERT INTO `variant_options` VALUES (1,'12123',1,4,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(2,'111',1,5,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(3,'hghh',1,6,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(4,'12123',2,4,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(5,'ddd',2,5,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(6,'hghh',2,6,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(7,'1231',3,4,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(8,'111',3,5,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(9,'hghh',3,6,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(10,'1231',4,4,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(11,'ddd',4,5,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(12,'hghh',4,6,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(13,'12',5,4,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(14,'33',5,5,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(15,'333',5,6,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(16,'12',6,4,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(17,'3',6,5,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(18,'333',6,6,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(19,'12',7,4,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(20,'33',7,5,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(21,'333',7,6,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(22,'12',8,4,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(23,'3',8,5,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(24,'333',8,6,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(25,'11',9,4,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(26,'212',9,5,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(27,NULL,9,6,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(28,'11',10,4,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(29,'212',10,5,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(30,NULL,10,6,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(31,'size 12',11,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(32,'màu đen',11,5,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(33,NULL,11,6,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(34,'size 12',12,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(35,'màu xanh',12,5,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(36,NULL,12,6,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(37,'size 24',13,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(38,'màu đen',13,5,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(39,NULL,13,6,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(40,'size 24',14,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(41,'màu xanh',14,5,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(42,NULL,14,6,'2025-12-24 08:04:39','2025-12-24 08:04:39');
/*!40000 ALTER TABLE `variant_options` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-04 22:26:54
-- Thêm data vào bảng supercategories (thêm 19 bản ghi mới, tổng 20)
INSERT INTO `supercategories` (`name`, `image`, `createdAt`, `updatedAt`) VALUES
('Fashion', 'supercategory-fashion.jpeg', '2025-01-15 10:00:00', '2025-01-15 10:00:00'),
('Electronics', 'supercategory-electronics.jpeg', '2025-02-20 11:30:00', '2025-02-20 11:30:00'),
('Home Appliances', 'supercategory-home.jpeg', '2025-03-10 09:45:00', '2025-03-10 09:45:00'),
('Books', 'supercategory-books.jpeg', '2025-04-05 14:20:00', '2025-04-05 14:20:00'),
('Toys', 'supercategory-toys.jpeg', '2025-05-18 16:10:00', '2025-05-18 16:10:00'),
('Beauty', 'supercategory-beauty.jpeg', '2025-06-22 08:55:00', '2025-06-22 08:55:00'),
('Sports', 'supercategory-sports.jpeg', '2025-07-30 13:40:00', '2025-07-30 13:40:00'),
('Groceries', 'supercategory-groceries.jpeg', '2025-08-12 15:25:00', '2025-08-12 15:25:00'),
('Automotive', 'supercategory-auto.jpeg', '2025-09-25 10:15:00', '2025-09-25 10:15:00'),
('Health', 'supercategory-health.jpeg', '2025-10-08 12:05:00', '2025-10-08 12:05:00'),
('Furniture', 'supercategory-furniture.jpeg', '2025-11-14 17:50:00', '2025-11-14 17:50:00'),
('Jewelry', 'supercategory-jewelry.jpeg', '2025-12-03 09:35:00', '2025-12-03 09:35:00'),
('Stationery', 'supercategory-stationery.jpeg', '2025-01-28 11:20:00', '2025-01-28 11:20:00'),
('Pets', 'supercategory-pets.jpeg', '2025-02-15 14:45:00', '2025-02-15 14:45:00'),
('Garden', 'supercategory-garden.jpeg', '2025-03-22 16:30:00', '2025-03-22 16:30:00'),
('Music', 'supercategory-music.jpeg', '2025-04-10 08:10:00', '2025-04-10 08:10:00'),
('Movies', 'supercategory-movies.jpeg', '2025-05-05 13:55:00', '2025-05-05 13:55:00'),
('Games', 'supercategory-games.jpeg', '2025-06-18 15:40:00', '2025-06-18 15:40:00'),
('Software', 'supercategory-software.jpeg', '2025-07-25 10:25:00', '2025-07-25 10:25:00');

-- Thêm data vào bảng admins (thêm 18 bản ghi mới, tổng 20)
INSERT INTO `admins` (`id`, `username`, `password`, `email`, `phone`, `fullname`, `role`, `job_title`, `hire_date`, `salary`, `wallet`, `address`, `active`, `image`, `bank_name`, `bank_account_number`, `bank_account_holder_name`, `passwordChangedAt`, `createdAt`, `updatedAt`) VALUES
('ADMIN018', 'admin18', '$2b$12$hashedpass18', 'admin18@example.com', '0123456798', 'Admin Eighteen', 'staff', 'Staff', '2025-06-01', 1900000, 140000, 'Address18', 1, 'admin18.jpg', 'Bank18', 'Acc18', 'Holder18', NULL, '2025-01-05 10:00:00', '2025-01-05 10:00:00'),
('ADMIN019', 'admin19', '$2b$12$hashedpass19', 'admin19@example.com', '0123456799', 'Admin Nineteen', 'manager', 'Manager', '2025-07-01', 2000000, 150000, 'Address19', 1, 'admin19.jpg', 'Bank19', 'Acc19', 'Holder19', NULL, '2025-01-15 11:30:00', '2025-01-15 11:30:00'),
('ADMIN020', 'admin20', '$2b$12$hashedpass20', 'admin20@example.com', '0123456800', 'Admin Twenty', 'staff', 'Staff', '2025-08-01', 2100000, 160000, 'Address20', 1, 'admin20.jpg', 'Bank20', 'Acc20', 'Holder20', NULL, '2025-01-25 09:45:00', '2025-01-25 09:45:00'),
('ADMIN021', 'admin21', '$2b$12$hashedpass21', 'admin21@example.com', '0123456801', 'Admin Twenty One', 'manager', 'Manager', '2025-09-01', 2200000, 170000, 'Address21', 1, 'admin21.jpg', 'Bank21', 'Acc21', 'Holder21', NULL, '2025-02-05 14:20:00', '2025-02-05 14:20:00'),
('ADMIN022', 'admin22', '$2b$12$hashedpass22', 'admin22@example.com', '0123456802', 'Admin Twenty Two', 'staff', 'Staff', '2025-10-01', 2300000, 180000, 'Address22', 1, 'admin22.jpg', 'Bank22', 'Acc22', 'Holder22', NULL, '2025-02-15 16:10:00', '2025-02-15 16:10:00'),
('ADMIN023', 'admin23', '$2b$12$hashedpass23', 'admin23@example.com', '0123456803', 'Admin Twenty Three', 'manager', 'Manager', '2025-11-01', 2400000, 190000, 'Address23', 1, 'admin23.jpg', 'Bank23', 'Acc23', 'Holder23', NULL, '2025-02-25 08:55:00', '2025-02-25 08:55:00'),
('ADMIN024', 'admin24', '$2b$12$hashedpass24', 'admin24@example.com', '0123456804', 'Admin Twenty Four', 'staff', 'Staff', '2025-12-01', 2500000, 200000, 'Address24', 1, 'admin24.jpg', 'Bank24', 'Acc24', 'Holder24', NULL, '2025-03-05 13:40:00', '2025-03-05 13:40:00'),
('ADMIN025', 'admin25', '$2b$12$hashedpass25', 'admin25@example.com', '0123456805', 'Admin Twenty Five', 'manager', 'Manager', '2025-01-15', 2600000, 210000, 'Address25', 1, 'admin25.jpg', 'Bank25', 'Acc25', 'Holder25', NULL, '2025-03-15 15:25:00', '2025-03-15 15:25:00'),
('ADMIN026', 'admin26', '$2b$12$hashedpass26', 'admin26@example.com', '0123456806', 'Admin Twenty Six', 'staff', 'Staff', '2025-02-15', 2700000, 220000, 'Address26', 1, 'admin26.jpg', 'Bank26', 'Acc26', 'Holder26', NULL, '2025-03-25 10:15:00', '2025-03-25 10:15:00'),
('ADMIN027', 'admin27', '$2b$12$hashedpass27', 'admin27@example.com', '0123456807', 'Admin Twenty Seven', 'manager', 'Manager', '2025-03-15', 2800000, 230000, 'Address27', 1, 'admin27.jpg', 'Bank27', 'Acc27', 'Holder27', NULL, '2025-04-05 12:05:00', '2025-04-05 12:05:00'),
('ADMIN028', 'admin28', '$2b$12$hashedpass28', 'admin28@example.com', '0123456808', 'Admin Twenty Eight', 'staff', 'Staff', '2025-04-15', 2900000, 240000, 'Address28', 1, 'admin28.jpg', 'Bank28', 'Acc28', 'Holder28', NULL, '2025-04-15 17:50:00', '2025-04-15 17:50:00'),
('ADMIN029', 'admin29', '$2b$12$hashedpass29', 'admin29@example.com', '0123456809', 'Admin Twenty Nine', 'manager', 'Manager', '2025-05-15', 3000000, 250000, 'Address29', 1, 'admin29.jpg', 'Bank29', 'Acc29', 'Holder29', NULL, '2025-04-25 09:35:00', '2025-04-25 09:35:00'),
('ADMIN030', 'admin30', '$2b$12$hashedpass30', 'admin30@example.com', '0123456810', 'Admin Thirty', 'staff', 'Staff', '2025-06-15', 3100000, 260000, 'Address30', 1, 'admin30.jpg', 'Bank30', 'Acc30', 'Holder30', NULL, '2025-05-05 11:20:00', '2025-05-05 11:20:00'),
('ADMIN031', 'admin31', '$2b$12$hashedpass31', 'admin31@example.com', '0123456811', 'Admin Thirty One', 'manager', 'Manager', '2025-07-15', 3200000, 270000, 'Address31', 1, 'admin31.jpg', 'Bank31', 'Acc31', 'Holder31', NULL, '2025-05-15 14:45:00', '2025-05-15 14:45:00'),
('ADMIN032', 'admin32', '$2b$12$hashedpass32', 'admin32@example.com', '0123456812', 'Admin Thirty Two', 'staff', 'Staff', '2025-08-15', 3300000, 280000, 'Address32', 1, 'admin32.jpg', 'Bank32', 'Acc32', 'Holder32', NULL, '2025-05-25 16:30:00', '2025-05-25 16:30:00'),
('ADMIN033', 'admin33', '$2b$12$hashedpass33', 'admin33@example.com', '0123456813', 'Admin Thirty Three', 'manager', 'Manager', '2025-09-15', 3400000, 290000, 'Address33', 1, 'admin33.jpg', 'Bank33', 'Acc33', 'Holder33', NULL, '2025-06-05 08:10:00', '2025-06-05 08:10:00'),
('ADMIN034', 'admin34', '$2b$12$hashedpass34', 'admin34@example.com', '0123456814', 'Admin Thirty Four', 'staff', 'Staff', '2025-10-15', 3500000, 300000, 'Address34', 1, 'admin34.jpg', 'Bank34', 'Acc34', 'Holder34', NULL, '2025-06-15 13:55:00', '2025-06-15 13:55:00'),
('ADMIN035', 'admin35', '$2b$12$hashedpass35', 'admin35@example.com', '0123456815', 'Admin Thirty Five', 'manager', 'Manager', '2025-11-15', 3600000, 310000, 'Address35', 1, 'admin35.jpg', 'Bank35', 'Acc35', 'Holder35', NULL, '2025-06-25 15:40:00', '2025-06-25 15:40:00'),
('ADMIN036', 'admin36', '$2b$12$hashedpass36', 'admin36@example.com', '0123456816', 'Admin Thirty Six', 'staff', 'Staff', '2025-12-15', 3700000, 320000, 'Address36', 1, 'admin36.jpg', 'Bank36', 'Acc36', 'Holder36', NULL, '2025-07-05 10:25:00', '2025-07-05 10:25:00'),
('ADMIN037', 'admin37', '$2b$12$hashedpass37', 'admin37@example.com', '0123456817', 'Admin Thirty Seven', 'manager', 'Manager', '2025-01-20', 3800000, 330000, 'Address37', 1, 'admin37.jpg', 'Bank37', 'Acc37', 'Holder37', NULL, '2025-07-15 12:00:00', '2025-07-15 12:00:00'),
('ADMIN038', 'admin38', '$2b$12$hashedpass38', 'admin38@example.com', '0123456818', 'Admin Thirty Eight', 'staff', 'Staff', '2025-02-20', 3900000, 340000, 'Address38', 1, 'admin38.jpg', 'Bank38', 'Acc38', 'Holder38', NULL, '2025-07-25 13:35:00', '2025-07-25 13:35:00'),
('ADMIN039', 'admin39', '$2b$12$hashedpass39', 'admin39@example.com', '0123456819', 'Admin Thirty Nine', 'manager', 'Manager', '2025-03-20', 4000000, 350000, 'Address39', 1, 'admin39.jpg', 'Bank39', 'Acc39', 'Holder39', NULL, '2025-08-05 15:10:00', '2025-08-05 15:10:00'),
('ADMIN040', 'admin40', '$2b$12$hashedpass40', 'admin40@example.com', '0123456820', 'Admin Forty', 'staff', 'Staff', '2025-04-20', 4100000, 360000, 'Address40', 1, 'admin40.jpg', 'Bank40', 'Acc40', 'Holder40', NULL, '2025-08-15 16:45:00', '2025-08-15 16:45:00'),
('ADMIN041', 'admin41', '$2b$12$hashedpass41', 'admin41@example.com', '0123456821', 'Admin Forty One', 'manager', 'Manager', '2025-05-20', 4200000, 370000, 'Address41', 1, 'admin41.jpg', 'Bank41', 'Acc41', 'Holder41', NULL, '2025-08-25 09:20:00', '2025-08-25 09:20:00'),
('ADMIN042', 'admin42', '$2b$12$hashedpass42', 'admin42@example.com', '0123456822', 'Admin Forty Two', 'staff', 'Staff', '2025-06-20', 4300000, 380000, 'Address42', 1, 'admin42.jpg', 'Bank42', 'Acc42', 'Holder42', NULL, '2025-09-05 10:55:00', '2025-09-05 10:55:00'),
('ADMIN043', 'admin43', '$2b$12$hashedpass43', 'admin43@example.com', '0123456823', 'Admin Forty Three', 'manager', 'Manager', '2025-07-20', 4400000, 390000, 'Address43', 1, 'admin43.jpg', 'Bank43', 'Acc43', 'Holder43', NULL, '2025-09-15 12:30:00', '2025-09-15 12:30:00'),
('ADMIN044', 'admin44', '$2b$12$hashedpass44', 'admin44@example.com', '0123456824', 'Admin Forty Four', 'staff', 'Staff', '2025-08-20', 4500000, 400000, 'Address44', 1, 'admin44.jpg', 'Bank44', 'Acc44', 'Holder44', NULL, '2025-09-25 14:05:00', '2025-09-25 14:05:00'),
('ADMIN045', 'admin45', '$2b$12$hashedpass45', 'admin45@example.com', '0123456825', 'Admin Forty Five', 'manager', 'Manager', '2025-09-20', 4600000, 410000, 'Address45', 1, 'admin45.jpg', 'Bank45', 'Acc45', 'Holder45', NULL, '2025-10-05 15:40:00', '2025-10-05 15:40:00'),
('ADMIN046', 'admin46', '$2b$12$hashedpass46', 'admin46@example.com', '0123456826', 'Admin Forty Six', 'staff', 'Staff', '2025-10-20', 4700000, 420000, 'Address46', 1, 'admin46.jpg', 'Bank46', 'Acc46', 'Holder46', NULL, '2025-10-15 17:15:00', '2025-10-15 17:15:00'),
('ADMIN047', 'admin47', '$2b$12$hashedpass47', 'admin47@example.com', '0123456827', 'Admin Forty Seven', 'manager', 'Manager', '2025-11-20', 4800000, 430000, 'Address47', 1, 'admin47.jpg', 'Bank47', 'Acc47', 'Holder47', NULL, '2025-10-25 09:50:00', '2025-10-25 09:50:00'),
('ADMIN048', 'admin48', '$2b$12$hashedpass48', 'admin48@example.com', '0123456828', 'Admin Forty Eight', 'staff', 'Staff', '2025-12-20', 4900000, 440000, 'Address48', 1, 'admin48.jpg', 'Bank48', 'Acc48', 'Holder48', NULL, '2025-11-05 11:25:00', '2025-11-05 11:25:00'),
('ADMIN049', 'admin49', '$2b$12$hashedpass49', 'admin49@example.com', '0123456829', 'Admin Forty Nine', 'manager', 'Manager', '2025-01-25', 5000000, 450000, 'Address49', 1, 'admin49.jpg', 'Bank49', 'Acc49', 'Holder49', NULL, '2025-11-15 13:00:00', '2025-11-15 13:00:00'),
('ADMIN050', 'admin50', '$2b$12$hashedpass50', 'admin50@example.com', '0123456830', 'Admin Fifty', 'staff', 'Staff', '2025-02-25', 5100000, 460000, 'Address50', 1, 'admin50.jpg', 'Bank50', 'Acc50', 'Holder50', NULL, '2025-11-25 14:35:00', '2025-11-25 14:35:00'),
('ADMIN051', 'admin51', '$2b$12$hashedpass51', 'admin51@example.com', '0123456831', 'Admin Fifty One', 'manager', 'Manager', '2025-03-25', 5200000, 470000, 'Address51', 1, 'admin51.jpg', 'Bank51', 'Acc51', 'Holder51', NULL, '2025-12-05 16:10:00', '2025-12-05 16:10:00'),
('ADMIN052', 'admin52', '$2b$12$hashedpass52', 'admin52@example.com', '0123456832', 'Admin Fifty Two', 'staff', 'Staff', '2025-04-25', 5300000, 480000, 'Address52', 1, 'admin52.jpg', 'Bank52', 'Acc52', 'Holder52', NULL, '2025-12-15 09:45:00', '2025-12-15 09:45:00'),
('ADMIN053', 'admin53', '$2b$12$hashedpass53', 'admin53@example.com', '0123456833', 'Admin Fifty Three', 'manager', 'Manager', '2025-05-25', 5400000, 490000, 'Address53', 1, 'admin53.jpg', 'Bank53', 'Acc53', 'Holder53', NULL, '2025-12-25 11:20:00', '2025-12-25 11:20:00'),
('ADMIN054', 'admin54', '$2b$12$hashedpass54', 'admin54@example.com', '0123456834', 'Admin Fifty Four', 'staff', 'Staff', '2025-06-25', 5500000, 500000, 'Address54', 1, 'admin54.jpg', 'Bank54', 'Acc54', 'Holder54', NULL, '2026-01-01 13:00:00', '2026-01-01 13:00:00'),
('ADMIN055', 'admin55', '$2b$12$hashedpass55', 'admin55@example.com', '0123456835', 'Admin Fifty Five', 'manager', 'Manager', '2025-07-25', 5600000, 510000, 'Address55', 1, 'admin55.jpg', 'Bank55', 'Acc55', 'Holder55', NULL, '2026-01-02 14:30:00', '2026-01-02 14:30:00'),
('ADMIN056', 'admin56', '$2b$12$hashedpass56', 'admin56@example.com', '0123456836', 'Admin Fifty Six', 'staff', 'Staff', '2025-08-25', 5700000, 520000, 'Address56', 1, 'admin56.jpg', 'Bank56', 'Acc56', 'Holder56', NULL, '2026-01-03 16:00:00', '2026-01-03 16:00:00'),
('ADMIN057', 'admin57', '$2b$12$hashedpass57', 'admin57@example.com', '0123456837', 'Admin Fifty Seven', 'manager', 'Manager', '2025-09-25', 5800000, 530000, 'Address57', 1, 'admin57.jpg', 'Bank57', 'Acc57', 'Holder57', NULL, '2025-01-10 09:15:00', '2025-01-10 09:15:00'),
('ADMIN058', 'admin58', '$2b$12$hashedpass58', 'admin58@example.com', '0123456838', 'Admin Fifty Eight', 'staff', 'Staff', '2025-10-25', 5900000, 540000, 'Address58', 1, 'admin58.jpg', 'Bank58', 'Acc58', 'Holder58', NULL, '2025-01-20 10:45:00', '2025-01-20 10:45:00'),
('ADMIN059', 'admin59', '$2b$12$hashedpass59', 'admin59@example.com', '0123456839', 'Admin Fifty Nine', 'manager', 'Manager', '2025-11-25', 6000000, 550000, 'Address59', 1, 'admin59.jpg', 'Bank59', 'Acc59', 'Holder59', NULL, '2025-01-30 12:15:00', '2025-01-30 12:15:00'),
('ADMIN060', 'admin60', '$2b$12$hashedpass60', 'admin60@example.com', '0123456840', 'Admin Sixty', 'staff', 'Staff', '2025-12-25', 6100000, 560000, 'Address60', 1, 'admin60.jpg', 'Bank60', 'Acc60', 'Holder60', NULL, '2025-02-10 13:45:00', '2025-02-10 13:45:00'),
('ADMIN061', 'admin61', '$2b$12$hashedpass61', 'admin61@example.com', '0123456841', 'Admin Sixty One', 'manager', 'Manager', '2025-01-30', 6200000, 570000, 'Address61', 1, 'admin61.jpg', 'Bank61', 'Acc61', 'Holder61', NULL, '2025-02-20 15:15:00', '2025-02-20 15:15:00'),
('ADMIN062', 'admin62', '$2b$12$hashedpass62', 'admin62@example.com', '0123456842', 'Admin Sixty Two', 'staff', 'Staff', '2025-02-28', 6300000, 580000, 'Address62', 1, 'admin62.jpg', 'Bank62', 'Acc62', 'Holder62', NULL, '2025-03-10 16:45:00', '2025-03-10 16:45:00'),
('ADMIN063', 'admin63', '$2b$12$hashedpass63', 'admin63@example.com', '0123456843', 'Admin Sixty Three', 'manager', 'Manager', '2025-03-30', 6400000, 590000, 'Address63', 1, 'admin63.jpg', 'Bank63', 'Acc63', 'Holder63', NULL, '2025-03-20 09:30:00', '2025-03-20 09:30:00'),
('ADMIN064', 'admin64', '$2b$12$hashedpass64', 'admin64@example.com', '0123456844', 'Admin Sixty Four', 'staff', 'Staff', '2025-04-30', 6500000, 600000, 'Address64', 1, 'admin64.jpg', 'Bank64', 'Acc64', 'Holder64', NULL, '2025-03-30 11:00:00', '2025-03-30 11:00:00'),
('ADMIN065', 'admin65', '$2b$12$hashedpass65', 'admin65@example.com', '0123456845', 'Admin Sixty Five', 'manager', 'Manager', '2025-05-30', 6600000, 610000, 'Address65', 1, 'admin65.jpg', 'Bank65', 'Acc65', 'Holder65', NULL, '2025-04-10 12:30:00', '2025-04-10 12:30:00'),
('ADMIN066', 'admin66', '$2b$12$hashedpass66', 'admin66@example.com', '0123456846', 'Admin Sixty Six', 'staff', 'Staff', '2025-06-30', 6700000, 620000, 'Address66', 1, 'admin66.jpg', 'Bank66', 'Acc66', 'Holder66', NULL, '2025-04-20 14:00:00', '2025-04-20 14:00:00'),
('ADMIN067', 'admin67', '$2b$12$hashedpass67', 'admin67@example.com', '0123456847', 'Admin Sixty Seven', 'manager', 'Manager', '2025-07-30', 6800000, 630000, 'Address67', 1, 'admin67.jpg', 'Bank67', 'Acc67', 'Holder67', NULL, '2025-04-30 15:30:00', '2025-04-30 15:30:00'),
('ADMIN068', 'admin68', '$2b$12$hashedpass68', 'admin68@example.com', '0123456848', 'Admin Sixty Eight', 'staff', 'Staff', '2025-08-30', 6900000, 640000, 'Address68', 1, 'admin68.jpg', 'Bank68', 'Acc68', 'Holder68', NULL, '2025-05-10 17:00:00', '2025-05-10 17:00:00');
-- Tiếp tục tương tự cho các bảng khác. Vì giới hạn độ dài phản hồi, tôi sẽ cung cấp mẫu cho một số bảng chính và lưu ý rằng bạn cần tạo data giả tương tự, đảm bảo foreign keys hợp lệ (ví dụ: categoryId phải tồn tại trong categories, clientId trong clients, v.v.). Sử dụng ID hiện có từ dump và thêm mới.

-- Ví dụ cho bảng categories (thêm 18 bản ghi, sử dụng superCategoryId từ bảng supercategories)
INSERT INTO `categories` (`name`, `image`, `superCategoryId`, `createdAt`, `updatedAt`) VALUES
('Điện thoại', 'dienthoai1.png', 1, '2025-01-05 10:00:00', '2025-01-05 10:00:00'),
('Laptop', 'laptop1.png', 1, '2025-02-10 11:30:00', '2025-02-10 11:30:00'),
('Tivi', 'tivi1.png', 1, '2025-03-15 09:45:00', '2025-03-15 09:45:00'),
('Tủ lạnh', 'tulanh1.png', 1, '2025-04-20 14:20:00', '2025-04-20 14:20:00'),
('Máy giặt', 'maygiat1.png', 1, '2025-05-25 08:55:00', '2025-05-25 08:55:00'),
('Điều hòa', 'dieuhoa1.png', 1, '2025-06-30 13:40:00', '2025-06-30 13:40:00'),
('Thời trang nam', 'thoitrangnam1.png', 2, '2025-07-10 15:25:00', '2025-07-10 15:25:00'),
('Thời trang nữ', 'thoitrangnu1.png', 2, '2025-08-15 10:15:00', '2025-08-15 10:15:00'),
('Giày dép nam', 'giaydepnam1.png', 2, '2025-09-20 12:05:00', '2025-09-20 12:05:00'),
('Giày dép nữ', 'giaydepnu1.png', 2, '2025-10-25 17:50:00', '2025-10-25 17:50:00'),
('Túi xách', 'tuixach1.png', 2, '2025-11-05 09:35:00', '2025-11-05 09:35:00'),
('Gia dụng', 'giadung1.png', 1, '2025-12-10 11:20:00', '2025-12-10 11:20:00'),
('Bàn ghế', 'banghe1.png', 1, '2025-08-20 14:45:00', '2025-08-20 14:45:00'),
('Dụng cụ', 'dungcu1.png', 1, '2025-09-25 16:30:00', '2025-09-25 16:30:00'),
('Thể thao', 'thethao1.png', 2, '2025-10-30 08:10:00', '2025-10-30 08:10:00'),
('Trẻ em', 'treem1.png', 2, '2025-11-15 10:00:00', '2025-11-15 10:00:00'),
('Sách vở', 'sachvo1.png', 1, '2025-12-20 11:30:00', '2025-12-20 11:30:00'),
('Phụ kiện', 'phukien1.png', 1, '2025-08-05 09:45:00', '2025-08-05 09:45:00'),
('Xe cộ', 'xe1.png', 1, '2025-09-10 14:20:00', '2025-09-10 14:20:00'),
('Đồ ăn', 'doan1.png', 1, '2025-10-15 08:55:00', '2025-10-15 08:55:00');

INSERT INTO `orders`
('LG Inverter 494L', 'Tủ lạnh LG Inverter 494 lít, Door-in-Door, làm đá tự động, Linear Cooling', 'Việt Nam', 38, 12, 18990000, 4.6, 29, 'tulanh2.png', 'ACTIVE', 6, 'STORE2025080501001', '2025-10-20 16:30:00', '2025-10-20 16:30:00'),
('Panasonic Inverter 322L', 'Tủ lạnh Panasonic Inverter 322 lít, Ag Clean, Econavi, ngăn rau quả giữ ẩm', 'Việt Nam', 56, 8, 9990000, 4.4, 44, 'tulanh3.png', 'ACTIVE', 6, 'STORE2025081002002', '2025-11-25 08:10:00', '2025-11-25 08:10:00'),
('Hitachi Inverter 540L', 'Tủ lạnh Hitachi Inverter 540 lít, Made in Japan, Vacuum Compartment, cửa tự động', 'Nhật Bản', 25, 5, 32990000, 4.8, 18, 'tulanh4.png', 'ACTIVE', 6, 'STORE1766314663632', '2025-12-30 10:00:00', '2025-12-30 10:00:00'),

-- Máy giặt (categoryId: 7)
('Electrolux Inverter 9kg', 'Máy giặt Electrolux Inverter 9kg, UltraMix, Vapour Care, giặt hơi nước diệt khuẩn', 'Thái Lan', 68, 15, 8990000, 4.5, 52, 'maygiat1.png', 'ACTIVE', 7, 'STORE1766314663632', '2025-08-10 11:30:00', '2025-08-10 11:30:00'),
('Samsung AI EcoBubble 10kg', 'Máy giặt Samsung AI EcoBubble 10kg, AI Wash, giặt hơi nước, kết nối SmartThings', 'Việt Nam', 55, 18, 12990000, 4.6, 41, 'maygiat2.png', 'ACTIVE', 7, 'STORE2025080501001', '2025-09-05 09:45:00', '2025-09-05 09:45:00'),
('LG AI DD 11kg', 'Máy giặt LG AI DD 11kg, TurboWash 360, Steam+, ThinQ AI điều khiển từ xa', 'Việt Nam', 45, 20, 14990000, 4.7, 33, 'maygiat3.png', 'ACTIVE', 7, 'STORE2025081002002', '2025-10-10 14:20:00', '2025-10-10 14:20:00'),

-- Điều hòa (categoryId: 8)
('Daikin Inverter 1HP', 'Điều hòa Daikin Inverter 1HP, làm lạnh nhanh, tiết kiệm điện, kháng khuẩn Streamer', 'Thái Lan', 88, 10, 9990000, 4.6, 67, 'dieuhoa1.png', 'ACTIVE', 8, 'STORE1766314663632', '2025-08-20 08:55:00', '2025-08-20 08:55:00'),
('Panasonic Inverter 1.5HP', 'Điều hòa Panasonic Inverter 1.5HP, Nanoe X diệt khuẩn, Econavi cảm biến thông minh', 'Malaysia', 72, 12, 12990000, 4.5, 54, 'dieuhoa2.png', 'ACTIVE', 8, 'STORE2025080501001', '2025-09-15 13:40:00', '2025-09-15 13:40:00'),

-- Thời trang nam (categoryId: 9)
('Áo sơ mi nam cao cấp', 'Áo sơ mi nam công sở cao cấp, chất liệu cotton Bamboo, form Regular Fit thoải mái', 'Việt Nam', 250, 20, 450000, 4.4, 128, 'thoitrangnam1.png', 'ACTIVE', 9, 'STORE1766314663632', '2025-08-25 15:25:00', '2025-08-25 15:25:00'),
('Áo polo nam thể thao', 'Áo polo nam thể thao, chất liệu polyester thoáng khí, co giãn 4 chiều', 'Việt Nam', 320, 15, 350000, 4.3, 165, 'thoitrangnam2.png', 'ACTIVE', 9, 'STORE2025080501001', '2025-09-20 10:15:00', '2025-09-20 10:15:00'),
('Quần jean nam slim fit', 'Quần jean nam slim fit, chất liệu denim cotton cao cấp, wash nhẹ thời trang', 'Việt Nam', 180, 25, 550000, 4.5, 92, 'thoitrangnam3.png', 'ACTIVE', 9, 'STORE2025081002002', '2025-10-25 12:05:00', '2025-10-25 12:05:00'),

-- Thời trang nữ (categoryId: 10)
('Đầm nữ công sở', 'Đầm nữ công sở thanh lịch, chất liệu lụa cao cấp, form A sang trọng', 'Việt Nam', 145, 30, 650000, 4.6, 78, 'thoitrangnu1.png', 'ACTIVE', 10, 'STORE1766314663632', '2025-11-05 17:50:00', '2025-11-05 17:50:00'),
('Áo kiểu nữ thời trang', 'Áo kiểu nữ thời trang Hàn Quốc, chất liệu voan mềm mại, họa tiết hoa nhẹ nhàng', 'Hàn Quốc', 210, 20, 380000, 4.4, 105, 'thoitrangnu2.png', 'ACTIVE', 10, 'STORE2025080501001', '2025-12-10 09:35:00', '2025-12-10 09:35:00'),
('Chân váy midi nữ', 'Chân váy midi nữ xếp ly thanh lịch, chất liệu tuyết mưa cao cấp', 'Việt Nam', 175, 25, 420000, 4.5, 88, 'thoitrangnu3.png', 'ACTIVE', 10, 'STORE2025081002002', '2025-08-15 11:20:00', '2025-08-15 11:20:00'),

-- Giày dép nam (categoryId: 11)
('Giày sneaker nam Nike', 'Giày sneaker nam Nike Air Max, đế Air êm ái, chất liệu mesh thoáng khí', 'Việt Nam', 135, 15, 2500000, 4.7, 72, 'giaydepnam1.png', 'ACTIVE', 11, 'STORE1766314663632', '2025-09-10 14:45:00', '2025-09-10 14:45:00'),
('Giày da nam công sở', 'Giày da nam công sở, da bò thật 100%, đế cao su chống trượt', 'Việt Nam', 95, 10, 1200000, 4.5, 48, 'giaydepnam2.png', 'ACTIVE', 11, 'STORE2025080501001', '2025-10-15 16:30:00', '2025-10-15 16:30:00'),

-- Giày dép nữ (categoryId: 12)
('Giày cao gót nữ', 'Giày cao gót nữ 7cm, mũi nhọn thanh lịch, da tổng hợp cao cấp', 'Việt Nam', 165, 20, 680000, 4.4, 85, 'giaydepnu1.png', 'ACTIVE', 12, 'STORE1766314663632', '2025-11-20 08:10:00', '2025-11-20 08:10:00'),
('Sandal nữ thời trang', 'Sandal nữ đế bệt quai mảnh, phong cách Hàn Quốc sang trọng', 'Hàn Quốc', 198, 25, 450000, 4.3, 102, 'giaydepnu2.png', 'ACTIVE', 12, 'STORE2025081002002', '2025-12-25 10:00:00', '2025-12-25 10:00:00'),

-- Túi xách (categoryId: 13)
('Túi xách nữ da PU', 'Túi xách nữ da PU cao cấp, thiết kế Hàn Quốc, ngăn đựng rộng rãi', 'Hàn Quốc', 142, 30, 550000, 4.5, 76, 'tuixach1.png', 'ACTIVE', 13, 'STORE1766314663632', '2025-08-05 11:30:00', '2025-08-05 11:30:00'),
('Balo laptop nam', 'Balo laptop nam 15.6 inch, chống nước, có cổng sạc USB', 'Trung Quốc', 225, 20, 420000, 4.4, 118, 'tuixach2.png', 'ACTIVE', 13, 'STORE2025080501001', '2025-09-08 09:45:00', '2025-09-08 09:45:00'),

-- Gia dụng (categoryId: 14)
('Nồi chiên không dầu', 'Nồi chiên không dầu 5L, công nghệ Rapid Air, điều khiển cảm ứng', 'Trung Quốc', 285, 25, 1590000, 4.6, 152, 'giadung1.png', 'ACTIVE', 14, 'STORE1766314663632', '2025-10-12 14:20:00', '2025-10-12 14:20:00'),
('Robot hút bụi thông minh', 'Robot hút bụi lau nhà thông minh, điều khiển qua app, tự động sạc', 'Trung Quốc', 165, 30, 4990000, 4.5, 87, 'giadung2.png', 'ACTIVE', 14, 'STORE2025081002002', '2025-11-18 08:55:00', '2025-11-18 08:55:00'),
('Máy xay sinh tố đa năng', 'Máy xay sinh tố Philips 2L, 1000W, 3 tốc độ xay, lưỡi dao thép không gỉ', 'Trung Quốc', 195, 15, 890000, 4.4, 98, 'giadung3.png', 'ACTIVE', 14, 'STORE1766314663632', '2025-12-05 10:30:00', '2025-12-05 10:30:00'),

-- Bàn ghế (categoryId: 15)
('Bàn làm việc gỗ công nghiệp', 'Bàn làm việc gỗ MDF phủ melamine, khung thép sơn tĩnh điện, kích thước 120x60cm', 'Việt Nam', 125, 20, 1290000, 4.5, 68, 'banghe1.png', 'ACTIVE', 15, 'STORE1766314663632', '2025-08-15 09:00:00', '2025-08-15 09:00:00'),
('Ghế xoay văn phòng', 'Ghế xoay văn phòng lưng lưới, tay vịn điều chỉnh, bánh xe êm ái', 'Trung Quốc', 180, 25, 1590000, 4.6, 92, 'banghe2.png', 'ACTIVE', 15, 'STORE2025080501001', '2025-09-20 10:15:00', '2025-09-20 10:15:00'),
('Bộ bàn ghế ăn 4 người', 'Bộ bàn ghế ăn gỗ cao su tự nhiên, 4 ghế đệm nỉ, thiết kế hiện đại', 'Việt Nam', 65, 15, 4990000, 4.7, 45, 'banghe3.png', 'ACTIVE', 15, 'STORE2025081002002', '2025-10-25 14:30:00', '2025-10-25 14:30:00'),
('Kệ sách 5 tầng', 'Kệ sách gỗ 5 tầng, lắp ráp dễ dàng, chịu lực tốt, kích thước 60x30x150cm', 'Việt Nam', 210, 30, 690000, 4.3, 115, 'banghe4.png', 'ACTIVE', 15, 'STORE1766314663632', '2025-11-10 11:45:00', '2025-11-10 11:45:00'),

-- Dụng cụ (categoryId: 16)
('Bộ dụng cụ sửa chữa 100 chi tiết', 'Bộ dụng cụ đa năng 100 chi tiết, hộp đựng chắc chắn, thép carbon cao cấp', 'Đài Loan', 145, 20, 890000, 4.5, 78, 'dungcu1.png', 'ACTIVE', 16, 'STORE1766314663632', '2025-08-25 08:30:00', '2025-08-25 08:30:00'),
('Máy khoan pin Bosch', 'Máy khoan pin Bosch 12V, 2 pin, 2 tốc độ, momen xoắn 30Nm', 'Đức', 95, 10, 2490000, 4.7, 52, 'dungcu2.png', 'ACTIVE', 16, 'STORE2025080501001', '2025-09-30 15:20:00', '2025-09-30 15:20:00'),
('Thước đo laser 50m', 'Thước đo khoảng cách laser 50m, độ chính xác cao, màn hình LCD', 'Trung Quốc', 175, 25, 590000, 4.4, 89, 'dungcu3.png', 'ACTIVE', 16, 'STORE2025081002002', '2025-10-15 09:45:00', '2025-10-15 09:45:00'),

-- Thể thao (categoryId: 17)
('Xe đạp thể thao Giant', 'Xe đạp thể thao Giant Escape 3, khung nhôm, 21 tốc độ Shimano', 'Đài Loan', 45, 10, 8990000, 4.8, 32, 'thethao1.png', 'ACTIVE', 17, 'STORE1766314663632', '2025-08-10 10:00:00', '2025-08-10 10:00:00'),
('Bộ tạ tay cao su 20kg', 'Bộ tạ tay cao su 20kg (2x10kg), tay cầm thép mạ chrome, lớp cao su chống trượt', 'Việt Nam', 220, 15, 890000, 4.5, 125, 'thethao2.png', 'ACTIVE', 17, 'STORE2025080501001', '2025-09-05 14:30:00', '2025-09-05 14:30:00'),
('Máy chạy bộ điện', 'Máy chạy bộ điện đa năng, tốc độ 0-14km/h, màn hình LED, gấp gọn', 'Trung Quốc', 85, 20, 6990000, 4.6, 58, 'thethao3.png', 'ACTIVE', 17, 'STORE2025081002002', '2025-10-20 11:15:00', '2025-10-20 11:15:00'),
('Vợt cầu lông Yonex', 'Vợt cầu lông Yonex Astrox 88D, khung carbon, căng dây sẵn', 'Nhật Bản', 135, 12, 1890000, 4.7, 72, 'thethao4.png', 'ACTIVE', 17, 'STORE1766314663632', '2025-11-25 16:00:00', '2025-11-25 16:00:00'),

-- Trẻ em (categoryId: 18)
('Xe đẩy em bé đa năng', 'Xe đẩy em bé gấp gọn, 3 tư thế nằm ngồi, có mái che, bánh xe xoay 360', 'Trung Quốc', 75, 25, 2490000, 4.6, 48, 'treem1.png', 'ACTIVE', 18, 'STORE1766314663632', '2025-08-20 09:30:00', '2025-08-20 09:30:00'),
('Bộ đồ chơi Lego 500 miếng', 'Bộ đồ chơi Lego xếp hình 500 miếng, nhựa ABS an toàn, phát triển tư duy', 'Đan Mạch', 165, 20, 890000, 4.7, 95, 'treem2.png', 'ACTIVE', 18, 'STORE2025080501001', '2025-09-15 13:45:00', '2025-09-15 13:45:00'),
('Ghế ăn dặm cho bé', 'Ghế ăn dặm gấp gọn, điều chỉnh độ cao, có khay ăn tháo rời, đai an toàn 5 điểm', 'Việt Nam', 110, 15, 1290000, 4.5, 62, 'treem3.png', 'ACTIVE', 18, 'STORE2025081002002', '2025-10-10 10:20:00', '2025-10-10 10:20:00'),
('Bỉm Merries size L', 'Bỉm Merries size L (9-14kg), 54 miếng, siêu thấm hút, mềm mại', 'Nhật Bản', 350, 10, 450000, 4.8, 185, 'treem4.png', 'ACTIVE', 18, 'STORE1766314663632', '2025-11-05 15:10:00', '2025-11-05 15:10:00'),

-- Sách vở (categoryId: 19)
('Sách Đắc Nhân Tâm', 'Đắc Nhân Tâm - Dale Carnegie, bìa cứng, bản dịch mới nhất', 'Việt Nam', 520, 15, 98000, 4.9, 285, 'sachvo1.png', 'ACTIVE', 19, 'STORE1766314663632', '2025-08-05 08:00:00', '2025-08-05 08:00:00'),
('Vở Campus 200 trang', 'Vở Campus 200 trang kẻ ngang, giấy trắng mịn, bìa cứng', 'Việt Nam', 850, 20, 25000, 4.5, 420, 'sachvo2.png', 'ACTIVE', 19, 'STORE2025080501001', '2025-09-01 09:15:00', '2025-09-01 09:15:00'),
('Bộ bút bi Thiên Long', 'Bộ bút bi Thiên Long 10 cây, mực xanh đen đỏ, viết trơn êm', 'Việt Nam', 680, 10, 45000, 4.4, 350, 'sachvo3.png', 'ACTIVE', 19, 'STORE2025081002002', '2025-10-15 11:30:00', '2025-10-15 11:30:00'),

-- Phụ kiện (categoryId: 20)
('Tai nghe Bluetooth Sony', 'Tai nghe Bluetooth Sony WH-1000XM5, chống ồn chủ động, pin 30h', 'Malaysia', 85, 15, 7990000, 4.8, 52, 'phukien1.png', 'ACTIVE', 20, 'STORE1766314663632', '2025-08-12 10:45:00', '2025-08-12 10:45:00'),
('Sạc dự phòng Anker 20000mAh', 'Sạc dự phòng Anker PowerCore 20000mAh, sạc nhanh 22.5W, 2 cổng USB-C', 'Trung Quốc', 195, 20, 690000, 4.6, 118, 'phukien2.png', 'ACTIVE', 20, 'STORE2025080501001', '2025-09-08 14:20:00', '2025-09-08 14:20:00'),
('Ốp lưng iPhone 15 Pro Max', 'Ốp lưng iPhone 15 Pro Max MagSafe, chất liệu silicon cao cấp, chống sốc', 'Trung Quốc', 320, 25, 290000, 4.4, 175, 'phukien3.png', 'ACTIVE', 20, 'STORE2025081002002', '2025-10-20 09:00:00', '2025-10-20 09:00:00'),
('Chuột gaming Logitech G502', 'Chuột gaming Logitech G502 Hero, sensor 25600 DPI, 11 nút lập trình', 'Trung Quốc', 125, 18, 1490000, 4.7, 68, 'phukien4.png', 'ACTIVE', 20, 'STORE1766314663632', '2025-11-15 16:30:00', '2025-11-15 16:30:00'),
('Bàn phím cơ Akko', 'Bàn phím cơ Akko 3098B, switch Cream Yellow, RGB, kết nối 3 chế độ', 'Trung Quốc', 95, 12, 1890000, 4.6, 45, 'phukien5.png', 'ACTIVE', 20, 'STORE2025080501001', '2025-12-10 11:00:00', '2025-12-10 11:00:00'),

-- Xe cộ (categoryId: 21)
('Xe máy Honda Vision', 'Xe máy Honda Vision 2024, động cơ eSP+ 110cc, tiết kiệm xăng', 'Việt Nam', 35, 5, 32990000, 4.8, 25, 'xe1.png', 'ACTIVE', 21, 'STORE1766314663632', '2025-08-18 08:30:00', '2025-08-18 08:30:00'),
('Xe đạp điện Vinfast', 'Xe đạp điện Vinfast Klara S, pin lithium, tầm xa 90km, sạc 4h', 'Việt Nam', 55, 10, 22990000, 4.6, 38, 'xe2.png', 'ACTIVE', 21, 'STORE2025080501001', '2025-09-22 10:15:00', '2025-09-22 10:15:00'),
('Mũ bảo hiểm fullface', 'Mũ bảo hiểm fullface Royal M136, kính chống UV, thông gió tốt', 'Việt Nam', 185, 15, 690000, 4.5, 95, 'xe3.png', 'ACTIVE', 21, 'STORE2025081002002', '2025-10-28 14:45:00', '2025-10-28 14:45:00'),
('Găng tay xe máy', 'Găng tay xe máy cảm ứng, chất liệu da tổng hợp, có đệm bảo vệ', 'Việt Nam', 245, 20, 190000, 4.4, 130, 'xe4.png', 'ACTIVE', 21, 'STORE1766314663632', '2025-11-12 09:30:00', '2025-11-12 09:30:00'),
('Áo mưa bộ cao cấp', 'Áo mưa bộ 2 lớp, chống thấm tuyệt đối, có phản quang, size M-XXL', 'Việt Nam', 320, 25, 290000, 4.3, 175, 'xe5.png', 'ACTIVE', 21, 'STORE2025080501001', '2025-12-05 11:20:00', '2025-12-05 11:20:00'),
('Dầu nhớt Castrol', 'Dầu nhớt Castrol Power1 4T 10W-40, 1 lít, bảo vệ động cơ xe máy', 'Việt Nam', 480, 10, 85000, 4.6, 260, 'xe6.png', 'ACTIVE', 21, 'STORE2025081002002', '2025-08-30 15:00:00', '2025-08-30 15:00:00'),

-- Đồ ăn (categoryId: 22)
('Bánh trung thu Kinh Đô', 'Hộp bánh trung thu Kinh Đô 4 bánh, nhân thập cẩm và đậu xanh', 'Việt Nam', 280, 15, 350000, 4.7, 145, 'doan1.png', 'ACTIVE', 22, 'STORE1766314663632', '2025-08-25 08:00:00', '2025-08-25 08:00:00'),
('Cà phê G7 hộp 50 gói', 'Cà phê hòa tan G7 3in1, hộp 50 gói x 16g, vị đậm đà', 'Việt Nam', 450, 20, 125000, 4.5, 235, 'doan2.png', 'ACTIVE', 22, 'STORE2025080501001', '2025-09-10 09:30:00', '2025-09-10 09:30:00'),
('Mì Hảo Hảo thùng 30 gói', 'Mì Hảo Hảo tôm chua cay, thùng 30 gói, đậm đà hương vị Việt', 'Việt Nam', 620, 10, 145000, 4.4, 320, 'doan3.png', 'ACTIVE', 22, 'STORE2025081002002', '2025-10-05 10:45:00', '2025-10-05 10:45:00');

INSERT INTO `product_variants` (`price`, `stock_quantity`, `productId`, `createdAt`, `updatedAt`) VALUES
-- iPhone 15 Pro Max (productId: 5)
(29990000, 50, 5, '2025-01-10 10:00:00', '2025-01-10 10:00:00'),
(32990000, 30, 5, '2025-01-10 10:00:00', '2025-01-10 10:00:00'),
-- Samsung Galaxy S24 Ultra (productId: 6)
(27990000, 45, 6, '2025-02-15 11:30:00', '2025-02-15 11:30:00'),
(30990000, 25, 6, '2025-02-15 11:30:00', '2025-02-15 11:30:00'),
-- Xiaomi 14 Ultra (productId: 7)
(19990000, 60, 7, '2025-03-20 09:45:00', '2025-03-20 09:45:00'),
-- MacBook Pro 14 M3 Pro (productId: 8)
(49990000, 25, 8, '2025-04-05 14:20:00', '2025-04-05 14:20:00'),
(59990000, 15, 8, '2025-04-05 14:20:00', '2025-04-05 14:20:00'),
-- Dell XPS 15 (productId: 9)
(42990000, 20, 9, '2025-05-18 16:10:00', '2025-05-18 16:10:00'),
-- ASUS ROG Zephyrus G14 (productId: 10)
(35990000, 35, 10, '2025-06-22 08:55:00', '2025-06-22 08:55:00'),
-- Lenovo ThinkPad X1 Carbon (productId: 11)
(38990000, 18, 11, '2025-07-30 13:40:00', '2025-07-30 13:40:00'),
-- HP Spectre x360 14 (productId: 12)
(36990000, 22, 12, '2025-08-12 15:25:00', '2025-08-12 15:25:00'),
-- Sony Bravia XR 65 inch (productId: 13)
(32990000, 28, 13, '2025-09-25 10:15:00', '2025-09-25 10:15:00'),
-- Samsung Neo QLED 55 inch (productId: 14)
(25990000, 40, 14, '2025-10-08 12:05:00', '2025-10-08 12:05:00'),
-- LG OLED 55 inch C3 (productId: 15)
(28990000, 32, 15, '2025-11-14 17:50:00', '2025-11-14 17:50:00'),
-- TCL 65 inch QLED (productId: 16)
(15990000, 55, 16, '2025-12-03 09:35:00', '2025-12-03 09:35:00'),
-- Xiaomi TV A Pro 55 inch (productId: 17)
(9990000, 70, 17, '2025-08-28 11:20:00', '2025-08-28 11:20:00'),
-- Samsung Inverter 380L (productId: 18)
(12990000, 25, 18, '2025-09-15 14:45:00', '2025-09-15 14:45:00'),
-- LG Inverter 494L (productId: 19)
(18990000, 18, 19, '2025-10-20 16:30:00', '2025-10-20 16:30:00'),
-- Panasonic Inverter 322L (productId: 20)
(9990000, 35, 20, '2025-11-25 08:10:00', '2025-11-25 08:10:00'),
-- Hitachi Inverter 540L (productId: 21)
(32990000, 12, 21, '2025-12-30 10:00:00', '2025-12-30 10:00:00'),
-- Electrolux Inverter 9kg (productId: 22)
(8990000, 40, 22, '2025-08-10 11:30:00', '2025-08-10 11:30:00'),
-- Samsung AI EcoBubble 10kg (productId: 23)
(12990000, 30, 23, '2025-09-05 09:45:00', '2025-09-05 09:45:00'),
-- LG AI DD 11kg (productId: 24)
(14990000, 25, 24, '2025-10-10 14:20:00', '2025-10-10 14:20:00'),
-- Daikin Inverter 1HP (productId: 25)
(9990000, 50, 25, '2025-08-20 08:55:00', '2025-08-20 08:55:00'),
-- Panasonic Inverter 1.5HP (productId: 26)
(12990000, 38, 26, '2025-09-15 13:40:00', '2025-09-15 13:40:00'),
-- Áo sơ mi nam cao cấp (productId: 27)
(450000, 150, 27, '2025-08-25 15:25:00', '2025-08-25 15:25:00'),
(480000, 100, 27, '2025-08-25 15:25:00', '2025-08-25 15:25:00'),
-- Áo polo nam thể thao (productId: 28)
(350000, 200, 28, '2025-09-20 10:15:00', '2025-09-20 10:15:00'),
(380000, 150, 28, '2025-09-20 10:15:00', '2025-09-20 10:15:00'),
-- Quần jean nam slim fit (productId: 29)
(550000, 120, 29, '2025-10-25 12:05:00', '2025-10-25 12:05:00'),
(590000, 80, 29, '2025-10-25 12:05:00', '2025-10-25 12:05:00'),
-- Đầm nữ công sở (productId: 30)
(650000, 80, 30, '2025-11-05 17:50:00', '2025-11-05 17:50:00'),
(720000, 60, 30, '2025-11-05 17:50:00', '2025-11-05 17:50:00'),
-- Áo kiểu nữ thời trang (productId: 31)
(380000, 130, 31, '2025-12-10 09:35:00', '2025-12-10 09:35:00'),
(420000, 90, 31, '2025-12-10 09:35:00', '2025-12-10 09:35:00'),
-- Chân váy midi nữ (productId: 32)
(420000, 100, 32, '2025-08-15 11:20:00', '2025-08-15 11:20:00'),
(480000, 70, 32, '2025-08-15 11:20:00', '2025-08-15 11:20:00'),
-- Giày sneaker nam Nike (productId: 33)
(2500000, 45, 33, '2025-09-10 14:45:00', '2025-09-10 14:45:00'),
(2800000, 30, 33, '2025-09-10 14:45:00', '2025-09-10 14:45:00'),
(3200000, 20, 33, '2025-09-10 14:45:00', '2025-09-10 14:45:00'),
-- Giày da nam công sở (productId: 34)
(1200000, 55, 34, '2025-10-15 16:30:00', '2025-10-15 16:30:00'),
(1450000, 35, 34, '2025-10-15 16:30:00', '2025-10-15 16:30:00'),
-- Giày cao gót nữ (productId: 35)
(680000, 85, 35, '2025-11-20 08:10:00', '2025-11-20 08:10:00'),
(750000, 55, 35, '2025-11-20 08:10:00', '2025-11-20 08:10:00'),
-- Sandal nữ thời trang (productId: 36)
(450000, 110, 36, '2025-12-25 10:00:00', '2025-12-25 10:00:00'),
(520000, 75, 36, '2025-12-25 10:00:00', '2025-12-25 10:00:00'),
-- Túi xách nữ da PU (productId: 37)
(550000, 75, 37, '2025-08-05 11:30:00', '2025-08-05 11:30:00'),
(620000, 50, 37, '2025-08-05 11:30:00', '2025-08-05 11:30:00'),
(750000, 30, 37, '2025-08-05 11:30:00', '2025-08-05 11:30:00'),
-- Balo laptop nam (productId: 38)
(420000, 120, 38, '2025-09-08 09:45:00', '2025-09-08 09:45:00'),
(520000, 80, 38, '2025-09-08 09:45:00', '2025-09-08 09:45:00'),
-- Nồi chiên không dầu (productId: 39)
(1590000, 90, 39, '2025-10-12 14:20:00', '2025-10-12 14:20:00'),
(1890000, 60, 39, '2025-10-12 14:20:00', '2025-10-12 14:20:00'),
-- Robot hút bụi thông minh (productId: 40)
(4990000, 35, 40, '2025-11-18 08:55:00', '2025-11-18 08:55:00'),
(5990000, 20, 40, '2025-11-18 08:55:00', '2025-11-18 08:55:00'),
-- Máy xay sinh tố đa năng (productId: 41)
(890000, 65, 41, '2025-12-05 10:30:00', '2025-12-05 10:30:00'),
(1190000, 40, 41, '2025-12-05 10:30:00', '2025-12-05 10:30:00'),

-- Bàn làm việc gỗ công nghiệp (productId: 42)
(1290000, 50, 42, '2025-08-15 09:00:00', '2025-08-15 09:00:00'),
(1590000, 30, 42, '2025-08-15 09:00:00', '2025-08-15 09:00:00'),
-- Ghế xoay văn phòng (productId: 43)
(1590000, 60, 43, '2025-09-20 10:15:00', '2025-09-20 10:15:00'),
(1990000, 40, 43, '2025-09-20 10:15:00', '2025-09-20 10:15:00'),
-- Bộ bàn ghế ăn 4 người (productId: 44)
(4990000, 25, 44, '2025-10-25 14:30:00', '2025-10-25 14:30:00'),
(5990000, 15, 44, '2025-10-25 14:30:00', '2025-10-25 14:30:00'),
-- Kệ sách 5 tầng (productId: 45)
(690000, 85, 45, '2025-11-10 11:45:00', '2025-11-10 11:45:00'),
(890000, 55, 45, '2025-11-10 11:45:00', '2025-11-10 11:45:00'),

-- Bộ dụng cụ sửa chữa 100 chi tiết (productId: 46)
(890000, 60, 46, '2025-08-25 08:30:00', '2025-08-25 08:30:00'),
(1290000, 35, 46, '2025-08-25 08:30:00', '2025-08-25 08:30:00'),
-- Máy khoan pin Bosch (productId: 47)
(2490000, 40, 47, '2025-09-30 15:20:00', '2025-09-30 15:20:00'),
(3290000, 25, 47, '2025-09-30 15:20:00', '2025-09-30 15:20:00'),
-- Thước đo laser 50m (productId: 48)
(590000, 75, 48, '2025-10-15 09:45:00', '2025-10-15 09:45:00'),
(890000, 45, 48, '2025-10-15 09:45:00', '2025-10-15 09:45:00'),

-- Xe đạp thể thao Giant (productId: 49)
(8990000, 20, 49, '2025-08-10 10:00:00', '2025-08-10 10:00:00'),
(11990000, 12, 49, '2025-08-10 10:00:00', '2025-08-10 10:00:00'),
-- Bộ tạ tay cao su 20kg (productId: 50)
(890000, 95, 50, '2025-09-05 14:30:00', '2025-09-05 14:30:00'),
(1290000, 60, 50, '2025-09-05 14:30:00', '2025-09-05 14:30:00'),
-- Máy chạy bộ điện (productId: 51)
(6990000, 30, 51, '2025-10-20 11:15:00', '2025-10-20 11:15:00'),
(9990000, 18, 51, '2025-10-20 11:15:00', '2025-10-20 11:15:00'),
-- Vợt cầu lông Yonex (productId: 52)
(1890000, 55, 52, '2025-11-25 16:00:00', '2025-11-25 16:00:00'),
(2490000, 35, 52, '2025-11-25 16:00:00', '2025-11-25 16:00:00'),

-- Xe đẩy em bé đa năng (productId: 53)
(2490000, 35, 53, '2025-08-20 09:30:00', '2025-08-20 09:30:00'),
(3290000, 22, 53, '2025-08-20 09:30:00', '2025-08-20 09:30:00'),
-- Bộ đồ chơi Lego 500 miếng (productId: 54)
(890000, 70, 54, '2025-09-15 13:45:00', '2025-09-15 13:45:00'),
(1290000, 45, 54, '2025-09-15 13:45:00', '2025-09-15 13:45:00'),
-- Ghế ăn dặm cho bé (productId: 55)
(1290000, 50, 55, '2025-10-10 10:20:00', '2025-10-10 10:20:00'),
(1690000, 30, 55, '2025-10-10 10:20:00', '2025-10-10 10:20:00'),
-- Bỉm Merries size L (productId: 56)
(450000, 150, 56, '2025-11-05 15:10:00', '2025-11-05 15:10:00'),
(490000, 100, 56, '2025-11-05 15:10:00', '2025-11-05 15:10:00'),

-- Sách Đắc Nhân Tâm (productId: 57)
(98000, 200, 57, '2025-08-05 08:00:00', '2025-08-05 08:00:00'),
(125000, 120, 57, '2025-08-05 08:00:00', '2025-08-05 08:00:00'),
-- Vở Campus 200 trang (productId: 58)
(25000, 500, 58, '2025-09-01 09:15:00', '2025-09-01 09:15:00'),
(35000, 300, 58, '2025-09-01 09:15:00', '2025-09-01 09:15:00'),
-- Bộ bút bi Thiên Long (productId: 59)
(45000, 400, 59, '2025-10-15 11:30:00', '2025-10-15 11:30:00'),
(65000, 250, 59, '2025-10-15 11:30:00', '2025-10-15 11:30:00'),

-- Tai nghe Bluetooth Sony (productId: 60)
(7990000, 30, 60, '2025-08-12 10:45:00', '2025-08-12 10:45:00'),
(8990000, 20, 60, '2025-08-12 10:45:00', '2025-08-12 10:45:00'),
-- Sạc dự phòng Anker 20000mAh (productId: 61)
(690000, 85, 61, '2025-09-08 14:20:00', '2025-09-08 14:20:00'),
(890000, 55, 61, '2025-09-08 14:20:00', '2025-09-08 14:20:00'),
-- Ốp lưng iPhone 15 Pro Max (productId: 62)
(290000, 180, 62, '2025-10-20 09:00:00', '2025-10-20 09:00:00'),
(390000, 120, 62, '2025-10-20 09:00:00', '2025-10-20 09:00:00'),
-- Chuột gaming Logitech G502 (productId: 63)
(1490000, 45, 63, '2025-11-15 16:30:00', '2025-11-15 16:30:00'),
(1790000, 28, 63, '2025-11-15 16:30:00', '2025-11-15 16:30:00'),
-- Bàn phím cơ Akko (productId: 64)
(1890000, 38, 64, '2025-12-10 11:00:00', '2025-12-10 11:00:00'),
(2290000, 22, 64, '2025-12-10 11:00:00', '2025-12-10 11:00:00'),

-- Xe máy Honda Vision (productId: 65)
(32990000, 15, 65, '2025-08-18 08:30:00', '2025-08-18 08:30:00'),
(35990000, 10, 65, '2025-08-18 08:30:00', '2025-08-18 08:30:00'),
-- Xe đạp điện Vinfast (productId: 66)
(22990000, 25, 66, '2025-09-22 10:15:00', '2025-09-22 10:15:00'),
(26990000, 15, 66, '2025-09-22 10:15:00', '2025-09-22 10:15:00'),
-- Mũ bảo hiểm fullface (productId: 67)
(690000, 80, 67, '2025-10-28 14:45:00', '2025-10-28 14:45:00'),
(890000, 50, 67, '2025-10-28 14:45:00', '2025-10-28 14:45:00'),
-- Găng tay xe máy (productId: 68)
(190000, 150, 68, '2025-11-12 09:30:00', '2025-11-12 09:30:00'),
(290000, 95, 68, '2025-11-12 09:30:00', '2025-11-12 09:30:00'),
-- Áo mưa bộ cao cấp (productId: 69)
(290000, 120, 69, '2025-12-05 11:20:00', '2025-12-05 11:20:00'),
(390000, 80, 69, '2025-12-05 11:20:00', '2025-12-05 11:20:00'),
-- Dầu nhớt Castrol (productId: 70)
(85000, 250, 70, '2025-08-30 15:00:00', '2025-08-30 15:00:00'),
(120000, 150, 70, '2025-08-30 15:00:00', '2025-08-30 15:00:00'),

-- Bánh trung thu Kinh Đô (productId: 71)
(350000, 100, 71, '2025-08-25 08:00:00', '2025-08-25 08:00:00'),
(490000, 60, 71, '2025-08-25 08:00:00', '2025-08-25 08:00:00'),
-- Cà phê G7 hộp 50 gói (productId: 72)
(125000, 200, 72, '2025-09-10 09:30:00', '2025-09-10 09:30:00'),
(180000, 130, 72, '2025-09-10 09:30:00', '2025-09-10 09:30:00'),
-- Mì Hảo Hảo thùng 30 gói (productId: 73)
(145000, 300, 73, '2025-10-05 10:45:00', '2025-10-05 10:45:00'),
(175000, 180, 73, '2025-10-05 10:45:00', '2025-10-05 10:45:00');
INSERT INTO `orders` (`qr_code`, `payment_method`, `total_price`, `order_date`, `status`, `shipping_address`, `shipping_fee`, `cancel_reason`, `paid_at`, `delivered_at`, `image_shipping`, `clientId`, `shipperId`, `storeId`, `coupons`, `shipping_code`, `createdAt`, `updatedAt`) VALUES
('order-21-qr.jpg', 'cash', 160000, '2025-01-05', 'PENDING', 'Address 13, Hanoi', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-01-05 10:00:00', '2025-01-05 10:00:00'),
('order-22-qr.jpg', 'wallet', 170000, '2025-01-10', 'CONFIRMED', 'Address 14, Hanoi', 30000, NULL, '2025-01-10', NULL, 'Order-22.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-01-10 11:30:00', '2025-01-10 11:30:00'),
('order-23-qr.jpg', 'cash', 180000, '2025-01-15', 'IN_TRANSIT', 'Address 15, Hanoi', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-01-15 09:45:00', '2025-01-15 09:45:00'),
('order-24-qr.jpg', 'wallet', 190000, '2025-01-20', 'DELIVERED', 'Address 16, Hanoi', 30000, NULL, '2025-01-20', '2025-01-21', 'Order-24.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-01-20 14:20:00', '2025-01-20 14:20:00'),
('order-25-qr.jpg', 'cash', 200000, '2025-01-25', 'CLIENT_CONFIRMED', 'Address 17, Hanoi', 18000, NULL, '2025-01-25', '2025-01-26', 'Order-25.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-01-25 16:10:00', '2025-01-25 16:10:00'),
('order-26-qr.jpg', 'wallet', 210000, '2025-02-05', 'CANCELLED', 'Address 18, Hanoi', 30000, 'Customer request', NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', NULL, 'STORE1766314663632', NULL, NULL, '2025-02-05 08:55:00', '2025-02-05 08:55:00'),
('order-27-qr.jpg', 'cash', 220000, '2025-02-10', 'RETURNED', 'Address 19, Hanoi', 18000, NULL, '2025-02-10', NULL, 'Order-27.jpeg', 'CLIENT1766314602202', 'SHIPPER1766408019380', 'STORE1766314663632', '[1]', 1, '2025-02-10 13:40:00', '2025-02-10 13:40:00'),
('order-28-qr.jpg', 'wallet', 230000, '2025-02-15', 'RETURN_CONFIRMED', 'Address 20, Hanoi', 30000, NULL, '2025-02-15', NULL, 'Order-28.jpeg', 'CLIENT1766565306888', 'SHIPPER1766315105177', 'STORE1766314663632', NULL, NULL, '2025-02-15 15:25:00', '2025-02-15 15:25:00'),
('order-29-qr.jpg', 'cash', 240000, '2025-02-20', 'FAILED', 'Address 21, Hanoi', 18000, 'Payment failed', NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', NULL, 'STORE1766314663632', '[1]', 1, '2025-02-20 10:15:00', '2025-02-20 10:15:00'),
('order-30-qr.jpg', 'wallet', 250000, '2025-02-25', 'PENDING', 'Address 22, Hanoi', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-02-25 12:05:00', '2025-02-25 12:05:00'),
('order-31-qr.jpg', 'cash', 260000, '2025-03-05', 'CONFIRMED', 'Address 23, Hanoi', 18000, NULL, '2025-03-05', NULL, 'Order-31.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-03-05 17:50:00', '2025-03-05 17:50:00'),
('order-32-qr.jpg', 'wallet', 270000, '2025-03-10', 'IN_TRANSIT', 'Address 24, Hanoi', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-03-10 09:35:00', '2025-03-10 09:35:00'),
('order-33-qr.jpg', 'cash', 280000, '2025-03-15', 'PENDING', 'Address 25, Hanoi', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-03-15 11:20:00', '2025-03-15 11:20:00'),
('order-34-qr.jpg', 'wallet', 290000, '2025-03-20', 'CONFIRMED', 'Address 26, Hanoi', 30000, NULL, '2025-03-20', NULL, 'Order-34.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-03-20 14:45:00', '2025-03-20 14:45:00'),
('order-35-qr.jpg', 'cash', 300000, '2025-03-25', 'IN_TRANSIT', 'Address 27, Hanoi', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-03-25 16:30:00', '2025-03-25 16:30:00'),
('order-36-qr.jpg', 'wallet', 310000, '2025-04-05', 'DELIVERED', 'Address 28, Hanoi', 30000, NULL, '2025-04-05', '2025-04-06', 'Order-36.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-04-05 08:10:00', '2025-04-05 08:10:00'),
('order-37-qr.jpg', 'cash', 320000, '2025-04-10', 'CLIENT_CONFIRMED', 'Address 29, Hanoi', 18000, NULL, '2025-04-10', '2025-04-11', 'Order-37.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-04-10 13:55:00', '2025-04-10 13:55:00'),
('order-38-qr.jpg', 'wallet', 330000, '2025-04-15', 'CANCELLED', 'Address 30, Hanoi', 30000, 'Customer request', NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', NULL, 'STORE1766314663632', NULL, NULL, '2025-04-15 15:40:00', '2025-04-15 15:40:00'),
('order-39-qr.jpg', 'cash', 340000, '2025-04-20', 'RETURNED', 'Address 31, Hanoi', 18000, NULL, '2025-04-20', NULL, 'Order-39.jpeg', 'CLIENT1766314602202', 'SHIPPER1766408019380', 'STORE1766314663632', '[1]', 1, '2025-04-20 10:25:00', '2025-04-20 10:25:00'),
('order-40-qr.jpg', 'wallet', 350000, '2025-04-25', 'RETURN_CONFIRMED', 'Address 32, Hanoi', 30000, NULL, '2025-04-25', NULL, 'Order-40.jpeg', 'CLIENT1766565306888', 'SHIPPER1766315105177', 'STORE1766314663632', NULL, NULL, '2025-04-25 12:00:00', '2025-04-25 12:00:00'),
('order-41-qr.jpg', 'cash', 360000, '2025-05-05', 'FAILED', 'Address 33, Hanoi', 18000, 'Payment failed', NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', NULL, 'STORE1766314663632', '[1]', 1, '2025-05-05 13:35:00', '2025-05-05 13:35:00'),
('order-42-qr.jpg', 'wallet', 370000, '2025-05-10', 'PENDING', 'Address 34, Hanoi', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-05-10 15:10:00', '2025-05-10 15:10:00'),
('order-43-qr.jpg', 'cash', 380000, '2025-05-15', 'CONFIRMED', 'Address 35, Hanoi', 18000, NULL, '2025-05-15', NULL, 'Order-43.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-05-15 16:45:00', '2025-05-15 16:45:00'),
('order-44-qr.jpg', 'wallet', 390000, '2025-05-20', 'IN_TRANSIT', 'Address 36, Hanoi', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-05-20 09:20:00', '2025-05-20 09:20:00'),
('order-45-qr.jpg', 'cash', 400000, '2025-05-25', 'PENDING', 'Address 37, Hanoi', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-05-25 11:10:00', '2025-05-25 11:10:00'),
('order-46-qr.jpg', 'wallet', 410000, '2025-06-05', 'CONFIRMED', 'Address 38, Hanoi', 30000, NULL, '2025-06-05', NULL, 'Order-46.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-06-05 12:45:00', '2025-06-05 12:45:00'),
('order-47-qr.jpg', 'cash', 420000, '2025-06-10', 'IN_TRANSIT', 'Address 39, Hanoi', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-06-10 14:20:00', '2025-06-10 14:20:00'),
('order-48-qr.jpg', 'wallet', 430000, '2025-06-15', 'DELIVERED', 'Address 40, Hanoi', 30000, NULL, '2025-06-15', '2025-06-16', 'Order-48.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-06-15 15:55:00', '2025-06-15 15:55:00'),
('order-49-qr.jpg', 'cash', 440000, '2025-06-20', 'CLIENT_CONFIRMED', 'Address 41, Hanoi', 18000, NULL, '2025-06-20', '2025-06-21', 'Order-49.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-06-20 17:30:00', '2025-06-20 17:30:00'),
('order-50-qr.jpg', 'wallet', 450000, '2025-06-25', 'CANCELLED', 'Address 42, Hanoi', 30000, 'Customer request', NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', NULL, 'STORE1766314663632', NULL, NULL, '2025-06-25 09:05:00', '2025-06-25 09:05:00'),
('order-51-qr.jpg', 'cash', 460000, '2025-07-05', 'RETURNED', 'Address 43, Hanoi', 18000, NULL, '2025-07-05', NULL, 'Order-51.jpeg', 'CLIENT1766314602202', 'SHIPPER1766408019380', 'STORE1766314663632', '[1]', 1, '2025-07-05 10:40:00', '2025-07-05 10:40:00'),
('order-52-qr.jpg', 'wallet', 470000, '2025-07-10', 'RETURN_CONFIRMED', 'Address 44, Hanoi', 30000, NULL, '2025-07-10', NULL, 'Order-52.jpeg', 'CLIENT1766565306888', 'SHIPPER1766315105177', 'STORE1766314663632', NULL, NULL, '2025-07-10 12:15:00', '2025-07-10 12:15:00'),
('order-53-qr.jpg', 'cash', 480000, '2025-07-15', 'FAILED', 'Address 45, Hanoi', 18000, 'Payment failed', NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', NULL, 'STORE1766314663632', '[1]', 1, '2025-07-15 13:50:00', '2025-07-15 13:50:00'),
('order-54-qr.jpg', 'wallet', 490000, '2025-07-20', 'PENDING', 'Address 46, Hanoi', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-07-20 15:25:00', '2025-07-20 15:25:00'),
('order-55-qr.jpg', 'cash', 500000, '2025-07-25', 'CONFIRMED', 'Address 47, Hanoi', 18000, NULL, '2025-07-25', NULL, 'Order-55.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-07-25 16:00:00', '2025-07-25 16:00:00'),
('order-56-qr.jpg', 'wallet', 510000, '2025-08-05', 'IN_TRANSIT', 'Address 48, Hanoi', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-08-05 09:00:00', '2025-08-05 09:00:00'),
('order-57-qr.jpg', 'cash', 520000, '2025-08-10', 'PENDING', 'Address 49, Hanoi', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-08-10 10:30:00', '2025-08-10 10:30:00'),
('order-58-qr.jpg', 'wallet', 530000, '2025-08-15', 'CONFIRMED', 'Address 50, Hanoi', 30000, NULL, '2025-08-15', NULL, 'Order-58.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-08-15 12:00:00', '2025-08-15 12:00:00'),
('order-59-qr.jpg', 'cash', 540000, '2025-08-20', 'IN_TRANSIT', 'Address 51, Hanoi', 18000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-08-20 13:30:00', '2025-08-20 13:30:00'),
('order-60-qr.jpg', 'wallet', 550000, '2025-08-25', 'DELIVERED', 'Address 52, Hanoi', 30000, NULL, '2025-08-25', '2025-08-26', 'Order-60.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-08-25 15:00:00', '2025-08-25 15:00:00'),
('order-61-qr.jpg', 'cash', 560000, '2025-09-05', 'CLIENT_CONFIRMED', 'Address 53, Hanoi', 18000, NULL, '2025-09-05', '2025-09-06', 'Order-61.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-09-05 16:30:00', '2025-09-05 16:30:00'),
('order-62-qr.jpg', 'wallet', 570000, '2025-09-10', 'CANCELLED', 'Address 54, Hanoi', 30000, 'Customer request', NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', NULL, 'STORE1766314663632', NULL, NULL, '2025-09-10 09:30:00', '2025-09-10 09:30:00'),
('order-63-qr.jpg', 'cash', 580000, '2025-09-15', 'RETURNED', 'Address 55, Hanoi', 18000, NULL, '2025-09-15', NULL, 'Order-63.jpeg', 'CLIENT1766314602202', 'SHIPPER1766408019380', 'STORE1766314663632', '[1]', 1, '2025-09-15 11:00:00', '2025-09-15 11:00:00'),
('order-64-qr.jpg', 'wallet', 590000, '2025-09-20', 'RETURN_CONFIRMED', 'Address 56, Hanoi', 30000, NULL, '2025-09-20', NULL, 'Order-64.jpeg', 'CLIENT1766565306888', 'SHIPPER1766315105177', 'STORE1766314663632', NULL, NULL, '2025-09-20 12:30:00', '2025-09-20 12:30:00'),
('order-65-qr.jpg', 'cash', 600000, '2025-09-25', 'FAILED', 'Address 57, Hanoi', 18000, 'Payment failed', NULL, NULL, 'default-order.jpg', 'CLIENT1766314602202', NULL, 'STORE1766314663632', '[1]', 1, '2025-09-25 14:00:00', '2025-09-25 14:00:00'),
('order-66-qr.jpg', 'wallet', 610000, '2025-10-05', 'PENDING', 'Address 58, Hanoi', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-10-05 15:30:00', '2025-10-05 15:30:00'),
('order-67-qr.jpg', 'cash', 620000, '2025-10-10', 'CONFIRMED', 'Address 59, Hanoi', 18000, NULL, '2025-10-10', NULL, 'Order-67.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-10-10 17:00:00', '2025-10-10 17:00:00'),
('order-68-qr.jpg', 'wallet', 630000, '2025-10-15', 'IN_TRANSIT', 'Address 60, Hanoi', 30000, NULL, NULL, NULL, 'default-order.jpg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-10-15 09:45:00', '2025-10-15 09:45:00'),
('order-69-qr.jpg', 'cash', 185000, '2025-05-08', 'CLIENT_CONFIRMED', 'Số 15 Lê Lợi, Quận 1, TP.HCM', 18000, NULL, '2025-05-08', '2025-05-09', 'Order-69.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-05-08 08:30:00', '2025-05-08 08:30:00'),
('order-70-qr.jpg', 'wallet', 225000, '2025-05-22', 'CLIENT_CONFIRMED', 'Số 88 Nguyễn Huệ, Quận 1, TP.HCM', 30000, NULL, '2025-05-22', '2025-05-23', 'Order-70.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-05-22 14:15:00', '2025-05-22 14:15:00'),
('order-71-qr.jpg', 'cash', 195000, '2025-06-03', 'CLIENT_CONFIRMED', 'Số 45 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 18000, NULL, '2025-06-03', '2025-06-04', 'Order-71.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-06-03 09:45:00', '2025-06-03 09:45:00'),
('order-72-qr.jpg', 'wallet', 265000, '2025-06-18', 'CLIENT_CONFIRMED', 'Số 120 Cầu Giấy, Cầu Giấy, Hà Nội', 30000, NULL, '2025-06-18', '2025-06-19', 'Order-72.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-06-18 16:20:00', '2025-06-18 16:20:00'),
('order-73-qr.jpg', 'cash', 175000, '2025-07-02', 'CLIENT_CONFIRMED', 'Số 78 Hai Bà Trưng, Quận 3, TP.HCM', 18000, NULL, '2025-07-02', '2025-07-03', 'Order-73.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-07-02 10:30:00', '2025-07-02 10:30:00'),
('order-74-qr.jpg', 'wallet', 320000, '2025-07-15', 'CLIENT_CONFIRMED', 'Số 55 Nguyễn Trãi, Thanh Xuân, Hà Nội', 30000, NULL, '2025-07-15', '2025-07-16', 'Order-74.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-07-15 11:45:00', '2025-07-15 11:45:00'),
('order-75-qr.jpg', 'cash', 245000, '2025-07-28', 'CLIENT_CONFIRMED', 'Số 99 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 18000, NULL, '2025-07-28', '2025-07-29', 'Order-75.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-07-28 13:00:00', '2025-07-28 13:00:00'),
('order-76-qr.jpg', 'wallet', 285000, '2025-08-11', 'CLIENT_CONFIRMED', 'Số 200 Võ Văn Tần, Quận 3, TP.HCM', 30000, NULL, '2025-08-11', '2025-08-12', 'Order-76.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-08-11 15:30:00', '2025-08-11 15:30:00'),
('order-77-qr.jpg', 'cash', 210000, '2025-08-25', 'CLIENT_CONFIRMED', 'Số 67 Bà Triệu, Hoàn Kiếm, Hà Nội', 18000, NULL, '2025-08-25', '2025-08-26', 'Order-77.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-08-25 08:15:00', '2025-08-25 08:15:00'),
('order-78-qr.jpg', 'wallet', 355000, '2025-09-08', 'CLIENT_CONFIRMED', 'Số 33 Nguyễn Đình Chiểu, Quận 1, TP.HCM', 30000, NULL, '2025-09-08', '2025-09-09', 'Order-78.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-09-08 17:00:00', '2025-09-08 17:00:00'),
('order-79-qr.jpg', 'cash', 195000, '2025-09-22', 'CLIENT_CONFIRMED', 'Số 145 Láng Hạ, Đống Đa, Hà Nội', 18000, NULL, '2025-09-22', '2025-09-23', 'Order-79.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-09-22 09:30:00', '2025-09-22 09:30:00'),
('order-80-qr.jpg', 'wallet', 275000, '2025-10-05', 'CLIENT_CONFIRMED', 'Số 88 Pasteur, Quận 1, TP.HCM', 30000, NULL, '2025-10-05', '2025-10-06', 'Order-80.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-10-05 14:45:00', '2025-10-05 14:45:00'),
('order-81-qr.jpg', 'cash', 230000, '2025-10-18', 'CLIENT_CONFIRMED', 'Số 22 Kim Mã, Ba Đình, Hà Nội', 18000, NULL, '2025-10-18', '2025-10-19', 'Order-81.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-10-18 10:15:00', '2025-10-18 10:15:00'),
('order-82-qr.jpg', 'wallet', 315000, '2025-11-02', 'CLIENT_CONFIRMED', 'Số 56 Điện Biên Phủ, Bình Thạnh, TP.HCM', 30000, NULL, '2025-11-02', '2025-11-03', 'Order-82.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-11-02 16:30:00', '2025-11-02 16:30:00'),
('order-83-qr.jpg', 'cash', 185000, '2025-11-15', 'CLIENT_CONFIRMED', 'Số 111 Giảng Võ, Ba Đình, Hà Nội', 18000, NULL, '2025-11-15', '2025-11-16', 'Order-83.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-11-15 11:00:00', '2025-11-15 11:00:00'),
('order-84-qr.jpg', 'wallet', 295000, '2025-11-28', 'CLIENT_CONFIRMED', 'Số 77 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', 30000, NULL, '2025-11-28', '2025-11-29', 'Order-84.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-11-28 13:45:00', '2025-11-28 13:45:00'),
('order-85-qr.jpg', 'cash', 250000, '2025-12-10', 'CLIENT_CONFIRMED', 'Số 44 Tây Sơn, Đống Đa, Hà Nội', 18000, NULL, '2025-12-10', '2025-12-11', 'Order-85.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-12-10 08:45:00', '2025-12-10 08:45:00'),
('order-86-qr.jpg', 'wallet', 340000, '2025-12-23', 'CLIENT_CONFIRMED', 'Số 99 Cách Mạng Tháng 8, Quận 10, TP.HCM', 30000, NULL, '2025-12-23', '2025-12-24', 'Order-86.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-12-23 15:15:00', '2025-12-23 15:15:00'),
('order-87-qr.jpg', 'cash', 205000, '2026-01-02', 'CLIENT_CONFIRMED', 'Số 66 Phố Huế, Hai Bà Trưng, Hà Nội', 18000, NULL, '2026-01-02', '2026-01-03', 'Order-87.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2026-01-02 10:00:00', '2026-01-02 10:00:00'),
('order-88-qr.jpg', 'wallet', 380000, '2026-01-04', 'CLIENT_CONFIRMED', 'Số 128 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM', 30000, NULL, '2026-01-04', '2026-01-04', 'Order-88.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2026-01-04 09:00:00', '2026-01-04 09:00:00'),
('order-89-qr.jpg', 'cash', 155000, '2025-05-03', 'CLIENT_CONFIRMED', 'Số 12 Phạm Ngọc Thạch, Quận 3, TP.HCM', 18000, NULL, '2025-05-03', '2025-05-04', 'Order-89.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-05-03 07:30:00', '2025-05-03 07:30:00'),
('order-90-qr.jpg', 'wallet', 198000, '2025-05-11', 'CLIENT_CONFIRMED', 'Số 35 Lê Duẩn, Quận 1, TP.HCM', 30000, NULL, '2025-05-11', '2025-05-12', 'Order-90.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-05-11 11:20:00', '2025-05-11 11:20:00'),
('order-91-qr.jpg', 'cash', 267000, '2025-05-19', 'CLIENT_CONFIRMED', 'Số 58 Hoàng Diệu, Ba Đình, Hà Nội', 18000, NULL, '2025-05-19', '2025-05-20', 'Order-91.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-05-19 14:45:00', '2025-05-19 14:45:00'),
('order-92-qr.jpg', 'wallet', 312000, '2025-05-27', 'CLIENT_CONFIRMED', 'Số 92 Nguyễn Du, Quận 1, TP.HCM', 30000, NULL, '2025-05-27', '2025-05-28', 'Order-92.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-05-27 16:10:00', '2025-05-27 16:10:00'),
('order-93-qr.jpg', 'cash', 178000, '2025-06-07', 'CLIENT_CONFIRMED', 'Số 101 Thái Hà, Đống Đa, Hà Nội', 18000, NULL, '2025-06-07', '2025-06-08', 'Order-93.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-06-07 08:55:00', '2025-06-07 08:55:00'),
('order-94-qr.jpg', 'wallet', 245000, '2025-06-14', 'CLIENT_CONFIRMED', 'Số 67 Trương Định, Quận 3, TP.HCM', 30000, NULL, '2025-06-14', '2025-06-15', 'Order-94.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-06-14 13:30:00', '2025-06-14 13:30:00'),
('order-95-qr.jpg', 'cash', 289000, '2025-06-23', 'CLIENT_CONFIRMED', 'Số 28 Xã Đàn, Đống Đa, Hà Nội', 18000, NULL, '2025-06-23', '2025-06-24', 'Order-95.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-06-23 15:20:00', '2025-06-23 15:20:00'),
('order-96-qr.jpg', 'wallet', 334000, '2025-06-29', 'CLIENT_CONFIRMED', 'Số 156 Lý Tự Trọng, Quận 1, TP.HCM', 30000, NULL, '2025-06-29', '2025-06-30', 'Order-96.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-06-29 09:45:00', '2025-06-29 09:45:00'),
('order-97-qr.jpg', 'cash', 167000, '2025-07-06', 'CLIENT_CONFIRMED', 'Số 89 Chùa Bộc, Đống Đa, Hà Nội', 18000, NULL, '2025-07-06', '2025-07-07', 'Order-97.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-07-06 10:15:00', '2025-07-06 10:15:00'),
('order-98-qr.jpg', 'wallet', 278000, '2025-07-12', 'CLIENT_CONFIRMED', 'Số 44 Hai Bà Trưng, Quận 1, TP.HCM', 30000, NULL, '2025-07-12', '2025-07-13', 'Order-98.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-07-12 12:40:00', '2025-07-12 12:40:00'),
('order-99-qr.jpg', 'cash', 223000, '2025-07-21', 'CLIENT_CONFIRMED', 'Số 33 Nguyễn Chí Thanh, Đống Đa, Hà Nội', 18000, NULL, '2025-07-21', '2025-07-22', 'Order-99.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-07-21 14:55:00', '2025-07-21 14:55:00'),
('order-100-qr.jpg', 'wallet', 356000, '2025-07-30', 'CLIENT_CONFIRMED', 'Số 78 Đinh Tiên Hoàng, Quận Bình Thạnh, TP.HCM', 30000, NULL, '2025-07-30', '2025-07-31', 'Order-100.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-07-30 16:30:00', '2025-07-30 16:30:00'),
('order-101-qr.jpg', 'cash', 189000, '2025-08-04', 'CLIENT_CONFIRMED', 'Số 112 Trường Chinh, Đống Đa, Hà Nội', 18000, NULL, '2025-08-04', '2025-08-05', 'Order-101.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-08-04 08:20:00', '2025-08-04 08:20:00'),
('order-102-qr.jpg', 'wallet', 298000, '2025-08-14', 'CLIENT_CONFIRMED', 'Số 65 Nguyễn Văn Cừ, Quận 5, TP.HCM', 30000, NULL, '2025-08-14', '2025-08-15', 'Order-102.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-08-14 11:50:00', '2025-08-14 11:50:00'),
('order-103-qr.jpg', 'cash', 234000, '2025-08-22', 'CLIENT_CONFIRMED', 'Số 47 Đội Cấn, Ba Đình, Hà Nội', 18000, NULL, '2025-08-22', '2025-08-23', 'Order-103.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-08-22 13:15:00', '2025-08-22 13:15:00'),
('order-104-qr.jpg', 'wallet', 367000, '2025-08-30', 'CLIENT_CONFIRMED', 'Số 123 Cống Quỳnh, Quận 1, TP.HCM', 30000, NULL, '2025-08-30', '2025-08-31', 'Order-104.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-08-30 15:40:00', '2025-08-30 15:40:00'),
('order-105-qr.jpg', 'cash', 176000, '2025-09-03', 'CLIENT_CONFIRMED', 'Số 56 Ngọc Hà, Ba Đình, Hà Nội', 18000, NULL, '2025-09-03', '2025-09-04', 'Order-105.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-09-03 09:30:00', '2025-09-03 09:30:00'),
('order-106-qr.jpg', 'wallet', 289000, '2025-09-12', 'CLIENT_CONFIRMED', 'Số 88 Bùi Viện, Quận 1, TP.HCM', 30000, NULL, '2025-09-12', '2025-09-13', 'Order-106.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-09-12 12:05:00', '2025-09-12 12:05:00'),
('order-107-qr.jpg', 'cash', 215000, '2025-09-19', 'CLIENT_CONFIRMED', 'Số 34 Liễu Giai, Ba Đình, Hà Nội', 18000, NULL, '2025-09-19', '2025-09-20', 'Order-107.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-09-19 14:25:00', '2025-09-19 14:25:00'),
('order-108-qr.jpg', 'wallet', 345000, '2025-09-27', 'CLIENT_CONFIRMED', 'Số 156 Nguyễn Thái Học, Quận 1, TP.HCM', 30000, NULL, '2025-09-27', '2025-09-28', 'Order-108.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-09-27 16:50:00', '2025-09-27 16:50:00'),
('order-109-qr.jpg', 'cash', 198000, '2025-10-02', 'CLIENT_CONFIRMED', 'Số 78 Phan Đình Phùng, Ba Đình, Hà Nội', 18000, NULL, '2025-10-02', '2025-10-03', 'Order-109.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-10-02 08:45:00', '2025-10-02 08:45:00'),
('order-110-qr.jpg', 'wallet', 312000, '2025-10-11', 'CLIENT_CONFIRMED', 'Số 45 Lê Thánh Tôn, Quận 1, TP.HCM', 30000, NULL, '2025-10-11', '2025-10-12', 'Order-110.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-10-11 11:15:00', '2025-10-11 11:15:00'),
('order-111-qr.jpg', 'cash', 256000, '2025-10-22', 'CLIENT_CONFIRMED', 'Số 92 Hoàng Hoa Thám, Ba Đình, Hà Nội', 18000, NULL, '2025-10-22', '2025-10-23', 'Order-111.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-10-22 13:40:00', '2025-10-22 13:40:00'),
('order-112-qr.jpg', 'wallet', 378000, '2025-10-29', 'CLIENT_CONFIRMED', 'Số 67 Đề Thám, Quận 1, TP.HCM', 30000, NULL, '2025-10-29', '2025-10-30', 'Order-112.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-10-29 15:55:00', '2025-10-29 15:55:00'),
('order-113-qr.jpg', 'cash', 183000, '2025-11-05', 'CLIENT_CONFIRMED', 'Số 23 Văn Cao, Ba Đình, Hà Nội', 18000, NULL, '2025-11-05', '2025-11-06', 'Order-113.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-11-05 09:10:00', '2025-11-05 09:10:00'),
('order-114-qr.jpg', 'wallet', 298000, '2025-11-12', 'CLIENT_CONFIRMED', 'Số 134 Võ Thị Sáu, Quận 3, TP.HCM', 30000, NULL, '2025-11-12', '2025-11-13', 'Order-114.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-11-12 12:35:00', '2025-11-12 12:35:00'),
('order-115-qr.jpg', 'cash', 227000, '2025-11-20', 'CLIENT_CONFIRMED', 'Số 56 Nguyễn Thái Học, Ba Đình, Hà Nội', 18000, NULL, '2025-11-20', '2025-11-21', 'Order-115.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-11-20 14:50:00', '2025-11-20 14:50:00'),
('order-116-qr.jpg', 'wallet', 356000, '2025-11-26', 'CLIENT_CONFIRMED', 'Số 89 Nguyễn Cư Trinh, Quận 1, TP.HCM', 30000, NULL, '2025-11-26', '2025-11-27', 'Order-116.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-11-26 17:15:00', '2025-11-26 17:15:00'),
('order-117-qr.jpg', 'cash', 169000, '2025-12-03', 'CLIENT_CONFIRMED', 'Số 112 Đê La Thành, Đống Đa, Hà Nội', 18000, NULL, '2025-12-03', '2025-12-04', 'Order-117.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-12-03 08:30:00', '2025-12-03 08:30:00'),
('order-118-qr.jpg', 'wallet', 287000, '2025-12-08', 'CLIENT_CONFIRMED', 'Số 45 Phạm Ngũ Lão, Quận 1, TP.HCM', 30000, NULL, '2025-12-08', '2025-12-09', 'Order-118.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-12-08 11:45:00', '2025-12-08 11:45:00'),
('order-119-qr.jpg', 'cash', 243000, '2025-12-15', 'CLIENT_CONFIRMED', 'Số 78 Khâm Thiên, Đống Đa, Hà Nội', 18000, NULL, '2025-12-15', '2025-12-16', 'Order-119.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-12-15 13:20:00', '2025-12-15 13:20:00'),
('order-120-qr.jpg', 'wallet', 398000, '2025-12-19', 'CLIENT_CONFIRMED', 'Số 167 Trần Quang Khải, Quận 1, TP.HCM', 30000, NULL, '2025-12-19', '2025-12-20', 'Order-120.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-12-19 15:35:00', '2025-12-19 15:35:00'),
('order-121-qr.jpg', 'cash', 178000, '2025-12-25', 'CLIENT_CONFIRMED', 'Số 34 Cát Linh, Đống Đa, Hà Nội', 18000, NULL, '2025-12-25', '2025-12-26', 'Order-121.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-12-25 09:55:00', '2025-12-25 09:55:00'),
('order-122-qr.jpg', 'wallet', 315000, '2025-12-28', 'CLIENT_CONFIRMED', 'Số 56 Mạc Đĩnh Chi, Quận 1, TP.HCM', 30000, NULL, '2025-12-28', '2025-12-29', 'Order-122.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2025-12-28 12:10:00', '2025-12-28 12:10:00'),
('order-123-qr.jpg', 'cash', 267000, '2025-12-31', 'CLIENT_CONFIRMED', 'Số 89 Tôn Đức Thắng, Đống Đa, Hà Nội', 18000, NULL, '2025-12-31', '2026-01-01', 'Order-123.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2025-12-31 14:40:00', '2025-12-31 14:40:00'),
('order-124-qr.jpg', 'wallet', 389000, '2026-01-01', 'CLIENT_CONFIRMED', 'Số 123 Nguyễn Công Trứ, Quận 1, TP.HCM', 30000, NULL, '2026-01-01', '2026-01-02', 'Order-124.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2026-01-01 10:25:00', '2026-01-01 10:25:00'),
('order-125-qr.jpg', 'cash', 192000, '2026-01-03', 'CLIENT_CONFIRMED', 'Số 67 Nguyễn Lương Bằng, Đống Đa, Hà Nội', 18000, NULL, '2026-01-03', '2026-01-04', 'Order-125.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2026-01-03 08:15:00', '2026-01-03 08:15:00'),
('order-126-qr.jpg', 'wallet', 345000, '2026-01-04', 'CLIENT_CONFIRMED', 'Số 78 Tôn Thất Tùng, Quận 1, TP.HCM', 30000, NULL, '2026-01-04', '2026-01-04', 'Order-126.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2026-01-04 11:30:00', '2026-01-04 11:30:00'),
('order-127-qr.jpg', 'cash', 218000, '2026-01-04', 'CLIENT_CONFIRMED', 'Số 145 Láng, Đống Đa, Hà Nội', 18000, NULL, '2026-01-04', '2026-01-04', 'Order-127.jpeg', 'CLIENT1766314602202', 'SHIPPER1766315105177', 'STORE1766314663632', '[1]', 1, '2026-01-04 14:20:00', '2026-01-04 14:20:00'),
('order-128-qr.jpg', 'wallet', 278000, '2026-01-04', 'CLIENT_CONFIRMED', 'Số 99 Sư Vạn Hạnh, Quận 10, TP.HCM', 30000, NULL, '2026-01-04', '2026-01-04', 'Order-128.jpeg', 'CLIENT1766565306888', 'SHIPPER1766408019380', 'STORE1766314663632', NULL, NULL, '2026-01-04 16:45:00', '2026-01-04 16:45:00');

INSERT INTO `order_items` (`title`, `image`, `quantity`, `price`, `orderId`, `product_variantId`, `createdAt`, `updatedAt`) VALUES
(NULL, NULL, 1, 50000, 9, 1, '2025-01-15 10:00:00', '2025-01-15 10:00:00'),
(NULL, NULL, 2, 75000, 10, 2, '2025-02-20 11:30:00', '2025-02-20 11:30:00'),
(NULL, NULL, 3, 100000, 11, 3, '2025-03-10 09:45:00', '2025-03-10 09:45:00'),
(NULL, NULL, 1, 120000, 12, 4, '2025-04-05 14:20:00', '2025-04-05 14:20:00'),
(NULL, NULL, 4, 80000, 13, 5, '2025-05-18 16:10:00', '2025-05-18 16:10:00'),
(NULL, NULL, 2, 90000, 14, 6, '2025-06-22 08:55:00', '2025-06-22 08:55:00'),
(NULL, NULL, 3, 110000, 15, 7, '2025-07-30 13:40:00', '2025-07-30 13:40:00'),
(NULL, NULL, 1, 130000, 16, 8, '2025-08-12 15:25:00', '2025-08-12 15:25:00'),
(NULL, NULL, 5, 60000, 17, 9, '2025-09-25 10:15:00', '2025-09-25 10:15:00'),
(NULL, NULL, 2, 140000, 18, 10, '2025-10-08 12:05:00', '2025-10-08 12:05:00'),
(NULL, NULL, 3, 70000, 19, 11, '2025-11-14 17:50:00', '2025-11-14 17:50:00'), 
(NULL, NULL, 1, 150000, 20, 12, '2025-12-03 09:35:00', '2025-12-03 09:35:00');

INSERT INTO `coupons` (`code`, `description`, `discount`, `quantity`, `expire`, `storeId`, `createdAt`, `updatedAt`) VALUES
('COUPON12', 'Discount 12%', 12000, 50, '2026-01-15 10:00:00', 'STORE1766314663632', '2025-01-10 09:00:00', '2025-01-10 09:00:00'),
('COUPON13', 'Discount 13%', 13000, 60, '2026-02-20 11:30:00', 'STORE1766314663632', '2025-02-15 10:30:00', '2025-02-15 10:30:00'),
('COUPON14', 'Discount 14%', 14000, 70, '2026-03-10 09:45:00', 'STORE1766314663632', '2025-03-20 11:45:00', '2025-03-20 11:45:00'),
('COUPON15', 'Discount 15%', 15000, 80, '2026-04-05 14:20:00', 'STORE1766314663632', '2025-04-05 13:15:00', '2025-04-05 13:15:00'),
('COUPON16', 'Discount 16%', 16000, 90, '2026-05-18 16:10:00', 'STORE1766314663632', '2025-05-10 14:50:00', '2025-05-10 14:50:00'),
('COUPON17', 'Discount 17%', 17000, 100, '2026-06-22 08:55:00', 'STORE1766314663632', '2025-06-15 16:20:00', '2025-06-15 16:20:00'),
('COUPON18', 'Discount 18%', 18000, 110, '2026-07-30 13:40:00', 'STORE1766314663632', '2025-07-20 09:35:00', '2025-07-20 09:35:00'),
('COUPON19', 'Discount 19%', 19000, 120, '2026-08-12 15:25:00', 'STORE1766314663632', '2025-08-25 11:10:00', '2025-08-25 11:10:00'),
('COUPON20', 'Discount 20%', 20000, 130, '2026-09-25 10:15:00', 'STORE1766314663632', '2025-09-30 12:45:00', '2025-09-30 12:45:00'),
('COUPON21', 'Discount 21%', 21000, 140, '2026-10-08 12:05:00', 'STORE1766314663632', '2025-10-05 14:20:00', '2025-10-05 14:20:00'),
('COUPON22', 'Discount 22%', 22000, 150, '2026-11-14 17:50:00', 'STORE1766314663632', '2025-11-10 15:55:00', '2025-11-10 15:55:00'),
('COUPON23', 'Discount 23%', 23000, 160, '2026-12-03 09:35:00', 'STORE1766314663632', '2025-12-15 17:30:00', '2025-12-15 17:30:00'),
('COUPON24', 'Discount 24%', 24000, 170, '2026-01-28 11:20:00', 'STORE1766314663632', '2025-01-20 09:05:00', '2025-01-20 09:05:00'),
('COUPON25', 'Discount 25%', 25000, 180, '2026-02-15 14:45:00', 'STORE1766314663632', '2025-02-25 10:40:00', '2025-02-25 10:40:00'),
('COUPON26', 'Discount 26%', 26000, 190, '2026-03-22 16:30:00', 'STORE1766314663632', '2025-03-30 12:15:00', '2025-03-30 12:15:00'),
('COUPON27', 'Discount 27%', 27000, 200, '2026-04-10 08:10:00', 'STORE1766314663632', '2025-04-05 13:50:00', '2025-04-05 13:50:00'),
('COUPON28', 'Discount 28%', 28000, 210, '2026-05-05 13:55:00', 'STORE1766314663632', '2025-05-10 15:25:00', '2025-05-10 15:25:00'),
('COUPON29', 'Discount 29%', 29000, 220, '2026-06-18 15:40:00', 'STORE1766314663632', '2025-06-15 16:00:00', '2025-06-15 16:00:00'),
('COUPON30', 'Discount 30%', 30000, 230, '2026-07-25 10:25:00', 'STORE1766314663632', '2025-07-20 17:35:00', '2025-07-20 17:35:00');