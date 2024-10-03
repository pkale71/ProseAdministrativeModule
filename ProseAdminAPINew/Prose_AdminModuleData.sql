-- MySQL dump 10.13  Distrib 5.6.43, for Win64 (x86_64)
--
-- Host: localhost    Database: prose_administrative
-- ------------------------------------------------------
-- Server version	5.6.43-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_session`
--

DROP TABLE IF EXISTS `academic_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academic_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` varchar(30) NOT NULL,
  `batch_year` varchar(10) NOT NULL,
  `is_current_session` int(11) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_session`
--

LOCK TABLES `academic_session` WRITE;
/*!40000 ALTER TABLE `academic_session` DISABLE KEYS */;
INSERT INTO `academic_session` VALUES (1,'2024-2025','2024',1,'2024-09-02 16:22:24',1,'2024-09-02 16:25:35',1);
/*!40000 ALTER TABLE `academic_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academy_enclosure_document`
--

DROP TABLE IF EXISTS `academy_enclosure_document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academy_enclosure_document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academy_enclosure_document`
--

LOCK TABLES `academy_enclosure_document` WRITE;
/*!40000 ALTER TABLE `academy_enclosure_document` DISABLE KEYS */;
INSERT INTO `academy_enclosure_document` VALUES (1,'Pan',1,'2024-06-21 18:53:43',4),(2,'GST Certificate',1,'2024-06-21 18:53:55',4),(3,'License Certificate',1,'2024-07-11 19:26:11',4);
/*!40000 ALTER TABLE `academy_enclosure_document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_type`
--

DROP TABLE IF EXISTS `batch_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `batch_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `applicable_from_year_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_type`
--

LOCK TABLES `batch_type` WRITE;
/*!40000 ALTER TABLE `batch_type` DISABLE KEYS */;
INSERT INTO `batch_type` VALUES (1,'Morning','07:00:00','12:00:00',1,1,'2024-09-03 11:05:40',1,NULL,NULL),(2,'Evening','12:00:00','17:00:00',1,1,'2024-09-03 11:06:51',1,'2024-09-03 11:10:11',1);
/*!40000 ALTER TABLE `batch_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_partner`
--

DROP TABLE IF EXISTS `business_partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_partner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `code` varchar(10) NOT NULL,
  `business_partner_type_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `business_vertical_id` int(11) NOT NULL,
  `business_vertical_type_ids` text NOT NULL,
  `address` text NOT NULL,
  `country_id` int(11) NOT NULL,
  `state_region_id` int(11) NOT NULL,
  `district_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `pincode` varchar(9) NOT NULL,
  `contact_person` text,
  `contact_email` varchar(150) DEFAULT NULL,
  `contact_mobile` varchar(15) DEFAULT NULL,
  `incharge_person` text,
  `incharge_email` varchar(150) DEFAULT NULL,
  `incharge_mobile` varchar(15) DEFAULT NULL,
  `applicable_from` date NOT NULL,
  `applicable_to` date NOT NULL,
  `is_having_contract` int(11) DEFAULT NULL,
  `current_contract_history_id` int(11) DEFAULT NULL,
  `reward_applicable` int(11) DEFAULT NULL,
  `commission_term_id` int(11) DEFAULT NULL,
  `pan_number` varchar(10) DEFAULT NULL,
  `gst_number` varchar(15) DEFAULT NULL,
  `commercial_term_id` int(11) DEFAULT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  `deleted_on` datetime DEFAULT NULL,
  `deleted_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_partner`
--

LOCK TABLES `business_partner` WRITE;
/*!40000 ALTER TABLE `business_partner` DISABLE KEYS */;
INSERT INTO `business_partner` VALUES (1,'Just Game LLP - Just Cricket','RP-000001',1,'info@justcric.com',1,'3,1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490023','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,NULL,NULL,'2022-04-01','2027-03-31',1,10,1,1,'AAMF13029Q','29AAMF13029Q1ZN',NULL,1,'2024-06-28 12:27:18',4,NULL,NULL,'a8ca8b10-351b-11ef-ac9e-9528e9adec92',NULL,NULL),(2,'Just Game LLP - Just Cricket-1','RP-000002',1,'info-1@justcric.com',1,'3,1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490023','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,NULL,NULL,'2022-04-01','2027-03-31',0,NULL,1,1,'AAMF13029Q','29AAMF13029Q1ZN',NULL,1,'2024-06-28 12:35:46',4,NULL,NULL,'d7b25600-351c-11ef-a0e6-e31ab257a17b',NULL,NULL),(3,'Just Game LLP - Just Cricket-2','RP-000003',1,'info-2@justcric.com',1,'1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490001','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,'tnaas3@gmail.com','9448505903','2021-04-01','2024-12-31',1,3,0,1,NULL,NULL,NULL,0,'2024-06-28 12:37:08',4,'2024-07-12 11:24:10',4,'083ca2d0-351d-11ef-a6a9-598cb34e38bd','2024-07-04 10:23:14',4),(4,'Just Game LLP - Just Cricket-3','RP-000004',1,'info-3@justcric.com',1,'3,1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490023','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,NULL,NULL,'2022-04-01','2027-03-31',1,11,1,1,'AAMF13029Q','29AAMF13029Q1ZN',NULL,1,'2024-07-25 11:33:52',4,NULL,NULL,'ab3d2b10-4a4b-11ef-bd40-d3d120286f56',NULL,NULL),(5,'Just Game LLP - Just Cricket-34','RP-000005',1,'info-34@justcric.com',1,'3,1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490023','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,NULL,NULL,'2022-04-01','2027-03-31',1,12,1,1,'AAMF13029Q','29AAMF13029Q1ZN',NULL,1,'2024-07-25 11:35:08',4,NULL,NULL,'d82746b0-4a4b-11ef-a62d-e3f941a30cfc',NULL,NULL),(6,'Just Game LLP - Just Cricket-4','RP-000006',1,'info-4@justcric.com',1,'3,1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490023','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,NULL,NULL,'2022-04-01','2027-03-31',1,13,1,1,'AAMF13029Q','29AAMF13029Q1ZN',NULL,1,'2024-07-25 11:36:01',4,NULL,NULL,'f812d0c0-4a4b-11ef-b4c4-2ded99e9605b',NULL,NULL),(7,'Just Game LLP - Just Cricket-5','RP-000007',1,'info-5@justcric.com',1,'3,1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490023','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,NULL,NULL,'2022-04-01','2027-03-31',1,14,1,1,'AAMF13029Q','29AAMF13029Q1ZN',NULL,1,'2024-07-25 11:40:27',4,NULL,NULL,'96535bb0-4a4c-11ef-8e81-3597d148b6c0',NULL,NULL);
/*!40000 ALTER TABLE `business_partner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_partner_coach`
--

DROP TABLE IF EXISTS `business_partner_coach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_partner_coach` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_partner_id` int(11) NOT NULL,
  `coach_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_partner_coach`
--

LOCK TABLES `business_partner_coach` WRITE;
/*!40000 ALTER TABLE `business_partner_coach` DISABLE KEYS */;
INSERT INTO `business_partner_coach` VALUES (1,1,2,1,'2024-07-03 17:59:22',4,NULL,NULL),(4,1,5,1,'2024-09-19 17:15:59',12,NULL,NULL),(5,1,6,1,'2024-09-19 17:17:23',12,NULL,NULL);
/*!40000 ALTER TABLE `business_partner_coach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_partner_contract_history`
--

DROP TABLE IF EXISTS `business_partner_contract_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_partner_contract_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_partner_id` int(11) NOT NULL,
  `contract_from` date NOT NULL,
  `contract_to` date NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_partner_contract_history`
--

LOCK TABLES `business_partner_contract_history` WRITE;
/*!40000 ALTER TABLE `business_partner_contract_history` DISABLE KEYS */;
INSERT INTO `business_partner_contract_history` VALUES (3,3,'2024-01-01','2024-12-31',1,'2024-06-28 12:37:08',4,NULL,NULL),(9,1,'2019-01-01','2020-12-31',0,'2024-06-29 11:22:35',4,'2024-06-29 11:51:30',4),(10,1,'2022-01-01','2023-12-31',1,'2024-06-29 11:51:30',4,NULL,NULL),(11,4,'2024-01-01','2024-12-31',1,'2024-07-25 11:33:52',4,NULL,NULL),(12,5,'2024-01-01','2024-12-31',1,'2024-07-25 11:35:08',4,NULL,NULL),(13,6,'2024-01-01','2024-12-31',1,'2024-07-25 11:36:01',4,NULL,NULL),(14,7,'2024-01-01','2024-12-31',1,'2024-07-25 11:40:27',4,NULL,NULL);
/*!40000 ALTER TABLE `business_partner_contract_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_partner_doc_upload`
--

DROP TABLE IF EXISTS `business_partner_doc_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_partner_doc_upload` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_partner_id` int(11) NOT NULL,
  `academy_enclosure_document_id` int(11) NOT NULL,
  `file_name` text NOT NULL,
  `uploaded_on` datetime NOT NULL,
  `uploaded_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_partner_doc_upload`
--

LOCK TABLES `business_partner_doc_upload` WRITE;
/*!40000 ALTER TABLE `business_partner_doc_upload` DISABLE KEYS */;
INSERT INTO `business_partner_doc_upload` VALUES (3,2,1,'RP-000002_3.pdf','2024-06-28 12:35:46',4,NULL,NULL),(4,2,2,'RP-000002_4.xlsx','2024-06-28 12:35:46',4,NULL,NULL),(5,3,1,'RP-000003_5.pdf','2024-06-28 12:37:08',4,NULL,NULL),(6,3,2,'RP-000003_6.xlsx','2024-06-28 12:37:08',4,NULL,NULL),(9,1,2,'RP-000001_9.docx','2024-07-03 15:44:37',4,'2024-07-03 15:45:19',4),(10,1,3,'RP-000001_10.pdf','2024-09-19 17:15:15',12,NULL,NULL);
/*!40000 ALTER TABLE `business_partner_doc_upload` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_partner_type`
--

DROP TABLE IF EXISTS `business_partner_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_partner_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_partner_type`
--

LOCK TABLES `business_partner_type` WRITE;
/*!40000 ALTER TABLE `business_partner_type` DISABLE KEYS */;
INSERT INTO `business_partner_type` VALUES (1,'B2C','Referral Partner'),(2,'B2B','Business Partner');
/*!40000 ALTER TABLE `business_partner_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_vertical`
--

DROP TABLE IF EXISTS `business_vertical`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_vertical` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_vertical`
--

LOCK TABLES `business_vertical` WRITE;
/*!40000 ALTER TABLE `business_vertical` DISABLE KEYS */;
INSERT INTO `business_vertical` VALUES (1,'Sporting',1,'2024-06-19 16:31:03',1,NULL,NULL);
/*!40000 ALTER TABLE `business_vertical` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_vertical_group`
--

DROP TABLE IF EXISTS `business_vertical_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_vertical_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `business_vertical_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_vertical_group`
--

LOCK TABLES `business_vertical_group` WRITE;
/*!40000 ALTER TABLE `business_vertical_group` DISABLE KEYS */;
INSERT INTO `business_vertical_group` VALUES (1,'Team Soprt',1,1,'2024-06-20 11:33:30',4,'2024-06-20 11:40:22',4),(2,'Team Soprt 11',1,1,'2024-06-27 15:36:51',4,NULL,NULL),(3,'Team Soprt 12',1,1,'2024-06-27 15:36:51',4,NULL,NULL),(10,'Team Soprt 11',1,1,'2024-06-27 15:47:47',4,NULL,NULL),(11,'Team Soprt 12',1,1,'2024-06-27 15:47:47',4,NULL,NULL),(12,'Team Soprt 11',1,1,'2024-06-27 15:49:16',4,NULL,NULL),(13,'Team Soprt 12',1,1,'2024-06-27 15:49:16',4,NULL,NULL),(14,'Team Soprt 11',1,1,'2024-06-27 15:50:17',4,NULL,NULL),(15,'Team Soprt 12',1,1,'2024-06-27 15:50:17',4,NULL,NULL),(16,'Team Soprt 11',1,1,'2024-06-27 15:50:37',4,NULL,NULL),(17,'Team Soprt 12',1,1,'2024-06-27 15:50:37',4,NULL,NULL);
/*!40000 ALTER TABLE `business_vertical_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_vertical_type`
--

DROP TABLE IF EXISTS `business_vertical_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_vertical_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `business_vertical_id` int(11) NOT NULL,
  `business_vertical_group_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_vertical_type`
--

LOCK TABLES `business_vertical_type` WRITE;
/*!40000 ALTER TABLE `business_vertical_type` DISABLE KEYS */;
INSERT INTO `business_vertical_type` VALUES (1,'Cricket',1,1,1,'2024-06-20 13:51:22',4,'2024-06-20 13:56:44',4),(2,'Foot Ball',1,1,1,'2024-06-26 13:27:22',4,NULL,NULL),(3,'Basket Ball',1,1,1,'2024-06-26 13:28:04',4,NULL,NULL),(4,'Golf',1,1,1,'2024-06-27 16:00:13',4,NULL,NULL);
/*!40000 ALTER TABLE `business_vertical_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chapter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `applicable_from_year_id` int(11) NOT NULL,
  `effective_till_year_id` int(11) DEFAULT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter`
--

LOCK TABLES `chapter` WRITE;
/*!40000 ALTER TABLE `chapter` DISABLE KEYS */;
INSERT INTO `chapter` VALUES (1,3,'ABC-1',1,NULL,1,'2024-09-19 17:10:44',13,'2024-09-19 17:11:13',13),(2,3,'abc-2',1,NULL,1,'2024-09-19 17:10:44',13,NULL,NULL);
/*!40000 ALTER TABLE `chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `country_id` int(11) NOT NULL,
  `state_region_id` int(11) NOT NULL,
  `district_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'Anantapur',1,1,1,1,'2024-10-02 19:37:30',1,NULL,NULL),(2,'Hindupur',1,1,1,1,'2024-10-02 19:37:30',1,NULL,NULL),(3,'Chittoor',1,1,2,1,'2024-10-02 19:37:30',1,NULL,NULL),(4,'Tirupati',1,1,2,1,'2024-10-02 19:37:30',1,NULL,NULL),(5,'Kakinada',1,1,3,1,'2024-10-02 19:37:30',1,NULL,NULL),(6,'Rajahmundry',1,1,3,1,'2024-10-02 19:37:30',1,NULL,NULL),(7,'Guntur',1,1,4,1,'2024-10-02 19:37:30',1,NULL,NULL),(8,'Tenali',1,1,4,1,'2024-10-02 19:37:30',1,NULL,NULL),(9,'Vijayawada',1,1,5,1,'2024-10-02 19:37:30',1,NULL,NULL),(10,'Machilipatnam',1,1,5,1,'2024-10-02 19:37:30',1,NULL,NULL),(11,'Kurnool',1,1,6,1,'2024-10-02 19:37:30',1,NULL,NULL),(12,'Nandyal',1,1,6,1,'2024-10-02 19:37:30',1,NULL,NULL),(13,'Ongole',1,1,7,1,'2024-10-02 19:37:30',1,NULL,NULL),(14,'Nellore',1,1,8,1,'2024-10-02 19:37:30',1,NULL,NULL),(15,'Srikakulam',1,1,9,1,'2024-10-02 19:37:30',1,NULL,NULL),(16,'Visakhapatnam',1,1,10,1,'2024-10-02 19:37:30',1,NULL,NULL),(17,'Vizianagaram',1,1,11,1,'2024-10-02 19:37:30',1,NULL,NULL),(18,'Eluru',1,1,12,1,'2024-10-02 19:37:30',1,NULL,NULL),(19,'Kadapa',1,1,13,1,'2024-10-02 19:37:30',1,NULL,NULL),(20,'Proddatur',1,1,13,1,'2024-10-02 19:37:30',1,NULL,NULL);
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coach`
--

DROP TABLE IF EXISTS `coach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coach` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `name` text NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `business_vertical_type_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coach`
--

LOCK TABLES `coach` WRITE;
/*!40000 ALTER TABLE `coach` DISABLE KEYS */;
INSERT INTO `coach` VALUES (2,'C-000002','Manish Kumar Mehta','manish551@gmail.com','9994848830',1,0,'2024-06-21 11:17:58',4,'2024-06-21 11:30:34',4,'d04e98f0-2f91-11ef-b305-5dd7364747d2'),(5,'C-000005','Mukesh Pandit','mukesh1345@gmail.com','7773399302',1,0,'2024-06-26 12:59:10',4,NULL,NULL,'c7c95300-338d-11ef-bca2-21b3eedfc717'),(6,'C-000006','Rohit Singh','rohit99448@gmail.com','7713399302',1,1,'2024-06-26 12:59:54',4,NULL,NULL,'e21ecf50-338d-11ef-bca2-21b3eedfc717');
/*!40000 ALTER TABLE `coach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commercial_term`
--

DROP TABLE IF EXISTS `commercial_term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commercial_term` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commercial_term`
--

LOCK TABLES `commercial_term` WRITE;
/*!40000 ALTER TABLE `commercial_term` DISABLE KEYS */;
INSERT INTO `commercial_term` VALUES (1,'Consolidated Fee'),(2,'Per Student Variable'),(3,'MG & Per Student Variable');
/*!40000 ALTER TABLE `commercial_term` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commission_term`
--

DROP TABLE IF EXISTS `commission_term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commission_term` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commission_term`
--

LOCK TABLES `commission_term` WRITE;
/*!40000 ALTER TABLE `commission_term` DISABLE KEYS */;
INSERT INTO `commission_term` VALUES (1,'Fixed'),(2,'Variable'),(3,'MG + Variable');
/*!40000 ALTER TABLE `commission_term` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (1,'India',1,'2024-06-24 14:09:22',4,'2024-07-04 16:46:31',4),(3,'USA',1,'2024-06-24 14:09:44',4,NULL,NULL),(22,'Nepal',1,'2024-07-04 16:35:54',4,'2024-07-04 16:46:31',4),(23,'Westindies',1,'2024-07-04 16:35:54',4,'2024-07-04 16:46:31',4),(40,'Afganistan',1,'2024-07-04 17:43:17',1,NULL,NULL),(41,'Pakistan',1,'2024-07-04 17:43:17',1,NULL,NULL),(42,'Russia',1,'2024-07-04 17:43:17',1,NULL,NULL),(43,'England',1,'2024-07-04 17:43:17',1,NULL,NULL),(44,'Saudi Arab',1,'2024-07-04 17:43:17',1,NULL,NULL);
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_mode`
--

DROP TABLE IF EXISTS `delivery_mode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery_mode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_mode`
--

LOCK TABLES `delivery_mode` WRITE;
/*!40000 ALTER TABLE `delivery_mode` DISABLE KEYS */;
INSERT INTO `delivery_mode` VALUES (1,'Online'),(2,'Offline'),(3,'Hybrid');
/*!40000 ALTER TABLE `delivery_mode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `district`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `district` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `country_id` int(11) NOT NULL,
  `state_region_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `district`
--

LOCK TABLES `district` WRITE;
/*!40000 ALTER TABLE `district` DISABLE KEYS */;
INSERT INTO `district` VALUES (1,'Anantapur',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(2,'Chittoor',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(3,'East Godavari',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(4,'Guntur',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(5,'Krishna',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(6,'Kurnool',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(7,'Prakasam',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(8,'Sri Potti Sriramulu Nellore',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(9,'Srikakulam',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(10,'Visakhapatnam',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(11,'Vizianagaram',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(12,'West Godavari',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(13,'YSR Kadapa',1,1,1,'2024-10-02 19:33:42',1,NULL,NULL),(14,'Anjaw',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(15,'Changlang',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(16,'Dibang Valley',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(17,'East Kameng',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(18,'East Siang',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(19,'Kamle',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(20,'Kra Daadi',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(21,'Kurung Kumey',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(22,'Lepa Rada',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(23,'Lohit',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(24,'Longding',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(25,'Lower Dibang Valley',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(26,'Lower Siang',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(27,'Lower Subansiri',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(28,'Namsai',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(29,'Pakke-Kessang',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(30,'Papum Pare',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(31,'Shi Yomi',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(32,'Siang',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(33,'Tawang',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(34,'Tirap',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(35,'Upper Siang',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(36,'Upper Subansiri',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(37,'West Kameng',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL),(38,'West Siang',1,2,1,'2024-10-02 19:41:17',1,NULL,NULL);
/*!40000 ALTER TABLE `district` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade`
--

DROP TABLE IF EXISTS `grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade_category_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade`
--

LOCK TABLES `grade` WRITE;
/*!40000 ALTER TABLE `grade` DISABLE KEYS */;
INSERT INTO `grade` VALUES (2,2,'UKG',1,'2024-06-04 12:58:49',4),(4,3,'Class-1',1,'2024-06-04 13:02:42',4),(5,3,'Class-2',1,'2024-06-04 13:02:48',4),(6,2,'LKG',1,'2024-07-17 15:38:08',13),(7,3,'Class-3',1,'2024-07-17 15:40:06',13),(8,5,'Class-4',1,'2024-07-17 15:40:18',13),(9,7,'Class-11',1,'2024-08-30 11:36:06',1),(10,7,'Class-12',1,'2024-08-30 11:36:06',1);
/*!40000 ALTER TABLE `grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade_category`
--

DROP TABLE IF EXISTS `grade_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grade_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_category`
--

LOCK TABLES `grade_category` WRITE;
/*!40000 ALTER TABLE `grade_category` DISABLE KEYS */;
INSERT INTO `grade_category` VALUES (2,'Pre-Primary',1,'2024-05-30 11:48:53',4),(3,'Primary',1,'2024-05-30 11:48:58',4),(4,'Middle',1,'2024-05-30 11:49:57',4),(5,'Secondary',1,'2024-05-30 11:50:05',4),(7,'Senior Secondary',0,'2024-07-17 12:42:07',13);
/*!40000 ALTER TABLE `grade_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,'LMS'),(2,'E-Resource'),(3,'Admission');
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school`
--

DROP TABLE IF EXISTS `school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `school` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `code` varchar(10) NOT NULL,
  `schooling_group_id` int(11) NOT NULL,
  `school_sub_group_id` int(11) NOT NULL,
  `schooling_category_id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile1` varchar(15) NOT NULL,
  `mobile2` varchar(15) DEFAULT NULL,
  `landline1` varchar(15) DEFAULT NULL,
  `landline2` varchar(15) DEFAULT NULL,
  `website` text,
  `address` text NOT NULL,
  `logo_file_name` text,
  `country_id` int(11) NOT NULL,
  `state_region_id` int(11) NOT NULL,
  `district_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `pincode` varchar(9) NOT NULL,
  `contract_from` date DEFAULT NULL,
  `contract_to` date DEFAULT NULL,
  `delivery_mode_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `uuid` varchar(36) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  `deleted_on` datetime DEFAULT NULL,
  `deleted_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school`
--

LOCK TABLES `school` WRITE;
/*!40000 ALTER TABLE `school` DISABLE KEYS */;
INSERT INTO `school` VALUES (1,'Krishna Public School-Bhilai','SV-000001',1,1,1,'kpsbhilai@gmail.com','9998745621',NULL,NULL,NULL,'https://www.kpsbhilai.com','Nehru Nagar, Bhilai','SV-000001.jpg',1,4,3,1,'490025',NULL,NULL,1,1,'27d36830-7a60-11ef-bf1c-5551c94fc247','2024-09-24 16:01:27',4,'2024-09-27 10:18:37',12,NULL,NULL),(2,'Krishna Public School-Durg','SV-000002',1,2,1,'kpsdurg@gmail.com','9998745621','89788775654',NULL,NULL,'https://www.kpsdurg.com','Nehru Nagar, Bhilai','SV-000002.jpg',1,4,3,1,'490025',NULL,NULL,2,1,'69aae030-7a60-11ef-bf1c-5551c94fc247','2024-09-24 16:03:18',4,'2024-09-27 12:56:13',12,NULL,NULL),(3,'Krishna Public School-Raipur','SV-000003',1,2,1,'kpsraipur@gmail.com','9998745621',NULL,NULL,NULL,'https://www.kpsdurg.com','Nehru Nagar, Bhilai','SV-000003.png',1,4,3,1,'490025',NULL,NULL,3,1,'84019500-7a60-11ef-bf1c-5551c94fc247','2024-09-24 16:04:02',4,'2024-09-24 17:43:59',4,NULL,NULL),(4,'MGM-Bhilai','SV-000004',1,2,1,'mgmbhilai@gmail.com','09993443707',NULL,NULL,NULL,NULL,'H.No.-1087 Near Puri I.T.I.','SV-000004.png',1,4,3,1,'490023',NULL,NULL,1,1,'7113b440-7b33-11ef-bbbd-73f9701af5b0','2024-09-25 17:13:54',12,'2024-09-25 17:13:54',12,NULL,NULL),(5,'Mile Stone-Junwani Road','SV-000005',2,1,1,'milestone@gmail.com','09993443707','99484838829','5694995553',NULL,'https://www.milestone.org','H.No.-1087 Near Puri I.T.I.',NULL,1,4,3,26,'490023',NULL,NULL,1,1,'d1e4ba90-7b46-11ef-bbbd-73f9701af5b0','2024-09-25 19:32:37',12,NULL,NULL,NULL,NULL),(7,'Demo School','SV-000007',2,1,1,'demoSchool@gmail.com','5652164613','464513645564',NULL,NULL,'https://www.demoschool.com','St-2, Saket Nagar, Bhilai','SV-000007.jpg',1,4,3,1,'490023','2024-10-04','2024-10-04',2,1,'c07df830-80bd-11ef-b34b-b1119743b54d','2024-10-02 18:26:33',12,'2024-10-02 18:55:31',12,NULL,NULL);
/*!40000 ALTER TABLE `school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_schooling_program_detail`
--

DROP TABLE IF EXISTS `school_schooling_program_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `school_schooling_program_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `academic_session_id` int(11) NOT NULL,
  `schooling_program_id` int(11) NOT NULL,
  `admission_start_date` date NOT NULL,
  `admission_end_date` date NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `batch_type_ids` text NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `uuid` varchar(36) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_schooling_program_detail`
--

LOCK TABLES `school_schooling_program_detail` WRITE;
/*!40000 ALTER TABLE `school_schooling_program_detail` DISABLE KEYS */;
INSERT INTO `school_schooling_program_detail` VALUES (3,1,1,4,'2024-09-26','2024-09-30','2024-10-01','2024-11-30','1,2',1,'eedf6da0-7b43-11ef-bbbd-73f9701af5b0','2024-09-25 19:11:57',4,NULL,NULL),(4,1,1,3,'2024-09-26','2024-10-01','2024-10-01','2024-11-30','2',1,'045ac640-7b51-11ef-a03e-3f5828887d31','2024-09-25 20:45:36',4,'2024-09-26 20:04:23',12),(6,1,1,1,'2024-09-26','2024-09-30','2024-10-01','2024-10-31','2',1,'1c7d4dd0-7bd1-11ef-9b8a-45e5a4b6e0f5','2024-09-26 12:02:32',12,NULL,NULL),(7,2,1,1,'2024-09-27','2024-10-01','2024-10-05','2024-12-29','2,1',1,'f7193f20-7c8b-11ef-a1b9-b1512f219fc0','2024-09-27 10:20:05',12,NULL,NULL);
/*!40000 ALTER TABLE `school_schooling_program_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_sub_group`
--

DROP TABLE IF EXISTS `school_sub_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `school_sub_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_sub_group`
--

LOCK TABLES `school_sub_group` WRITE;
/*!40000 ALTER TABLE `school_sub_group` DISABLE KEYS */;
INSERT INTO `school_sub_group` VALUES (1,'Sports',1,'2024-09-03 10:56:14',1),(2,'Music',1,'2024-09-03 10:56:25',1);
/*!40000 ALTER TABLE `school_sub_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schooling_category`
--

DROP TABLE IF EXISTS `schooling_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schooling_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schooling_category`
--

LOCK TABLES `schooling_category` WRITE;
/*!40000 ALTER TABLE `schooling_category` DISABLE KEYS */;
INSERT INTO `schooling_category` VALUES (1,'K-12',1,'2024-08-30 11:20:34',1);
/*!40000 ALTER TABLE `schooling_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schooling_group`
--

DROP TABLE IF EXISTS `schooling_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schooling_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schooling_group`
--

LOCK TABLES `schooling_group` WRITE;
/*!40000 ALTER TABLE `schooling_group` DISABLE KEYS */;
INSERT INTO `schooling_group` VALUES (1,'School Group-1',1,'2024-08-29 19:44:40',1),(2,'School Group-2',1,'2024-08-29 19:44:51',1);
/*!40000 ALTER TABLE `schooling_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schooling_program`
--

DROP TABLE IF EXISTS `schooling_program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schooling_program` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `schooling_category_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schooling_program`
--

LOCK TABLES `schooling_program` WRITE;
/*!40000 ALTER TABLE `schooling_program` DISABLE KEYS */;
INSERT INTO `schooling_program` VALUES (1,'Schooling program-1',1,1,'2024-09-02 15:30:02',1,NULL,NULL),(3,'Schooling program-3',1,1,'2024-09-02 15:59:35',1,NULL,NULL),(4,'Schooling program-4',1,1,'2024-09-02 15:59:35',1,NULL,NULL);
/*!40000 ALTER TABLE `schooling_program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state_region`
--

DROP TABLE IF EXISTS `state_region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `state_region` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `country_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state_region`
--

LOCK TABLES `state_region` WRITE;
/*!40000 ALTER TABLE `state_region` DISABLE KEYS */;
INSERT INTO `state_region` VALUES (1,'Andhra Pradesh',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(2,'Arunachal Pradesh',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(3,'Assam',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(4,'Bihar',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(5,'Chhattisgarh',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(6,'Goa',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(7,'Gujarat',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(8,'Haryana',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(9,'Himachal Pradesh',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(10,'Jharkhand',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(11,'Karnataka',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(12,'Kerala',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(13,'Madhya Pradesh',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(14,'Maharashtra',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(15,'Manipur',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(16,'Meghalaya',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(17,'Mizoram',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(18,'Nagaland',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(19,'Odisha',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(20,'Punjab',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(21,'Rajasthan',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(22,'Sikkim',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(23,'Tamil Nadu',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(24,'Telangana',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(25,'Tripura',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(26,'Uttar Pradesh',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(27,'Uttarakhand',1,1,'2024-10-02 19:26:59',1,NULL,NULL),(28,'West Bengal',1,1,'2024-10-02 19:26:59',1,NULL,NULL);
/*!40000 ALTER TABLE `state_region` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_center`
--

DROP TABLE IF EXISTS `study_center`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_center` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_partner_id` int(11) DEFAULT NULL,
  `name` text NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `mobile` varchar(15) NOT NULL,
  `email` varchar(150) NOT NULL,
  `country_id` int(11) NOT NULL,
  `state_region_id` int(11) NOT NULL,
  `district_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `pincode` varchar(9) NOT NULL,
  `address` text NOT NULL,
  `study_center_type_id` int(11) NOT NULL,
  `pan_number` varchar(10) DEFAULT NULL,
  `gst_number` varchar(15) DEFAULT NULL,
  `landlord_name` text,
  `contact_person_name` text,
  `contact_person_email` varchar(150) DEFAULT NULL,
  `contact_person_mobile` varchar(15) DEFAULT NULL,
  `current_agreement_history_id` int(11) DEFAULT NULL,
  `study_center_reward_type_id` int(11) DEFAULT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `uuid` varchar(36) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  `deleted_on` datetime DEFAULT NULL,
  `deleted_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_center`
--

LOCK TABLES `study_center` WRITE;
/*!40000 ALTER TABLE `study_center` DISABLE KEYS */;
INSERT INTO `study_center` VALUES (1,NULL,'Krishna Public School-2','CW-000001','994589435851','kpsbhilai22@gmail.com',1,4,3,1,'4900452','Nehru Nagar',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'92355320-4034-11ef-a7fe-ad56391774c9','2024-07-12 15:23:20',4,'2024-07-13 11:00:39',4,NULL,NULL),(3,NULL,'Krishna Public School-3','CO-000003','777589435851','kpsbhilai23@gmail.com',1,4,3,1,'4900452','Nehru Nagar',2,'AAMF13029Q','29AAMF13029Q1ZN','Kamlesh','Rohit Sinha','rohit124@gmail.com','998584939383',2,2,1,'1a74b8c0-40da-11ef-a20a-b771b1bb406c','2024-07-13 11:08:16',4,NULL,NULL,NULL,NULL),(4,NULL,'Krishna Public School-4','CO-000004','777589435859','kpsbhilai24@gmail.com',1,4,3,1,'4900452','Nehru Nagar',2,'AAMF13029Q','29AAMF13029Q1ZN','Kamlesh','Rohit Sinha','rohit124@gmail.com','998584939383',4,2,1,'74e5a530-40da-11ef-a20a-b771b1bb406c','2024-07-13 11:10:48',4,NULL,NULL,NULL,NULL),(5,2,'Krishna\'s Public School-9','PC-000005','994589435856','kpsbhilai29@gmail.com',1,4,3,1,'4900452','Nehru Nagar',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'926d4ea0-40da-11ef-a20a-b771b1bb406c','2024-07-13 11:11:37',4,'2024-07-13 11:30:37',4,'2024-07-13 11:36:38',4),(6,2,'Krishna Public School-5','PC-000006','777589435852','kpsbhilai25@gmail.com',1,4,3,1,'4900452','Nehru Nagar',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'a20de5d0-40db-11ef-ad02-6522ae59098b','2024-07-13 11:19:13',4,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `study_center` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_center_agreement_history`
--

DROP TABLE IF EXISTS `study_center_agreement_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_center_agreement_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `study_center_id` int(11) NOT NULL,
  `agreement_from` date NOT NULL,
  `agreement_to` date NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_center_agreement_history`
--

LOCK TABLES `study_center_agreement_history` WRITE;
/*!40000 ALTER TABLE `study_center_agreement_history` DISABLE KEYS */;
INSERT INTO `study_center_agreement_history` VALUES (2,3,'2023-06-01','2024-06-30',1,'2024-07-13 11:08:16',4,NULL,NULL),(4,4,'2024-07-01','2025-06-30',1,'2024-07-15 19:23:32',4,NULL,NULL);
/*!40000 ALTER TABLE `study_center_agreement_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_center_doc_upload`
--

DROP TABLE IF EXISTS `study_center_doc_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_center_doc_upload` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `study_center_id` int(11) NOT NULL,
  `academy_enclosure_document_id` int(11) NOT NULL,
  `file_name` text NOT NULL,
  `uploaded_on` datetime NOT NULL,
  `uploaded_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_center_doc_upload`
--

LOCK TABLES `study_center_doc_upload` WRITE;
/*!40000 ALTER TABLE `study_center_doc_upload` DISABLE KEYS */;
INSERT INTO `study_center_doc_upload` VALUES (1,1,1,'CW-000001_1.xlsx','2024-07-12 15:23:20',4,NULL,NULL),(2,1,2,'CW-000001_2.pdf','2024-07-12 15:23:20',4,NULL,NULL),(4,3,3,'CO-000003_4.pdf','2024-07-13 11:08:16',4,NULL,NULL),(5,4,3,'CO-000004_5.pdf','2024-07-13 11:10:48',4,NULL,NULL),(6,5,3,'PC-000005_6.pdf','2024-07-13 11:11:37',4,NULL,NULL),(7,6,3,'PC-000006_7.pdf','2024-07-13 11:19:13',4,NULL,NULL);
/*!40000 ALTER TABLE `study_center_doc_upload` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_center_reward_type`
--

DROP TABLE IF EXISTS `study_center_reward_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_center_reward_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_center_reward_type`
--

LOCK TABLES `study_center_reward_type` WRITE;
/*!40000 ALTER TABLE `study_center_reward_type` DISABLE KEYS */;
INSERT INTO `study_center_reward_type` VALUES (1,'Rent'),(2,'Revenue Sharing'),(3,'Rent & Revenue Sharing');
/*!40000 ALTER TABLE `study_center_reward_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_center_type`
--

DROP TABLE IF EXISTS `study_center_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_center_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_center_type`
--

LOCK TABLES `study_center_type` WRITE;
/*!40000 ALTER TABLE `study_center_type` DISABLE KEYS */;
INSERT INTO `study_center_type` VALUES (1,'Company Owned'),(2,'Company Operated'),(3,'Partner Captive');
/*!40000 ALTER TABLE `study_center_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `syllabus_id` int(11) NOT NULL,
  `grade_category_id` int(11) NOT NULL,
  `grade_id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `applicable_from_year_id` int(11) NOT NULL,
  `effective_till_year_id` int(11) DEFAULT NULL,
  `total_session` int(11) NOT NULL,
  `session_duration` int(11) NOT NULL,
  `subject_type_id` int(11) NOT NULL,
  `has_practical` int(11) NOT NULL,
  `is_mandatory` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (1,1,2,6,'Hindi',1,NULL,260,35,1,0,0,1,'2024-09-19 12:52:52',13,NULL,NULL),(3,1,3,4,'English',1,NULL,260,35,2,1,1,1,'2024-09-19 17:09:45',13,NULL,NULL),(4,1,3,4,'Physics',1,NULL,260,35,1,1,0,1,'2024-09-19 17:31:36',13,NULL,NULL),(5,1,3,4,'Maths',1,NULL,260,35,1,0,1,1,'2024-09-23 11:53:14',13,NULL,NULL),(6,1,5,8,'Computer',1,NULL,250,40,1,1,1,1,'2024-10-03 12:34:25',13,'2024-10-03 12:51:52',13);
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_type`
--

DROP TABLE IF EXISTS `subject_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subject_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_type`
--

LOCK TABLES `subject_type` WRITE;
/*!40000 ALTER TABLE `subject_type` DISABLE KEYS */;
INSERT INTO `subject_type` VALUES (1,'Non-Vocational'),(2,'Vocational');
/*!40000 ALTER TABLE `subject_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `syllabus`
--

DROP TABLE IF EXISTS `syllabus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `syllabus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `grade_category_ids` text NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `syllabus`
--

LOCK TABLES `syllabus` WRITE;
/*!40000 ALTER TABLE `syllabus` DISABLE KEYS */;
INSERT INTO `syllabus` VALUES (1,'CBSE','3,4,5',1,'2024-08-28 15:48:06',1,'2024-08-29 11:49:51',1),(2,'NIOS','4,7',1,'2024-08-28 16:50:30',1,'2024-08-29 11:56:08',1);
/*!40000 ALTER TABLE `syllabus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tie_up_school`
--

DROP TABLE IF EXISTS `tie_up_school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tie_up_school` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `website` text NOT NULL,
  `address` text NOT NULL,
  `tie_up_school_syllabus_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `state_region_id` int(11) NOT NULL,
  `district_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `pincode` varchar(9) NOT NULL,
  `contact_person` text NOT NULL,
  `pan_number` varchar(10) NOT NULL,
  `current_contract_history_id` int(11) DEFAULT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `uuid` varchar(36) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  `deleted_on` datetime DEFAULT NULL,
  `deleted_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tie_up_school`
--

LOCK TABLES `tie_up_school` WRITE;
/*!40000 ALTER TABLE `tie_up_school` DISABLE KEYS */;
INSERT INTO `tie_up_school` VALUES (1,'Krishna Public School','kpsbhilai@gmail.com','994589435834','https://www.kpsbhilai.com','Nehru Nagar',2,1,4,3,1,'4900452','Rahul Singh','DHPEK4389J',1,1,'cfb37fe0-3e83-11ef-8822-510cd6b4254b','2024-07-10 11:45:31',4,NULL,NULL,NULL,NULL),(2,'Krishna Public School-1','kpsbhilai1@gmail.com','994589435830','https://www.kpsbhilai.org','Nehru Nagar',2,1,4,3,1,'4900452','Rahul Singh','DHPEK4389J',2,1,'73c23f90-3e84-11ef-a571-fb920cd43bcc','2024-07-10 11:50:07',4,NULL,NULL,NULL,NULL),(3,'Krishna Public School-21','kpsbhilai2@gmail.com','994589435831','https://www.kpsbhilai.co.in','Nehru Nagar',3,1,4,3,1,'4900452','Rahul Singh','DHPEK4389J',5,0,'37c7fb00-3e85-11ef-b0e6-1f5491d21839','2024-07-10 11:55:35',4,'2024-07-17 13:16:12',4,'2024-07-10 12:31:01',4),(4,'Krishna Public School-2','kpsbhilai22@gmail.com','994589435851','https://www.kpsbhilai.co.in','Nehru Nagar',2,1,4,3,1,'4900452','Rahul Singh','DHPEK4389J',6,1,'a2bd9e60-3f89-11ef-ba6d-7d3c33682264','2024-07-11 18:59:44',4,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tie_up_school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tie_up_school_contract_history`
--

DROP TABLE IF EXISTS `tie_up_school_contract_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tie_up_school_contract_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tie_up_school_id` int(11) NOT NULL,
  `contract_from` date NOT NULL,
  `contract_to` date NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tie_up_school_contract_history`
--

LOCK TABLES `tie_up_school_contract_history` WRITE;
/*!40000 ALTER TABLE `tie_up_school_contract_history` DISABLE KEYS */;
INSERT INTO `tie_up_school_contract_history` VALUES (1,1,'2024-06-01','2024-06-30',1,'2024-07-10 11:45:31',4,NULL,NULL),(2,2,'2024-06-01','2024-06-30',1,'2024-07-10 11:50:07',4,NULL,NULL),(5,3,'2022-01-01','2023-12-31',1,'2024-07-10 15:52:35',4,NULL,NULL),(6,4,'2023-06-01','2024-06-30',1,'2024-07-11 18:59:44',4,NULL,NULL);
/*!40000 ALTER TABLE `tie_up_school_contract_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tie_up_school_doc_upload`
--

DROP TABLE IF EXISTS `tie_up_school_doc_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tie_up_school_doc_upload` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tie_up_school_id` int(11) NOT NULL,
  `academy_enclosure_document_id` int(11) NOT NULL,
  `file_name` text NOT NULL,
  `uploaded_on` datetime NOT NULL,
  `uploaded_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tie_up_school_doc_upload`
--

LOCK TABLES `tie_up_school_doc_upload` WRITE;
/*!40000 ALTER TABLE `tie_up_school_doc_upload` DISABLE KEYS */;
INSERT INTO `tie_up_school_doc_upload` VALUES (2,4,2,'4_2.pdf','2024-07-11 18:59:44',4,'2024-07-11 19:24:57',4),(3,4,3,'4_3.pptx','2024-07-11 19:26:20',4,'2024-07-11 19:28:43',4);
/*!40000 ALTER TABLE `tie_up_school_doc_upload` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tie_up_school_syllabus`
--

DROP TABLE IF EXISTS `tie_up_school_syllabus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tie_up_school_syllabus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tie_up_school_syllabus`
--

LOCK TABLES `tie_up_school_syllabus` WRITE;
/*!40000 ALTER TABLE `tie_up_school_syllabus` DISABLE KEYS */;
INSERT INTO `tie_up_school_syllabus` VALUES (1,'CBSE',1,'2024-07-19 19:55:03',4),(2,'NIOS',1,'2024-07-19 19:55:13',4),(3,'State Board',1,'2024-07-19 19:55:26',4);
/*!40000 ALTER TABLE `tie_up_school_syllabus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `applicable_from_year_id` int(11) NOT NULL,
  `effective_till_year_id` int(11) DEFAULT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (1,'poems',1,1,NULL,1,'2024-09-19 17:12:03',13,'2024-09-23 16:04:36',13),(2,'Inspiring Stories',1,1,NULL,1,'2024-09-19 17:12:03',13,'2024-09-19 17:12:17',13);
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `user_grade_id` int(11) NOT NULL,
  `user_category_id` int(11) DEFAULT NULL,
  `password` text NOT NULL,
  `profile_pic_file_name` text,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `is_approved_by_admin` int(11) DEFAULT '0',
  `auth_token` text,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  `deleted_on` datetime DEFAULT NULL,
  `deleted_by_id` int(11) DEFAULT NULL,
  `approved_on` datetime DEFAULT NULL,
  `approved_by_id` int(11) DEFAULT NULL,
  `denied_on` datetime DEFAULT NULL,
  `denied_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'HR','Admin','pkale711@gmail.com','9993443711','Male',1,NULL,'5816EE12CB8BD00C6D28A7B640D1D48E',NULL,1,1,NULL,'2024-05-20 12:26:39',0,'2024-08-22 14:24:29',1,NULL,NULL,'2024-05-20 12:26:39',0,NULL,NULL,'27537b39-1676-11ef-866d-54ee753f9eea'),(4,'Rohit',NULL,'rohitsingh@gmail.com','9993443701','Male',3,1,'5816EE12CB8BD00C6D28A7B640D1D48E','81c5bfd0-1739-11ef-9262-bb5f70f380f8_Pic.png',1,1,'02ymL8vtKyxWXmsHkGGDKJLTme4MbVEncnKCApvbfgwRo6svvS2yvWEr','2024-05-21 11:45:22',1,'2024-08-22 14:22:36',1,NULL,NULL,'2024-05-27 16:16:13',1,'2024-05-21 15:16:00',1,'81c5bfd0-1739-11ef-9262-bb5f70f380f8'),(9,'Kamlesh','Singh','kamlesh.1223@gmail.com','7773443701','Male',5,NULL,'8A14FF7F88739EB67A837FB10BD35933',NULL,1,1,NULL,'2024-05-21 12:02:56',1,'2024-07-16 14:57:37',1,NULL,NULL,'2024-05-23 16:06:20',1,NULL,NULL,'f5c03b20-173b-11ef-86f5-1774f3e8216f'),(10,'Umesh','Yadav','umesh.yadav@gmail.com','7773443639','Male',5,NULL,'FD88B4A891D0ACC524777DEC2A6C1D05','a9177500-173f-11ef-86f5-1774f3e8216f_Pic.png',0,1,NULL,'2024-05-21 12:29:25',1,'2024-07-16 14:57:28',1,'2024-07-16 14:58:53',1,'2024-05-23 16:07:16',1,NULL,NULL,'a9177500-173f-11ef-86f5-1774f3e8216f'),(12,'Rajesh',NULL,'pkale71@yahoo.com','9993443712','Male',5,NULL,'FD88B4A891D0ACC524777DEC2A6C1D05',NULL,1,1,'JSWSFKFI13mtTME0OZo3RkteiGfGuBUxGjOnhXpryycG4ivwTe2U0vwP','2024-06-12 14:04:50',1,'2024-07-16 14:58:32',1,NULL,NULL,'2024-07-16 16:12:12',1,NULL,NULL,'a229d270-2896-11ef-b5f4-6fdbbd826909'),(13,'Rakesh','Jaiswal','pkale111828@gmail.com','9993445709','Male',2,NULL,'650EB8F04280030788ED749DD42DB611',NULL,1,1,'YIp8f0aRjZmZfoUndIIqRosZKqCr3EWU9ePSvEX8Mb4IgvYiWeMWSuqT','2024-07-16 13:44:42',1,'2024-08-22 14:24:01',1,NULL,NULL,'2024-07-16 16:40:26',1,NULL,NULL,'749b2eb0-434b-11ef-8a09-53c95d2ff855'),(14,'Santosh',NULL,'pkale71@gmail.com','9993443707','Male',4,3,'5816EE12CB8BD00C6D28A7B640D1D48E','767d4270-7980-11ef-8a40-d72077a38398_Pic.jpg',1,1,'f2v5OXkbuBp3UvpLboFYLJQj14qktgcft8iXYDeHWq4mNnZdJmPoKKeA','2024-09-23 13:20:12',1,NULL,NULL,NULL,NULL,'2024-09-23 14:16:24',1,NULL,NULL,'767d4270-7980-11ef-8a40-d72077a38398');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_category`
--

DROP TABLE IF EXISTS `user_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_category`
--

LOCK TABLES `user_category` WRITE;
/*!40000 ALTER TABLE `user_category` DISABLE KEYS */;
INSERT INTO `user_category` VALUES (1,'Staff-User','STFUSR'),(2,'Student-User','STDUSR'),(3,'Parent-User','PRTUSR');
/*!40000 ALTER TABLE `user_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_grade`
--

DROP TABLE IF EXISTS `user_grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_grade`
--

LOCK TABLES `user_grade` WRITE;
/*!40000 ALTER TABLE `user_grade` DISABLE KEYS */;
INSERT INTO `user_grade` VALUES (1,'HR-Admin','HRADM'),(2,'Academic-Admin','ACADM'),(3,'Module-Admin','MOADM'),(4,'Module-User','MOUSR'),(5,'Business-Admin','BUADM');
/*!40000 ALTER TABLE `user_grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_login_logout_history`
--

DROP TABLE IF EXISTS `user_login_logout_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_login_logout_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `auth_token` text NOT NULL,
  `login_on` datetime NOT NULL,
  `logout_on` datetime DEFAULT NULL,
  `logout_as` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_login_logout_history`
--

LOCK TABLES `user_login_logout_history` WRITE;
/*!40000 ALTER TABLE `user_login_logout_history` DISABLE KEYS */;
INSERT INTO `user_login_logout_history` VALUES (1,1,'JoAtervlxY11izO3SAConmT8FxYAY9EWBcZjN1Wx2VNi0QJVSF0ekWMu','2024-05-20 13:56:22','2024-05-20 13:57:02','Forced'),(2,1,'xTYjn84jotRq8eBQyDkezCQSDndpqTfeq7AxeFmbjf42zGIKVaIm1UuZ','2024-05-20 13:57:02','2024-05-20 14:13:55','Forced'),(3,1,'9wjPmFyiwO63BnQTbrXY6h9P7AgdcqdLiv1ywbEY6IU6eCH91J55rbzj','2024-05-20 14:13:55','2024-05-20 15:57:48','Normal'),(4,1,'9D6GCsQy0YbjHAMgz7lMlYztVAmlR8XNw14hGLzydxTPnjrwTDrEf3nl','2024-05-20 16:00:22','2024-05-20 16:49:40',NULL),(5,1,'W8RFlhGbvXFd9TJBZf3IJSmev9PSXyDqL6LFWfrbCGpkHSBfyZ42CzQt','2024-05-20 16:55:07','2024-05-21 10:26:20','Forced'),(6,1,'KFxeLwW9rdwKytGKP5q9TKbdY6zsZFlwKj5B89WDscFb7KGAkjGdmJ2j','2024-05-21 10:26:20','2024-05-21 14:07:23','Forced'),(7,1,'cSESWUmzcLs9mbINe8AmJI2aYDoqsBLls7QoHuKbbublPfc8dTcNrF2o','2024-05-21 14:07:23','2024-05-23 16:08:16','Forced'),(8,9,'emEmQKJb1I68gtxsuRPaN88XlXhttFpYl8guJx8O7Lffxfz1ZCWhKh6z','2024-05-23 16:06:32','2024-05-27 15:14:35','Forced'),(9,1,'NlqnIGvdiJpjKun3mDI8vyW44K7U5IaaRPHSR7nUGyy1A6s3rsTs42yI','2024-05-23 16:08:16','2024-05-23 16:11:53','Forced'),(10,1,'Dif9dTQxKqox524Sn8kPFljAW1gEItsdIp78pjdnyNd2znRfv8K8HoXr','2024-05-23 16:11:53','2024-05-23 16:15:16','Forced'),(11,1,'0a1Q4ocrAqXVC54YNjO7TmLmgViTVGpjXWIeuuCiPijZCkZN1ql8MlaA','2024-05-23 16:15:16','2024-05-23 16:15:29','Forced'),(12,1,'FhQEQ3Yk3Jmo1Bbdx8Q81kvtmrciTvWJgBhs02VOiZVBg66ozrP2dJz5','2024-05-23 16:15:29','2024-05-23 16:16:31','Forced'),(13,1,'dQlnGFgceQDZHk665sQSpBBXVVyfByi1oWbv75CPq9bOKHiwVfGl3xfM','2024-05-23 16:16:31','2024-05-23 16:18:25','Forced'),(14,1,'ZgzwIJinKj0Nf1O3Qu5xxM2QDkZCjmwyzTbpfXdvhcA5cpuu2846IJeQ','2024-05-23 16:18:25','2024-05-23 16:19:35','Forced'),(15,1,'58hIiRLWIqD9MDHIhQokbzvSoULTWlYV8WlXKKC9NFNinWgLrenAeDCe','2024-05-23 16:19:35','2024-05-23 16:20:38','Forced'),(16,1,'R8cfTsIAnugwMO5pPHBY4rnri6V8PyXwXpHg8y7l6b19AuO7qrl577VK','2024-05-23 16:20:38','2024-05-23 16:22:56','Forced'),(17,1,'h9VY33SciRFNfFiKEPUuXk6YpIKCrnXkThyvKkA4FD9pu7orX4zTth5E','2024-05-23 16:22:56','2024-05-24 15:48:23','Forced'),(18,1,'codd3jniQvEyyY9Wce8ek5cLoyP0Or57uX0lSxwWPjgJoxtzy7N1ZVL5','2024-05-24 15:48:23','2024-05-24 15:49:00','Forced'),(19,1,'VtbsxzRJ6zDbLT3fbtA6NPoEVngz8RGKX83Xqu3p3Ctu5IcjqOLlBtmJ','2024-05-24 15:49:00','2024-05-24 17:22:36','Forced'),(20,1,'jmIX647AzAErVwMfU5Z4Jv1AZ4QxZOystTjlmlkOP2OLaberQnm4CN2i','2024-05-24 17:22:36','2024-05-24 17:23:25','Forced'),(21,1,'sgdn0OGUU6KzIEn3tUrfiPeDXVM4biANTuFgkklXySQm9fvVBOYM9qyV','2024-05-24 17:23:25','2024-05-24 17:24:18','Forced'),(22,1,'howoRHbD9Dt0Zk4yDhwdBATx8bgreSDw1jjOZsdwu7oloKA2fO6pLflN','2024-05-24 17:24:18','2024-05-24 17:24:38','Forced'),(23,1,'s6RRx7n7TJfRA2Fc8EloSRWORxZj8KBtA1wp69rIRqrIsyW4tImyMcL7','2024-05-24 17:24:38','2024-05-24 17:25:10','Forced'),(24,1,'uGs73n8s2wRfvfdm6yujdZ1aNrpPloqGOnX7n3O0Yo4WgCDhfpgYFx6Z','2024-05-24 17:25:10','2024-05-24 17:25:49','Forced'),(25,1,'vhEMY2V8fO7S0fN4Q1VduvAyUqrb7HzF4KxQGXpuskPRFoBDyHLV10vj','2024-05-24 17:25:49','2024-05-24 18:06:35','Forced'),(26,1,'rbvC4y6ho1ukyFTBog8v3aEXrJJ3M8eSf7RdrPWCKbnryaqk46n49qHb','2024-05-24 18:06:35','2024-05-24 18:08:07','Forced'),(27,1,'IhRxRIWNHAPCyz3zVCEk0yf467CP7Ks5oS4nMvoIKYzKV1yMedQFjeON','2024-05-24 18:08:07','2024-05-24 18:08:29','Forced'),(28,1,'wOzvqzyEbJRFwhDUjRQS1qcQZR0BXzfII0nnXsOEcG9TxbVBmZQdtxiE','2024-05-24 18:08:29','2024-05-24 18:08:34','Forced'),(29,1,'gvM2t45ElQWawDmE7v6gA91GtDGHWyhqtACRfoqWLc1KBbtiA3Uo2aCl','2024-05-24 18:08:34','2024-05-24 18:08:51','Forced'),(30,1,'74XfrpFohyHLwh9brDVJ0GB7C0GLmHSdFdbET1ykdr0VtbH35V9QxBOI','2024-05-24 18:08:51','2024-05-24 18:09:26','Forced'),(31,1,'ScJY6V9jsZSt8hLlWPyliI96wuaHHLNtbdtBc8dz7ywRN2Rp4JZmYsjK','2024-05-24 18:09:26','2024-05-24 18:09:36','Forced'),(32,1,'gMbqdLiCdq9QN7lCf7LRaNkGVKLVcEVZA1n0MbdoNnOwbBLUiDSCCF2J','2024-05-24 18:09:36','2024-05-24 18:10:32','Forced'),(33,1,'XtJKZsxlfNpEpChEJ5aPRNYNipUQJKq5SzpAEMSi6OgE6blbz1vm7Acu','2024-05-24 18:10:32','2024-05-24 18:10:43','Forced'),(34,1,'T7gT7ZyIlfrSNmZ4usBGsgK4A7C4wZiXXrqdDzQkeUtm4QuIzb6uYXVb','2024-05-24 18:10:43','2024-05-24 18:13:02','Forced'),(35,1,'BzZq7QXRSC61PbEbkvJkHgrpmMPWW79eKEHOco3Kh8DnKsBoyjEFSp1Y','2024-05-24 18:13:02','2024-05-24 18:15:07','Forced'),(36,1,'LTpWCVdySfHAt45A2Y6VBIS6XRL1O3DNaHAJDYMlwrslL921g5mommbe','2024-05-24 18:15:07','2024-05-24 18:16:45','Forced'),(37,1,'7CnrgOFN3oiPbW5lr9mQUs4Q6qBO3JHUA3RdiYdfcLKHsM5n0UPnUtHl','2024-05-24 18:16:45','2024-05-27 14:47:18','Forced'),(38,1,'LAofL5xQN5tYSQyp9dm61GwvpabDkAJ2pYyyZHKYT3qfkEyI5LtHvpdE','2024-05-27 14:47:18','2024-05-27 14:50:20','Forced'),(39,1,'D3ScStWpRzWjeBcdp5UxHicVAMTKucw3y7hxHan11RYOHZoJyQvM8kHl','2024-05-27 14:50:20','2024-05-27 14:51:31','Forced'),(40,1,'15ljuw9Y35yJb5f5szTUjSuyAq32CH6boPLSOQx6fX0zxGnQjAR5IYyb','2024-05-27 14:51:31','2024-05-27 14:51:51','Forced'),(41,1,'czrneWKpX1eHw61pcwuKHglKePk2AQjhDQmB031EenJTLFZlJoVSe47V','2024-05-27 14:51:51','2024-05-27 14:58:15','Forced'),(42,1,'zt4acBekoscovfgDlm4OW4QkVl69ilsVfd2wsqQ4AXSF0XO5gR2XSnrr','2024-05-27 14:58:15','2024-05-27 14:59:36','Forced'),(43,1,'2DqLt5ExeOrGV9DNFeX8PzjQD6RYEUjvDbBTdsr7YMF5fTKuMTVBfZ9a','2024-05-27 14:59:36','2024-05-27 14:59:44','Forced'),(44,1,'45Q7ONITVkF4LkM0QWetloYgg3Xru7qfjyK6mZMfXJHcAdPPP5zHZ6H5','2024-05-27 14:59:44','2024-05-27 14:59:55','Forced'),(45,1,'66noUms9czjJgcgkm2NwozCIjDu8sqTHRtUp9fKj941Ih7e6v8C0EONp','2024-05-27 14:59:55','2024-05-27 15:01:13','Forced'),(46,1,'S4XlMvnw6XV9RK3BFtIt73Uo7C1PpLvwFsUAr58DGNyHzR4vsL83NpIE','2024-05-27 15:01:13','2024-05-27 15:01:50','Forced'),(47,1,'419SDulLVyC8fAQmSQPprDhuzcCjaUkM3cq3xAsTqBzCM5KIZWUD1c8f','2024-05-27 15:01:50','2024-05-27 15:02:51','Forced'),(48,1,'D0WvYV8gebjIcczLvtI7f7Z1MAmZqShglGSNfvZQpb0uvbCzRcoIUMQR','2024-05-27 15:02:51','2024-05-27 15:12:45','Forced'),(49,1,'tA0offbfyW3HqjTpqxfbr16lCYZ6pDpr7TDTIaNSW4voLIMvpUiGprm2','2024-05-27 15:12:45','2024-05-27 15:26:14','Forced'),(50,9,'sxkx7gwLlyULEi13bj2CIq09SSFtsNgm9b7lRnfsk75dRo42VsSGkbR1','2024-05-27 15:14:35','2024-05-27 15:27:19','Forced'),(51,1,'Fa8T5zfvAQYxejmWLqee9PQkms6KEBkqJavnCeSKxDgiZzhGEyLS6CKC','2024-05-27 15:26:14','2024-05-27 15:26:20','Normal'),(52,9,'aPp3AXiA86gNbD2VkvDs2Kc34G53ZQ2gY1T4H2xxcp7OytoWggN7EozM','2024-05-27 15:27:19','2024-05-27 15:35:07','Normal'),(53,9,'neUXdIJdP4U0oTpX3Uyb8LkPJjPKufLofWzaXqhiBU2hhVpY8QzsndF2','2024-05-27 15:35:10','2024-05-27 15:38:24','Forced'),(54,9,'zqi5Kz7CrVEhv9juksItbPAEdGq1C1EgehyXPgIovpPUMTRVGiQpcIrW','2024-05-27 15:38:24','2024-05-27 15:39:58','Forced'),(55,9,'LejDkZYevyhkPxJWJ6rYvTNL136yKF1UDQDA3r5RJ3bQdkBESjtm3o6W','2024-05-27 15:39:58','2024-05-27 15:43:50','Forced'),(56,9,'Pg2Iz9I6iglDxRIMyVNQjj5eTNzjOJ1GC1INuZ7cfueiFO9GcMcBRNwN','2024-05-27 15:43:50','2024-05-27 15:44:48','Forced'),(57,9,'KphDBBYPzc60XdiY1862bZkMtCXx1JS96xAVvitFCOdioNh3Zdtrr9Gu','2024-05-27 15:44:48','2024-05-27 15:45:43','Forced'),(58,9,'GCmwjdHvJ1b4JVK66uWmRd1eSF2BuHsEAl1IBhAi2JREEK6XiAIPLwGS','2024-05-27 15:45:43','2024-05-27 15:46:23','Forced'),(59,9,'U2dB4xwtyG9vVirQL9HkZU47cDs8dChuPAitTMJcP4R4BvlgKP2sgRgs','2024-05-27 15:46:23','2024-05-27 15:48:23','Forced'),(60,9,'8hCzTJXOcIbR6pfSJVqTwrS6V5E4iy3U1BXvYxi2Zg4Bxi2ooBgmVibC','2024-05-27 15:48:23','2024-05-27 16:13:21','Normal'),(61,4,'2QVu8ivqSnEIxlw8F1ERkONvBnhgTLHUE1p2TqcEAsBsaGvjxbHjexpg','2024-05-27 16:17:00','2024-05-27 16:17:37','Forced'),(62,4,'jVLVcKuSWHrQd4EvcEAc1BIqgltLPgCAwjwS38ZGNLYyvKdnv4I8Ssb6','2024-05-27 16:17:37','2024-05-27 16:18:47','Forced'),(63,4,'Erqis4fUQBuOYYH8MEfZ5BGi6hnrY39QOY9tqEkLt4Z5RdiGCf6URG3F','2024-05-27 16:18:47','2024-05-27 16:19:01','Forced'),(64,4,'LdTrweKSBaZR83oMrYfBmHfrt4QEqY7NBszlNDfZjo4EII5lh6nAmxHY','2024-05-27 16:19:01','2024-06-27 16:26:13','Forced'),(65,4,'1EAM9KWWWVTYGcxGrylmTYndHbGdXRgLCTHHwVZfIPdtl9G2AHO3tgh7','2024-06-27 16:26:13','2024-06-27 16:36:04','Forced'),(66,4,'KCnU2tEUCpSUAV5s2mEps8blUxpQTs7ZdteJFsqd5NzIzorrpY4s8Vuw','2024-06-27 16:36:04','2024-08-13 19:35:48','Forced'),(67,1,'Bgb3Gjx9uyatzAvphpvwzpWswfAuOWA1TyjUOqlZOLmOD7WX3u0pu3ly','2024-06-27 16:36:24','2024-06-27 16:43:21','Forced'),(68,1,'FREHt5n5KuYdqPxrCo9vIdqwVsXw2uRT6chBe0ToZWxCWFjGzlCGL4BJ','2024-06-27 16:43:21','2024-07-16 11:42:49','Forced'),(69,1,'ZBFqsSwqSoCMpI4TuBydHyTGqAcuOYwqlYRXVuNqfdbQAK4BM55SwNaK','2024-07-16 11:42:49','2024-07-16 11:43:08','Normal'),(70,1,'TUMUkFywgsq7lANjYdcXDsXscsZgM4NOqmRmLzsrPd9FH3aEilAfHW6y','2024-07-16 11:43:11','2024-07-16 16:39:51','Normal'),(71,1,'kjzhOyTJnGPm1uZ7eHsCheo1BGlS78XRxf7QsF9X9fUHDOfrY2FQeV1o','2024-07-16 16:40:05','2024-07-16 16:40:32','Normal'),(72,13,'i9xw7tR2uFVcNLqzvLfuM3PaDJlDLAePjM7m5er9l97EsQ0I5Og5wUXh','2024-07-16 16:40:38','2024-07-16 16:40:51','Normal'),(73,1,'HOEndIFL2Qs2elAOfhSP8pnEAVHnc3wUKfvUlM8cPvX8vQ5tERrz2FM8','2024-07-16 16:46:48','2024-07-16 17:08:49','Normal'),(74,13,'8tcNpPZnr6Jo6mluz2Idqdmd7RV9UpmvI8GN1sQ3Ku787yIGSV3m6rzj','2024-07-16 17:08:53','2024-07-17 10:31:08','Forced'),(75,13,'oMhragQKfTJphSXFYTxkO6QxEIygGzT9SSHmvmcyj7BkIr02hxKil441','2024-07-17 10:31:08','2024-07-18 10:13:37','Forced'),(76,13,'w63fKyAPSWFul3HwQHmTuEzAp6SE1rpoYc1nFJ8pUyrjWosFCIRCqOxu','2024-07-18 10:13:37','2024-07-23 10:41:31','Forced'),(77,13,'a1oYnh2Ee0lbcNQrxcMfpydR8kXR7JgrrZK7PM9NNiUz0DHqjSY1W1yY','2024-07-23 10:41:31','2024-07-24 10:19:21','Forced'),(78,13,'1eBZpEpkGu11b0IofyHFvWl9zQWqulZOsgtKMSLnOwMLD5TwoIBb2lSw','2024-07-24 10:19:21','2024-09-19 12:43:11','Forced'),(79,1,'7TG5dr6El9P6i2ukoBcx2qc7rzmILW4fFnAsiEGkxGVmpeQvusUCsmpQ','2024-08-13 19:33:27','2024-08-13 19:35:27','Normal'),(80,4,'Z7DWZfky7MKknFotyr4pbBb7uYe2LLzLLtNhbcjpN9eE3cuw8YEE7zQc','2024-08-13 19:35:48','2024-08-14 20:09:29','Forced'),(81,4,'dxeYCrt5RRTcbiOWDGi0U3kFNt4VemJlFhU3yCk1DTBumnETNoeRlsDU','2024-08-14 20:09:29','2024-08-14 20:36:48','Forced'),(82,1,'grSE3KjSIMDyxID1Na4LTmcYpE7SJxObvoGoBvJ0QIpw2h4rBukqhoFX','2024-08-14 20:35:21','2024-08-14 20:36:34','Normal'),(83,4,'W4DOBwATifoxcqbEs7rihhuBm8md84fRpHocqHvSMV1qof4zXKzvswqE','2024-08-14 20:36:48','2024-08-16 07:48:56','Forced'),(84,4,'g9tWTdFC5JSN66OgWKVvcCwVWF4g6I4GAkm7jzI5RcDG9IgAcMA8MZ3b','2024-08-16 07:48:56','2024-08-16 07:52:45','Forced'),(85,4,'02ymL8vtKyxWXmsHkGGDKJLTme4MbVEncnKCApvbfgwRo6svvS2yvWEr','2024-08-16 07:52:45',NULL,NULL),(86,1,'IqqGQDou33G6YmYO58XB8sz6h4Rrz1PoIyAUBFQE83bniTzp6O1FbPNR','2024-08-22 14:22:11','2024-09-19 12:27:11','Forced'),(87,1,'VpeNHSOMSSE9GF5iyFxkK5PdcgFrTBhYq3UOZe0jdTBxeVxjQNN23xd0','2024-09-19 12:27:11','2024-09-19 12:42:32','Normal'),(88,13,'38Sq9BH6XdsFYt7ciWAog9Xh3BRsWZNdGKdErtQBI7tOcTZWUXjQSAVD','2024-09-19 12:43:11','2024-09-19 16:52:44','Forced'),(89,13,'TMngMGXwx2kAvZgY2LPAds9HHNxT3OLXFs50gWh8J5pK5c6OA731ios6','2024-09-19 16:52:44','2024-09-19 17:13:36','Normal'),(90,12,'Fu4T1RbU97HEKB1C3x1sVlOI7xtTFlXNKliDvx3WEzDK1FKnY6wTxb2I','2024-09-19 17:14:21','2024-09-19 17:23:33','Normal'),(91,13,'ShJjJPgJvGFnRVbm3Tcx1lifVca6LXi6GZcNRsUNRApZTXxLSHWQ7UDV','2024-09-19 17:23:39','2024-09-19 17:28:16','Normal'),(92,12,'8wun6atHd8oSWeUOyNE9DxHHB4ZHHWY1zUWRKM1GucUbZdaBBxxq9Ql6','2024-09-19 17:28:24','2024-09-19 17:30:25','Normal'),(93,13,'br7Zv59UHTktxuYL92pX338SMj5HJhfdW1sLburVdjkH1bysOVPyTVxC','2024-09-19 17:30:31','2024-09-19 17:38:43','Normal'),(94,12,'QhjA3tpKMjcnZA3JTlwnVpV17iHMoaRPi6qMpVtIR0Pxz5JQl4AJn78l','2024-09-19 17:38:47','2024-09-23 12:05:13','Forced'),(95,1,'PqEnKucNSZjApn8xgHC9yIJuf8jvYiHiSkA79BPLvjtTD5jJOWAPvMCP','2024-09-23 11:35:02','2024-09-23 11:51:31','Normal'),(96,13,'n8AvNzLAjP8xBbPZNlbMdgFQP3MkTzNyx1m6RvIxl4HVZ2sjZ5c7qHnP','2024-09-23 11:52:02','2024-09-23 12:05:02','Normal'),(97,12,'0vudj2Y79dWW8dMRjh51e1jGSIPuxwgPlLrYWJiGG6dKZIF4RSU8LSL5','2024-09-23 12:05:13','2024-09-23 12:58:51','Normal'),(98,1,'pAomLVCYIsrreMeUU0eJA14zM8mvSsH9otCFpDq6vueD48lydHaXtUP8','2024-09-23 12:59:01','2024-09-23 13:11:05','Normal'),(99,1,'1jIr5sSeKLYgFlTZTWV4j3uQLsVFyxDt5cEuIz9pG0ydChwphd7quAWM','2024-09-23 13:11:15','2024-09-23 14:18:11','Normal'),(100,14,'BB6irkn6zUpeqFTr58moiRlcvtU3GzaeurFigCj1IOrbtziHSxdzQ9bj','2024-09-23 14:18:20','2024-10-01 16:13:36','Forced'),(101,13,'LIp22BnCVBSVo6XmurtqH14bJxKR6kOVf5iDfQP5xdwleYOfPHOf5tZm','2024-09-23 14:20:54','2024-09-23 15:49:53','Normal'),(102,13,'ebXU6NJWRNgdi0I5C2MT5owiIsiMvCXEpx8hvd2n9vJuUUGOrkzO2PlD','2024-09-23 15:50:09','2024-09-23 17:44:07','Forced'),(103,13,'2GHVfOWTnwmwA8bPsW2miWYuIbltJd8F5lVLIeRXdTFyCHkVmIdBPruS','2024-09-23 17:44:07','2024-09-25 13:48:01','Forced'),(104,13,'RwSvfoIex46I9nBeWQ1Qz1L51qqoQkXlybnhubdTnbR1TuAfvDZe7zfU','2024-09-25 13:48:01','2024-09-25 13:48:08','Normal'),(105,12,'KBdMWRy7xDMuK6TApGbYwxfJA4gn9QE8m1EnTlmdpSCrx8ZkFG5kHT7L','2024-09-25 13:48:15','2024-09-25 14:39:31','Forced'),(106,12,'Zpg0hZD2YKh2rHSBxTzTFEOwdQf29w277cOQgHFdsQ50fY7v9yY3Vq2f','2024-09-25 14:39:31','2024-09-26 10:00:13','Forced'),(107,12,'S2aXjgHoOnfYkBePFDdoFQixK28UCzmSd2fiosI6XPBQXdIqI8RoLG5V','2024-09-26 10:00:13','2024-09-26 11:29:39','Forced'),(108,12,'AhM87gP5ON6pVYl33DKXWEZZ5Nmv6mwRNEyrY5xYO7AowNk1zxljTGS3','2024-09-26 11:29:39','2024-09-26 19:56:44','Forced'),(109,12,'AFRamVJIPvKATBxuhNheQbUkwtEwz8ZxJJ1dO4VQgtepJZzZhpdpTcPz','2024-09-26 19:56:44','2024-09-27 10:10:06','Forced'),(110,12,'2dwFKOpqQBdA7nLmSlVVGvSyEuf9Rmqk7h1rhDiBAnihYAEivTOBx0W7','2024-09-27 10:10:06','2024-09-27 12:47:51','Forced'),(111,12,'LJydkh5xxD3gQUkU4v4258cK2LW9hit9Agve5ELUJ1L63RM9rm9eCMHT','2024-09-27 12:47:51','2024-10-01 16:13:12','Forced'),(112,12,'qFa37uZCePLrzMdMBcOowYG7ImW5M9RdKh5zscdwPgG3gjtbzBF8O2rG','2024-10-01 16:13:12','2024-10-01 16:13:16','Normal'),(113,14,'f2v5OXkbuBp3UvpLboFYLJQj14qktgcft8iXYDeHWq4mNnZdJmPoKKeA','2024-10-01 16:13:36',NULL,NULL),(114,1,'BCnLxLLwZpbUGkTUgh9DmcPgGRFnkdw0Vyh464TN5eT8tvj9MCvnwGzj','2024-10-01 16:13:49','2024-10-03 11:48:24','Forced'),(115,12,'mfkM9Cj2DWsHCPJ1Wc2CIosqxvuUqXPFLUxbkijFBKgDuMYRNXyQ3Xvy','2024-10-01 19:18:51','2024-10-02 16:24:32','Forced'),(116,12,'JSWSFKFI13mtTME0OZo3RkteiGfGuBUxGjOnhXpryycG4ivwTe2U0vwP','2024-10-02 16:24:32',NULL,NULL),(117,1,'UMsxmCPkNVPRTXfZvTNsL6ChzZYNVAwGM7DQotoVschbpZiPFVVKsmGd','2024-10-03 11:48:24','2024-10-03 11:48:45','Normal'),(118,13,'CUevsIYaCToT4YqdIpzdn9fsonPmkSTCWPyBScrC8VkwtMibh0k0Zz0q','2024-10-03 11:48:50','2024-10-03 13:17:45','Normal'),(119,13,'YIp8f0aRjZmZfoUndIIqRosZKqCr3EWU9ePSvEX8Mb4IgvYiWeMWSuqT','2024-10-03 13:40:07',NULL,NULL);
/*!40000 ALTER TABLE `user_login_logout_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_module`
--

DROP TABLE IF EXISTS `user_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `user_role_id` int(11) DEFAULT NULL,
  `user_type_id` int(11) DEFAULT NULL,
  `is_active` int(11) DEFAULT '1',
  `is_approved_by_module_admin` int(11) DEFAULT '0',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `approved_on` datetime DEFAULT NULL,
  `approved_by_id` int(11) DEFAULT NULL,
  `denied_on` datetime DEFAULT NULL,
  `denied_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_module`
--

LOCK TABLES `user_module` WRITE;
/*!40000 ALTER TABLE `user_module` DISABLE KEYS */;
INSERT INTO `user_module` VALUES (2,9,1,4,3,1,1,'2024-05-22 11:20:21',1,'2024-05-24 10:51:35',1,NULL,NULL),(4,9,2,2,5,1,0,'2024-05-24 10:59:40',1,NULL,NULL,NULL,NULL),(6,4,3,3,7,1,1,'2024-07-16 16:31:45',1,'2024-08-13 19:34:47',1,NULL,NULL),(7,4,2,5,6,1,1,'2024-08-14 20:35:41',1,'2024-08-14 20:36:22',1,NULL,NULL),(8,4,1,4,3,1,1,'2024-08-14 20:36:17',1,'2024-08-14 20:36:28',1,NULL,NULL),(9,14,3,NULL,NULL,1,1,'2024-09-23 13:38:46',1,'2024-09-23 14:17:58',1,NULL,NULL),(10,14,2,NULL,NULL,1,1,'2024-09-23 13:39:52',1,'2024-09-23 14:17:58',1,NULL,NULL),(11,14,1,NULL,NULL,1,1,'2024-09-23 13:43:30',1,'2024-09-23 14:17:58',1,NULL,NULL);
/*!40000 ALTER TABLE `user_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_module_history`
--

DROP TABLE IF EXISTS `user_module_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_module_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `user_role_id` int(11) DEFAULT NULL,
  `user_type_id` int(11) DEFAULT NULL,
  `assigned_on` datetime NOT NULL,
  `assigned_by_id` int(11) NOT NULL,
  `remark` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_module_history`
--

LOCK TABLES `user_module_history` WRITE;
/*!40000 ALTER TABLE `user_module_history` DISABLE KEYS */;
INSERT INTO `user_module_history` VALUES (1,9,2,4,3,'2024-05-24 10:51:18',1,'Approve'),(3,9,2,2,5,'2024-05-24 10:59:40',1,'Created'),(4,4,3,3,7,'2024-07-16 15:30:51',1,'Created'),(5,4,5,3,7,'2024-07-16 16:14:37',1,'Approve'),(6,4,5,3,7,'2024-07-16 16:19:57',1,'Deny'),(7,4,5,3,7,'2024-07-16 16:31:36',1,'Delete'),(8,4,3,3,7,'2024-07-16 16:31:45',1,'Created'),(9,4,2,5,6,'2024-08-14 20:35:41',1,'Created'),(10,4,1,4,3,'2024-08-14 20:36:17',1,'Created'),(11,4,7,5,6,'2024-08-14 20:36:22',1,'Approve'),(12,4,8,4,3,'2024-08-14 20:36:28',1,'Approve'),(13,14,1,0,0,'2024-09-23 13:43:30',1,'Created');
/*!40000 ALTER TABLE `user_module_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_on_boarding_link`
--

DROP TABLE IF EXISTS `user_on_boarding_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_on_boarding_link` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(10) NOT NULL,
  `user_grade_id` int(11) NOT NULL,
  `user_category_id` int(11) DEFAULT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `sent_on` datetime DEFAULT NULL,
  `is_sent` int(11) DEFAULT '0',
  `created_user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_on_boarding_link`
--

LOCK TABLES `user_on_boarding_link` WRITE;
/*!40000 ALTER TABLE `user_on_boarding_link` DISABLE KEYS */;
INSERT INTO `user_on_boarding_link` VALUES (1,'AqAVJW','pkale711@yahoo.com','9993443712',5,NULL,'2024-05-23 12:11:50',1,NULL,0,12),(4,'yzCD1O','pkale111828@gmail.com','9993445709',2,NULL,'2024-07-16 13:25:59',1,'2024-07-16 13:26:09',1,13),(5,'bwfO2x','pkale71@gmail.com','9993443707',4,3,'2024-09-23 13:15:00',1,'2024-09-23 13:15:23',1,14);
/*!40000 ALTER TABLE `user_on_boarding_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `module_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (2,'Head',2,1,'2024-05-21 15:53:53',1),(3,'Head',3,1,'2024-05-21 15:54:01',1),(4,'School',1,1,'2024-05-21 19:31:55',1),(5,'School',2,1,'2024-07-16 11:49:14',1);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `module_id` int(11) NOT NULL,
  `user_role_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES (1,'User',1,1,1,'2024-05-21 17:18:10',1),(2,'Admin',1,1,1,'2024-05-21 17:19:15',1),(3,'Principle',1,4,1,'2024-05-21 19:34:54',1),(5,'Vice-Principle',2,2,1,'2024-05-21 19:37:48',1),(6,'Teacher',2,5,1,'2024-07-16 11:55:55',1),(7,'Curriculum Head',3,3,1,'2024-07-16 12:12:30',1);
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-03 13:48:05
