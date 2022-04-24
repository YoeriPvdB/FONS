-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pearceyy
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL,
  `comment` mediumtext NOT NULL,
  `post_id` int NOT NULL,
  `username` varchar(26) NOT NULL,
  `user_id` int NOT NULL,
  `date` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (219604455,'I like this picture a lot!',4717111,'Ali',20104,'5/4/2022'),(572887525,'That is some really cool work :)',5487431,'Yoeri',53058,'5/4/2022'),(535691054,'Awesome!',6528908,'Isra',37487,'5/4/2022'),(676838208,'I like the green :)',9266496,'Yoeri',53058,'5/4/2022'),(627508858,'I agree, I also like green :)',9266496,'Ali',20104,'5/4/2022');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `post_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (4630644,53058),(4630644,53058),(4630644,53058),(4259683,53058),(4259683,53058),(4259683,94595),(4630644,94595),(4717111,94595),(4717111,37487),(4259683,37487),(1171288,37487),(5487431,37487),(6528908,37487),(5487431,53058),(6103238,53058),(6103238,20104),(9266496,53058),(9266496,20104),(5487431,20104);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_ID` int DEFAULT NULL,
  `user_ID` int DEFAULT NULL,
  `description` text,
  `likes` int DEFAULT NULL,
  `comments` int DEFAULT NULL,
  `views` int DEFAULT NULL,
  `date` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (4717111,53058,'no desc',1,1,0,'5/4/2022'),(4259683,53058,'no desc',1,0,0,'5/4/2022'),(1171288,16318,'no desc',1,0,0,'5/4/2022'),(5487431,16318,'no desc',3,1,0,'5/4/2022'),(6528908,20104,'no desc',1,1,0,'5/4/2022'),(6103238,37487,'no desc',2,0,0,'5/4/2022'),(9266496,37487,'no desc',2,2,0,'5/4/2022'),(6416735,53058,'no desc',0,0,0,'5/4/2022');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(15) DEFAULT NULL,
  `password` varchar(26) DEFAULT NULL,
  `user_ID` int DEFAULT NULL,
  `profile_image` varchar(20) DEFAULT NULL,
  `likes` int DEFAULT NULL,
  `posts` int DEFAULT NULL,
  `friends` int DEFAULT NULL,
  `comments` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Yoeri','pass',53058,'profile_53058.jpg',NULL,NULL,NULL,NULL),('Sarah','summer',16318,'profile_16318.jpg',NULL,NULL,NULL,NULL),('Ali','password',20104,'profile_20104.jpg',NULL,NULL,NULL,NULL),('Isra','pass',37487,'profile_37487.jpg',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-05 19:29:35
