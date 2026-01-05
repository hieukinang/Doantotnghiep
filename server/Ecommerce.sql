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
INSERT INTO `categories` VALUES (1,'son dior addict glow màu 004','category-ADMIN1766313158298-1766316079501.jpeg',NULL,'2025-12-21 11:21:19','2025-12-21 11:21:19'),(2,'quần áo','category-ADMIN1766313158298-1766316226407.jpeg',NULL,'2025-12-21 11:23:46','2025-12-21 11:23:46');
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
INSERT INTO `clients` VALUES ('CLIENT1766314602202','0946861622','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','hieu@gmail.com','0946861622',NULL,NULL,0,'NORMAL','ACTIVE',1,'default-client.jpg',NULL,NULL,NULL,11157000,0,'2025-12-21 10:56:42','2025-12-21 10:56:42','2025-12-28 14:02:24'),('CLIENT1766565280058','0000000000','$2b$12$h6NRrwNo788HzRT5smnk2.maCjgvByCYoZOMS3bEIBJTIGwaNc6fu','demo@gmail.com','___temp___',NULL,NULL,0,'NORMAL','ACTIVE',NULL,'default-client.jpg',NULL,NULL,NULL,0,0,'2025-12-24 08:34:40','2025-12-24 08:34:40','2025-12-24 08:34:40'),('CLIENT1766565284186','0112233445','$2b$12$f4ujgLl9eji16zs5PAae0.LbpbjhtXQCgmD.JKFVYUo/rabj5pCWm','temp@gmail.com','___temp___',NULL,NULL,0,'NORMAL','ACTIVE',NULL,'default-client.jpg',NULL,NULL,NULL,0,0,'2025-12-24 08:34:44','2025-12-24 08:34:44','2025-12-24 08:34:44'),('CLIENT1766565306888','0011223344','$2b$12$nVjLVH/1iF3K6NFdQRsPs.OgpiFPf..1JLgvfTv8UIxd1um0yIdhC','demoacc@gmail.com','demo user',NULL,NULL,0,'NORMAL','ACTIVE',3,'Client-CLIENT1766565306888.jpeg','MB','123123123','demo user',10741200,0,'2025-12-24 08:35:07','2025-12-24 08:35:06','2025-12-28 14:14:22');
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
INSERT INTO `product_variants` VALUES (1,12312,8,1,'2025-12-21 11:25:03','2025-12-22 12:11:44'),(2,12312,12,1,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(3,123123,22,1,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(4,123131,33,1,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(5,23423,15,2,'2025-12-22 06:02:06','2025-12-22 13:05:58'),(6,324234,2323,2,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(7,2342420,2323,2,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(8,23424,2323,2,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(9,1212,21212,3,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(10,121212,1212,3,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(11,100000,120,4,'2025-12-24 08:04:38','2025-12-28 11:02:06'),(12,120000,111,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(13,150000,211,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(14,140000,21,4,'2025-12-24 08:04:39','2025-12-24 08:04:39');
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
INSERT INTO `products` VALUES (1,'123213','ewqrqwerqwerqwerqwerqwerqwerqwerqwerqwerqwe',NULL,0,0,12312,0,0,'product-STORE1766314663632-1766316274051-main.jpeg','ACTIVE',2,'STORE1766314663632','2025-12-21 11:24:34','2025-12-21 11:58:00'),(2,'checkj','13231231313123131231231231231231231231231231231231','1213',0,0,23423,5,2,'product-STORE1766314663632-1766383317745-main.jpeg','ACTIVE',2,'STORE1766314663632','2025-12-22 06:01:57','2025-12-22 13:05:50'),(3,'vdvdfs','sdfsdfadfadsfasfasfafasfasdfadsfasdfa','sfdfsfsdf',0,0,1212,0,0,'product-STORE1766314663632-1766490612375-main.jpeg','ACTIVE',2,'STORE1766314663632','2025-12-23 11:50:12','2025-12-23 11:50:20'),(4,'áo thun nam','Áo đẹp, ngon, bổ , rẻ. Ai mặc cũng đẹp. demo demo','việt nam',0,0,100000,0,0,'product-STORE1766314663632-1766563446216-main.jpeg','ACTIVE',2,'STORE1766314663632','2025-12-24 08:04:06','2025-12-24 08:04:43');
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
INSERT INTO `shippers` VALUES ('SHIPPER1766315105177','036181538154','citizen_id-036181538154.jpeg','vehicle-036181538154.jpeg','profile-036181538154.jpeg','health-036181538154.jpeg','Hieu@gmail.com','0123456789','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Hiếu','ACTIVE',0,'motorcycle','B21-29163',0,0,'TP. Hồ Chí Minh','Hehe',986964,'Mb','13456678','Hiếu',0,'2025-12-21 11:05:05','2025-12-22 12:42:27'),('SHIPPER1766408019380','027452815382','citizen_id-027452815382.jpeg','vehicle-027452815382.jpeg','profile-027452815382.jpeg','health-027452815382.jpeg','Check@gmail.com','1234567890','$2b$12$V4WR0.MkVdkDcOBvVSffauRtdn8WYfMfm8ctkRPItNpQmQbxi7miy','Check','ACTIVE',0,'motorcycle','Gv717272',0,0,'Cần Thơ','Hdgd',1039000,'1019272','1518484','16vhsjs',0,'2025-12-22 12:53:39','2025-12-24 10:17:55');
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
INSERT INTO `stores` VALUES ('STORE1766314663632','037203002473','citizen_id-037203002473.jpeg','xxx','0946861622','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','hieu@gmail.com','MB','10122003','Hioeus',0,206535,0,'ACTIVE',0,5543,'hẹ hẹ','qzfgsdfg','0946861622',0,'avatar-037203002473.jpeg','sdfgsdfgdfsgsdfgsdf',0,'2025-12-21 10:57:43','2025-12-21 10:57:43','2025-12-24 10:17:55');
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
