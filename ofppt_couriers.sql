-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 11 fév. 2025 à 10:21
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

-- --------------------------------------------------------

--
-- Structure de la table `couriers`
--
CREATE DATABASE `ofppt_couriers`
USE ofppt_couriers
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
  `expiditeur` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `couriers`
--

INSERT INTO `couriers` (`id`, `title`, `description`, `deadline`, `state`, `critical`, `create_by`, `created_at`, `updated_at`, `is_courier`, `expiditeur`) VALUES
(49, 'test3', '', '2025-01-22', 'normal', 'false', 1, '2025-01-21 19:24:07', '2025-01-21 19:24:07', 1, ''),
(50, 'test bettwen date', 'walo', '2025-02-01', 'normal', 'false', 1, '2025-01-30 21:35:48', '2025-01-30 21:35:48', 1, 'badr'),
(51, 'test2', 'walo', '2025-02-08', 'normal', '', 1, '2025-01-30 20:37:40', '2025-01-31 20:51:17', 1, 'badr'),
(52, 'reunion', 'hhhhhhhhhhh', '2025-02-08', 'urgent', 'false', 1, '2025-02-07 09:09:56', '2025-02-07 09:09:56', 1, 'badr'),
(53, 'courier img', 'test image', '2025-02-15', 'normal', 'false', 1, '2025-02-08 22:06:35', '2025-02-08 22:06:35', 1, 'badr'),
(54, 'testing 5', 'testing', '2025-02-11', 'urgent', '', 1, '2025-02-09 13:48:19', '2025-02-09 20:10:11', 1, 'testing'),
(55, 'testing 2', ' testing 2', '2025-02-10', 'urgent', '', 1, '2025-02-09 13:49:01', '2025-02-09 20:11:37', 1, 'testing 2'),
(56, 'test evenment', 'evenment', '2025-02-10', 'urgent', 'false', 1, '2025-02-09 20:23:59', '2025-02-09 20:23:59', 0, 'evenment'),
(57, 'Livraison pour le Client C', 'Livraison de colis de routine.', '2025-02-12', 'normal', 'false', 3, '2025-02-09 21:50:20', '2025-02-09 21:50:20', 1, 'admin3@example.com'),
(58, 'Envoi du Rapport Mensuel', 'Soumettre le rapport au service financier.', '2025-02-15', 'normal', 'false', 4, '2025-02-09 21:50:20', '2025-02-09 21:50:20', 1, 'admin4@example.com'),
(59, 'Distribution des Factures', 'Envoyer les factures aux clients régionaux.', '2025-03-01', 'normal', 'false', 5, '2025-02-09 21:50:20', '2025-02-09 21:50:20', 1, 'admin5@example.com'),
(60, 'Livraison des Fournitures', 'Livraison des fournitures de bureau commandées.', '2025-02-20', 'normal', 'false', 6, '2025-02-09 21:50:20', '2025-02-09 21:50:20', 1, 'admin6@example.com'),
(61, 'Rapport de Retour Clients', 'Transmettre les résultats des enquêtes au marketing.', '2025-03-05', 'normal', 'false', 7, '2025-02-09 21:50:20', '2025-02-09 21:50:20', 1, 'admin7@example.com'),
(62, 'Transfert de Documents Légaux', 'Transfert standard d’accords juridiques.', '2025-03-10', 'normal', 'false', 8, '2025-02-09 21:50:20', '2025-02-09 21:50:20', 1, 'admin8@example.com'),
(63, 'Mise à Jour des Politiques RH', 'Envoyer les politiques mises à jour aux divisions RH.', '2025-02-25', 'normal', 'false', 9, '2025-02-09 21:50:20', '2025-02-09 21:50:20', 1, 'admin9@example.com'),
(64, 'Rapport de Maintenance', 'Partager les journaux de maintenance avec l’équipe des opérations.', '2025-03-15', 'normal', 'false', 10, '2025-02-09 21:50:20', '2025-02-09 21:50:20', 1, 'admin10@example.com'),
(105, 'Delivery for Client C', 'Delivery of confidential documents.', '2025-02-12', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin3@example.com'),
(106, 'Package for Client D', 'Package containing business contracts.', '2025-02-13', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin4@example.com'),
(107, 'Delivery for Client E', 'Delivery of marketing materials.', '2025-02-14', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin5@example.com'),
(108, 'Package for Client F', 'Fragile package requiring urgent delivery.', '2025-02-15', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin6@example.com'),
(109, 'Delivery for Client G', 'Scheduled delivery of supplies.', '2025-02-16', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin7@example.com'),
(110, 'Package for Client H', 'Delivery of IT equipment.', '2025-02-17', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin8@example.com'),
(111, 'Delivery for Client I', 'Delivery of training materials.', '2025-02-18', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin9@example.com'),
(112, 'Package for Client J', 'Sensitive documents for review.', '2025-02-19', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin10@example.com'),
(113, 'Delivery for Client K', 'Scheduled delivery of office supplies.', '2025-02-20', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin11@example.com'),
(114, 'Package for Client L', 'Package requiring immediate delivery.', '2025-02-21', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin12@example.com'),
(115, 'Delivery for Client M', 'Urgent delivery of promotional materials.', '2025-02-22', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin13@example.com'),
(116, 'Package for Client N', 'Important document delivery.', '2025-02-23', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin14@example.com'),
(117, 'Delivery for Client O', 'Urgent shipment for production.', '2025-02-24', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin15@example.com'),
(118, 'Package for Client P', 'Important business package.', '2025-02-25', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin16@example.com'),
(119, 'Delivery for Client Q', 'Client order of medical supplies.', '2025-02-26', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin17@example.com'),
(120, 'Package for Client R', 'Package containing laboratory equipment.', '2025-02-27', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin18@example.com'),
(121, 'Delivery for Client S', 'Package for exhibition.', '2025-02-28', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin19@example.com'),
(122, 'Package for Client T', 'Business package to be delivered by next day.', '2025-03-01', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin20@example.com'),
(123, 'Delivery for Client U', 'Delivery of training materials to remote team.', '2025-03-02', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin21@example.com'),
(124, 'Package for Client V', 'Urgent delivery of legal documents.', '2025-03-03', 'normal', 'false', 1, '2025-02-09 21:59:37', '2025-02-09 21:59:37', 1, 'admin22@example.com'),
(125, 'test ilyaaaas', 'test ilyaaaas', '2025-02-10', 'urgent', 'false', 1, '2025-02-09 22:07:46', '2025-02-09 22:07:46', 1, 'test ilyaaaas');

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

--
-- Déchargement des données de la table `courier_assigne`
--

INSERT INTO `courier_assigne` (`id`, `courier_id`, `group_id`, `department_id`, `created_at`) VALUES
(76, 49, NULL, 2, '2025-01-21 19:24:07'),
(78, 50, NULL, 2, '2025-01-30 21:35:48'),
(107, 54, NULL, 23, '2025-02-09 20:10:11'),
(108, 54, NULL, 2, '2025-02-09 20:10:11'),
(109, 54, 16, NULL, '2025-02-09 20:10:11'),
(111, 55, NULL, 23, '2025-02-09 20:11:37'),
(112, 56, NULL, 23, '2025-02-09 20:23:59'),
(113, 56, 16, NULL, '2025-02-09 20:23:59'),
(122, 49, 16, 2, '2025-02-09 21:55:02'),
(123, 50, 16, 3, '2025-02-09 21:55:02'),
(124, 51, 16, 15, '2025-02-09 21:55:02'),
(125, 52, 16, 23, '2025-02-09 21:55:02'),
(126, 53, 16, 2, '2025-02-09 21:55:02'),
(127, 54, 16, 3, '2025-02-09 21:55:02'),
(128, 55, 16, 15, '2025-02-09 21:55:02'),
(129, 56, 16, 23, '2025-02-09 21:55:02'),
(130, 57, 16, 2, '2025-02-09 21:55:02'),
(131, 58, 16, 3, '2025-02-09 21:55:02'),
(132, 59, 16, 15, '2025-02-09 21:55:02'),
(133, 60, 16, 23, '2025-02-09 21:55:02'),
(134, 61, 16, 2, '2025-02-09 21:55:02'),
(135, 62, 16, 3, '2025-02-09 21:55:02'),
(136, 63, 16, 15, '2025-02-09 21:55:02'),
(137, 64, 16, 23, '2025-02-09 21:55:02'),
(158, 105, 16, 2, '2025-02-09 22:02:58'),
(159, 106, 16, 3, '2025-02-09 22:02:58'),
(160, 107, 16, 2, '2025-02-09 22:02:58'),
(161, 108, 16, 15, '2025-02-09 22:02:58'),
(162, 109, 16, 23, '2025-02-09 22:02:58'),
(163, 110, 16, 2, '2025-02-09 22:02:58'),
(164, 111, 16, 3, '2025-02-09 22:02:58'),
(165, 112, 16, 15, '2025-02-09 22:02:58'),
(166, 113, 16, 23, '2025-02-09 22:02:58'),
(167, 125, NULL, 23, '2025-02-09 22:07:46'),
(168, 125, 16, NULL, '2025-02-09 22:07:46');

-- --------------------------------------------------------

--
-- Structure de la table `courier_files`
--

CREATE TABLE `courier_files` (
  `id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `courier_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courier_files`
--

INSERT INTO `courier_files` (`id`, `path`, `courier_id`) VALUES
(26, '0_1739052395891.png', 53),
(27, '0_1739116099089.png', 54);

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
(2, 'HR', NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(3, 'Sales', NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(15, 'Audit', NULL, '2025-02-09 15:06:17', '2025-02-09 15:06:17'),
(23, 'IT', NULL, '2025-02-09 15:38:42', '2025-02-09 15:38:42');

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

--
-- Déchargement des données de la table `group`
--

INSERT INTO `group` (`id`, `name`, `departement_id`, `created_at`, `updated_at`) VALUES
(16, 'bader', 23, '2025-02-09 15:38:57', '2025-02-09 15:38:57');

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
(1, 'test', 'test', 'admin1@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'admin', NULL, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(2, 'test', 'test', 'iliasstranquille@gmail.com', '2a8af40131532bc7784204812171a39b7dd0fc583d68f6d6c929b03b2c702764', 'admin', NULL, NULL, '2024-12-17 22:44:27', '2025-02-10 21:00:48'),
(3, 'test', 'test', 'user1_it@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(4, 'test', 'test', 'user2_it@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(5, 'test', 'test', 'user1_hr@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', 2, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(6, 'test', 'test', 'user2_hr@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', 2, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(7, 'test', 'test', 'user1_sales@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', 3, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(8, 'test', 'test', 'user2_sales@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', 3, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(9, 'test', 'test', 'user1_marketing@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(10, 'test', 'test', 'user2_marketing@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(11, 'test', 'test', 'user1_finance@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(12, 'test', 'test', 'user2_finance@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2024-12-17 22:44:27', '2024-12-17 22:44:27'),
(16, 'Elkhouli', 'Mohamed', 'admin22@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2025-02-09 14:33:07', '2025-02-09 14:33:07'),
(18, 'Elkhouli', 'Mohamed', 'admin333@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2025-02-09 14:40:35', '2025-02-09 14:40:35'),
(19, 'badr', 'jamaaoui', 'badortiana990@gmail.com', '2f328561d0539cc6e0d2cf55cc9f97ec51cedb0cc0fd0127a560e96673daa1c3', 'user', 2, NULL, '2025-02-09 14:40:36', '2025-02-09 14:40:36'),
(20, 'Elkhouli', 'Mohamed', 'admin1111111@example.com', '7d1936f05205682aa1ff6d0986f20a581dd79a25b5d7cc359f0db113770c8ab7', 'user', NULL, NULL, '2025-02-09 14:43:19', '2025-02-09 14:43:19'),
(21, 'testing', 'testing', 'testingtesting@example.com', '9a7fda4cd908aa2ff3dd8aaed9ecd81b385bc1940f292f0321126af8ad6083ee', 'user', 2, NULL, '2025-02-09 14:49:28', '2025-02-09 14:49:28'),
(23, 'Elkhouli', 'Mohamed', 'mohamedelkhouli746@gmail.com', '6e1777af95e7ff49f6c95fbea580971ed4cdf1585fea1810c9c345051ef638e3', 'user', 23, 16, '2025-02-09 20:47:28', '2025-02-09 20:47:28');

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
  ADD KEY `courier_id` (`courier_id`),
  ADD KEY `fk_departement` (`department_id`),
  ADD KEY `fk_group` (`group_id`);

--
-- Index pour la table `courier_files`
--
ALTER TABLE `courier_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courier_id` (`courier_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT pour la table `courier_assigne`
--
ALTER TABLE `courier_assigne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT pour la table `courier_files`
--
ALTER TABLE `courier_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `departement`
--
ALTER TABLE `departement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `group`
--
ALTER TABLE `group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `couriers`
--
ALTER TABLE `couriers`
  ADD CONSTRAINT `couriers_ibfk_1` FOREIGN KEY (`create_by`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `courier_assigne`
--
ALTER TABLE `courier_assigne`
  ADD CONSTRAINT `courier_assigne_ibfk_1` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`id`),
  ADD CONSTRAINT `fk_departement` FOREIGN KEY (`department_id`) REFERENCES `departement` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_group` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `courier_files`
--
ALTER TABLE `courier_files`
  ADD CONSTRAINT `courier_files_ibfk_1` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`id`);

--
-- Contraintes pour la table `departement`
--
ALTER TABLE `departement`
  ADD CONSTRAINT `departement_ibfk_1` FOREIGN KEY (`parent_department_id`) REFERENCES `departement` (`id`);

--
-- Contraintes pour la table `group`
--
ALTER TABLE `group`
  ADD CONSTRAINT `fk_department_id` FOREIGN KEY (`departement_id`) REFERENCES `departement` (`id`) ON DELETE CASCADE;

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
