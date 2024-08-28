-- MySQL dump 10.13  Distrib 5.6.43, for Win64 (x86_64)
--
-- Host: localhost    Database: prose_administrative_module_dev
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
  `name` varchar(30) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_admission_open` int(11) NOT NULL,
  `is_current_session` int(11) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_session`
--

LOCK TABLES `academic_session` WRITE;
/*!40000 ALTER TABLE `academic_session` DISABLE KEYS */;
INSERT INTO `academic_session` VALUES (2,'2024-2025','2024-04-01','2025-03-31',1,0,'2024-05-29 16:35:47',4,NULL,NULL);
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
  `is_compulsory` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academy_enclosure_document`
--

LOCK TABLES `academy_enclosure_document` WRITE;
/*!40000 ALTER TABLE `academy_enclosure_document` DISABLE KEYS */;
INSERT INTO `academy_enclosure_document` VALUES (1,'Pan',1,1,'2024-06-21 18:53:43',4),(2,'GST Certificate',1,1,'2024-06-21 18:53:55',4),(3,'License Certificate',1,1,'2024-07-11 19:26:11',4);
/*!40000 ALTER TABLE `academy_enclosure_document` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_partner`
--

LOCK TABLES `business_partner` WRITE;
/*!40000 ALTER TABLE `business_partner` DISABLE KEYS */;
INSERT INTO `business_partner` VALUES (1,'Just Game LLP - Just Cricket','RP-000001',1,'info@justcric.com',1,'3,1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490023','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,NULL,NULL,'2022-04-01','2027-03-31',1,10,1,1,'AAMF13029Q','29AAMF13029Q1ZN',NULL,1,'2024-06-28 12:27:18',4,NULL,NULL,'a8ca8b10-351b-11ef-ac9e-9528e9adec92',NULL,NULL),(2,'Just Game LLP - Just Cricket-1','RP-000002',1,'info-1@justcric.com',1,'3,1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490023','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,NULL,NULL,'2022-04-01','2027-03-31',0,NULL,1,1,'AAMF13029Q','29AAMF13029Q1ZN',NULL,1,'2024-06-28 12:35:46',4,NULL,NULL,'d7b25600-351c-11ef-a0e6-e31ab257a17b',NULL,NULL),(3,'Just Game LLP - Just Cricket-2','RP-000003',1,'info-2@justcric.com',1,'1,2','No 7/1 , Itgalpura village, Rajanukunte, Bangalore North',1,4,3,1,'490001','Mr.Nasiruddin','tnaas3@gmail.com','9448505903',NULL,'tnaas3@gmail.com','9448505903','2021-04-01','2024-12-31',1,3,0,1,NULL,NULL,NULL,0,'2024-06-28 12:37:08',4,'2024-07-12 11:24:10',4,'083ca2d0-351d-11ef-a6a9-598cb34e38bd','2024-07-04 10:23:14',4);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_partner_coach`
--

LOCK TABLES `business_partner_coach` WRITE;
/*!40000 ALTER TABLE `business_partner_coach` DISABLE KEYS */;
INSERT INTO `business_partner_coach` VALUES (1,1,2,1,'2024-07-03 17:59:22',4,NULL,NULL),(3,1,6,1,'2024-07-03 18:08:35',4,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_partner_contract_history`
--

LOCK TABLES `business_partner_contract_history` WRITE;
/*!40000 ALTER TABLE `business_partner_contract_history` DISABLE KEYS */;
INSERT INTO `business_partner_contract_history` VALUES (3,3,'2024-01-01','2024-12-31',1,'2024-06-28 12:37:08',4,NULL,NULL),(9,1,'2019-01-01','2020-12-31',0,'2024-06-29 11:22:35',4,'2024-06-29 11:51:30',4),(10,1,'2022-01-01','2023-12-31',1,'2024-06-29 11:51:30',4,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_partner_doc_upload`
--

LOCK TABLES `business_partner_doc_upload` WRITE;
/*!40000 ALTER TABLE `business_partner_doc_upload` DISABLE KEYS */;
INSERT INTO `business_partner_doc_upload` VALUES (3,2,1,'RP-000002_3.pdf','2024-06-28 12:35:46',4,NULL,NULL),(4,2,2,'RP-000002_4.xlsx','2024-06-28 12:35:46',4,NULL,NULL),(5,3,1,'RP-000003_5.pdf','2024-06-28 12:37:08',4,NULL,NULL),(6,3,2,'RP-000003_6.xlsx','2024-06-28 12:37:08',4,NULL,NULL),(9,1,2,'RP-000001_9.docx','2024-07-03 15:44:37',4,'2024-07-03 15:45:19',4);
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
-- Table structure for table `chapter_wise_topic`
--

DROP TABLE IF EXISTS `chapter_wise_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chapter_wise_topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_session_id` int(11) NOT NULL,
  `subject_wise_chapter_id` int(11) NOT NULL,
  `name` text CHARACTER SET utf8 NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter_wise_topic`
--

LOCK TABLES `chapter_wise_topic` WRITE;
/*!40000 ALTER TABLE `chapter_wise_topic` DISABLE KEYS */;
INSERT INTO `chapter_wise_topic` VALUES (2,2,2,'Topic-1',1,'2024-06-11 16:27:10',4,NULL,NULL),(3,2,2,'Topic-110',1,'2024-06-12 10:37:21',4,NULL,NULL),(4,2,2,'हिंदी व्याकरण',1,'2024-07-05 12:26:12',1,NULL,NULL),(5,2,2,'विराम चिह्न',1,'2024-07-05 12:26:12',1,NULL,NULL),(6,2,2,'पर्यायवाची शब्द',1,'2024-07-05 12:26:12',1,NULL,NULL);
/*!40000 ALTER TABLE `chapter_wise_topic` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'Bhilai',1,4,3,1,'2024-06-25 12:47:19',4,'2024-06-25 12:52:24',4),(23,'Anda',1,4,3,1,'2024-07-05 10:49:02',1,NULL,NULL),(24,'Dhamdha',1,4,3,1,'2024-07-05 10:49:02',1,NULL,NULL),(25,'Jamul',1,4,3,1,'2024-07-05 10:49:02',1,NULL,NULL),(26,'Patan',1,4,3,1,'2024-07-05 10:49:02',1,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `district`
--

LOCK TABLES `district` WRITE;
/*!40000 ALTER TABLE `district` DISABLE KEYS */;
INSERT INTO `district` VALUES (1,'Bhopal',1,2,1,'2024-06-24 19:13:43',4,'2024-06-24 19:24:00',4),(3,'Durg',1,4,1,'2024-06-25 12:46:46',4,NULL,NULL),(4,'Raipur',1,4,1,'2024-07-04 20:13:00',1,NULL,NULL),(5,'Mahasamund',1,4,1,'2024-07-04 20:13:00',1,NULL,NULL),(6,'Balod',1,4,1,'2024-07-04 20:13:00',1,NULL,NULL),(7,'Baloda-Baazar',1,4,1,'2024-07-04 20:13:00',1,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade`
--

LOCK TABLES `grade` WRITE;
/*!40000 ALTER TABLE `grade` DISABLE KEYS */;
INSERT INTO `grade` VALUES (2,2,'KG-2',1,'2024-06-04 12:58:49',4),(4,3,'Class-1',1,'2024-06-04 13:02:42',4),(5,3,'Class-2',1,'2024-06-04 13:02:48',4);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_category`
--

LOCK TABLES `grade_category` WRITE;
/*!40000 ALTER TABLE `grade_category` DISABLE KEYS */;
INSERT INTO `grade_category` VALUES (2,'Pre-Primary',1,'2024-05-30 11:48:53',4),(3,'Primary',1,'2024-05-30 11:48:58',4),(4,'Middle',1,'2024-05-30 11:49:57',4),(5,'Secondary',1,'2024-05-30 11:50:05',4);
/*!40000 ALTER TABLE `grade_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade_wise_syllabus`
--

DROP TABLE IF EXISTS `grade_wise_syllabus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grade_wise_syllabus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_session_id` int(11) NOT NULL,
  `grade_id` int(11) NOT NULL,
  `syllabus_id` int(11) NOT NULL,
  `is_active` int(11) DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_wise_syllabus`
--

LOCK TABLES `grade_wise_syllabus` WRITE;
/*!40000 ALTER TABLE `grade_wise_syllabus` DISABLE KEYS */;
INSERT INTO `grade_wise_syllabus` VALUES (2,2,4,2,1,'2024-06-07 16:03:07',4,'2024-06-07 16:07:52',4);
/*!40000 ALTER TABLE `grade_wise_syllabus` ENABLE KEYS */;
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
-- Table structure for table `schooling_program`
--

DROP TABLE IF EXISTS `schooling_program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schooling_program` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `academic_session_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schooling_program`
--

LOCK TABLES `schooling_program` WRITE;
/*!40000 ALTER TABLE `schooling_program` DISABLE KEYS */;
INSERT INTO `schooling_program` VALUES (2,'K12',2,1,'2024-05-27 19:16:18',4),(3,'Graduation',2,1,'2024-05-27 19:16:40',4),(4,'Post-Graduation',2,1,'2024-06-06 20:05:20',4);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state_region`
--

LOCK TABLES `state_region` WRITE;
/*!40000 ALTER TABLE `state_region` DISABLE KEYS */;
INSERT INTO `state_region` VALUES (2,'MadhyaPradesh',1,1,'2024-06-24 17:29:56',4,NULL,NULL),(4,'Chhattisgarh',1,1,'2024-06-24 19:15:42',4,NULL,NULL),(5,'Delhi',1,1,'2024-07-04 19:58:24',1,NULL,NULL),(6,'Maharastra',1,1,'2024-07-04 19:58:24',1,NULL,NULL);
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
INSERT INTO `study_center` VALUES (1,NULL,'Krishna Public School-2','CW-000001','994589435851','kpsbhilai22@gmail.com',1,4,3,1,'4900452','Nehru Nagar',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'92355320-4034-11ef-a7fe-ad56391774c9','2024-07-12 15:23:20',4,'2024-07-13 11:00:39',4,NULL,NULL),(3,NULL,'Krishna Public School-3','CO-000003','777589435851','kpsbhilai23@gmail.com',1,4,3,1,'4900452','Nehru Nagar',2,'AAMF13029Q','29AAMF13029Q1ZN','Kamlesh','Rohit Sinha','rohit124@gmail.com','998584939383',2,2,1,'1a74b8c0-40da-11ef-a20a-b771b1bb406c','2024-07-13 11:08:16',4,NULL,NULL,NULL,NULL),(4,NULL,'Krishna Public School-4','CO-000004','777589435859','kpsbhilai24@gmail.com',1,4,3,1,'4900452','Nehru Nagar',2,'AAMF13029Q','29AAMF13029Q1ZN','Kamlesh','Rohit Sinha','rohit124@gmail.com','998584939383',3,2,1,'74e5a530-40da-11ef-a20a-b771b1bb406c','2024-07-13 11:10:48',4,NULL,NULL,NULL,NULL),(5,2,'Krishna\'s Public School-9','PC-000005','994589435856','kpsbhilai29@gmail.com',1,4,3,1,'4900452','Nehru Nagar',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'926d4ea0-40da-11ef-a20a-b771b1bb406c','2024-07-13 11:11:37',4,'2024-07-13 11:30:37',4,'2024-07-13 11:36:38',4),(6,2,'Krishna Public School-5','PC-000006','777589435852','kpsbhilai25@gmail.com',1,4,3,1,'4900452','Nehru Nagar',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'a20de5d0-40db-11ef-ad02-6522ae59098b','2024-07-13 11:19:13',4,NULL,NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_center_agreement_history`
--

LOCK TABLES `study_center_agreement_history` WRITE;
/*!40000 ALTER TABLE `study_center_agreement_history` DISABLE KEYS */;
INSERT INTO `study_center_agreement_history` VALUES (2,3,'2023-06-01','2024-06-30',1,'2024-07-13 11:08:16',4,NULL,NULL),(3,4,'2023-06-01','2024-06-30',1,'2024-07-13 11:10:48',4,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
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
-- Table structure for table `subject_wise_chapter`
--

DROP TABLE IF EXISTS `subject_wise_chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subject_wise_chapter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_session_id` int(11) NOT NULL,
  `syllabus_wise_subject_id` int(11) NOT NULL,
  `name` text CHARACTER SET utf8 NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_wise_chapter`
--

LOCK TABLES `subject_wise_chapter` WRITE;
/*!40000 ALTER TABLE `subject_wise_chapter` DISABLE KEYS */;
INSERT INTO `subject_wise_chapter` VALUES (2,2,2,'Chapter-21',1,'2024-06-11 11:52:43',4,'2024-06-11 12:13:54',4),(3,2,2,'Chapter-2',1,'2024-06-11 13:05:48',4,NULL,NULL);
/*!40000 ALTER TABLE `subject_wise_chapter` ENABLE KEYS */;
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
  `schooling_program_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `syllabus`
--

LOCK TABLES `syllabus` WRITE;
/*!40000 ALTER TABLE `syllabus` DISABLE KEYS */;
INSERT INTO `syllabus` VALUES (2,'NIOS',3,0,'2024-05-28 10:26:31',4),(3,'CBSE',3,1,'2024-06-07 17:07:36',4);
/*!40000 ALTER TABLE `syllabus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `syllabus_wise_subject`
--

DROP TABLE IF EXISTS `syllabus_wise_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `syllabus_wise_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_session_id` int(11) NOT NULL,
  `grade_wise_syllabus_id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `updated_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `syllabus_wise_subject`
--

LOCK TABLES `syllabus_wise_subject` WRITE;
/*!40000 ALTER TABLE `syllabus_wise_subject` DISABLE KEYS */;
INSERT INTO `syllabus_wise_subject` VALUES (2,2,2,'Hindi',1,'2024-06-10 12:32:21',4,NULL,NULL);
/*!40000 ALTER TABLE `syllabus_wise_subject` ENABLE KEYS */;
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
  `syllabus_id` int(11) NOT NULL,
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
INSERT INTO `tie_up_school` VALUES (1,'Krishna Public School','kpsbhilai@gmail.com','994589435834','https://www.kpsbhilai.com','Nehru Nagar',2,1,4,3,1,'4900452','Rahul Singh','DHPEK4389J',1,1,'cfb37fe0-3e83-11ef-8822-510cd6b4254b','2024-07-10 11:45:31',4,NULL,NULL,NULL,NULL),(2,'Krishna Public School-1','kpsbhilai1@gmail.com','994589435830','https://www.kpsbhilai.org','Nehru Nagar',2,1,4,3,1,'4900452','Rahul Singh','DHPEK4389J',2,1,'73c23f90-3e84-11ef-a571-fb920cd43bcc','2024-07-10 11:50:07',4,NULL,NULL,NULL,NULL),(3,'Krishna Public School-21','kpsbhilai2@gmail.com','994589435831','https://www.kpsbhilai.co.in','Nehru Nagar',3,1,4,3,1,'4900452','Rahul Singh','DHPEK4389J',5,0,'37c7fb00-3e85-11ef-b0e6-1f5491d21839','2024-07-10 11:55:35',4,'2024-07-10 12:27:41',4,'2024-07-10 12:31:01',4),(4,'Krishna Public School-2','kpsbhilai22@gmail.com','994589435851','https://www.kpsbhilai.co.in','Nehru Nagar',2,1,4,3,1,'4900452','Rahul Singh','DHPEK4389J',6,1,'a2bd9e60-3f89-11ef-ba6d-7d3c33682264','2024-07-11 18:59:44',4,NULL,NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'HR','Admin','pkale71@gmail.com','9993443711','Male',1,1,'5816EE12CB8BD00C6D28A7B640D1D48E',NULL,1,1,'FREHt5n5KuYdqPxrCo9vIdqwVsXw2uRT6chBe0ToZWxCWFjGzlCGL4BJ','2024-05-20 12:26:39',0,NULL,NULL,NULL,NULL,'2024-05-20 12:26:39',0,NULL,NULL,'27537b39-1676-11ef-866d-54ee753f9eea'),(4,'Rohit',NULL,'rohitsingh@gmail.com','9993443701','Male',2,1,'5816EE12CB8BD00C6D28A7B640D1D48E','81c5bfd0-1739-11ef-9262-bb5f70f380f8_Pic.png',1,1,'LdTrweKSBaZR83oMrYfBmHfrt4QEqY7NBszlNDfZjo4EII5lh6nAmxHY','2024-05-21 11:45:22',1,NULL,NULL,NULL,NULL,'2024-05-27 16:16:13',1,'2024-05-21 15:16:00',1,'81c5bfd0-1739-11ef-9262-bb5f70f380f8'),(9,'Kamlesh','Singh','kamlesh.1223@gmail.com','7773443701','Male',5,1,'8A14FF7F88739EB67A837FB10BD35933',NULL,1,1,NULL,'2024-05-21 12:02:56',1,NULL,NULL,NULL,NULL,'2024-05-23 16:06:20',1,NULL,NULL,'f5c03b20-173b-11ef-86f5-1774f3e8216f'),(10,'Umesh','Yadav','umesh.yadav@gmail.com','7773443639','Male',5,1,'FD88B4A891D0ACC524777DEC2A6C1D05','a9177500-173f-11ef-86f5-1774f3e8216f_Pic.png',1,1,NULL,'2024-05-21 12:29:25',1,NULL,NULL,NULL,NULL,'2024-05-23 16:07:16',1,NULL,NULL,'a9177500-173f-11ef-86f5-1774f3e8216f'),(12,'Rajesh',NULL,'pkale71@yahoo.com','9993443712','Male',5,1,'FD88B4A891D0ACC524777DEC2A6C1D05',NULL,1,0,NULL,'2024-06-12 14:04:50',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'a229d270-2896-11ef-b5f4-6fdbbd826909');
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
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_login_logout_history`
--

LOCK TABLES `user_login_logout_history` WRITE;
/*!40000 ALTER TABLE `user_login_logout_history` DISABLE KEYS */;
INSERT INTO `user_login_logout_history` VALUES (1,1,'JoAtervlxY11izO3SAConmT8FxYAY9EWBcZjN1Wx2VNi0QJVSF0ekWMu','2024-05-20 13:56:22','2024-05-20 13:57:02','Forced'),(2,1,'xTYjn84jotRq8eBQyDkezCQSDndpqTfeq7AxeFmbjf42zGIKVaIm1UuZ','2024-05-20 13:57:02','2024-05-20 14:13:55','Forced'),(3,1,'9wjPmFyiwO63BnQTbrXY6h9P7AgdcqdLiv1ywbEY6IU6eCH91J55rbzj','2024-05-20 14:13:55','2024-05-20 15:57:48','Normal'),(4,1,'9D6GCsQy0YbjHAMgz7lMlYztVAmlR8XNw14hGLzydxTPnjrwTDrEf3nl','2024-05-20 16:00:22','2024-05-20 16:49:40',NULL),(5,1,'W8RFlhGbvXFd9TJBZf3IJSmev9PSXyDqL6LFWfrbCGpkHSBfyZ42CzQt','2024-05-20 16:55:07','2024-05-21 10:26:20','Forced'),(6,1,'KFxeLwW9rdwKytGKP5q9TKbdY6zsZFlwKj5B89WDscFb7KGAkjGdmJ2j','2024-05-21 10:26:20','2024-05-21 14:07:23','Forced'),(7,1,'cSESWUmzcLs9mbINe8AmJI2aYDoqsBLls7QoHuKbbublPfc8dTcNrF2o','2024-05-21 14:07:23','2024-05-23 16:08:16','Forced'),(8,9,'emEmQKJb1I68gtxsuRPaN88XlXhttFpYl8guJx8O7Lffxfz1ZCWhKh6z','2024-05-23 16:06:32','2024-05-27 15:14:35','Forced'),(9,1,'NlqnIGvdiJpjKun3mDI8vyW44K7U5IaaRPHSR7nUGyy1A6s3rsTs42yI','2024-05-23 16:08:16','2024-05-23 16:11:53','Forced'),(10,1,'Dif9dTQxKqox524Sn8kPFljAW1gEItsdIp78pjdnyNd2znRfv8K8HoXr','2024-05-23 16:11:53','2024-05-23 16:15:16','Forced'),(11,1,'0a1Q4ocrAqXVC54YNjO7TmLmgViTVGpjXWIeuuCiPijZCkZN1ql8MlaA','2024-05-23 16:15:16','2024-05-23 16:15:29','Forced'),(12,1,'FhQEQ3Yk3Jmo1Bbdx8Q81kvtmrciTvWJgBhs02VOiZVBg66ozrP2dJz5','2024-05-23 16:15:29','2024-05-23 16:16:31','Forced'),(13,1,'dQlnGFgceQDZHk665sQSpBBXVVyfByi1oWbv75CPq9bOKHiwVfGl3xfM','2024-05-23 16:16:31','2024-05-23 16:18:25','Forced'),(14,1,'ZgzwIJinKj0Nf1O3Qu5xxM2QDkZCjmwyzTbpfXdvhcA5cpuu2846IJeQ','2024-05-23 16:18:25','2024-05-23 16:19:35','Forced'),(15,1,'58hIiRLWIqD9MDHIhQokbzvSoULTWlYV8WlXKKC9NFNinWgLrenAeDCe','2024-05-23 16:19:35','2024-05-23 16:20:38','Forced'),(16,1,'R8cfTsIAnugwMO5pPHBY4rnri6V8PyXwXpHg8y7l6b19AuO7qrl577VK','2024-05-23 16:20:38','2024-05-23 16:22:56','Forced'),(17,1,'h9VY33SciRFNfFiKEPUuXk6YpIKCrnXkThyvKkA4FD9pu7orX4zTth5E','2024-05-23 16:22:56','2024-05-24 15:48:23','Forced'),(18,1,'codd3jniQvEyyY9Wce8ek5cLoyP0Or57uX0lSxwWPjgJoxtzy7N1ZVL5','2024-05-24 15:48:23','2024-05-24 15:49:00','Forced'),(19,1,'VtbsxzRJ6zDbLT3fbtA6NPoEVngz8RGKX83Xqu3p3Ctu5IcjqOLlBtmJ','2024-05-24 15:49:00','2024-05-24 17:22:36','Forced'),(20,1,'jmIX647AzAErVwMfU5Z4Jv1AZ4QxZOystTjlmlkOP2OLaberQnm4CN2i','2024-05-24 17:22:36','2024-05-24 17:23:25','Forced'),(21,1,'sgdn0OGUU6KzIEn3tUrfiPeDXVM4biANTuFgkklXySQm9fvVBOYM9qyV','2024-05-24 17:23:25','2024-05-24 17:24:18','Forced'),(22,1,'howoRHbD9Dt0Zk4yDhwdBATx8bgreSDw1jjOZsdwu7oloKA2fO6pLflN','2024-05-24 17:24:18','2024-05-24 17:24:38','Forced'),(23,1,'s6RRx7n7TJfRA2Fc8EloSRWORxZj8KBtA1wp69rIRqrIsyW4tImyMcL7','2024-05-24 17:24:38','2024-05-24 17:25:10','Forced'),(24,1,'uGs73n8s2wRfvfdm6yujdZ1aNrpPloqGOnX7n3O0Yo4WgCDhfpgYFx6Z','2024-05-24 17:25:10','2024-05-24 17:25:49','Forced'),(25,1,'vhEMY2V8fO7S0fN4Q1VduvAyUqrb7HzF4KxQGXpuskPRFoBDyHLV10vj','2024-05-24 17:25:49','2024-05-24 18:06:35','Forced'),(26,1,'rbvC4y6ho1ukyFTBog8v3aEXrJJ3M8eSf7RdrPWCKbnryaqk46n49qHb','2024-05-24 18:06:35','2024-05-24 18:08:07','Forced'),(27,1,'IhRxRIWNHAPCyz3zVCEk0yf467CP7Ks5oS4nMvoIKYzKV1yMedQFjeON','2024-05-24 18:08:07','2024-05-24 18:08:29','Forced'),(28,1,'wOzvqzyEbJRFwhDUjRQS1qcQZR0BXzfII0nnXsOEcG9TxbVBmZQdtxiE','2024-05-24 18:08:29','2024-05-24 18:08:34','Forced'),(29,1,'gvM2t45ElQWawDmE7v6gA91GtDGHWyhqtACRfoqWLc1KBbtiA3Uo2aCl','2024-05-24 18:08:34','2024-05-24 18:08:51','Forced'),(30,1,'74XfrpFohyHLwh9brDVJ0GB7C0GLmHSdFdbET1ykdr0VtbH35V9QxBOI','2024-05-24 18:08:51','2024-05-24 18:09:26','Forced'),(31,1,'ScJY6V9jsZSt8hLlWPyliI96wuaHHLNtbdtBc8dz7ywRN2Rp4JZmYsjK','2024-05-24 18:09:26','2024-05-24 18:09:36','Forced'),(32,1,'gMbqdLiCdq9QN7lCf7LRaNkGVKLVcEVZA1n0MbdoNnOwbBLUiDSCCF2J','2024-05-24 18:09:36','2024-05-24 18:10:32','Forced'),(33,1,'XtJKZsxlfNpEpChEJ5aPRNYNipUQJKq5SzpAEMSi6OgE6blbz1vm7Acu','2024-05-24 18:10:32','2024-05-24 18:10:43','Forced'),(34,1,'T7gT7ZyIlfrSNmZ4usBGsgK4A7C4wZiXXrqdDzQkeUtm4QuIzb6uYXVb','2024-05-24 18:10:43','2024-05-24 18:13:02','Forced'),(35,1,'BzZq7QXRSC61PbEbkvJkHgrpmMPWW79eKEHOco3Kh8DnKsBoyjEFSp1Y','2024-05-24 18:13:02','2024-05-24 18:15:07','Forced'),(36,1,'LTpWCVdySfHAt45A2Y6VBIS6XRL1O3DNaHAJDYMlwrslL921g5mommbe','2024-05-24 18:15:07','2024-05-24 18:16:45','Forced'),(37,1,'7CnrgOFN3oiPbW5lr9mQUs4Q6qBO3JHUA3RdiYdfcLKHsM5n0UPnUtHl','2024-05-24 18:16:45','2024-05-27 14:47:18','Forced'),(38,1,'LAofL5xQN5tYSQyp9dm61GwvpabDkAJ2pYyyZHKYT3qfkEyI5LtHvpdE','2024-05-27 14:47:18','2024-05-27 14:50:20','Forced'),(39,1,'D3ScStWpRzWjeBcdp5UxHicVAMTKucw3y7hxHan11RYOHZoJyQvM8kHl','2024-05-27 14:50:20','2024-05-27 14:51:31','Forced'),(40,1,'15ljuw9Y35yJb5f5szTUjSuyAq32CH6boPLSOQx6fX0zxGnQjAR5IYyb','2024-05-27 14:51:31','2024-05-27 14:51:51','Forced'),(41,1,'czrneWKpX1eHw61pcwuKHglKePk2AQjhDQmB031EenJTLFZlJoVSe47V','2024-05-27 14:51:51','2024-05-27 14:58:15','Forced'),(42,1,'zt4acBekoscovfgDlm4OW4QkVl69ilsVfd2wsqQ4AXSF0XO5gR2XSnrr','2024-05-27 14:58:15','2024-05-27 14:59:36','Forced'),(43,1,'2DqLt5ExeOrGV9DNFeX8PzjQD6RYEUjvDbBTdsr7YMF5fTKuMTVBfZ9a','2024-05-27 14:59:36','2024-05-27 14:59:44','Forced'),(44,1,'45Q7ONITVkF4LkM0QWetloYgg3Xru7qfjyK6mZMfXJHcAdPPP5zHZ6H5','2024-05-27 14:59:44','2024-05-27 14:59:55','Forced'),(45,1,'66noUms9czjJgcgkm2NwozCIjDu8sqTHRtUp9fKj941Ih7e6v8C0EONp','2024-05-27 14:59:55','2024-05-27 15:01:13','Forced'),(46,1,'S4XlMvnw6XV9RK3BFtIt73Uo7C1PpLvwFsUAr58DGNyHzR4vsL83NpIE','2024-05-27 15:01:13','2024-05-27 15:01:50','Forced'),(47,1,'419SDulLVyC8fAQmSQPprDhuzcCjaUkM3cq3xAsTqBzCM5KIZWUD1c8f','2024-05-27 15:01:50','2024-05-27 15:02:51','Forced'),(48,1,'D0WvYV8gebjIcczLvtI7f7Z1MAmZqShglGSNfvZQpb0uvbCzRcoIUMQR','2024-05-27 15:02:51','2024-05-27 15:12:45','Forced'),(49,1,'tA0offbfyW3HqjTpqxfbr16lCYZ6pDpr7TDTIaNSW4voLIMvpUiGprm2','2024-05-27 15:12:45','2024-05-27 15:26:14','Forced'),(50,9,'sxkx7gwLlyULEi13bj2CIq09SSFtsNgm9b7lRnfsk75dRo42VsSGkbR1','2024-05-27 15:14:35','2024-05-27 15:27:19','Forced'),(51,1,'Fa8T5zfvAQYxejmWLqee9PQkms6KEBkqJavnCeSKxDgiZzhGEyLS6CKC','2024-05-27 15:26:14','2024-05-27 15:26:20','Normal'),(52,9,'aPp3AXiA86gNbD2VkvDs2Kc34G53ZQ2gY1T4H2xxcp7OytoWggN7EozM','2024-05-27 15:27:19','2024-05-27 15:35:07','Normal'),(53,9,'neUXdIJdP4U0oTpX3Uyb8LkPJjPKufLofWzaXqhiBU2hhVpY8QzsndF2','2024-05-27 15:35:10','2024-05-27 15:38:24','Forced'),(54,9,'zqi5Kz7CrVEhv9juksItbPAEdGq1C1EgehyXPgIovpPUMTRVGiQpcIrW','2024-05-27 15:38:24','2024-05-27 15:39:58','Forced'),(55,9,'LejDkZYevyhkPxJWJ6rYvTNL136yKF1UDQDA3r5RJ3bQdkBESjtm3o6W','2024-05-27 15:39:58','2024-05-27 15:43:50','Forced'),(56,9,'Pg2Iz9I6iglDxRIMyVNQjj5eTNzjOJ1GC1INuZ7cfueiFO9GcMcBRNwN','2024-05-27 15:43:50','2024-05-27 15:44:48','Forced'),(57,9,'KphDBBYPzc60XdiY1862bZkMtCXx1JS96xAVvitFCOdioNh3Zdtrr9Gu','2024-05-27 15:44:48','2024-05-27 15:45:43','Forced'),(58,9,'GCmwjdHvJ1b4JVK66uWmRd1eSF2BuHsEAl1IBhAi2JREEK6XiAIPLwGS','2024-05-27 15:45:43','2024-05-27 15:46:23','Forced'),(59,9,'U2dB4xwtyG9vVirQL9HkZU47cDs8dChuPAitTMJcP4R4BvlgKP2sgRgs','2024-05-27 15:46:23','2024-05-27 15:48:23','Forced'),(60,9,'8hCzTJXOcIbR6pfSJVqTwrS6V5E4iy3U1BXvYxi2Zg4Bxi2ooBgmVibC','2024-05-27 15:48:23','2024-05-27 16:13:21','Normal'),(61,4,'2QVu8ivqSnEIxlw8F1ERkONvBnhgTLHUE1p2TqcEAsBsaGvjxbHjexpg','2024-05-27 16:17:00','2024-05-27 16:17:37','Forced'),(62,4,'jVLVcKuSWHrQd4EvcEAc1BIqgltLPgCAwjwS38ZGNLYyvKdnv4I8Ssb6','2024-05-27 16:17:37','2024-05-27 16:18:47','Forced'),(63,4,'Erqis4fUQBuOYYH8MEfZ5BGi6hnrY39QOY9tqEkLt4Z5RdiGCf6URG3F','2024-05-27 16:18:47','2024-05-27 16:19:01','Forced'),(64,4,'LdTrweKSBaZR83oMrYfBmHfrt4QEqY7NBszlNDfZjo4EII5lh6nAmxHY','2024-05-27 16:19:01','2024-06-27 16:26:13','Forced'),(65,4,'1EAM9KWWWVTYGcxGrylmTYndHbGdXRgLCTHHwVZfIPdtl9G2AHO3tgh7','2024-06-27 16:26:13','2024-06-27 16:36:04','Forced'),(66,4,'KCnU2tEUCpSUAV5s2mEps8blUxpQTs7ZdteJFsqd5NzIzorrpY4s8Vuw','2024-06-27 16:36:04',NULL,NULL),(67,1,'Bgb3Gjx9uyatzAvphpvwzpWswfAuOWA1TyjUOqlZOLmOD7WX3u0pu3ly','2024-06-27 16:36:24','2024-06-27 16:43:21','Forced'),(68,1,'FREHt5n5KuYdqPxrCo9vIdqwVsXw2uRT6chBe0ToZWxCWFjGzlCGL4BJ','2024-06-27 16:43:21',NULL,NULL);
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
  `user_role_id` int(11) NOT NULL,
  `user_type_id` int(11) NOT NULL,
  `is_active` int(11) DEFAULT '1',
  `is_approved_by_module_admin` int(11) DEFAULT '0',
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `approved_on` datetime DEFAULT NULL,
  `approved_by_id` int(11) DEFAULT NULL,
  `denied_on` datetime DEFAULT NULL,
  `denied_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_module`
--

LOCK TABLES `user_module` WRITE;
/*!40000 ALTER TABLE `user_module` DISABLE KEYS */;
INSERT INTO `user_module` VALUES (2,9,1,4,3,1,1,'2024-05-22 11:20:21',1,'2024-05-24 10:51:35',1,NULL,NULL),(4,9,2,2,5,1,0,'2024-05-24 10:59:40',1,NULL,NULL,NULL,NULL);
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
  `user_role_id` int(11) NOT NULL,
  `user_type_id` int(11) NOT NULL,
  `assigned_on` datetime NOT NULL,
  `assigned_by_id` int(11) NOT NULL,
  `remark` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_module_history`
--

LOCK TABLES `user_module_history` WRITE;
/*!40000 ALTER TABLE `user_module_history` DISABLE KEYS */;
INSERT INTO `user_module_history` VALUES (1,9,2,4,3,'2024-05-24 10:51:18',1,'Approve'),(3,9,2,2,5,'2024-05-24 10:59:40',1,'Created');
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
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `sent_on` datetime DEFAULT NULL,
  `is_sent` int(11) DEFAULT '0',
  `created_user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_on_boarding_link`
--

LOCK TABLES `user_on_boarding_link` WRITE;
/*!40000 ALTER TABLE `user_on_boarding_link` DISABLE KEYS */;
INSERT INTO `user_on_boarding_link` VALUES (1,'AqAVJW','pkale71@yahoo.com','9993443712','2024-05-23 12:11:50',1,NULL,0,12);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (2,'Head',2,1,'2024-05-21 15:53:53',1),(3,'Head',3,1,'2024-05-21 15:54:01',1),(4,'School',1,0,'2024-05-21 19:31:55',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES (1,'User',1,1,1,'2024-05-21 17:18:10',1),(2,'Admin',1,1,1,'2024-05-21 17:19:15',1),(3,'Principle',1,4,0,'2024-05-21 19:34:54',1),(5,'Vice-Principle',2,2,1,'2024-05-21 19:37:48',1);
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

-- Dump completed on 2024-07-13 13:55:33
