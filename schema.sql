CREATE DATABASE IF NOT EXISTS `aevfoto` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `aevfoto`;

CREATE TABLE IF NOT EXISTS `photos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `year` int(10) unsigned NOT NULL,
  `month` int(10) unsigned NOT NULL,
  `subfolder` varchar(50) DEFAULT '',
  `filename` varchar(50) NOT NULL DEFAULT '',
  `rating` int(11) NOT NULL DEFAULT 0,
  `flagged_for_deletion` bit(1) NOT NULL DEFAULT b'0',
  `path_hash` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'READ',
  `password` char(128) NOT NULL DEFAULT '',
  `salt` char(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
