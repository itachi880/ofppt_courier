-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 06 mars 2025 à 12:55
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ofppt_couriers`
--
CREATE DATABASE IF NOT EXISTS `ofppt_couriers` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ofppt_couriers`;

DELIMITER $$
--
-- Procédures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `getStatus` (IN `year_` INT, IN `month_` INT)   BEGIN
    SELECT 
        SUM(
            CASE   
                WHEN YEAR(created_at) = year_ 
                 AND MONTH(created_at) = month_ THEN 1
                ELSE 0
            END
        ) AS total_opened,

        SUM(
            CASE 
                WHEN is_validated = 1
                 AND YEAR(created_at) = year_ 
                 AND MONTH(created_at) = month_ 
                 AND DATE(updated_at) <= deadline THEN 1
                ELSE 0
            END
        ) AS total_closed_before_deadline,

        SUM(
            CASE
                WHEN is_validated = 1
                 AND YEAR(created_at) = year_ 
                 AND MONTH(created_at) = month_ 
                 AND DATE(updated_at) > deadline THEN 1
                ELSE 0
            END
        ) AS total_closed_after_deadline,

        SUM(
            CASE
                WHEN is_validated = 0
                 AND YEAR(created_at) = year_ 
                 AND MONTH(created_at) = month_ THEN 1
                ELSE 0
            END
        ) AS total_not_validated

    FROM couriers;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `res` (IN `n` INT)   BEGIN
if(n%2=0)THEN  
SELECT * FROM users where id%2=0;
ELSE
 SELECT * FROM users where id%2!=0;
end if;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SHOWPRIMEID` ()   SELECT * FROM users WHERE isPrime(id)$$

--
-- Fonctions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `isPalanorie` (`number` INT) RETURNS TINYINT(1) DETERMINISTIC BEGIN
DECLARE new int  DEFAULT 0 ;
DECLARE existent int  DEFAULT number;
WHILE existent > 10 DO
set new = (new + existent % 10) * 10;
set existent =  existent div 10;
end WHILE;
set new = (new + existent % 10);
if new = number THEN return true;
ELSE
return false;
end IF;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `isPrime` (`n` INT) RETURNS TINYINT(1) DETERMINISTIC BEGIN
DECLARE i int DEFAULT 2;
	WHILE (i * i <= n)  DO
    if (n%i=0) THEN RETURN false;
    end IF;
 END WHILE;
 RETURN true;
 END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `Nchifre` (`n` INT) RETURNS INT(11) DETERMINISTIC BEGIN
    	DECLARE a int DEFAULT 1;
        DECLARE c int DEFAULT n;
        WHILE(c div 10 >= 1)DO
        	set a= a+1;
            set c=c div 10;
            end WHILE;
         RETURN a;
         END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `showID` (`id` INT) RETURNS TINYINT(1) DETERMINISTIC BEGIN
        	DECLARE counter int DEFAULT id;
            DECLARE res int DEFAULT 0;
			WHILE(counter>0)do 
            set res= res+ counter%10;
            set counter=counter div 10;
            end while;
	RETURN res;
    end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `couriers`
--

CREATE TABLE `couriers` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `state` enum('normal','urgent','tres urgent') NOT NULL DEFAULT 'normal',
  `critical` varchar(50) NOT NULL DEFAULT 'false',
  `create_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_courier` tinyint(1) NOT NULL DEFAULT 1,
  `expiditeur` varchar(255) NOT NULL DEFAULT '',
  `is_validated` tinyint(1) DEFAULT 0,
  `result_validation` text DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `courier_assigne`
--

CREATE TABLE `courier_assigne` (
  `id` int(11) NOT NULL,
  `courier_id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `courier_files`
--

CREATE TABLE `courier_files` (
  `id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `courier_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `departement`
--

CREATE TABLE `departement` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_department_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `departement`
--

INSERT INTO `departement` (`id`, `name`, `parent_department_id`, `created_at`, `updated_at`) VALUES
(3, 'Service Audit et Controle de Gestion Casablanca Settat', NULL, '2025-02-27 12:02:12', '2025-02-27 12:02:12'),
(4, 'Service Services aux Entreprises Casablanca Settat', NULL, '2025-02-27 12:03:17', '2025-02-27 12:03:17'),
(5, 'Service Logistique  Casablanca Settat', NULL, '2025-02-27 12:04:08', '2025-02-27 12:04:08'),
(6, 'Service Ressources Humaines  Casablanca Settat', NULL, '2025-02-27 12:08:35', '2025-02-27 12:08:35'),
(7, 'Correspondants Regionaux Informatiques    Casablanca Settat', NULL, '2025-02-27 12:09:36', '2025-02-27 12:09:36'),
(8, 'Service Evaluations,Certificats et Diplômes Casablanca Settat', NULL, '2025-02-27 12:10:37', '2025-02-27 12:10:37'),
(9, 'Service Insertion et Orientation  Casablanca Settat', NULL, '2025-02-27 12:11:36', '2025-02-27 12:11:36'),
(10, 'Service Contrôle Qualité et Suivi de la Formation Casablanca Settat', NULL, '2025-02-27 12:17:40', '2025-02-27 12:17:40'),
(11, 'Service Financier et Comptable Casablanca Settat', NULL, '2025-02-27 12:18:12', '2025-02-27 12:18:12'),
(12, 'Service programmation et suivi de la carte de formation Casablanca Settat', NULL, '2025-02-27 12:18:26', '2025-02-27 12:18:26'),
(13, 'Division Contrôle Qualité Casablanca Settat', NULL, '2025-02-27 12:18:39', '2025-02-27 12:18:39');

-- --------------------------------------------------------

--
-- Structure de la table `group`
--

CREATE TABLE `group` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `departement_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `dep_id` int(11) NOT NULL,
  `grp_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `notified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL DEFAULT 'test',
  `last_name` varchar(60) NOT NULL DEFAULT 'test',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `departement_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `departement_id`, `group_id`, `created_at`, `updated_at`) VALUES
(1, 'test', 'test', 'iliasstranquille@gmail.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'admin', NULL, NULL, '2024-12-17 22:44:27', '2025-02-23 12:38:41'),
(26, 'badr', 'jm', 'badortiana880@gmail.com', '45eb08fd3a0ea8296a04b99b6c87aef3c5ad741a4a5180cc89315783681bbd10', 'admin', 10, NULL, '2025-02-22 21:27:46', '2025-03-04 14:21:29'),
(118, 'iliass', 'haidi', 'meeiliass6@gmail.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2025-02-22 20:41:13', '2025-03-03 15:09:01'),
(120, 'chef', '1', 'chef1@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'Chef_Dr', NULL, NULL, '2025-03-04 12:56:29', '2025-03-04 13:03:36');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `couriers`
--
ALTER TABLE `couriers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `create_by` (`create_by`);

--
-- Index pour la table `courier_assigne`
--
ALTER TABLE `courier_assigne`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_courier_id` (`courier_id`),
  ADD KEY `idx_group_id` (`group_id`),
  ADD KEY `idx_department_id` (`department_id`);

--
-- Index pour la table `courier_files`
--
ALTER TABLE `courier_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courier_files_ibfk_1` (`courier_id`);

--
-- Index pour la table `departement`
--
ALTER TABLE `departement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_department_id` (`parent_department_id`);

--
-- Index pour la table `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_department_id` (`departement_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dep_id` (`dep_id`),
  ADD KEY `grp_id` (`grp_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `dep_id` (`departement_id`),
  ADD KEY `grp_id` (`group_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `couriers`
--
ALTER TABLE `couriers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `courier_assigne`
--
ALTER TABLE `courier_assigne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `courier_files`
--
ALTER TABLE `courier_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `departement`
--
ALTER TABLE `departement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `group`
--
ALTER TABLE `group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `courier_assigne`
--
ALTER TABLE `courier_assigne`
  ADD CONSTRAINT `fk_courier_id` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_department` FOREIGN KEY (`department_id`) REFERENCES `departement` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_group` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `courier_files`
--
ALTER TABLE `courier_files`
  ADD CONSTRAINT `courier_files_ibfk_1` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`dep_id`) REFERENCES `departement` (`id`),
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`grp_id`) REFERENCES `group` (`id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `dep_id` FOREIGN KEY (`departement_id`) REFERENCES `departement` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `grp_id` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
