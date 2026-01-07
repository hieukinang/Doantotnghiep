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
INSERT INTO `addresses` VALUES (1,'Hà Nội','Mỗ lao','10 Trần phú','CLIENT1766314602202','2025-12-22 06:03:19','2025-12-22 06:03:19'),(3,'Hà Nội','Hà Đông','Học viện Công nghệ Bưu chính Viễn thông','CLIENT1766565306888','2025-12-24 08:38:50','2026-01-05 16:38:15');
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
INSERT INTO `admins` VALUES ('ADMIN018','admin18','$2b$12$hashedpass18','admin18@example.com','0123456798','Admin Eighteen','staff','Staff','2025-06-01',1900000,140000,'Address18',1,'admin18.jpg','Bank18','Acc18','Holder18',NULL,'2025-01-05 10:00:00','2025-01-05 10:00:00'),('ADMIN019','admin19','$2b$12$hashedpass19','admin19@example.com','0123456799','Admin Nineteen','manager','Manager','2025-07-01',2000000,150000,'Address19',1,'admin19.jpg','Bank19','Acc19','Holder19',NULL,'2025-01-15 11:30:00','2025-01-15 11:30:00'),('ADMIN020','admin20','$2b$12$hashedpass20','admin20@example.com','0123456800','Admin Twenty','staff','Staff','2025-08-01',2100000,160000,'Address20',1,'admin20.jpg','Bank20','Acc20','Holder20',NULL,'2025-01-25 09:45:00','2025-01-25 09:45:00'),('ADMIN021','admin21','$2b$12$hashedpass21','admin21@example.com','0123456801','Admin Twenty One','manager','Manager','2025-09-01',2200000,170000,'Address21',1,'admin21.jpg','Bank21','Acc21','Holder21',NULL,'2025-02-05 14:20:00','2025-02-05 14:20:00'),('ADMIN022','admin22','$2b$12$hashedpass22','admin22@example.com','0123456802','Admin Twenty Two','staff','Staff','2025-10-01',2300000,180000,'Address22',1,'admin22.jpg','Bank22','Acc22','Holder22',NULL,'2025-02-15 16:10:00','2025-02-15 16:10:00'),('ADMIN023','admin23','$2b$12$hashedpass23','admin23@example.com','0123456803','Admin Twenty Three','manager','Manager','2025-11-01',2400000,190000,'Address23',1,'admin23.jpg','Bank23','Acc23','Holder23',NULL,'2025-02-25 08:55:00','2025-02-25 08:55:00'),('ADMIN024','admin24','$2b$12$hashedpass24','admin24@example.com','0123456804','Admin Twenty Four','staff','Staff','2025-12-01',2500000,200000,'Address24',1,'admin24.jpg','Bank24','Acc24','Holder24',NULL,'2025-03-05 13:40:00','2025-03-05 13:40:00'),('ADMIN025','admin25','$2b$12$hashedpass25','admin25@example.com','0123456805','Admin Twenty Five','manager','Manager','2025-01-15',2600000,210000,'Address25',1,'admin25.jpg','Bank25','Acc25','Holder25',NULL,'2025-03-15 15:25:00','2025-03-15 15:25:00'),('ADMIN026','admin26','$2b$12$hashedpass26','admin26@example.com','0123456806','Admin Twenty Six','staff','Staff','2025-02-15',2700000,220000,'Address26',1,'admin26.jpg','Bank26','Acc26','Holder26',NULL,'2025-03-25 10:15:00','2025-03-25 10:15:00'),('ADMIN027','admin27','$2b$12$hashedpass27','admin27@example.com','0123456807','Admin Twenty Seven','manager','Manager','2025-03-15',2800000,230000,'Address27',1,'admin27.jpg','Bank27','Acc27','Holder27',NULL,'2025-04-05 12:05:00','2025-04-05 12:05:00'),('ADMIN028','admin28','$2b$12$hashedpass28','admin28@example.com','0123456808','Admin Twenty Eight','staff','Staff','2025-04-15',2900000,240000,'Address28',1,'admin28.jpg','Bank28','Acc28','Holder28',NULL,'2025-04-15 17:50:00','2025-04-15 17:50:00'),('ADMIN029','admin29','$2b$12$hashedpass29','admin29@example.com','0123456809','Admin Twenty Nine','manager','Manager','2025-05-15',3000000,250000,'Address29',1,'admin29.jpg','Bank29','Acc29','Holder29',NULL,'2025-04-25 09:35:00','2025-04-25 09:35:00'),('ADMIN030','admin30','$2b$12$hashedpass30','admin30@example.com','0123456810','Admin Thirty','staff','Staff','2025-06-15',3100000,260000,'Address30',1,'admin30.jpg','Bank30','Acc30','Holder30',NULL,'2025-05-05 11:20:00','2025-05-05 11:20:00'),('ADMIN031','admin31','$2b$12$hashedpass31','admin31@example.com','0123456811','Admin Thirty One','manager','Manager','2025-07-15',3200000,270000,'Address31',1,'admin31.jpg','Bank31','Acc31','Holder31',NULL,'2025-05-15 14:45:00','2025-05-15 14:45:00'),('ADMIN032','admin32','$2b$12$hashedpass32','admin32@example.com','0123456812','Admin Thirty Two','staff','Staff','2025-08-15',3300000,280000,'Address32',1,'admin32.jpg','Bank32','Acc32','Holder32',NULL,'2025-05-25 16:30:00','2025-05-25 16:30:00'),('ADMIN033','admin33','$2b$12$hashedpass33','admin33@example.com','0123456813','Admin Thirty Three','manager','Manager','2025-09-15',3400000,290000,'Address33',1,'admin33.jpg','Bank33','Acc33','Holder33',NULL,'2025-06-05 08:10:00','2025-06-05 08:10:00'),('ADMIN034','admin34','$2b$12$hashedpass34','admin34@example.com','0123456814','Admin Thirty Four','staff','Staff','2025-10-15',3500000,300000,'Address34',1,'admin34.jpg','Bank34','Acc34','Holder34',NULL,'2025-06-15 13:55:00','2025-06-15 13:55:00'),('ADMIN035','admin35','$2b$12$hashedpass35','admin35@example.com','0123456815','Admin Thirty Five','manager','Manager','2025-11-15',3600000,310000,'Address35',1,'admin35.jpg','Bank35','Acc35','Holder35',NULL,'2025-06-25 15:40:00','2025-06-25 15:40:00'),('ADMIN036','admin36','$2b$12$hashedpass36','admin36@example.com','0123456816','Admin Thirty Six','staff','Staff','2025-12-15',3700000,320000,'Address36',1,'admin36.jpg','Bank36','Acc36','Holder36',NULL,'2025-07-05 10:25:00','2025-07-05 10:25:00'),('ADMIN037','admin37','$2b$12$hashedpass37','admin37@example.com','0123456817','Admin Thirty Seven','manager','Manager','2025-01-20',3800000,330000,'Address37',1,'admin37.jpg','Bank37','Acc37','Holder37',NULL,'2025-07-15 12:00:00','2025-07-15 12:00:00'),('ADMIN038','admin38','$2b$12$hashedpass38','admin38@example.com','0123456818','Admin Thirty Eight','staff','Staff','2025-02-20',3900000,340000,'Address38',1,'admin38.jpg','Bank38','Acc38','Holder38',NULL,'2025-07-25 13:35:00','2025-07-25 13:35:00'),('ADMIN039','admin39','$2b$12$hashedpass39','admin39@example.com','0123456819','Admin Thirty Nine','manager','Manager','2025-03-20',4000000,350000,'Address39',1,'admin39.jpg','Bank39','Acc39','Holder39',NULL,'2025-08-05 15:10:00','2025-08-05 15:10:00'),('ADMIN040','admin40','$2b$12$hashedpass40','admin40@example.com','0123456820','Admin Forty','staff','Staff','2025-04-20',4100000,360000,'Address40',1,'admin40.jpg','Bank40','Acc40','Holder40',NULL,'2025-08-15 16:45:00','2025-08-15 16:45:00'),('ADMIN041','admin41','$2b$12$hashedpass41','admin41@example.com','0123456821','Admin Forty One','manager','Manager','2025-05-20',4200000,370000,'Address41',1,'admin41.jpg','Bank41','Acc41','Holder41',NULL,'2025-08-25 09:20:00','2025-08-25 09:20:00'),('ADMIN042','admin42','$2b$12$hashedpass42','admin42@example.com','0123456822','Admin Forty Two','staff','Staff','2025-06-20',4300000,380000,'Address42',1,'admin42.jpg','Bank42','Acc42','Holder42',NULL,'2025-09-05 10:55:00','2025-09-05 10:55:00'),('ADMIN043','admin43','$2b$12$hashedpass43','admin43@example.com','0123456823','Admin Forty Three','manager','Manager','2025-07-20',4400000,390000,'Address43',1,'admin43.jpg','Bank43','Acc43','Holder43',NULL,'2025-09-15 12:30:00','2025-09-15 12:30:00'),('ADMIN044','admin44','$2b$12$hashedpass44','admin44@example.com','0123456824','Admin Forty Four','staff','Staff','2025-08-20',4500000,400000,'Address44',1,'admin44.jpg','Bank44','Acc44','Holder44',NULL,'2025-09-25 14:05:00','2025-09-25 14:05:00'),('ADMIN045','admin45','$2b$12$hashedpass45','admin45@example.com','0123456825','Admin Forty Five','manager','Manager','2025-09-20',4600000,410000,'Address45',1,'admin45.jpg','Bank45','Acc45','Holder45',NULL,'2025-10-05 15:40:00','2025-10-05 15:40:00'),('ADMIN046','admin46','$2b$12$hashedpass46','admin46@example.com','0123456826','Admin Forty Six','staff','Staff','2025-10-20',4700000,420000,'Address46',1,'admin46.jpg','Bank46','Acc46','Holder46',NULL,'2025-10-15 17:15:00','2025-10-15 17:15:00'),('ADMIN047','admin47','$2b$12$hashedpass47','admin47@example.com','0123456827','Admin Forty Seven','manager','Manager','2025-11-20',4800000,430000,'Address47',1,'admin47.jpg','Bank47','Acc47','Holder47',NULL,'2025-10-25 09:50:00','2025-10-25 09:50:00'),('ADMIN048','admin48','$2b$12$hashedpass48','admin48@example.com','0123456828','Admin Forty Eight','staff','Staff','2025-12-20',4900000,440000,'Address48',1,'admin48.jpg','Bank48','Acc48','Holder48',NULL,'2025-11-05 11:25:00','2025-11-05 11:25:00'),('ADMIN049','admin49','$2b$12$hashedpass49','admin49@example.com','0123456829','Admin Forty Nine','manager','Manager','2025-01-25',5000000,450000,'Address49',1,'admin49.jpg','Bank49','Acc49','Holder49',NULL,'2025-11-15 13:00:00','2025-11-15 13:00:00'),('ADMIN050','admin50','$2b$12$hashedpass50','admin50@example.com','0123456830','Admin Fifty','staff','Staff','2025-02-25',5100000,460000,'Address50',1,'admin50.jpg','Bank50','Acc50','Holder50',NULL,'2025-11-25 14:35:00','2025-11-25 14:35:00'),('ADMIN051','admin51','$2b$12$hashedpass51','admin51@example.com','0123456831','Admin Fifty One','manager','Manager','2025-03-25',5200000,470000,'Address51',1,'admin51.jpg','Bank51','Acc51','Holder51',NULL,'2025-12-05 16:10:00','2025-12-05 16:10:00'),('ADMIN052','admin52','$2b$12$hashedpass52','admin52@example.com','0123456832','Admin Fifty Two','staff','Staff','2025-04-25',5300000,480000,'Address52',1,'admin52.jpg','Bank52','Acc52','Holder52',NULL,'2025-12-15 09:45:00','2025-12-15 09:45:00'),('ADMIN053','admin53','$2b$12$hashedpass53','admin53@example.com','0123456833','Admin Fifty Three','manager','Manager','2025-05-25',5400000,490000,'Address53',1,'admin53.jpg','Bank53','Acc53','Holder53',NULL,'2025-12-25 11:20:00','2025-12-25 11:20:00'),('ADMIN054','admin54','$2b$12$hashedpass54','admin54@example.com','0123456834','Admin Fifty Four','staff','Staff','2025-06-25',5500000,500000,'Address54',1,'admin54.jpg','Bank54','Acc54','Holder54',NULL,'2026-01-01 13:00:00','2026-01-01 13:00:00'),('ADMIN055','admin55','$2b$12$hashedpass55','admin55@example.com','0123456835','Admin Fifty Five','manager','Manager','2025-07-25',5600000,510000,'Address55',1,'admin55.jpg','Bank55','Acc55','Holder55',NULL,'2026-01-02 14:30:00','2026-01-02 14:30:00'),('ADMIN056','admin56','$2b$12$hashedpass56','admin56@example.com','0123456836','Admin Fifty Six','staff','Staff','2025-08-25',5700000,520000,'Address56',1,'admin56.jpg','Bank56','Acc56','Holder56',NULL,'2026-01-03 16:00:00','2026-01-03 16:00:00'),('ADMIN057','admin57','$2b$12$hashedpass57','admin57@example.com','0123456837','Admin Fifty Seven','manager','Manager','2025-09-25',5800000,530000,'Address57',1,'admin57.jpg','Bank57','Acc57','Holder57',NULL,'2025-01-10 09:15:00','2025-01-10 09:15:00'),('ADMIN058','admin58','$2b$12$hashedpass58','admin58@example.com','0123456838','Admin Fifty Eight','staff','Staff','2025-10-25',5900000,540000,'Address58',1,'admin58.jpg','Bank58','Acc58','Holder58',NULL,'2025-01-20 10:45:00','2025-01-20 10:45:00'),('ADMIN059','admin59','$2b$12$hashedpass59','admin59@example.com','0123456839','Admin Fifty Nine','manager','Manager','2025-11-25',6000000,550000,'Address59',1,'admin59.jpg','Bank59','Acc59','Holder59',NULL,'2025-01-30 12:15:00','2025-01-30 12:15:00'),('ADMIN060','admin60','$2b$12$hashedpass60','admin60@example.com','0123456840','Admin Sixty','staff','Staff','2025-12-25',6100000,560000,'Address60',1,'admin60.jpg','Bank60','Acc60','Holder60',NULL,'2025-02-10 13:45:00','2025-02-10 13:45:00'),('ADMIN061','admin61','$2b$12$hashedpass61','admin61@example.com','0123456841','Admin Sixty One','manager','Manager','2025-01-30',6200000,570000,'Address61',1,'admin61.jpg','Bank61','Acc61','Holder61',NULL,'2025-02-20 15:15:00','2025-02-20 15:15:00'),('ADMIN062','admin62','$2b$12$hashedpass62','admin62@example.com','0123456842','Admin Sixty Two','staff','Staff','2025-02-28',6300000,580000,'Address62',1,'admin62.jpg','Bank62','Acc62','Holder62',NULL,'2025-03-10 16:45:00','2025-03-10 16:45:00'),('ADMIN063','admin63','$2b$12$hashedpass63','admin63@example.com','0123456843','Admin Sixty Three','manager','Manager','2025-03-30',6400000,590000,'Address63',1,'admin63.jpg','Bank63','Acc63','Holder63',NULL,'2025-03-20 09:30:00','2025-03-20 09:30:00'),('ADMIN064','admin64','$2b$12$hashedpass64','admin64@example.com','0123456844','Admin Sixty Four','staff','Staff','2025-04-30',6500000,600000,'Address64',1,'admin64.jpg','Bank64','Acc64','Holder64',NULL,'2025-03-30 11:00:00','2025-03-30 11:00:00'),('ADMIN065','admin65','$2b$12$hashedpass65','admin65@example.com','0123456845','Admin Sixty Five','manager','Manager','2025-05-30',6600000,610000,'Address65',1,'admin65.jpg','Bank65','Acc65','Holder65',NULL,'2025-04-10 12:30:00','2025-04-10 12:30:00'),('ADMIN066','admin66','$2b$12$hashedpass66','admin66@example.com','0123456846','Admin Sixty Six','staff','Staff','2025-06-30',6700000,620000,'Address66',1,'admin66.jpg','Bank66','Acc66','Holder66',NULL,'2025-04-20 14:00:00','2025-04-20 14:00:00'),('ADMIN067','admin67','$2b$12$hashedpass67','admin67@example.com','0123456847','Admin Sixty Seven','manager','Manager','2025-07-30',6800000,630000,'Address67',1,'admin67.jpg','Bank67','Acc67','Holder67',NULL,'2025-04-30 15:30:00','2025-04-30 15:30:00'),('ADMIN068','admin68','$2b$12$hashedpass68','admin68@example.com','0123456848','Admin Sixty Eight','staff','Staff','2025-08-30',6900000,640000,'Address68',1,'admin68.jpg','Bank68','Acc68','Holder68',NULL,'2025-05-10 17:00:00','2025-05-10 17:00:00'),('ADMIN1766313158298','0123456789','$2b$12$9YozhzyFvb5IxW4p4kyiNeNYbLqHX8SHEfqBt8CdpIN1zFjYIpyRq','manager@admin.com',NULL,NULL,'manager',NULL,NULL,NULL,0,NULL,1,'default-admin.jpg',NULL,NULL,NULL,NULL,'2025-12-21 10:32:38','2025-12-21 10:32:38'),('ADMIN1766318074075','TriDM24','$2b$12$7r5j8zJD.59suGzL7aJw8ut52O5fJCY/IctJoetKuAa95jQibO8ZC','hieu@gmail.com','0946861622','dinh Hiếu','manager','hehehe','2025-12-24',121221212,0,'qưerqwer',1,'Admin-ADMIN1766313158298.jpeg','1212','1212121','21121','2025-12-21 11:54:34','2025-12-21 11:54:34','2025-12-21 11:54:34'),('ADMIN1766490502023','xxx123','$2b$12$Ml/YYVTr7BTGA.a/5KnbO.cpzGd7sTmcPf2pOFD66IfW6RJYSigAy','hieu1@gmail.com','0946861621','dinh Hiếu','staff','xzgsdf','2025-12-03',1231231231,0,'qưerqwer',1,'Admin-ADMIN1766313158298.jpeg','MB','10122003','Hioeus','2025-12-23 11:48:22','2025-12-23 11:48:22','2025-12-23 11:48:22');
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
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES (1,'123',1,'2025-12-21 11:21:19','2025-12-21 11:21:19'),(2,'122',1,'2025-12-21 11:21:19','2025-12-21 11:21:19'),(3,'11',1,'2025-12-21 11:21:19','2025-12-21 11:21:19'),(4,'12',2,'2025-12-21 11:23:46','2025-12-21 11:23:46'),(5,'11',2,'2025-12-21 11:23:46','2025-12-21 11:23:46'),(6,'124',2,'2025-12-21 11:23:46','2025-12-21 11:23:46'),(7,'Dung lượng',1,'2025-08-05 10:00:00','2025-08-05 10:00:00'),(8,'Màu sắc',1,'2025-08-05 10:00:00','2025-08-05 10:00:00'),(9,'RAM',1,'2025-08-05 10:00:00','2025-08-05 10:00:00'),(10,'RAM',2,'2025-08-10 11:30:00','2025-08-10 11:30:00'),(11,'Ổ cứng',2,'2025-08-10 11:30:00','2025-08-10 11:30:00'),(12,'Màu sắc',2,'2025-08-10 11:30:00','2025-08-10 11:30:00'),(13,'Kích thước',3,'2025-08-15 14:20:00','2025-08-15 14:20:00'),(14,'Độ phân giải',3,'2025-08-15 14:20:00','2025-08-15 14:20:00'),(15,'Công nghệ',3,'2025-08-15 14:20:00','2025-08-15 14:20:00'),(16,'Size',4,'2025-08-20 09:45:00','2025-08-20 09:45:00'),(17,'Màu sắc',4,'2025-08-20 09:45:00','2025-08-20 09:45:00'),(18,'Chất liệu',4,'2025-08-20 09:45:00','2025-08-20 09:45:00'),(19,'Size',5,'2025-08-25 16:10:00','2025-08-25 16:10:00'),(20,'Màu sắc',5,'2025-08-25 16:10:00','2025-08-25 16:10:00'),(21,'Chất liệu',5,'2025-08-25 16:10:00','2025-08-25 16:10:00'),(22,'Size',6,'2025-09-03 08:30:00','2025-09-03 08:30:00'),(23,'Màu sắc',6,'2025-09-03 08:30:00','2025-09-03 08:30:00'),(24,'Chất liệu',6,'2025-09-03 08:30:00','2025-09-03 08:30:00'),(25,'Dung tích',7,'2025-09-10 13:15:00','2025-09-10 13:15:00'),(26,'Màu sắc',7,'2025-09-10 13:15:00','2025-09-10 13:15:00'),(27,'Công suất',7,'2025-09-10 13:15:00','2025-09-10 13:15:00'),(28,'Kích thước',8,'2025-09-18 15:40:00','2025-09-18 15:40:00'),(29,'Màu sắc',8,'2025-09-18 15:40:00','2025-09-18 15:40:00'),(30,'Chất liệu',8,'2025-09-18 15:40:00','2025-09-18 15:40:00'),(31,'Màu sắc',9,'2025-09-25 10:55:00','2025-09-25 10:55:00'),(32,'Loại kết nối',9,'2025-09-25 10:55:00','2025-09-25 10:55:00'),(33,'Phiên bản',9,'2025-09-25 10:55:00','2025-09-25 10:55:00'),(34,'Ngôn ngữ',10,'2025-10-02 12:25:00','2025-10-02 12:25:00'),(35,'Loại bìa',10,'2025-10-02 12:25:00','2025-10-02 12:25:00'),(36,'Số trang',10,'2025-10-02 12:25:00','2025-10-02 12:25:00'),(37,'Phân khối',11,'2025-10-05 09:00:00','2025-10-05 09:00:00'),(38,'Màu sắc',11,'2025-10-05 09:00:00','2025-10-05 09:00:00'),(39,'Loại xe',11,'2025-10-05 09:00:00','2025-10-05 09:00:00'),(40,'Size',12,'2025-10-08 10:30:00','2025-10-08 10:30:00'),(41,'Màu sắc',12,'2025-10-08 10:30:00','2025-10-08 10:30:00'),(42,'Thương hiệu',12,'2025-10-08 10:30:00','2025-10-08 10:30:00'),(43,'Dung tích',13,'2025-10-12 11:45:00','2025-10-12 11:45:00'),(44,'Loại da',13,'2025-10-12 11:45:00','2025-10-12 11:45:00'),(45,'Xuất xứ',13,'2025-10-12 11:45:00','2025-10-12 11:45:00'),(46,'Size',14,'2025-10-15 14:00:00','2025-10-15 14:00:00'),(47,'Màu sắc',14,'2025-10-15 14:00:00','2025-10-15 14:00:00'),(48,'Độ tuổi',14,'2025-10-15 14:00:00','2025-10-15 14:00:00'),(49,'Khối lượng',15,'2025-10-18 15:30:00','2025-10-18 15:30:00'),(50,'Hạn sử dụng',15,'2025-10-18 15:30:00','2025-10-18 15:30:00'),(51,'Xuất xứ',15,'2025-10-18 15:30:00','2025-10-18 15:30:00'),(52,'Size',16,'2025-10-22 08:15:00','2025-10-22 08:15:00'),(53,'Màu sắc',16,'2025-10-22 08:15:00','2025-10-22 08:15:00'),(54,'Chất liệu',16,'2025-10-22 08:15:00','2025-10-22 08:15:00'),(55,'Loại máy',17,'2025-10-25 09:45:00','2025-10-25 09:45:00'),(56,'Màu sắc',17,'2025-10-25 09:45:00','2025-10-25 09:45:00'),(57,'Chất liệu dây',17,'2025-10-25 09:45:00','2025-10-25 09:45:00'),(58,'Kích thước',18,'2025-10-28 11:00:00','2025-10-28 11:00:00'),(59,'Màu sắc',18,'2025-10-28 11:00:00','2025-10-28 11:00:00'),(60,'Chất liệu',18,'2025-10-28 11:00:00','2025-10-28 11:00:00'),(61,'Độ phân giải',19,'2025-11-01 13:20:00','2025-11-01 13:20:00'),(62,'Màu sắc',19,'2025-11-01 13:20:00','2025-11-01 13:20:00'),(63,'Loại ống kính',19,'2025-11-01 13:20:00','2025-11-01 13:20:00'),(64,'Loại bút',20,'2025-11-05 14:50:00','2025-11-05 14:50:00'),(65,'Màu mực',20,'2025-11-05 14:50:00','2025-11-05 14:50:00'),(66,'Thương hiệu',20,'2025-11-05 14:50:00','2025-11-05 14:50:00');
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
INSERT INTO `cart` VALUES (1,0,'CLIENT1766314602202','2025-12-22 06:02:44','2026-01-05 16:06:05'),(2,0,'CLIENT1766565306888','2025-12-29 08:25:32','2026-01-06 16:33:18');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Điện thoại di động','dienthoai1.png',1,'2025-08-05 10:00:00','2025-08-05 10:00:00'),(2,'Laptop','laptop1.png',1,'2025-08-10 11:30:00','2025-08-10 11:30:00'),(3,'Tivi','tivi1.png',1,'2025-08-15 14:20:00','2025-08-15 14:20:00'),(4,'Thời trang nam','thoitrangnam1.png',2,'2025-08-20 09:45:00','2025-08-20 09:45:00'),(5,'Thời trang nữ','thoitrangnu1.png',2,'2025-08-25 16:10:00','2025-08-25 16:10:00'),(6,'Giày dép','giaydepnam1.png',2,'2025-09-03 08:30:00','2025-09-03 08:30:00'),(7,'Đồ gia dụng','giadung1.png',3,'2025-09-10 13:15:00','2025-09-10 13:15:00'),(8,'Nội thất','banghe1.png',3,'2025-09-18 15:40:00','2025-09-18 15:40:00'),(9,'Phụ kiện điện tử','phukien1.png',1,'2025-09-25 10:55:00','2025-09-25 10:55:00'),(10,'Sách vở','sachvo1.png',4,'2025-10-02 12:25:00','2025-10-02 12:25:00'),(11,'Xe máy','xe1.png',5,'2025-10-05 09:00:00','2025-10-05 09:00:00'),(12,'Đồ thể thao','thethao1.png',6,'2025-10-08 10:30:00','2025-10-08 10:30:00'),(13,'Mỹ phẩm','thethao1.png',7,'2025-10-12 11:45:00','2025-10-12 11:45:00'),(14,'Đồ trẻ em','treem1.png',8,'2025-10-15 14:00:00','2025-10-15 14:00:00'),(15,'Thực phẩm khô','doan1.png',9,'2025-10-18 15:30:00','2025-10-18 15:30:00'),(16,'Túi xách','tuixach1.png',2,'2025-10-22 08:15:00','2025-10-22 08:15:00'),(17,'Đồng hồ','phukien1.png',2,'2025-10-25 09:45:00','2025-10-25 09:45:00'),(18,'Dụng cụ nhà bếp','dungcu1.png',3,'2025-10-28 11:00:00','2025-10-28 11:00:00'),(19,'Máy ảnh','phukien1.png',1,'2025-11-01 13:20:00','2025-11-01 13:20:00'),(20,'Bút viết','sachvo1.png',10,'2025-11-05 14:50:00','2025-11-05 14:50:00');
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
INSERT INTO `clients` VALUES ('CLIENT1766314602202','0946861622','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','hieu@gmail.com','0946861622',NULL,NULL,0,'NORMAL','ACTIVE',1,'default-client.jpg',NULL,NULL,NULL,39865000,0,'2025-12-21 10:56:42','2025-12-21 10:56:42','2026-01-05 16:15:24'),('CLIENT1766565280058','0000000000','$2b$12$h6NRrwNo788HzRT5smnk2.maCjgvByCYoZOMS3bEIBJTIGwaNc6fu','demo@gmail.com','___temp___',NULL,NULL,0,'NORMAL','ACTIVE',NULL,'default-client.jpg',NULL,NULL,NULL,0,0,'2025-12-24 08:34:40','2025-12-24 08:34:40','2025-12-24 08:34:40'),('CLIENT1766565284186','0112233445','$2b$12$f4ujgLl9eji16zs5PAae0.LbpbjhtXQCgmD.JKFVYUo/rabj5pCWm','temp@gmail.com','___temp___',NULL,NULL,0,'NORMAL','ACTIVE',NULL,'default-client.jpg',NULL,NULL,NULL,0,0,'2025-12-24 08:34:44','2025-12-24 08:34:44','2025-12-24 08:34:44'),('CLIENT1766565306888','0011223344','$2b$12$nVjLVH/1iF3K6NFdQRsPs.OgpiFPf..1JLgvfTv8UIxd1um0yIdhC','demoacc@gmail.com','demo user',NULL,NULL,0,'NORMAL','ACTIVE',3,'Client-CLIENT1766565306888.jpeg','MB','123123123','demo user',65723000,0,'2025-12-24 08:35:07','2025-12-24 08:35:06','2026-01-06 16:21:29'),('CLIENT2025001','0901234567','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','nguyenvana@gmail.com','Nguyễn Văn An','1995-03-15','male',150,'NORMAL','ACTIVE',NULL,'default-client.jpg','Vietcombank','0123456789','Nguyen Van An',5000000,1,'2025-08-05 09:30:00','2025-08-05 09:30:00','2025-08-05 09:30:00'),('CLIENT2025002','0902345678','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','tranthib@gmail.com','Trần Thị Bình','1998-07-22','female',200,'NORMAL','ACTIVE',NULL,'default-client.jpg','Techcombank','9876543210','Tran Thi Binh',3500000,1,'2025-08-10 14:20:00','2025-08-10 14:20:00','2025-08-10 14:20:00'),('CLIENT2025003','0903456789','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','levanc@gmail.com','Lê Văn Cường','1992-11-08','male',320,'VIP','ACTIVE',NULL,'default-client.jpg','MB','1122334455','Le Van Cuong',8500000,1,'2025-08-15 10:45:00','2025-08-15 10:45:00','2025-08-15 10:45:00'),('CLIENT2025004','0904567890','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','phamthid@gmail.com','Phạm Thị Dung','2000-01-30','female',100,'NORMAL','ACTIVE',NULL,'default-client.jpg','ACB','5566778899','Pham Thi Dung',2000000,1,'2025-08-20 16:10:00','2025-08-20 16:10:00','2025-08-20 16:10:00'),('CLIENT2025005','0905678901','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','hoangvane@gmail.com','Hoàng Văn Em','1997-05-12','male',180,'NORMAL','ACTIVE',NULL,'default-client.jpg','Sacombank','6677889900','Hoang Van Em',4200000,1,'2025-08-28 08:55:00','2025-08-28 08:55:00','2025-08-28 08:55:00'),('CLIENT2025006','0906789012','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','vuthif@gmail.com','Vũ Thị Phương','1994-09-20','female',250,'VIP','ACTIVE',NULL,'default-client.jpg','VPBank','7788990011','Vu Thi Phuong',6500000,1,'2025-09-01 10:00:00','2025-09-01 10:00:00','2025-09-01 10:00:00'),('CLIENT2025007','0907890123','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','dangvang@gmail.com','Đặng Văn Giang','1990-12-05','male',400,'VIP','ACTIVE',NULL,'default-client.jpg','TPBank','8899001122','Dang Van Giang',12000000,1,'2025-09-05 11:30:00','2025-09-05 11:30:00','2025-09-05 11:30:00'),('CLIENT2025008','0908901234','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','buithih@gmail.com','Bùi Thị Hương','1999-04-18','female',120,'NORMAL','ACTIVE',NULL,'default-client.jpg','OCB','9900112233','Bui Thi Huong',2800000,1,'2025-09-10 13:45:00','2025-09-10 13:45:00','2025-09-10 13:45:00'),('CLIENT2025009','0909012345','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','ngovanh@gmail.com','Ngô Văn Hải','1996-06-25','male',160,'NORMAL','ACTIVE',NULL,'default-client.jpg','SHB','0011223344','Ngo Van Hai',3800000,1,'2025-09-15 15:00:00','2025-09-15 15:00:00','2025-09-15 15:00:00'),('CLIENT2025010','0910123456','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','dothik@gmail.com','Đỗ Thị Kim','2001-02-14','female',90,'NORMAL','ACTIVE',NULL,'default-client.jpg','Vietinbank','1122334455','Do Thi Kim',1500000,1,'2025-09-20 16:30:00','2025-09-20 16:30:00','2025-09-20 16:30:00'),('CLIENT2025011','0911234567','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','trinhvanl@gmail.com','Trịnh Văn Long','1993-08-10','male',280,'VIP','ACTIVE',NULL,'default-client.jpg','BIDV','2233445566','Trinh Van Long',7200000,1,'2025-09-25 08:15:00','2025-09-25 08:15:00','2025-09-25 08:15:00'),('CLIENT2025012','0912345678','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','lyethim@gmail.com','Lý Thị Mai','1997-11-28','female',140,'NORMAL','ACTIVE',NULL,'default-client.jpg','Agribank','3344556677','Ly Thi Mai',3200000,1,'2025-10-01 09:45:00','2025-10-01 09:45:00','2025-10-01 09:45:00'),('CLIENT2025013','0913456789','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','maivann@gmail.com','Mai Văn Nam','1988-05-05','male',500,'VIP','ACTIVE',NULL,'default-client.jpg','Vietcombank','4455667788','Mai Van Nam',15000000,1,'2025-10-05 11:00:00','2025-10-05 11:00:00','2025-10-05 11:00:00'),('CLIENT2025014','0914567890','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','caothio@gmail.com','Cao Thị Oanh','2002-09-15','female',80,'NORMAL','ACTIVE',NULL,'default-client.jpg','MB','5566778899','Cao Thi Oanh',1200000,1,'2025-10-10 14:20:00','2025-10-10 14:20:00','2025-10-10 14:20:00'),('CLIENT2025015','0915678901','$2b$12$f2WVz860Codu8/D3QU8q2O3ekQKUmVBaTLmHlh4I0fyZ5w4cbPQ1e','lamvanp@gmail.com','Lâm Văn Phúc','1991-01-22','male',220,'NORMAL','ACTIVE',NULL,'default-client.jpg','Techcombank','6677889900','Lam Van Phuc',5500000,1,'2025-10-15 16:00:00','2025-10-15 16:00:00','2025-10-15 16:00:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'adsfdas','12312',31233,1200,'2026-01-16 11:15:00',NULL,'2025-12-21 11:20:18','2026-01-05 17:14:20'),(2,'adsfdasqưerqwe','qưerqwerqwe',121231,111,'2026-01-01 17:00:00','STORE1766314663632','2025-12-21 12:06:07','2025-12-21 12:06:07'),(3,'ewqr','qưerqwer',1234123,213,'2025-12-25 17:00:00','STORE1766314663632','2025-12-21 12:08:25','2025-12-21 12:08:25'),(4,'sádfadsfa','qăer',12313,12,'2026-01-02 17:00:00','STORE1766314663632','2025-12-21 12:08:39','2025-12-21 12:08:39'),(6,'sádfadsfaẳe','zdxvdf',12342,1206,'2026-01-23 17:00:00','STORE1766314663632','2025-12-21 12:09:07','2026-01-05 17:14:20'),(7,'adsfdass','12121',7,12,'2026-01-03 14:45:00',NULL,'2025-12-28 14:26:48','2025-12-28 14:26:48'),(8,'qưer','qưerqwer',1234,1234,'2026-01-01 17:00:00',NULL,'2025-12-28 14:44:51','2025-12-28 14:44:51'),(9,'sdfgsdfg','sdfgsdfg',1000,321,'2026-01-02 17:00:00',NULL,'2025-12-28 15:50:30','2025-12-28 15:50:30'),(10,'12312','123123',123123,123123,'2026-01-01 17:00:00',NULL,'2025-12-28 15:54:21','2025-12-28 15:54:21'),(11,'demo coupon','demo coupon',29999,100,'2025-12-30 17:00:00','STORE1766314663632','2025-12-28 15:56:38','2025-12-28 15:56:38'),(12,'NEWUSER2025','Giảm 10% cho khách hàng mới',10,100,'2026-06-30 23:59:59',NULL,'2025-08-01 00:00:00','2025-08-01 00:00:00'),(13,'SUMMER50K','Giảm 50.000đ đơn từ 500.000đ',50000,200,'2026-03-31 23:59:59','STORE2025001','2025-08-15 00:00:00','2025-08-15 00:00:00'),(14,'TECH20','Giảm 20% cho sản phẩm công nghệ',20,50,'2026-02-28 23:59:59','STORE2025002','2025-09-01 00:00:00','2025-09-01 00:00:00'),(15,'FREESHIP','Miễn phí vận chuyển',30000,500,'2026-12-31 23:59:59',NULL,'2025-09-15 00:00:00','2025-09-15 00:00:00'),(16,'GIADUNG100K','Giảm 100.000đ cho đồ gia dụng',100000,80,'2026-04-30 23:59:59','STORE2025003','2025-10-01 00:00:00','2025-10-01 00:00:00'),(17,'XEMAY500K','Giảm 500.000đ khi mua xe máy',500000,30,'2026-06-30 23:59:59','STORE2025006','2025-10-15 00:00:00','2025-10-15 00:00:00'),(18,'SPORT15','Giảm 15% đồ thể thao',15,100,'2026-05-31 23:59:59','STORE2025006','2025-10-20 00:00:00','2025-10-20 00:00:00'),(19,'BEAUTY30K','Giảm 30.000đ mỹ phẩm đơn từ 200.000đ',30000,150,'2026-04-30 23:59:59','STORE2025007','2025-10-25 00:00:00','2025-10-25 00:00:00'),(20,'BABY20','Giảm 20% đồ trẻ em',20,80,'2026-07-31 23:59:59','STORE2025008','2025-11-01 00:00:00','2025-11-01 00:00:00'),(21,'THUCPHAM10','Giảm 10% thực phẩm',10,200,'2026-03-31 23:59:59','STORE2025009','2025-11-05 00:00:00','2025-11-05 00:00:00'),(22,'TUIXACH100K','Giảm 100.000đ túi xách cao cấp',100000,49,'2026-05-31 23:59:59','STORE2025010','2025-11-10 00:00:00','2026-01-05 15:42:09'),(23,'DONGHO200K','Giảm 200.000đ đồng hồ chính hãng',200000,39,'2026-06-30 23:59:59',NULL,'2025-11-12 00:00:00','2026-01-05 15:42:09'),(24,'NHAHANG15','Giảm 15% dụng cụ nhà bếp',15,100,'2026-08-31 23:59:59','STORE2025003','2025-11-15 00:00:00','2025-11-15 00:00:00'),(25,'CAMERA1M','Giảm 1.000.000đ máy ảnh Sony',1000000,20,'2026-04-30 23:59:59','STORE2025002','2025-11-18 00:00:00','2025-11-18 00:00:00'),(26,'VANPHONG20K','Giảm 20.000đ văn phòng phẩm đơn từ 100.000đ',20000,300,'2026-09-30 23:59:59','STORE2025010','2025-11-20 00:00:00','2025-11-20 00:00:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,NULL,NULL,2,23423,1,5,'2025-12-22 06:05:14','2025-12-22 06:05:14'),(2,NULL,NULL,2,23423,2,5,'2025-12-22 11:56:38','2025-12-22 11:56:38'),(3,NULL,NULL,3,12312,3,1,'2025-12-22 12:04:00','2025-12-22 12:04:00'),(4,NULL,NULL,3,23423,4,5,'2025-12-22 12:07:20','2025-12-22 12:07:20'),(5,NULL,NULL,1,23423,5,5,'2025-12-22 12:13:55','2025-12-22 12:13:55'),(6,NULL,NULL,3,23423,6,5,'2025-12-22 13:03:27','2025-12-22 13:03:27'),(7,NULL,NULL,1,100000,7,11,'2025-12-24 08:46:12','2025-12-24 08:46:12'),(8,NULL,NULL,1,100000,8,11,'2025-12-28 11:02:06','2025-12-28 11:02:06'),(9,'iPhone 15 Pro Max 256GB','dienthoai1.png',1,32990000,9,15,'2025-10-20 10:00:00','2025-10-20 10:00:00'),(10,'Samsung Galaxy S24 Ultra','dienthoai2.png',1,29990000,10,17,'2025-10-25 14:30:00','2025-10-25 14:30:00'),(11,'MacBook Pro 14 M3 Pro','laptop1.png',1,52990000,11,19,'2025-11-01 09:15:00','2025-11-01 09:15:00'),(12,'Áo sơ mi nam Oxford','thoitrangnam1.png',2,450000,12,23,'2025-11-05 11:45:00','2025-11-05 11:45:00'),(13,'Giày Nike Air Max','giaydepnam1.png',1,2890000,13,27,'2025-11-10 16:20:00','2025-11-10 16:20:00'),(14,'Honda Vision 2025','xe1.png',1,37000000,14,35,'2025-11-12 08:30:00','2025-11-12 08:30:00'),(15,'Bộ đồ thể thao Adidas','thethao1.png',2,420000,15,37,'2025-11-14 10:15:00','2025-11-14 10:15:00'),(16,'Serum Vitamin C','phukien2.png',1,450000,16,39,'2025-11-15 14:45:00','2025-11-15 14:45:00'),(17,'Gạo ST25 5kg','doan1.png',1,150000,17,43,'2025-11-16 16:20:00','2025-11-16 16:20:00'),(18,'Túi xách Charles & Keith','tuixach1.png',1,1200000,18,45,'2025-11-17 09:00:00','2025-11-17 09:00:00'),(19,'Đồng hồ Casio','phukien3.png',1,2550000,19,47,'2025-11-18 11:30:00','2025-11-18 11:30:00'),(20,'Bộ nồi inox 5 chiếc','dungcu1.png',1,1850000,20,49,'2025-11-19 13:45:00','2025-11-19 13:45:00'),(21,'Máy ảnh Sony A7 IV','phukien4.png',1,44500000,21,51,'2025-11-20 15:00:00','2025-11-20 15:00:00'),(22,'Bộ quần áo trẻ em','treem1.png',3,230000,22,41,'2025-11-21 10:20:00','2025-11-21 10:20:00'),(23,'Bút bi Thiên Long hộp 10','sachvo1.png',1,35000,23,53,'2025-11-22 08:45:00','2025-11-22 08:45:00'),(24,'Nồi chiên không dầu 5.5L','giadung1.png',1,2500000,14,29,'2025-11-12 08:30:00','2025-11-12 08:30:00'),(25,'Đầm nữ dự tiệc','thoitrangnu1.png',1,890000,15,25,'2025-11-14 10:15:00','2025-11-14 10:15:00'),(26,'Tai nghe Sony WH-1000XM5','phukien1.png',1,7500000,21,33,'2025-11-20 15:00:00','2025-11-20 15:00:00'),(27,NULL,NULL,1,1590000,24,45,'2026-01-05 15:42:09','2026-01-05 15:42:09'),(28,NULL,NULL,1,20000000,25,82,'2026-01-05 16:08:44','2026-01-05 16:08:44'),(29,NULL,NULL,1,20000000,26,82,'2026-01-05 17:01:08','2026-01-05 17:01:08'),(30,NULL,NULL,1,20000000,27,82,'2026-01-05 17:05:52','2026-01-05 17:05:52'),(31,NULL,NULL,1,25000000,28,88,'2026-01-05 17:06:11','2026-01-05 17:06:11'),(32,NULL,NULL,1,21500000,29,86,'2026-01-05 17:10:46','2026-01-05 17:10:46'),(33,NULL,NULL,1,20000000,30,82,'2026-01-05 17:10:54','2026-01-05 17:10:54'),(34,NULL,NULL,1,25000000,31,88,'2026-01-05 17:14:20','2026-01-05 17:14:20'),(35,NULL,NULL,1,25000000,32,88,'2026-01-05 17:14:28','2026-01-05 17:14:28'),(36,NULL,NULL,1,20000000,33,82,'2026-01-06 16:21:29','2026-01-06 16:21:29'),(37,NULL,NULL,1,20000000,34,82,'2026-01-06 16:29:35','2026-01-06 16:29:35'),(38,NULL,NULL,1,20000000,35,82,'2026-01-06 16:29:47','2026-01-06 16:29:47'),(39,NULL,NULL,1,20000000,36,82,'2026-01-06 16:32:17','2026-01-06 16:32:17'),(40,NULL,NULL,1,42990000,37,12,'2026-01-06 16:32:17','2026-01-06 16:32:17'),(41,NULL,NULL,1,32990000,38,1,'2026-01-06 16:33:18','2026-01-06 16:33:18'),(42,NULL,NULL,1,20000000,38,82,'2026-01-06 16:33:18','2026-01-06 16:33:18');
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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'order-1-qr.jpg','wallet',15613,'2025-12-22','RETURN_CONFIRMED','10 Trần phú, Mỗ lao, Hà Nội',30000,NULL,'2025-12-22',NULL,'Order-1.jpeg','CLIENT1766314602202','SHIPPER1766315105177','STORE1766314663632',NULL,NULL,'2025-12-22 06:05:14','2025-12-22 12:58:52'),(2,'order-2-qr.jpg','cash',15613,'2025-12-22','IN_TRANSIT','10 Trần phú, Mỗ lao, Hà Nội',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766314602202','SHIPPER1766315105177','STORE1766314663632','[1]',NULL,'2025-12-22 11:56:38','2025-12-22 12:41:50'),(3,'order-3-qr.jpg','cash',5703,'2025-12-22','IN_TRANSIT','10 Trần phú, Mỗ lao, Hà Nội',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766314602202','SHIPPER1766315105177','STORE1766314663632','[1]',NULL,'2025-12-22 12:04:00','2025-12-22 12:41:53'),(4,'order-4-qr.jpg','cash',39036,'2025-12-22','RETURN_CONFIRMED','10 Trần phú, Mỗ lao, Hà Nội',18000,NULL,'2025-12-22',NULL,'Order-4.jpeg','CLIENT1766314602202','SHIPPER1766315105177','STORE1766314663632','[1]',1,'2025-12-22 12:07:20','2025-12-22 12:56:50'),(5,'order-5-qr.jpg','cash',0,'2025-12-22','DELIVERED','10 Trần phú, Mỗ lao, Hà Nội',18000,NULL,'2026-01-05',NULL,'Order-5.jpeg','CLIENT1766314602202','SHIPPER1766408019380','STORE1766314663632','[1]',1,'2025-12-22 12:13:55','2026-01-05 16:25:16'),(6,'order-6-qr.jpg','wallet',39036,'2025-12-22','RETURN_CONFIRMED','10 Trần phú, Mỗ lao, Hà Nội',18000,NULL,'2025-12-22',NULL,'Order-6.jpeg','CLIENT1766314602202','SHIPPER1766408019380','STORE1766314663632',NULL,NULL,'2025-12-22 13:03:27','2025-12-22 13:06:11'),(7,'order-7-qr.jpg','wallet',56425,'2025-12-24','CLIENT_CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Km 10, Ngõ 5 Trần Phú, Hà Đông, Hà Nội',18000,NULL,'2025-12-24',NULL,'Order-7.jpeg','CLIENT1766565306888','SHIPPER1766408019380','STORE1766314663632',NULL,NULL,'2025-12-24 08:46:12','2025-12-24 12:21:45'),(8,'order-8-qr.jpg','wallet',56425,'2025-12-28','IN_TRANSIT','Học viện Công nghệ Bưu chính Viễn thông, Km 10, Ngõ 5 Trần Phú, Hà Đông, Hà Nội',18000,NULL,'2025-12-28',NULL,'default-order.jpg','CLIENT1766565306888','SHIPPER1766408019380','STORE1766314663632',NULL,NULL,'2025-12-28 11:02:06','2026-01-05 16:26:00'),(9,'order-9-qr.jpg','wallet',33490000,'2025-10-20','DELIVERED','123 Nguyễn Huệ, Quận 1, HCM',30000,NULL,'2025-10-20','2025-10-22','Order-9.jpeg','CLIENT2025001','SHIPPER2025001','STORE2025002',NULL,NULL,'2025-10-20 10:00:00','2025-10-22 15:30:00'),(10,'order-10-qr.jpg','cash',30490000,'2025-10-25','CLIENT_CONFIRMED','456 Lê Lợi, Quận 5, HCM',30000,NULL,'2025-10-27','2025-10-27','Order-10.jpeg','CLIENT2025002','SHIPPER2025002','STORE2025002',NULL,NULL,'2025-10-25 14:30:00','2025-10-27 10:00:00'),(11,'order-11-qr.jpg','wallet',53490000,'2025-11-01','IN_TRANSIT','789 Trần Phú, Đống Đa, HN',18000,NULL,NULL,NULL,'default-order.jpg','CLIENT2025003','SHIPPER2025003','STORE2025002',NULL,1,'2025-11-01 09:15:00','2025-11-02 08:00:00'),(12,'order-12-qr.jpg','cash',950000,'2025-11-05','PENDING','101 Kim Mã, Ba Đình, HN',18000,NULL,NULL,NULL,'default-order.jpg','CLIENT2025004','SHIPPER2025004','STORE2025001',NULL,NULL,'2025-11-05 11:45:00','2025-11-05 11:45:00'),(13,'order-13-qr.jpg','wallet',3190000,'2025-11-10','CONFIRMED','202 Nguyễn Thái Học, Q3, HCM',30000,NULL,'2025-11-10',NULL,'Order-13.jpeg','CLIENT2025005','SHIPPER2025005','STORE2025005',NULL,NULL,'2025-11-10 16:20:00','2025-11-11 09:00:00'),(14,'order-14-qr.jpg','wallet',37500000,'2025-11-12','DELIVERED','55 Nguyễn Trãi, Thanh Xuân, HN',18000,NULL,'2025-11-12','2025-11-14','Order-14.jpeg','CLIENT2025006','SHIPPER2025006','STORE2025006',NULL,2,'2025-11-12 08:30:00','2025-11-14 17:00:00'),(15,'order-15-qr.jpg','cash',890000,'2025-11-14','CLIENT_CONFIRMED','78 Lý Thường Kiệt, Đà Nẵng',25000,NULL,'2025-11-16','2025-11-16','Order-15.jpeg','CLIENT2025007','SHIPPER2025007','STORE2025007',NULL,NULL,'2025-11-14 10:15:00','2025-11-16 11:30:00'),(16,'order-16-qr.jpg','wallet',490000,'2025-11-15','IN_TRANSIT','234 Hai Bà Trưng, Quận 1, HCM',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT2025008','SHIPPER2025008','STORE2025008',NULL,NULL,'2025-11-15 14:45:00','2025-11-16 09:00:00'),(17,'order-17-qr.jpg','cash',185000,'2025-11-16','PENDING','89 Trần Đại Nghĩa, Hai Bà Trưng, HN',18000,NULL,NULL,NULL,'default-order.jpg','CLIENT2025009','SHIPPER2025009','STORE2025009',NULL,NULL,'2025-11-16 16:20:00','2025-11-16 16:20:00'),(18,'order-18-qr.jpg','wallet',1250000,'2025-11-17','CONFIRMED','567 Nguyễn Văn Linh, Quận 7, HCM',30000,NULL,'2025-11-17',NULL,'Order-18.jpeg','CLIENT2025010','SHIPPER2025010','STORE2025010',NULL,NULL,'2025-11-17 09:00:00','2025-11-18 08:00:00'),(19,'order-19-qr.jpg','cash',2590000,'2025-11-18','DELIVERED','123 Phan Xích Long, Phú Nhuận, HCM',30000,NULL,'2025-11-18','2025-11-20','Order-19.jpeg','CLIENT2025011','SHIPPER2025011','STORE2025005',NULL,3,'2025-11-18 11:30:00','2025-11-20 15:00:00'),(20,'order-20-qr.jpg','wallet',1890000,'2025-11-19','CLIENT_CONFIRMED','456 Cầu Giấy, HN',18000,NULL,'2025-11-21','2025-11-21','Order-20.jpeg','CLIENT2025012','SHIPPER2025012','STORE2025006',NULL,NULL,'2025-11-19 13:45:00','2025-11-21 10:30:00'),(21,'order-21-qr.jpg','cash',45000000,'2025-11-20','IN_TRANSIT','789 Lê Văn Việt, Thủ Đức, HCM',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT2025013','SHIPPER2025013','STORE2025002',NULL,NULL,'2025-11-20 15:00:00','2025-11-21 09:00:00'),(22,'order-22-qr.jpg','wallet',750000,'2025-11-21','PENDING','101 Hoàng Quốc Việt, Cầu Giấy, HN',18000,NULL,NULL,NULL,'default-order.jpg','CLIENT2025014','SHIPPER2025014','STORE2025007',NULL,4,'2025-11-21 10:20:00','2025-11-21 10:20:00'),(23,'order-23-qr.jpg','cash',35000,'2025-11-22','CONFIRMED','202 Nguyễn Xiển, Thanh Trì, HN',18000,NULL,'2025-11-22',NULL,'Order-23.jpeg','CLIENT2025015','SHIPPER2025015','STORE2025010',NULL,NULL,'2025-11-22 08:45:00','2025-11-23 09:15:00'),(24,'order-24-qr.jpg','wallet',1290000,'2026-01-05','PENDING','10 Trần phú, Mỗ lao, Hà Nội',2000,NULL,'2026-01-05',NULL,'default-order.jpg','CLIENT1766314602202',NULL,'STORE2025010',NULL,NULL,'2026-01-05 15:42:09','2026-01-05 15:42:09'),(25,'order-25-qr.jpg','cash',20000000,'2026-01-05','IN_TRANSIT','10 Trần phú, Mỗ lao, Hà Nội',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766314602202','SHIPPER1766408019380','STORE1766314663632',NULL,NULL,'2026-01-05 16:08:44','2026-01-05 16:26:05'),(26,'order-26-qr.jpg','wallet',20000000,'2026-01-06','CLIENT_CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',30000,NULL,'2026-01-06',NULL,'Order-26.jpeg','CLIENT1766565306888','SHIPPER1766408019380','STORE1766314663632',NULL,NULL,'2026-01-05 17:01:08','2026-01-06 14:34:34'),(27,'order-27-qr.jpg','cash',19956425,'2026-01-06','CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',25000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632','[6,1]',13,'2026-01-05 17:05:52','2026-01-05 17:06:40'),(28,'order-28-qr.jpg','wallet',24956425,'2026-01-06','CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',2000,NULL,'2026-01-06',NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632',NULL,NULL,'2026-01-05 17:06:11','2026-01-05 17:06:39'),(29,'order-29-qr.jpg','cash',21456425,'2026-01-06','CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',0,NULL,NULL,NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632','[6,1]',14,'2026-01-05 17:10:46','2026-01-05 17:11:07'),(30,'order-30-qr.jpg','wallet',20000000,'2026-01-06','CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',30000,NULL,'2026-01-06',NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632',NULL,NULL,'2026-01-05 17:10:54','2026-01-05 17:11:05'),(31,'order-31-qr.jpg','cash',24956425,'2026-01-06','CLIENT_CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',0,NULL,'2026-01-06',NULL,'Order-31.jpeg','CLIENT1766565306888','SHIPPER1766408019380','STORE1766314663632','[6,1]',14,'2026-01-05 17:14:20','2026-01-05 17:19:57'),(32,'order-32-qr.jpg','wallet',25000000,'2026-01-06','RETURN_CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',30000,NULL,'2026-01-06',NULL,'Order-32.jpeg','CLIENT1766565306888','SHIPPER1766408019380','STORE1766314663632',NULL,NULL,'2026-01-05 17:14:28','2026-01-05 17:20:34'),(33,'order-33-qr.jpg','wallet',20000000,'2026-01-06','CLIENT_CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',0,NULL,'2026-01-06',NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632',NULL,NULL,'2026-01-06 16:21:29','2026-01-06 16:21:29'),(34,'order-34-qr.jpg','cash',20000000,'2026-01-06','PENDING','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',2000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632',NULL,12,'2026-01-06 16:29:35','2026-01-06 16:29:35'),(35,'order-35-qr.jpg','cash',20000000,'2026-01-06','CLIENT_CONFIRMED','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632',NULL,NULL,'2026-01-06 16:29:47','2026-01-06 16:29:47'),(36,'order-36-qr.jpg','cash',20000000,'2026-01-06','PENDING','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632',NULL,NULL,'2026-01-06 16:32:17','2026-01-06 16:32:17'),(37,'order-37-qr.jpg','cash',42990000,'2026-01-06','PENDING','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE2025002',NULL,NULL,'2026-01-06 16:32:17','2026-01-06 16:32:17'),(38,'order-38-qr.jpg','cash',52990000,'2026-01-06','PENDING','Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội',30000,NULL,NULL,NULL,'default-order.jpg','CLIENT1766565306888',NULL,'STORE1766314663632',NULL,NULL,'2026-01-06 16:33:18','2026-01-06 16:33:18');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,'product-STORE1766314663632-1766383317781-slide-1.jpeg',2,'2025-12-22 06:01:57','2025-12-22 06:01:57'),(2,'product-STORE1766314663632-1766383317781-slide-2.jpeg',2,'2025-12-22 06:01:57','2025-12-22 06:01:57'),(3,'product-STORE1766314663632-1766563446274-slide-1.jpeg',4,'2025-12-24 08:04:06','2025-12-24 08:04:06'),(4,'product-STORE1766314663632-1767628416007-slide-1.jpeg',41,'2026-01-05 15:53:36','2026-01-05 15:53:36');
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
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,32990000,49,1,'2025-08-05 10:30:00','2026-01-06 16:33:18'),(2,34990000,30,1,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(3,38990000,20,1,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(4,29990000,45,2,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(5,32990000,25,2,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(6,22990000,60,3,'2025-08-12 09:45:00','2025-08-12 09:45:00'),(7,24990000,35,3,'2025-08-12 09:45:00','2025-08-12 09:45:00'),(8,52990000,25,4,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(9,62990000,15,4,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(10,45990000,20,5,'2025-08-20 16:15:00','2025-08-20 16:15:00'),(11,49990000,11,5,'2025-08-20 16:15:00','2026-01-05 15:25:01'),(12,42990000,34,6,'2025-08-25 08:50:00','2026-01-06 16:32:17'),(13,46990000,20,6,'2025-08-25 08:50:00','2025-08-25 08:50:00'),(14,35990000,28,7,'2025-09-03 10:20:00','2025-09-03 10:20:00'),(15,32990000,50,5,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(16,38990000,30,5,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(17,29990000,45,6,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(18,34990000,25,6,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(19,52990000,25,7,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(20,62990000,15,7,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(21,35990000,28,8,'2025-09-03 10:20:00','2025-09-03 10:20:00'),(22,42990000,15,8,'2025-09-03 10:20:00','2025-09-03 10:20:00'),(23,450000,150,9,'2025-09-10 08:45:00','2025-09-10 08:45:00'),(24,520000,100,9,'2025-09-10 08:45:00','2025-09-10 08:45:00'),(25,890000,80,10,'2025-09-18 09:50:00','2025-09-18 09:50:00'),(26,990000,50,10,'2025-09-18 09:50:00','2025-09-18 09:50:00'),(27,2890000,45,11,'2025-09-25 08:30:00','2025-09-25 08:30:00'),(28,3290000,30,11,'2025-09-25 08:30:00','2025-09-25 08:30:00'),(29,1890000,90,12,'2025-10-02 13:45:00','2025-10-02 13:45:00'),(30,2290000,60,12,'2025-10-02 13:45:00','2025-10-02 13:45:00'),(31,2990000,40,13,'2025-10-10 14:15:00','2025-10-10 14:15:00'),(32,3490000,25,13,'2025-10-10 14:15:00','2025-10-10 14:15:00'),(33,8490000,30,14,'2025-10-18 16:30:00','2025-10-18 16:30:00'),(34,9490000,20,14,'2025-10-18 16:30:00','2025-10-18 16:30:00'),(35,35000000,20,15,'2025-10-22 09:00:00','2025-10-22 09:00:00'),(36,37500000,15,15,'2025-10-22 09:00:00','2025-10-22 09:00:00'),(37,1290000,80,16,'2025-10-25 10:15:00','2025-10-25 10:15:00'),(38,1490000,60,16,'2025-10-25 10:15:00','2025-10-25 10:15:00'),(39,450000,200,17,'2025-10-28 11:30:00','2025-10-28 11:30:00'),(40,520000,150,17,'2025-10-28 11:30:00','2025-10-28 11:30:00'),(41,189000,300,18,'2025-11-01 08:45:00','2025-11-01 08:45:00'),(42,219000,250,18,'2025-11-01 08:45:00','2025-11-01 08:45:00'),(43,180000,500,19,'2025-11-03 09:30:00','2025-11-03 09:30:00'),(44,350000,300,19,'2025-11-03 09:30:00','2025-11-03 09:30:00'),(45,1590000,49,20,'2025-11-05 10:45:00','2026-01-05 15:42:09'),(46,1890000,35,20,'2025-11-05 10:45:00','2025-11-05 10:45:00'),(47,3500000,40,21,'2025-11-08 11:00:00','2025-11-08 11:00:00'),(48,4200000,25,21,'2025-11-08 11:00:00','2025-11-08 11:00:00'),(49,890000,100,22,'2025-11-10 13:15:00','2025-11-10 13:15:00'),(50,1190000,70,22,'2025-11-10 13:15:00','2025-11-10 13:15:00'),(51,54990000,15,23,'2025-11-12 14:30:00','2025-11-12 14:30:00'),(52,64990000,10,23,'2025-11-12 14:30:00','2025-11-12 14:30:00'),(53,45000,1000,24,'2025-11-15 15:45:00','2025-11-15 15:45:00'),(54,65000,800,24,'2025-11-15 15:45:00','2025-11-15 15:45:00'),(82,20000000,3,41,'2026-01-05 15:55:33','2026-01-06 16:33:18'),(83,21000000,11,41,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(84,15000000,14,41,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(85,20500000,14,41,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(86,21500000,11,41,'2026-01-05 15:55:33','2026-01-05 17:10:46'),(87,15500000,16,41,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(88,25000000,8,41,'2026-01-05 15:55:33','2026-01-05 17:20:17'),(89,26000000,9,41,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(90,20500000,5,41,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(91,25000000,2,41,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(92,26000000,3,41,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(93,20500000,2,41,'2026-01-05 15:55:33','2026-01-05 15:55:33');
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
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'iPhone 15 Pro Max 256GB','Điện thoại iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch. Thiết kế titanium cao cấp, pin dùng cả ngày.','Mỹ',150,10,32990000,48,120,'dienthoai1.png','ACTIVE',3,'STORE1766314663632','2025-08-05 10:30:00','2025-08-05 10:30:00'),(2,'Samsung Galaxy S24 Ultra','Điện thoại Samsung Galaxy S24 Ultra 5G, camera 200MP, S Pen tích hợp, màn hình Dynamic AMOLED 2X 6.8 inch. AI Galaxy mạnh mẽ.','Hàn Quốc',120,15,29990000,46,95,'dienthoai2.png','ACTIVE',3,'STORE2025081002002','2025-08-08 14:20:00','2025-08-08 14:20:00'),(3,'Xiaomi 14 Ultra','Điện thoại Xiaomi 14 Ultra với camera Leica chuyên nghiệp, chip Snapdragon 8 Gen 3, sạc nhanh 90W. Hiệu năng đỉnh cao.','Trung Quốc',80,12,22990000,45,68,'dienthoai3.png','ACTIVE',3,'STORE2025080501001','2025-08-12 09:45:00','2025-08-12 09:45:00'),(4,'MacBook Pro 14 M3 Pro','Laptop MacBook Pro 14 inch chip M3 Pro, 18GB RAM, 512GB SSD. Màn hình Liquid Retina XDR, hiệu năng vượt trội cho công việc sáng tạo.','Mỹ',65,8,52990000,49,45,'laptop1.png','ACTIVE',4,'STORE2025081002002','2025-08-15 11:30:00','2025-08-15 11:30:00'),(5,'iPhone 15 Pro Max 256GB','Điện thoại iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch.','Mỹ',150,10,32990000,48,120,'dienthoai1.png','ACTIVE',1,'STORE2025002','2025-08-05 10:30:00','2025-08-05 10:30:00'),(6,'Samsung Galaxy S24 Ultra','Samsung Galaxy S24 Ultra 5G, camera 200MP, S Pen tích hợp, màn hình Dynamic AMOLED 2X 6.8 inch.','Hàn Quốc',120,15,29990000,46,95,'dienthoai2.png','ACTIVE',1,'STORE2025002','2025-08-08 14:20:00','2025-08-08 14:20:00'),(7,'MacBook Pro 14 M3 Pro','Laptop MacBook Pro 14 inch chip M3 Pro, 18GB RAM, 512GB SSD. Màn hình Liquid Retina XDR.','Mỹ',65,8,52990000,49,45,'laptop1.png','ACTIVE',2,'STORE2025002','2025-08-15 11:30:00','2025-08-15 11:30:00'),(8,'Sony Bravia XR 65 inch','Tivi Sony Bravia XR 65 inch 4K HDR, công nghệ Cognitive Processor XR.','Nhật Bản',30,15,35990000,48,25,'tivi1.png','ACTIVE',3,'STORE2025002','2025-09-03 10:20:00','2025-09-03 10:20:00'),(9,'Áo sơ mi nam Oxford','Áo sơ mi nam vải Oxford cao cấp, form regular fit, cổ button-down.','Việt Nam',200,5,450000,44,180,'thoitrangnam1.png','ACTIVE',4,'STORE2025001','2025-09-10 08:45:00','2025-09-10 08:45:00'),(10,'Đầm nữ dự tiệc','Đầm nữ dự tiệc thiết kế sang trọng, chất liệu lụa cao cấp.','Việt Nam',120,20,890000,47,95,'thoitrangnu1.png','ACTIVE',5,'STORE2025001','2025-09-18 09:50:00','2025-09-18 09:50:00'),(11,'Giày thể thao Nike Air','Giày thể thao Nike Air Max, đệm khí êm ái, thiết kế năng động.','Việt Nam',180,25,2890000,47,142,'giaydepnam1.png','ACTIVE',6,'STORE2025005','2025-09-25 08:30:00','2025-09-25 08:30:00'),(12,'Nồi chiên không dầu 5.5L','Nồi chiên không dầu 5.5L, công suất 1800W, 8 chức năng nấu.','Trung Quốc',140,12,1890000,45,112,'giadung1.png','ACTIVE',7,'STORE2025003','2025-10-02 13:45:00','2025-10-02 13:45:00'),(13,'Ghế gaming cao cấp','Ghế gaming có gác chân, đệm mút D cao cấp, lưng ngả 180 độ.','Trung Quốc',70,20,2990000,46,55,'banghe1.png','ACTIVE',8,'STORE2025003','2025-10-10 14:15:00','2025-10-10 14:15:00'),(14,'Tai nghe Bluetooth Sony','Tai nghe Sony WH-1000XM5, chống ồn chủ động, pin 30 giờ.','Nhật Bản',100,15,8490000,48,82,'phukien1.png','ACTIVE',9,'STORE2025002','2025-10-18 16:30:00','2025-10-18 16:30:00'),(15,'Honda Vision 2025','Xe máy Honda Vision phiên bản mới, tiết kiệm xăng, thiết kế thời trang.','Việt Nam',45,5,35000000,49,30,'xe1.png','ACTIVE',11,'STORE2025015','2025-10-22 09:00:00','2025-10-22 09:00:00'),(16,'Bộ đồ thể thao Adidas','Bộ quần áo thể thao Adidas, chất liệu thấm hút mồ hôi, co giãn tốt.','Việt Nam',95,30,1290000,46,68,'thethao1.png','ACTIVE',12,'STORE2025006','2025-10-25 10:15:00','2025-10-25 10:15:00'),(17,'Serum Vitamin C Klairs','Serum vitamin C làm sáng da, mờ thâm, dưỡng ẩm. Phù hợp mọi loại da.','Hàn Quốc',220,15,450000,47,185,'phukien2.png','ACTIVE',13,'STORE2025007','2025-10-28 11:30:00','2025-10-28 11:30:00'),(18,'Bộ quần áo trẻ em cotton','Bộ quần áo trẻ em 100% cotton, mềm mại, an toàn cho bé từ 1-5 tuổi.','Việt Nam',300,10,189000,45,210,'treem1.png','ACTIVE',14,'STORE2025008','2025-11-01 08:45:00','2025-11-01 08:45:00'),(19,'Gạo ST25 cao cấp 5kg','Gạo ST25 đặc sản Sóc Trăng, hạt dài, thơm dẻo, ngon nhất thế giới.','Việt Nam',500,8,180000,48,320,'doan1.png','ACTIVE',15,'STORE2025009','2025-11-03 09:30:00','2025-11-03 09:30:00'),(20,'Túi xách nữ Charles & Keith','Túi xách nữ thiết kế sang trọng, chất liệu da PU cao cấp.','Singapore',85,20,1590000,46,72,'tuixach1.png','ACTIVE',16,'STORE2025010','2025-11-05 10:45:00','2025-11-05 10:45:00'),(21,'Đồng hồ Casio G-Shock','Đồng hồ nam Casio G-Shock chống sốc, chống nước 200m, pin 10 năm.','Nhật Bản',60,15,3500000,48,48,'phukien3.png','ACTIVE',17,'STORE2025011','2025-11-08 11:00:00','2025-11-08 11:00:00'),(22,'Bộ nồi inox 5 chiếc','Bộ nồi inox 304 cao cấp 5 chiếc, đáy từ, dùng được trên mọi loại bếp.','Việt Nam',110,25,890000,44,88,'dungcu1.png','ACTIVE',18,'STORE2025012','2025-11-10 13:15:00','2025-11-10 13:15:00'),(23,'Máy ảnh Sony Alpha A7 IV','Máy ảnh full-frame Sony A7 IV, 33MP, quay video 4K 60fps, IBIS 5 trục.','Nhật Bản',25,10,54990000,50,22,'phukien4.png','ACTIVE',19,'STORE2025013','2025-11-12 14:30:00','2025-11-12 14:30:00'),(24,'Bút bi Thiên Long TL-027','Hộp 20 bút bi Thiên Long TL-027, nét đều, viết êm, giá rẻ.','Việt Nam',1000,5,45000,43,150,'sachvo1.png','ACTIVE',20,'STORE2025014','2025-11-15 15:45:00','2025-11-15 15:45:00'),(41,'bộ bàn ghế ăn gia đình cao cấp','Bộ bàn ghế làm từ gỗ 100 năm tuổi từ nhật bản test','Nhật Bản',0,0,15000000,0,0,'product-STORE1766314663632-1767628415975-main.jpeg','ACTIVE',8,'STORE1766314663632','2026-01-05 15:53:36','2026-01-06 15:07:41');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `returns`
--

LOCK TABLES `returns` WRITE;
/*!40000 ALTER TABLE `returns` DISABLE KEYS */;
INSERT INTO `returns` VALUES (1,4,'2025-12-22 12:56:46','Sản phẩm bị lỗi/hỏng',57036.00,'2025-12-22 12:56:46','2025-12-22 12:56:46'),(2,1,'2025-12-22 12:58:04','Sản phẩm không đúng kích thước/màu sắc',45613.00,'2025-12-22 12:58:04','2025-12-22 12:58:04'),(3,6,'2025-12-22 13:05:58','Sản phẩm bị lỗi/hỏng',57036.00,'2025-12-22 13:05:58','2025-12-22 13:05:58'),(4,32,'2026-01-05 17:20:17','Sản phẩm bị lỗi/hỏng',25030000.00,'2026-01-05 17:20:17','2026-01-05 17:20:17');
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'như loằn',5,'CLIENT1766314602202',2,1,'2025-12-22 12:23:27','2025-12-22 12:23:27'),(2,'sản phẩm oke',4,'CLIENT1766314602202',2,6,'2025-12-22 13:05:50','2025-12-22 13:05:50'),(3,'Điện thoại rất đẹp, chụp ảnh sắc nét. Giao hàng nhanh!',5,'CLIENT2025001',5,9,'2025-10-23 10:00:00','2025-10-23 10:00:00'),(4,'Samsung xài mượt, màn hình đẹp. Rất hài lòng!',5,'CLIENT2025002',6,10,'2025-10-28 14:30:00','2025-10-28 14:30:00'),(5,'MacBook Pro chạy rất nhanh, pin trâu. Đáng tiền!',5,'CLIENT2025003',7,11,'2025-11-03 09:15:00','2025-11-03 09:15:00'),(6,'Áo đẹp, vải mát. Sẽ ủng hộ tiếp!',4,'CLIENT2025004',9,12,'2025-11-06 11:45:00','2025-11-06 11:45:00'),(7,'Giày đẹp, êm chân. Giao hàng nhanh!',5,'CLIENT2025005',11,13,'2025-11-12 16:20:00','2025-11-12 16:20:00'),(8,'Xe Vision 2025 tiết kiệm xăng, chạy êm. Rất ưng!',5,'CLIENT2025006',15,14,'2025-11-15 08:30:00','2025-11-15 08:30:00'),(9,'Đồ thể thao Adidas chất lượng tốt, thoáng mát',4,'CLIENT2025007',16,15,'2025-11-17 10:15:00','2025-11-17 10:15:00'),(10,'Serum dưỡng da rất hiệu quả, da sáng hơn sau 2 tuần',5,'CLIENT2025008',17,16,'2025-11-18 14:45:00','2025-11-18 14:45:00'),(11,'Gạo ST25 thơm ngon, nấu cơm dẻo',5,'CLIENT2025009',19,17,'2025-11-19 16:20:00','2025-11-19 16:20:00'),(12,'Túi xách đẹp, chất da tốt. Shop đóng gói cẩn thận',4,'CLIENT2025010',20,18,'2025-11-20 09:00:00','2025-11-20 09:00:00'),(13,'Đồng hồ Casio bền đẹp, chính hãng 100%',5,'CLIENT2025011',21,19,'2025-11-21 11:30:00','2025-11-21 11:30:00'),(14,'Bộ nồi inox sáng bóng, nấu ăn rất nhanh',4,'CLIENT2025012',22,20,'2025-11-22 13:45:00','2025-11-22 13:45:00'),(15,'Máy ảnh Sony chụp đẹp, quay video 4K mượt',5,'CLIENT2025013',23,21,'2025-11-23 15:00:00','2025-11-23 15:00:00'),(16,'Quần áo trẻ em mềm mại, con mặc rất thích',5,'CLIENT2025014',18,22,'2025-11-24 10:20:00','2025-11-24 10:20:00'),(17,'Bút Thiên Long viết mượt, giá rẻ',4,'CLIENT2025015',24,23,'2025-11-25 08:45:00','2025-11-25 08:45:00');
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
INSERT INTO `shippers` VALUES ('SHIPPER1766315105177','036181538154','citizen_id-036181538154.jpeg','vehicle-036181538154.jpeg','profile-036181538154.jpeg','health-036181538154.jpeg','Hieu@gmail.com','0123456789','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Hiếu','ACTIVE',0,'motorcycle','B21-29163',0,0,'TP. Hồ Chí Minh','Hehe',986964,'Mb','13456678','Hiếu',0,'2025-12-21 11:05:05','2025-12-22 12:42:27'),('SHIPPER1766408019380','027452815382','citizen_id-027452815382.jpeg','vehicle-027452815382.jpeg','profile-027452815382.jpeg','health-027452815382.jpeg','Check@gmail.com','1234567890','$2b$12$V4WR0.MkVdkDcOBvVSffauRtdn8WYfMfm8ctkRPItNpQmQbxi7miy','Check','ACTIVE',0,'motorcycle','Gv717272',0,0,'Cần Thơ','Hdgd',-23837400,'1019272','1518484','16vhsjs',0,'2025-12-22 12:53:39','2026-01-05 17:18:27'),('SHIPPER2025001','038201234567','citizen_id-1.jpeg','vehicle-1.jpeg','profile-1.jpeg','health-1.jpeg','shipper.tuan@gmail.com','0931234567','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Nguyễn Văn Tuấn','ACTIVE',1,'motorcycle','59A1-12345',45,120,'Hà Nội','Cầu Giấy',2500000,'Vietcombank','0011223344','Nguyen Van Tuan',1,'2025-08-05 08:30:00','2025-08-05 08:30:00'),('SHIPPER2025002','039302345678','citizen_id-2.jpeg','vehicle-2.jpeg','profile-2.jpeg','health-2.jpeg','shipper.hoa@gmail.com','0932345678','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Trần Thị Hoa','ACTIVE',1,'motorcycle','30A2-23456',42,95,'TP. Hồ Chí Minh','Quận 1',1800000,'Techcombank','1122334455','Tran Thi Hoa',1,'2025-08-12 10:15:00','2025-08-12 10:15:00'),('SHIPPER2025003','040403456789','citizen_id-3.jpeg','vehicle-3.jpeg','profile-3.jpeg','health-3.jpeg','shipper.minh@gmail.com','0933456789','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Lê Văn Minh','ACTIVE',0,'motorcycle','43A3-34567',48,150,'Đà Nẵng','Hải Châu',3200000,'MB','2233445566','Le Van Minh',1,'2025-08-20 14:45:00','2025-08-20 14:45:00'),('SHIPPER2025004','041504567890','citizen_id-4.jpeg','vehicle-4.jpeg','profile-4.jpeg','health-4.jpeg','shipper.lan@gmail.com','0934567890','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Phạm Thị Lan','ACTIVE',1,'motorcycle','51B4-45678',50,200,'TP. Hồ Chí Minh','Quận 7',4500000,'ACB','3344556677','Pham Thi Lan',1,'2025-09-05 09:20:00','2025-09-05 09:20:00'),('SHIPPER2025005','042605678901','citizen_id-5.jpeg','vehicle-5.jpeg','profile-5.jpeg','health-5.jpeg','shipper.duc@gmail.com','0935678901','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Hoàng Văn Đức','ACTIVE',1,'motorcycle','29B5-56789',46,110,'Hà Nội','Đống Đa',2100000,'BIDV','4455667788','Hoang Van Duc',1,'2025-09-15 11:30:00','2025-09-15 11:30:00'),('SHIPPER2025006','043706789012','citizen_id-6.jpeg','vehicle-6.jpeg','profile-6.jpeg','health-6.jpeg','shipper.hung@gmail.com','0936789012','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Vũ Văn Hùng','ACTIVE',1,'motorcycle','92A6-67890',44,85,'Hải Phòng','Lê Chân',1600000,'VPBank','5566778899','Vu Van Hung',1,'2025-09-20 08:00:00','2025-09-20 08:00:00'),('SHIPPER2025007','044807890123','citizen_id-7.jpeg','vehicle-7.jpeg','profile-7.jpeg','health-7.jpeg','shipper.nga@gmail.com','0937890123','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Đặng Thị Nga','ACTIVE',1,'motorcycle','36B7-78901',47,130,'TP. Hồ Chí Minh','Quận 3',2900000,'TPBank','6677889900','Dang Thi Nga',1,'2025-09-25 09:30:00','2025-09-25 09:30:00'),('SHIPPER2025008','045908901234','citizen_id-8.jpeg','vehicle-8.jpeg','profile-8.jpeg','health-8.jpeg','shipper.khanh@gmail.com','0938901234','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Bùi Văn Khánh','ACTIVE',0,'motorcycle','29C8-89012',49,180,'Hà Nội','Hoàng Mai',3800000,'OCB','7788990011','Bui Van Khanh',1,'2025-10-01 10:45:00','2025-10-01 10:45:00'),('SHIPPER2025009','046009012345','citizen_id-9.jpeg','vehicle-9.jpeg','profile-9.jpeg','health-9.jpeg','shipper.thao@gmail.com','0939012345','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Ngô Thị Thảo','ACTIVE',1,'motorcycle','51D9-90123',43,70,'TP. Hồ Chí Minh','Bình Thạnh',1400000,'SHB','8899001122','Ngo Thi Thao',1,'2025-10-05 11:15:00','2025-10-05 11:15:00'),('SHIPPER2025010','047110123456','citizen_id-10.jpeg','vehicle-10.jpeg','profile-10.jpeg','health-10.jpeg','shipper.phong@gmail.com','0940123456','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Đỗ Văn Phong','ACTIVE',1,'motorcycle','43E0-01234',50,220,'Đà Nẵng','Thanh Khê',5200000,'Vietinbank','9900112233','Do Van Phong',1,'2025-10-10 13:00:00','2025-10-10 13:00:00'),('SHIPPER2025011','048211234567','citizen_id-11.jpeg','vehicle-11.jpeg','profile-11.jpeg','health-11.jpeg','shipper.linh@gmail.com','0941234567','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Trịnh Thị Linh','ACTIVE',1,'motorcycle','30F1-12345',46,100,'TP. Hồ Chí Minh','Tân Bình',2200000,'Agribank','0011223344','Trinh Thi Linh',1,'2025-10-15 14:30:00','2025-10-15 14:30:00'),('SHIPPER2025012','049312345678','citizen_id-12.jpeg','vehicle-12.jpeg','profile-12.jpeg','health-12.jpeg','shipper.son@gmail.com','0942345678','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Lý Văn Sơn','ACTIVE',0,'motorcycle','92G2-23456',41,55,'Hải Phòng','Ngô Quyền',1100000,'Vietcombank','1122334455','Ly Van Son',1,'2025-10-20 15:45:00','2025-10-20 15:45:00'),('SHIPPER2025013','050413456789','citizen_id-13.jpeg','vehicle-13.jpeg','profile-13.jpeg','health-13.jpeg','shipper.huyen@gmail.com','0943456789','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Mai Thị Huyền','ACTIVE',1,'motorcycle','29H3-34567',48,160,'Hà Nội','Thanh Xuân',3500000,'MB','2233445566','Mai Thi Huyen',1,'2025-10-25 08:15:00','2025-10-25 08:15:00'),('SHIPPER2025014','051514567890','citizen_id-14.jpeg','vehicle-14.jpeg','profile-14.jpeg','health-14.jpeg','shipper.quang@gmail.com','0944567890','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Cao Văn Quang','ACTIVE',1,'motorcycle','51I4-45678',45,90,'TP. Hồ Chí Minh','Gò Vấp',1900000,'Techcombank','3344556677','Cao Van Quang',1,'2025-11-01 09:30:00','2025-11-01 09:30:00'),('SHIPPER2025015','052615678901','citizen_id-15.jpeg','vehicle-15.jpeg','profile-15.jpeg','health-15.jpeg','shipper.tam@gmail.com','0945678901','$2b$12$hXMI0.9nL3QzdtCYm9ocjuMNmDcqMCWUCu0umgWGTPs0UtHM/KuJ.','Lâm Văn Tâm','ACTIVE',1,'motorcycle','36J5-56789',47,140,'Đà Nẵng','Sơn Trà',3100000,'ACB','4455667788','Lam Van Tam',1,'2025-11-05 10:45:00','2025-11-05 10:45:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_codes`
--

LOCK TABLES `shipping_codes` WRITE;
/*!40000 ALTER TABLE `shipping_codes` DISABLE KEYS */;
INSERT INTO `shipping_codes` VALUES (1,'check','1231',12000,995,'2026-01-03 10:45:00','ADMIN1766313158298','2025-12-21 11:20:03','2025-12-28 11:02:06'),(2,'FREESHIP50K','Miễn phí ship đơn từ 500.000đ',30000,1000,'2026-06-30 23:59:59','ADMIN1766313158298','2025-08-01 00:00:00','2025-08-01 00:00:00'),(3,'SHIPGIAM20K','Giảm 20.000đ phí ship',20000,500,'2026-03-31 23:59:59','ADMIN1766313158298','2025-09-01 00:00:00','2025-09-01 00:00:00'),(4,'SHIPHN','Miễn phí ship nội thành Hà Nội',18000,300,'2026-12-31 23:59:59','ADMIN1766313158298','2025-10-01 00:00:00','2025-10-01 00:00:00'),(5,'SHIPHCM','Miễn phí ship nội thành HCM',30000,400,'2026-12-31 23:59:59','ADMIN1766313158298','2025-10-10 00:00:00','2025-10-10 00:00:00'),(6,'SHIPDN','Miễn phí ship nội thành Đà Nẵng',25000,200,'2026-12-31 23:59:59','ADMIN1766313158298','2025-10-15 00:00:00','2025-10-15 00:00:00'),(7,'SHIP10K','Giảm 10.000đ phí ship mọi đơn',10000,2000,'2026-06-30 23:59:59','ADMIN1766313158298','2025-10-20 00:00:00','2025-10-20 00:00:00'),(8,'SHIPTET','Giảm 50% phí ship dịp Tết',15000,1500,'2025-02-28 23:59:59','ADMIN1766313158298','2025-10-25 00:00:00','2025-10-25 00:00:00'),(9,'SHIP1M','Miễn phí ship đơn từ 1.000.000đ',30000,800,'2026-09-30 23:59:59','ADMIN1766313158298','2025-11-01 00:00:00','2025-11-01 00:00:00'),(10,'SHIPVIP','Miễn phí ship khách VIP',30000,500,'2026-12-31 23:59:59','ADMIN1766313158298','2025-11-05 00:00:00','2025-11-05 00:00:00'),(11,'SHIPHP','Miễn phí ship nội thành Hải Phòng',22000,150,'2026-12-31 23:59:59','ADMIN1766313158298','2025-11-10 00:00:00','2025-11-10 00:00:00'),(12,'SHIPCT','Miễn phí ship nội thành Cần Thơ',28000,147,'2026-12-31 23:59:59','ADMIN1766313158298','2025-11-15 00:00:00','2026-01-06 16:29:35'),(13,'SHIP500','Giảm 500đ/km phí ship ngoại thành',5000,2999,'2026-08-31 23:59:59','ADMIN1766313158298','2025-11-18 00:00:00','2026-01-05 17:05:52'),(14,'SHIPXE','Miễn phí vận chuyển xe máy',200000,47,'2026-06-30 23:59:59','ADMIN1766313158298','2025-11-20 00:00:00','2026-01-06 16:21:29');
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
INSERT INTO `stores` VALUES ('STORE1766314663632','037203002473','citizen_id-037203002473.jpeg','xxx','0946861622','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','hieu@gmail.com','MB','10122003','Hioeus',0,70162960,0,'ACTIVE',0,20940700,'hẹ hẹ','qzfgsdfg','0946861622',0,'avatar-037203002473.jpeg','sdfgsdfgdfsgsdfgsdf',0,'2025-12-21 10:57:43','2025-12-21 10:57:43','2026-01-06 16:17:16'),('STORE2025001','038123456789','citizen_id-s1.jpeg','Thời Trang Việt','0951234567','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','thoitrangviet@gmail.com','Vietcombank','1234567890','Tran Van A',45,15000000,120,'ACTIVE',2500,8500000,'Hà Nội','Cầu Giấy','123 Xuân Thủy',1,'store-s1.jpeg','Chuyên thời trang nam nữ cao cấp',1,'2025-08-05 09:00:00','2025-08-05 09:00:00','2025-08-05 09:00:00'),('STORE2025002','039234567890','citizen_id-s2.jpeg','Điện Tử Số','0952345678','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','dientuso@gmail.com','Techcombank','2345678901','Le Thi B',48,25000000,85,'ACTIVE',3200,12500000,'TP. Hồ Chí Minh','Quận 1','456 Nguyễn Huệ',1,'store-s2.jpeg','Thiết bị điện tử chính hãng',1,'2025-08-10 11:30:00','2025-08-10 11:30:00','2025-08-10 11:30:00'),('STORE2025003','040345678901','citizen_id-s3.jpeg','Gia Dụng Pro','0953456789','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','giadungpro@gmail.com','MB','3456789012','Pham Van C',42,18000000,200,'ACTIVE',4100,9800000,'Hà Nội','Đống Đa','789 Thái Hà',0,'store-s3.jpeg','Đồ gia dụng chất lượng',1,'2025-08-18 14:20:00','2025-08-18 14:20:00','2025-08-18 14:20:00'),('STORE2025004','041456789012','citizen_id-s4.jpeg','Sách Hay Online','0954567890','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','sachhay@gmail.com','ACB','4567890123','Nguyen Thi D',46,12000000,150,'ACTIVE',1800,6200000,'Đà Nẵng','Hải Châu','101 Trần Phú',1,'store-s4.jpeg','Sách hay giá tốt',1,'2025-08-25 16:45:00','2025-08-25 16:45:00','2025-08-25 16:45:00'),('STORE2025005','042567890123','citizen_id-s5.jpeg','Giày Dép Fashion','0955678901','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','giaydep@gmail.com','BIDV','5678901234','Hoang Van E',40,8000000,500,'ACTIVE',5500,4500000,'TP. Hồ Chí Minh','Quận 3','202 Võ Văn Tần',0,'store-s5.jpeg','Giày dép thời trang',1,'2025-09-03 10:15:00','2025-09-03 10:15:00','2025-09-03 10:15:00'),('STORE2025006','043678901234','citizen_id-s6.jpeg','Thể Thao 360','0956789012','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','thethao360@gmail.com','VPBank','6789012345','Vu Van F',44,10000000,180,'ACTIVE',2800,5800000,'Hà Nội','Hoàng Mai','303 Giải Phóng',0,'store-s6.jpeg','Đồ thể thao đa dạng',1,'2025-09-08 08:30:00','2025-09-08 08:30:00','2025-09-08 08:30:00'),('STORE2025007','044789012345','citizen_id-s7.jpeg','Mỹ Phẩm Hàn Quốc','0957890123','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','myphamhq@gmail.com','TPBank','7890123456','Dang Thi G',47,20000000,300,'ACTIVE',6200,11000000,'TP. Hồ Chí Minh','Quận 5','404 Trần Hưng Đạo',1,'store-s7.jpeg','Mỹ phẩm nhập khẩu chính hãng',1,'2025-09-15 09:45:00','2025-09-15 09:45:00','2025-09-15 09:45:00'),('STORE2025008','045890123456','citizen_id-s8.jpeg','Baby World','0958901234','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','babyworld@gmail.com','OCB','8901234567','Bui Van H',43,9000000,250,'ACTIVE',3500,7200000,'Hà Nội','Ba Đình','505 Kim Mã',0,'store-s8.jpeg','Đồ dùng cho mẹ và bé',1,'2025-09-22 11:00:00','2025-09-22 11:00:00','2025-09-22 11:00:00'),('STORE2025009','046901234567','citizen_id-s9.jpeg','Thực Phẩm Sạch','0959012345','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','thucphamsach@gmail.com','SHB','9012345678','Ngo Thi I',46,15000000,400,'ACTIVE',4800,8900000,'Đà Nẵng','Ngũ Hành Sơn','606 Lê Văn Hiến',1,'store-s9.jpeg','Thực phẩm organic',1,'2025-09-28 13:15:00','2025-09-28 13:15:00','2025-09-28 13:15:00'),('STORE2025010','047012345678','citizen_id-s10.jpeg','Túi Xách Luxury','0960123456','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','tuixachluxury@gmail.com','Vietinbank','0123456789','Do Van J',49,30000000,80,'ACTIVE',7500,16000000,'TP. Hồ Chí Minh','Quận 7','707 Nguyễn Văn Linh',1,'store-s10.jpeg','Túi xách cao cấp',1,'2025-10-05 14:30:00','2025-10-05 14:30:00','2025-10-05 14:30:00'),('STORE2025011','048123456789','citizen_id-s11.jpeg','Đồng Hồ Chính Hãng','0961234567','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','dongho@gmail.com','Agribank','1234567890','Trinh Van K',48,35000000,60,'ACTIVE',5000,18000000,'Hà Nội','Hai Bà Trưng','808 Bà Triệu',1,'store-s11.jpeg','Đồng hồ nam nữ chính hãng',1,'2025-10-12 15:45:00','2025-10-12 15:45:00','2025-10-12 15:45:00'),('STORE2025012','049234567890','citizen_id-s12.jpeg','Bếp Việt','0962345678','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','bepviet@gmail.com','Vietcombank','2345678901','Ly Thi L',41,7000000,350,'ACTIVE',2200,4200000,'TP. Hồ Chí Minh','Bình Tân','909 Kinh Dương Vương',0,'store-s12.jpeg','Dụng cụ nhà bếp đa dạng',1,'2025-10-18 08:00:00','2025-10-18 08:00:00','2025-10-18 08:00:00'),('STORE2025013','050345678901','citizen_id-s13.jpeg','Camera Pro','0963456789','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','camerapro@gmail.com','MB','3456789012','Mai Van M',50,40000000,45,'ACTIVE',4200,22000000,'Hà Nội','Tây Hồ','1010 Lạc Long Quân',1,'store-s13.jpeg','Máy ảnh và phụ kiện',1,'2025-10-25 09:15:00','2025-10-25 09:15:00','2025-10-25 09:00:00'),('STORE2025014','051456789012','citizen_id-s14.jpeg','Văn Phòng Phẩm ABC','0964567890','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','vanphongphamabc@gmail.com','Techcombank','4567890123','Cao Thi N',44,5000000,600,'ACTIVE',1500,3000000,'Đà Nẵng','Liên Chiểu','1111 Nguyễn Lương Bằng',0,'store-s14.jpeg','Văn phòng phẩm giá rẻ',1,'2025-11-01 10:30:00','2025-11-01 10:30:00','2025-11-01 10:30:00'),('STORE2025015','052567890123','citizen_id-s15.jpeg','Xe Máy Phú Thọ','0965678901','$2b$12$Ggn9hzPiNTxphQbM9LztretVeEYENVfV.t0bpCsS/E..LZ8yzyoVS','xemayphutho@gmail.com','ACB','5678901234','Lam Van O',47,50000000,30,'ACTIVE',3800,28000000,'TP. Hồ Chí Minh','Phú Nhuận','1212 Phan Xích Long',1,'store-s15.jpeg','Xe máy chính hãng',1,'2025-11-08 11:45:00','2025-11-08 11:45:00','2025-11-08 11:45:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supercategories`
--

LOCK TABLES `supercategories` WRITE;
/*!40000 ALTER TABLE `supercategories` DISABLE KEYS */;
INSERT INTO `supercategories` VALUES (1,'Điện tử','supercategory-dien-tu.jpg','2025-08-01 09:00:00','2025-08-01 09:00:00'),(2,'Thời trang','supercategory-thoi-trang.jpg','2025-08-02 10:00:00','2025-08-02 10:00:00'),(3,'Gia dụng','supercategory-gia-dung.jpg','2025-08-03 11:00:00','2025-08-03 11:00:00'),(4,'Đời sống','supercategory-doi-song.jpg','2025-08-04 12:00:00','2025-08-04 12:00:00'),(5,'Xe cộ & Phụ kiện','supercategory-xe-phu-kien.jpg','2025-08-05 13:00:00','2025-08-05 13:00:00'),(6,'Thể thao','supercategory-the-thao.jpg','2025-08-06 14:00:00','2025-08-06 14:00:00'),(7,'Sức khỏe & Làm đẹp','supercategory-suc-khoe.jpg','2025-08-07 15:00:00','2025-08-07 15:00:00'),(8,'Mẹ & Bé','supercategory-me-be.jpg','2025-08-08 16:00:00','2025-08-08 16:00:00'),(9,'Thực phẩm','supercategory-thuc-pham.jpg','2025-08-09 17:00:00','2025-08-09 17:00:00'),(10,'Văn phòng phẩm','supercategory-van-phong.jpg','2025-08-10 18:00:00','2025-08-10 18:00:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'CLIENT1766314602202',1000000,1000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-22 06:04:34','2025-12-22 06:04:34'),(2,'CLIENT1766314602202',954387,-45613.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Wallet payment for order 1','2025-12-22 06:05:14','2025-12-22 06:05:14'),(3,'SHIPPER1766315105177',1000000,1000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-22 06:06:51','2025-12-22 06:06:51'),(4,'STORE1766314663632',12490.4,12490.40,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 1','2025-12-22 06:23:22','2025-12-22 06:23:22'),(5,'SHIPPER1766315105177',1013000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 1','2025-12-22 06:23:22','2025-12-22 06:23:22'),(6,'STORE1766314663632',43719.2,31228.80,'TOP_UP','cash',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 4','2025-12-22 12:42:27','2025-12-22 12:42:27'),(7,'SHIPPER1766315105177',1026000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 4','2025-12-22 12:42:27','2025-12-22 12:42:27'),(8,'SHIPPER1766315105177',986964,-39036.00,'PAY_ORDER','cash',NULL,'SUCCESS','Trừ tiền đơn hàng 4','2025-12-22 12:42:27','2025-12-22 12:42:27'),(9,'CLIENT1766314602202',1011420,57036.00,'REFUND','refund',NULL,'SUCCESS','Refund confirmed for return 1 (order 4)','2025-12-22 12:56:50','2025-12-22 12:56:50'),(10,'STORE1766314663632',-13316.8,-57036.00,'PAY_ORDER','refund',NULL,'SUCCESS','Refund deducted for return 1 (order 4)','2025-12-22 12:56:50','2025-12-22 12:56:50'),(11,'CLIENT1766314602202',1057030,45613.00,'REFUND','refund',NULL,'SUCCESS','Refund confirmed for return 2 (order 1)','2025-12-22 12:58:52','2025-12-22 12:58:52'),(12,'STORE1766314663632',-58929.8,-45613.00,'PAY_ORDER','refund',NULL,'SUCCESS','Refund deducted for return 2 (order 1)','2025-12-22 12:58:52','2025-12-22 12:58:52'),(13,'CLIENT1766314602202',999994,-57036.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Wallet payment for order 6','2025-12-22 13:03:27','2025-12-22 13:03:27'),(14,'STORE1766314663632',-27701,31228.80,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 6','2025-12-22 13:05:01','2025-12-22 13:05:01'),(15,'SHIPPER1766408019380',1013000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 6','2025-12-22 13:05:01','2025-12-22 13:05:01'),(16,'CLIENT1766314602202',1057030,57036.00,'REFUND','refund',NULL,'SUCCESS','Refund confirmed for return 3 (order 6)','2025-12-22 13:06:11','2025-12-22 13:06:11'),(17,'STORE1766314663632',-84737,-57036.00,'PAY_ORDER','refund',NULL,'SUCCESS','Refund deducted for return 3 (order 6)','2025-12-22 13:06:11','2025-12-22 13:06:11'),(18,'CLIENT1766314602202',11057000,10000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-23 16:07:25','2025-12-23 16:07:25'),(19,'CLIENT1766565306888',9925580,-74425.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 7','2025-12-24 08:46:12','2025-12-24 08:46:12'),(20,'STORE1766314663632',-39597,45140.00,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 7','2025-12-24 10:17:54','2025-12-24 10:17:54'),(21,'SHIPPER1766408019380',1026000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 7','2025-12-24 10:17:54','2025-12-24 10:17:54'),(22,'STORE1766314663632',5543,45140.00,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 7','2025-12-24 10:17:55','2025-12-24 10:17:55'),(23,'SHIPPER1766408019380',1039000,13000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 7','2025-12-24 10:17:55','2025-12-24 10:17:55'),(24,'CLIENT1766565306888',10925600,1000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-24 12:35:40','2025-12-24 12:35:40'),(25,'CLIENT1766565306888',10851200,-74425.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 8','2025-12-28 11:02:06','2025-12-28 11:02:06'),(26,'CLIENT1766314602202',11157000,100000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-28 14:02:24','2025-12-28 14:02:24'),(27,'CLIENT1766565306888',11751200,900000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-28 14:03:20','2025-12-28 14:03:20'),(28,'CLIENT1766565306888',12741200,990000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2025-12-28 14:05:17','2025-12-28 14:05:17'),(29,'CLIENT1766565306888',10741200,2000000.00,'WITHDRAW','wallet',NULL,'SUCCESS','Rút tiền từ ví','2025-12-28 14:14:22','2025-12-28 14:14:22'),(30,'CLIENT1766314602202',9865000,-1292000.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 24','2026-01-05 15:42:09','2026-01-05 15:42:09'),(31,'CLIENT1766314602202',19865000,10000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2026-01-05 16:11:59','2026-01-05 16:11:59'),(32,'CLIENT1766314602202',39865000,20000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2026-01-05 16:15:24','2026-01-05 16:15:24'),(33,'STORE1766314663632',5543,0.00,'TOP_UP','cash',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 5','2026-01-05 16:25:16','2026-01-05 16:25:16'),(34,'SHIPPER1766408019380',1059000,20000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 5','2026-01-05 16:25:16','2026-01-05 16:25:16'),(35,'SHIPPER1766408019380',1059000,0.00,'PAY_ORDER','cash',NULL,'SUCCESS','Trừ tiền đơn hàng 5','2026-01-05 16:25:16','2026-01-05 16:25:16'),(36,'CLIENT1766565306888',60741200,50000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2026-01-05 16:34:53','2026-01-05 16:34:53'),(37,'CLIENT1766565306888',40711200,-20030000.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 26','2026-01-05 17:01:08','2026-01-05 17:01:08'),(38,'STORE1766314663632',16005500,16000000.00,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 26','2026-01-05 17:03:48','2026-01-05 17:03:48'),(39,'SHIPPER1766408019380',1079000,20000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 26','2026-01-05 17:03:48','2026-01-05 17:03:48'),(40,'CLIENT1766565306888',15752800,-24958425.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 28','2026-01-05 17:06:11','2026-01-05 17:06:11'),(41,'CLIENT1766565306888',105753000,90000000.00,'TOP_UP','stripe',NULL,'SUCCESS','Nạp tiền qua Stripe','2026-01-05 17:09:46','2026-01-05 17:09:46'),(42,'CLIENT1766565306888',85723000,-20030000.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 30','2026-01-05 17:10:54','2026-01-05 17:10:54'),(43,'CLIENT1766565306888',60693000,-25030000.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 32','2026-01-05 17:14:28','2026-01-05 17:14:28'),(44,'STORE1766314663632',35970700,19965140.00,'TOP_UP','cash',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 31','2026-01-05 17:18:14','2026-01-05 17:18:14'),(45,'SHIPPER1766408019380',1099000,20000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 31','2026-01-05 17:18:14','2026-01-05 17:18:14'),(46,'SHIPPER1766408019380',-23857400,-24956425.00,'PAY_ORDER','cash',NULL,'SUCCESS','Trừ tiền đơn hàng 31','2026-01-05 17:18:14','2026-01-05 17:18:14'),(47,'STORE1766314663632',55970700,20000000.00,'TOP_UP','wallet',NULL,'SUCCESS','Doanh thu cửa hàng từ đơn hàng 32','2026-01-05 17:18:27','2026-01-05 17:18:27'),(48,'SHIPPER1766408019380',-23837400,20000.00,'TOP_UP','system_shipping_fee',NULL,'SUCCESS','Phí vận chuyển cho đơn hàng 32','2026-01-05 17:18:27','2026-01-05 17:18:27'),(49,'CLIENT1766565306888',85723000,25030000.00,'REFUND','refund',NULL,'SUCCESS','Hoàn trả xác nhận cho yêu cầu trả hàng 4 (đơn hàng 32)','2026-01-05 17:20:34','2026-01-05 17:20:34'),(50,'STORE1766314663632',30940700,-25030000.00,'PAY_ORDER','refund',NULL,'SUCCESS','Hoàn trả trừ đi cho yêu cầu trả hàng 4 (đơn hàng 32)','2026-01-05 17:20:34','2026-01-05 17:20:34'),(51,'STORE1766314663632',20940700,10000000.00,'WITHDRAW','wallet',NULL,'SUCCESS','Rút tiền từ ví','2026-01-06 16:17:16','2026-01-06 16:17:16'),(52,'CLIENT1766565306888',65723000,-20000000.00,'PAY_ORDER','wallet',NULL,'SUCCESS','Thanh toán ví cho đơn hàng 33','2026-01-06 16:21:29','2026-01-06 16:21:29');
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
) ENGINE=InnoDB AUTO_INCREMENT=199 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_options`
--

LOCK TABLES `variant_options` WRITE;
/*!40000 ALTER TABLE `variant_options` DISABLE KEYS */;
INSERT INTO `variant_options` VALUES (1,'12123',1,4,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(2,'111',1,5,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(3,'hghh',1,6,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(4,'12123',2,4,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(5,'ddd',2,5,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(6,'hghh',2,6,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(7,'1231',3,4,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(8,'111',3,5,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(9,'hghh',3,6,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(10,'1231',4,4,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(11,'ddd',4,5,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(12,'hghh',4,6,'2025-12-21 11:25:03','2025-12-21 11:25:03'),(13,'12',5,4,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(14,'33',5,5,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(15,'333',5,6,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(16,'12',6,4,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(17,'3',6,5,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(18,'333',6,6,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(19,'12',7,4,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(20,'33',7,5,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(21,'333',7,6,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(22,'12',8,4,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(23,'3',8,5,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(24,'333',8,6,'2025-12-22 06:02:06','2025-12-22 06:02:06'),(25,'11',9,4,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(26,'212',9,5,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(27,NULL,9,6,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(28,'11',10,4,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(29,'212',10,5,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(30,NULL,10,6,'2025-12-23 11:50:15','2025-12-23 11:50:15'),(31,'size 12',11,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(32,'màu đen',11,5,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(33,NULL,11,6,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(34,'size 12',12,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(35,'màu xanh',12,5,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(36,NULL,12,6,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(37,'size 24',13,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(38,'màu đen',13,5,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(39,NULL,13,6,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(40,'size 24',14,4,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(41,'màu xanh',14,5,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(42,NULL,14,6,'2025-12-24 08:04:39','2025-12-24 08:04:39'),(43,'256GB',15,7,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(44,'Titan Đen',15,8,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(45,'8GB',15,9,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(46,'512GB',16,7,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(47,'Titan Trắng',16,8,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(48,'8GB',16,9,'2025-08-05 10:30:00','2025-08-05 10:30:00'),(49,'256GB',17,7,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(50,'Đen',17,8,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(51,'12GB',17,9,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(52,'512GB',18,7,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(53,'Tím',18,8,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(54,'12GB',18,9,'2025-08-08 14:20:00','2025-08-08 14:20:00'),(55,'18GB',19,10,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(56,'512GB SSD',19,11,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(57,'Xám',19,12,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(58,'36GB',20,10,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(59,'1TB SSD',20,11,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(60,'Bạc',20,12,'2025-08-15 11:30:00','2025-08-15 11:30:00'),(61,'55 inch',21,13,'2025-09-03 10:20:00','2025-09-03 10:20:00'),(62,'4K',21,14,'2025-09-03 10:20:00','2025-09-03 10:20:00'),(63,'OLED',21,15,'2025-09-03 10:20:00','2025-09-03 10:20:00'),(64,'65 inch',22,13,'2025-09-03 10:20:00','2025-09-03 10:20:00'),(65,'4K HDR',22,14,'2025-09-03 10:20:00','2025-09-03 10:20:00'),(66,'Mini LED',22,15,'2025-09-03 10:20:00','2025-09-03 10:20:00'),(67,'M',23,16,'2025-09-10 08:45:00','2025-09-10 08:45:00'),(68,'Trắng',23,17,'2025-09-10 08:45:00','2025-09-10 08:45:00'),(69,'Cotton',23,18,'2025-09-10 08:45:00','2025-09-10 08:45:00'),(70,'XL',24,16,'2025-09-10 08:45:00','2025-09-10 08:45:00'),(71,'Xanh dương',24,17,'2025-09-10 08:45:00','2025-09-10 08:45:00'),(72,'Oxford',24,18,'2025-09-10 08:45:00','2025-09-10 08:45:00'),(73,'S',25,19,'2025-09-18 09:50:00','2025-09-18 09:50:00'),(74,'Đỏ',25,20,'2025-09-18 09:50:00','2025-09-18 09:50:00'),(75,'Lụa',25,21,'2025-09-18 09:50:00','2025-09-18 09:50:00'),(76,'M',26,19,'2025-09-18 09:50:00','2025-09-18 09:50:00'),(77,'Đen',26,20,'2025-09-18 09:50:00','2025-09-18 09:50:00'),(78,'Nhung',26,21,'2025-09-18 09:50:00','2025-09-18 09:50:00'),(79,'41',27,22,'2025-09-25 08:30:00','2025-09-25 08:30:00'),(80,'Đen/Trắng',27,23,'2025-09-25 08:30:00','2025-09-25 08:30:00'),(81,'Da tổng hợp',27,24,'2025-09-25 08:30:00','2025-09-25 08:30:00'),(82,'43',28,22,'2025-09-25 08:30:00','2025-09-25 08:30:00'),(83,'Đỏ/Đen',28,23,'2025-09-25 08:30:00','2025-09-25 08:30:00'),(84,'Vải lưới',28,24,'2025-09-25 08:30:00','2025-09-25 08:30:00'),(85,'5.5L',29,25,'2025-10-02 13:45:00','2025-10-02 13:45:00'),(86,'Đen',29,26,'2025-10-02 13:45:00','2025-10-02 13:45:00'),(87,'1800W',29,27,'2025-10-02 13:45:00','2025-10-02 13:45:00'),(88,'7L',30,25,'2025-10-02 13:45:00','2025-10-02 13:45:00'),(89,'Trắng',30,26,'2025-10-02 13:45:00','2025-10-02 13:45:00'),(90,'2200W',30,27,'2025-10-02 13:45:00','2025-10-02 13:45:00'),(91,'Full size',31,28,'2025-10-10 14:15:00','2025-10-10 14:15:00'),(92,'Đen/Đỏ',31,29,'2025-10-10 14:15:00','2025-10-10 14:15:00'),(93,'Da PU',31,30,'2025-10-10 14:15:00','2025-10-10 14:15:00'),(94,'Full size',32,28,'2025-10-10 14:15:00','2025-10-10 14:15:00'),(95,'Xanh/Đen',32,29,'2025-10-10 14:15:00','2025-10-10 14:15:00'),(96,'Vải lưới',32,30,'2025-10-10 14:15:00','2025-10-10 14:15:00'),(97,'Đen',33,31,'2025-10-18 16:30:00','2025-10-18 16:30:00'),(98,'Bluetooth 5.3',33,32,'2025-10-18 16:30:00','2025-10-18 16:30:00'),(99,'2024',33,33,'2025-10-18 16:30:00','2025-10-18 16:30:00'),(100,'Bạc',34,31,'2025-10-18 16:30:00','2025-10-18 16:30:00'),(101,'Bluetooth 5.3',34,32,'2025-10-18 16:30:00','2025-10-18 16:30:00'),(102,'Limited Edition',34,33,'2025-10-18 16:30:00','2025-10-18 16:30:00'),(103,'110cc',35,37,'2025-10-22 09:00:00','2025-10-22 09:00:00'),(104,'Trắng ngọc',35,38,'2025-10-22 09:00:00','2025-10-22 09:00:00'),(105,'Tay ga',35,39,'2025-10-22 09:00:00','2025-10-22 09:00:00'),(106,'110cc',36,37,'2025-10-22 09:00:00','2025-10-22 09:00:00'),(107,'Đen mờ',36,38,'2025-10-22 09:00:00','2025-10-22 09:00:00'),(108,'Tay ga cao cấp',36,39,'2025-10-22 09:00:00','2025-10-22 09:00:00'),(109,'M',37,40,'2025-10-25 10:15:00','2025-10-25 10:15:00'),(110,'Đen',37,41,'2025-10-25 10:15:00','2025-10-25 10:15:00'),(111,'Adidas',37,42,'2025-10-25 10:15:00','2025-10-25 10:15:00'),(112,'L',38,40,'2025-10-25 10:15:00','2025-10-25 10:15:00'),(113,'Xanh navy',38,41,'2025-10-25 10:15:00','2025-10-25 10:15:00'),(114,'Adidas',38,42,'2025-10-25 10:15:00','2025-10-25 10:15:00'),(115,'35ml',39,43,'2025-10-28 11:30:00','2025-10-28 11:30:00'),(116,'Mọi loại da',39,44,'2025-10-28 11:30:00','2025-10-28 11:30:00'),(117,'Hàn Quốc',39,45,'2025-10-28 11:30:00','2025-10-28 11:30:00'),(118,'50ml',40,43,'2025-10-28 11:30:00','2025-10-28 11:30:00'),(119,'Da dầu',40,44,'2025-10-28 11:30:00','2025-10-28 11:30:00'),(120,'Hàn Quốc',40,45,'2025-10-28 11:30:00','2025-10-28 11:30:00'),(121,'80cm',41,46,'2025-11-01 08:45:00','2025-11-01 08:45:00'),(122,'Hồng',41,47,'2025-11-01 08:45:00','2025-11-01 08:45:00'),(123,'1-2 tuổi',41,48,'2025-11-01 08:45:00','2025-11-01 08:45:00'),(124,'100cm',42,46,'2025-11-01 08:45:00','2025-11-01 08:45:00'),(125,'Xanh',42,47,'2025-11-01 08:45:00','2025-11-01 08:45:00'),(126,'3-4 tuổi',42,48,'2025-11-01 08:45:00','2025-11-01 08:45:00'),(127,'5kg',43,49,'2025-11-03 09:30:00','2025-11-03 09:30:00'),(128,'12 tháng',43,50,'2025-11-03 09:30:00','2025-11-03 09:30:00'),(129,'Việt Nam',43,51,'2025-11-03 09:30:00','2025-11-03 09:30:00'),(130,'10kg',44,49,'2025-11-03 09:30:00','2025-11-03 09:30:00'),(131,'12 tháng',44,50,'2025-11-03 09:30:00','2025-11-03 09:30:00'),(132,'Việt Nam',44,51,'2025-11-03 09:30:00','2025-11-03 09:30:00'),(133,'Medium',45,52,'2025-11-05 10:45:00','2025-11-05 10:45:00'),(134,'Đen',45,53,'2025-11-05 10:45:00','2025-11-05 10:45:00'),(135,'Da PU',45,54,'2025-11-05 10:45:00','2025-11-05 10:45:00'),(136,'Large',46,52,'2025-11-05 10:45:00','2025-11-05 10:45:00'),(137,'Nâu',46,53,'2025-11-05 10:45:00','2025-11-05 10:45:00'),(138,'Da thật',46,54,'2025-11-05 10:45:00','2025-11-05 10:45:00'),(139,'Quartz',47,55,'2025-11-08 11:00:00','2025-11-08 11:00:00'),(140,'Đen',47,56,'2025-11-08 11:00:00','2025-11-08 11:00:00'),(141,'Nhựa',47,57,'2025-11-08 11:00:00','2025-11-08 11:00:00'),(142,'Quartz',48,55,'2025-11-08 11:00:00','2025-11-08 11:00:00'),(143,'Xanh',48,56,'2025-11-08 11:00:00','2025-11-08 11:00:00'),(144,'Kim loại',48,57,'2025-11-08 11:00:00','2025-11-08 11:00:00'),(145,'5 chiếc',49,58,'2025-11-10 13:15:00','2025-11-10 13:15:00'),(146,'Bạc',49,59,'2025-11-10 13:15:00','2025-11-10 13:15:00'),(147,'Inox 304',49,60,'2025-11-10 13:15:00','2025-11-10 13:15:00'),(148,'7 chiếc',50,58,'2025-11-10 13:15:00','2025-11-10 13:15:00'),(149,'Bạc',50,59,'2025-11-10 13:15:00','2025-11-10 13:15:00'),(150,'Inox 304',50,60,'2025-11-10 13:15:00','2025-11-10 13:15:00'),(151,'33MP',51,61,'2025-11-12 14:30:00','2025-11-12 14:30:00'),(152,'Đen',51,62,'2025-11-12 14:30:00','2025-11-12 14:30:00'),(153,'Kit 28-70mm',51,63,'2025-11-12 14:30:00','2025-11-12 14:30:00'),(154,'33MP',52,61,'2025-11-12 14:30:00','2025-11-12 14:30:00'),(155,'Đen',52,62,'2025-11-12 14:30:00','2025-11-12 14:30:00'),(156,'Kit 24-105mm',52,63,'2025-11-12 14:30:00','2025-11-12 14:30:00'),(157,'Bi',53,64,'2025-11-15 15:45:00','2025-11-15 15:45:00'),(158,'Xanh',53,65,'2025-11-15 15:45:00','2025-11-15 15:45:00'),(159,'Thiên Long',53,66,'2025-11-15 15:45:00','2025-11-15 15:45:00'),(160,'Bi',54,64,'2025-11-15 15:45:00','2025-11-15 15:45:00'),(161,'Đen',54,65,'2025-11-15 15:45:00','2025-11-15 15:45:00'),(162,'Thiên Long',54,66,'2025-11-15 15:45:00','2025-11-15 15:45:00'),(163,'1m3*2m',82,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(164,'vàng',82,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(165,'gỗ sồi',82,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(166,'1m3*2m',83,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(167,'vàng',83,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(168,'gỗ thông',83,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(169,'1m3*2m',84,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(170,'vàng',84,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(171,'gỗ ép',84,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(172,'1m3*2m',85,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(173,'đen',85,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(174,'gỗ sồi',85,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(175,'1m3*2m',86,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(176,'đen',86,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(177,'gỗ thông',86,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(178,'1m3*2m',87,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(179,'đen',87,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(180,'gỗ ép',87,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(181,'1m5*2m3',88,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(182,'vàng',88,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(183,'gỗ sồi',88,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(184,'1m5*2m3',89,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(185,'vàng',89,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(186,'gỗ thông',89,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(187,'1m5*2m3',90,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(188,'vàng',90,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(189,'gỗ ép',90,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(190,'1m5*2m3',91,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(191,'đen',91,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(192,'gỗ sồi',91,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(193,'1m5*2m3',92,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(194,'đen',92,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(195,'gỗ thông',92,30,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(196,'1m5*2m3',93,28,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(197,'đen',93,29,'2026-01-05 15:55:33','2026-01-05 15:55:33'),(198,'gỗ ép',93,30,'2026-01-05 15:55:33','2026-01-05 15:55:33');
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

-- Dump completed on 2026-01-06 23:40:02
