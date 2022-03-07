-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2022 at 02:58 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vehicle_rent`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Car', '2022-02-02 14:14:26', NULL),
(2, 'Bike', '2022-02-02 14:14:32', NULL),
(3, 'Motorbike', '2022-02-02 14:14:54', '2022-02-25 16:17:52'),
(4, 'Truck', '2022-02-02 14:15:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `histories`
--

CREATE TABLE `histories` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_vehicle` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `has_returned` tinyint(1) NOT NULL DEFAULT 0,
  `prepayment` float DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `histories`
--

INSERT INTO `histories` (`id`, `id_user`, `id_vehicle`, `quantity`, `date_start`, `date_end`, `has_returned`, `prepayment`, `created_at`, `updated_at`) VALUES
(1, 2, 6, 0, '2022-02-13', '2022-03-13', 0, 24000, '2022-01-28 16:35:27', '2022-02-04 17:49:45'),
(2, 1, 3, 0, '2021-12-01', '2022-01-23', 0, NULL, '2022-01-28 17:00:14', '2022-02-03 12:01:15'),
(3, 2, 6, 0, '2021-02-13', '2022-03-13', 0, NULL, '2022-01-28 17:00:26', '2022-02-03 12:08:03'),
(19, 1, 5, 0, '2022-01-23', '2022-01-23', 0, 180000, '2022-02-02 17:50:04', NULL),
(20, 5, 6, 0, '2022-02-01', '2022-02-02', 0, NULL, '2022-02-03 12:07:29', '2022-02-03 05:07:11'),
(21, 1, 3, 0, '2022-01-23', '2022-01-23', 0, NULL, '2022-02-04 16:14:57', NULL),
(22, 2, 3, 0, '2022-01-23', '2022-01-23', 0, NULL, '2022-02-04 16:15:03', NULL),
(23, 5, 3, 0, '2022-01-23', '2022-01-23', 0, NULL, '2022-02-04 16:37:28', NULL),
(24, 5, 5, 0, '2022-01-23', '2022-01-23', 0, NULL, '2022-02-04 16:37:34', NULL),
(25, 5, 2, 0, '2022-01-23', '2022-01-23', 0, NULL, '2022-02-04 16:37:41', NULL),
(26, 2, 6, 0, '2021-02-13', '2022-03-13', 0, 24000, '2022-02-04 16:56:15', '2022-02-06 20:26:23'),
(27, 2, 6, 0, '2020-01-13', '2022-01-13', 0, 24000, '2022-02-04 16:56:27', '2022-02-07 15:10:06'),
(28, 5, 22, 0, '2022-01-23', '2022-01-23', 0, 0, '2022-02-04 16:59:14', NULL),
(29, 5, 22, 0, '2022-01-23', '2022-01-23', 0, 0, '2022-02-04 16:59:30', NULL),
(30, 5, 22, 0, '2022-01-23', '2022-01-23', 0, 40000, '2022-02-04 17:03:14', NULL),
(31, 2, 42, 0, '2022-01-23', '2022-01-23', 0, 150000, '2022-02-04 17:09:44', NULL),
(32, 5, 42, 0, '2022-01-23', '2022-01-23', 0, 150000, '2022-02-04 17:12:09', NULL),
(33, 6, 42, 0, '2022-01-23', '2022-01-23', 0, 150000, '2022-02-04 17:12:13', NULL),
(34, 8, 41, 0, '2022-01-23', '2022-01-23', 0, 150000, '2022-02-07 10:10:29', NULL),
(35, 7, 41, 0, '2022-01-23', '2022-01-23', 0, 150000, '2022-02-07 10:10:40', NULL),
(36, 7, 42, 0, '2022-02-23', '2022-02-23', 0, 150000, '2022-02-07 10:11:32', NULL),
(37, 4, 11, 0, '2022-01-23', '2022-01-25', 0, 150000, '2022-02-07 10:11:59', NULL),
(38, 6, 11, 0, '2022-01-23', '2022-01-25', 0, 150000, '2022-02-07 10:12:03', NULL),
(39, 6, 33, 0, '2022-01-23', '2022-01-25', 0, 150000, '2022-02-07 10:12:12', NULL),
(40, 5, 33, 0, '2022-01-23', '2022-01-25', 0, 150000, '2022-02-07 10:12:19', NULL),
(41, 9, 42, 0, '2022-01-23', '2022-01-25', 0, 150000, '2022-02-07 10:13:46', NULL),
(42, 9, 32, 0, '2022-01-23', '2022-01-25', 0, 150000, '2022-02-07 10:14:26', NULL),
(43, 9, 22, 0, '2022-01-23', '2022-01-25', 0, 150000, '2022-02-07 10:14:28', NULL),
(44, 7, 22, 0, '2022-01-23', '2022-01-25', 0, 150000, '2022-02-07 10:14:31', NULL),
(45, 7, 7, 0, '2022-01-23', '2022-01-25', 0, 150000, '2022-02-07 10:14:59', NULL),
(46, 7, 7, 0, '2022-01-23', '2022-01-25', 0, 0, '2022-02-07 10:15:07', NULL),
(59, 7, 7, 0, '2022-01-23', '2022-01-25', 0, NULL, '2022-02-07 10:26:19', NULL),
(60, 7, 7, 0, '2022-01-23', '2022-01-25', 0, 0, '2022-02-07 10:26:24', NULL),
(61, 7, 29, 0, '2022-01-23', '2022-01-25', 0, 40000, '2022-02-07 10:32:38', NULL),
(62, 8, 29, 0, '2022-01-23', '2022-01-25', 0, 40000, '2022-02-07 10:32:42', NULL),
(63, 8, 29, 0, '2022-01-24', '2022-01-25', 0, 40000, '2022-02-07 15:12:27', NULL),
(64, 8, 6, 0, '2022-01-24', '2022-01-25', 0, 120000, '2022-02-07 15:13:18', NULL),
(65, 1, 45, 0, '2022-01-23', '2022-01-23', 0, 40000, '2022-02-12 19:46:51', NULL),
(67, 1, 45, 0, '2022-01-23', '2022-01-23', 0, 40000, '2022-02-14 11:14:40', NULL),
(68, 19, 45, 0, '2022-02-23', '2022-02-23', 0, 40000, '2022-02-24 10:05:13', NULL),
(69, 20, 45, 0, '2022-02-23', '2022-02-23', 0, 40000, '2022-02-24 10:05:21', NULL),
(70, 20, 60, 0, '2022-02-23', '2022-02-23', 0, 40000, '2022-02-24 10:05:48', NULL),
(71, 21, 60, 0, '2022-02-23', '2022-02-23', 0, 40000, '2022-02-24 10:05:55', NULL),
(72, 22, 44, 0, '2022-02-23', '2022-02-23', 0, 40000, '2022-02-24 10:06:11', NULL),
(73, 23, 44, 0, '2022-02-23', '2022-02-23', 0, 40000, '2022-02-24 10:06:18', NULL),
(74, 26, 41, 0, '2022-02-23', '2022-02-23', 0, 50000, '2022-02-24 10:06:28', NULL),
(75, 26, 41, 2, '2022-02-23', '2022-02-23', 0, 50000, '2022-03-05 17:33:49', NULL),
(76, 26, 60, 2, '2022-02-23', '2022-02-23', 0, NULL, '2022-03-05 15:52:06', '2022-03-06 19:30:30'),
(77, 12, 60, 2, '0000-00-00', '0000-00-00', 0, 0, '2022-03-06 16:19:55', NULL),
(78, 12, 60, 2, '2022-02-07', '2022-02-08', 0, 0, '2022-03-06 16:24:41', NULL),
(79, 12, 53, 1, '2022-02-08', '2022-02-08', 0, 0, '2022-03-06 19:10:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_otp_type` int(11) DEFAULT NULL,
  `code` varchar(6) NOT NULL,
  `is_expired` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `otp`
--

INSERT INTO `otp` (`id`, `id_user`, `id_otp_type`, `code`, `is_expired`, `created_at`, `updated_at`) VALUES
(5, 17, NULL, '384682', 0, '2022-02-11 16:32:58', '2022-02-15 09:43:43'),
(6, 17, NULL, '867416', 0, '2022-02-11 16:58:56', '2022-02-15 09:43:52'),
(7, 17, NULL, '783404', 1, '2022-02-11 17:19:28', '2022-02-15 09:43:59'),
(12, 17, NULL, '573307', 0, '2022-02-11 17:35:28', '2022-02-15 09:43:57'),
(13, 17, NULL, '138648', 1, '2022-02-14 11:00:32', '2022-02-15 09:43:55'),
(14, 25, NULL, '834816', 1, '2022-02-14 11:07:34', '2022-02-15 09:43:54'),
(15, 26, 2, '880812', 1, '2022-02-15 09:58:56', '2022-02-15 09:59:36'),
(16, 26, 1, '636871', 0, '2022-02-16 15:17:23', NULL),
(17, 27, 1, '577486', 0, '2022-03-06 21:40:40', NULL),
(18, 28, 1, '208876', 0, '2022-03-06 22:05:48', NULL),
(19, 29, 1, '474011', 0, '2022-03-06 22:10:52', NULL),
(20, 30, 1, '150805', 0, '2022-03-06 22:14:04', NULL),
(21, 31, 1, '314662', 0, '2022-03-06 22:28:28', NULL),
(22, 32, 1, '045516', 0, '2022-03-06 22:31:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `otp_type`
--

CREATE TABLE `otp_type` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `otp_type`
--

INSERT INTO `otp_type` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'verify user', '2022-02-15 09:38:46', '2022-02-15 02:38:12'),
(2, 'forgot password request', '2022-02-15 09:38:46', '2022-02-15 02:38:12');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'super admin', '2022-02-10 15:01:59', '2022-02-10 08:01:41'),
(2, 'admin', '2022-02-10 15:01:59', '2022-02-10 08:01:41'),
(3, 'users', '2022-02-10 15:02:12', '2022-02-10 17:33:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(120) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(16) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `username` varchar(32) NOT NULL,
  `gender` varchar(6) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `picture` varchar(100) DEFAULT NULL,
  `is_verified` tinyint(4) NOT NULL DEFAULT 0,
  `id_role` int(11) DEFAULT 3,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone_number`, `address`, `username`, `gender`, `birth_date`, `picture`, `is_verified`, `id_role`, `created_at`, `updated_at`) VALUES
(1, 'bobsnge@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$hPzwAVyVYaZE+6O9mInLTQ$VoD/zseeiYG/2JOOdTP0d0iLif25ibDNo/wIHhWrRYI', 'Bob Sponge', '0879654123', 'st. test 123', 'bobs', 'male', '2022-01-11', 'uploads\\user\\user-1644655157385-188090447.jpg', 0, 3, '2022-01-28 15:35:08', '2022-02-12 16:39:17'),
(2, 'starp@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$a5yvMgvUvZYYZsKrQsOtcw$6GY0ZTRBneK+govNfFpklz6OQlHA75i+QBW+qRF1QUQ', 'Star Pat', '0897563218', 'jalan cobaan gg lagi 21', 'starp', 'male', '1998-03-16', 'uploads\\user\\user-1644655402260-214023583.jpg', 0, 3, '2022-01-28 15:43:57', '2022-02-12 16:43:22'),
(4, 'lagi@coba.com', '123coba', 'lagi coba', '08976321321', 'jalan cobaan gg lagi 21', 'cblg', 'female', '1998-03-16', NULL, 0, NULL, '2022-01-31 21:59:27', '2022-01-31 22:08:38'),
(5, 'lagi@lagi.com', 'asdasd', 'lagi coba', '015648621', 'jalan cobaan gg lagi 21', 'cblg', 'male', '1997-08-16', NULL, 0, NULL, '2022-01-31 22:03:37', NULL),
(6, 'johndoe@mail.com', 'john', 'john doe', '0123654789', 'jalan doe john', 'jhndoe', 'male', '1980-01-01', NULL, 0, NULL, '2022-02-03 17:28:20', NULL),
(7, 'janedoe@mail.com', 'jane', 'janedoe', '08987456321', 'jalan doe jane', 'jnedoe', 'female', '1980-01-01', NULL, 0, NULL, '2022-02-03 17:29:18', NULL),
(8, 'maryjane@mail.com', 'maryj', 'mary jane', '08778778999', 'jalan em je', 'mjane', 'female', '1980-01-01', NULL, 0, NULL, '2022-02-07 10:08:45', NULL),
(9, 'guest@mail.com', 'g123', 'guest', '08123456789', 'guest st', 'guest', 'male', '1980-01-01', NULL, 0, NULL, '2022-02-07 10:09:32', NULL),
(11, 'kelvin@mail.com', 'Kelvin123', 'Kelvin', '08798456123', 'admin st', 'kelw', 'male', '1980-01-01', NULL, 0, NULL, '2022-02-07 11:13:38', NULL),
(12, 'admin1@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$x2j7mljt2wmt5d3qfPA7Bg$K6XHoG7sGVBVyS7DMGgZxRfyAHPtKS3DJ51GW6EiOcA', 'admin', '08987456321', 'admin st', 'admin1', 'female', '1980-01-01', 'uploads\\user\\user-1644659234032-922611905.png', 0, 2, '2022-02-10 15:27:43', '2022-02-12 18:23:43'),
(13, 'admin2@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$43GmTE/RTOM16i3uUfikAA$GBMTeCEi1QYoqY6xDkbHHH4c8QRDxauSnCZj/ZWzNMk', 'admin', '08987456321', 'admin st', 'admin2', 'male', '1980-01-01', NULL, 0, 2, '2022-02-10 15:28:13', '2022-02-10 17:13:21'),
(14, 'admin3@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$4Ho3MIjuU+nb8QfKMkrgEw$y6AKvFqL2sW/Fora806hNPYhcJiF0i9jMexIY16DClQ', 'admin', '08987456321', 'admin st', 'admin3', 'male', '1980-01-01', NULL, 0, 2, '2022-02-10 15:30:50', '2022-02-10 17:13:22'),
(15, 'user@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$jFkEviRoMHP65rl2dkrswQ$ehId1vcpmEZXSVc4fQR4Ui63NqFxuer55hJtlbUyAUw', 'user', '08789654123', 'user st', 'user', 'male', '1980-01-01', NULL, 0, 3, '2022-02-10 17:26:31', NULL),
(17, 'lucky7kelvin@yahoo.com', '$argon2i$v=19$m=4096,t=3,p=1$SNQgMrFydHU0TAG5h/vWZQ$hG6q+u/O8wGDJLug0TmCf+2QfJCBpMZGSoUhufeoq9g', '', NULL, NULL, 'kwong', NULL, NULL, NULL, 0, 3, '2022-02-11 13:07:28', '2022-02-14 11:03:03'),
(18, 'dummy@user.com', '$argon2i$v=19$m=4096,t=3,p=1$FF/Xzctkk1xRDsyYDeg6yw$5j3HBMKX7FyULWKWz7FnEaB1vsNBT+odR7KT2uAx3h8', 'dummy user', NULL, NULL, 'dummy', NULL, NULL, NULL, 0, 3, '2022-02-11 17:21:17', NULL),
(19, 'smano@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$Zq50jw54o4R2nvuLNTgtdA$bPy6hnVU+y7EE0Ok+KzmKeQktkSDMCy4R/tEN4ZbPWI', 'Mano Stra', NULL, NULL, 'smano', NULL, NULL, NULL, 0, 3, '2022-02-12 16:56:44', NULL),
(20, 'payam@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$eNQootTRql3TETW4V2njLQ$xmHOpUPd1rQaFN2EOSsRENWsIdM729k+TiOSTNsyS1g', 'Paha Ayam', NULL, NULL, 'payam', NULL, NULL, NULL, 0, 3, '2022-02-12 16:59:24', NULL),
(21, 'mcdonel@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$DzLd6fJEUKn2GmwZl9I/zw$8dAfTS0UU4cgcoGTsscG0jh12cZELcLE8bWu26vCOw8', 'Sir Mcdonel', NULL, NULL, 'mcdonel', NULL, NULL, 'uploads\\user\\user-1644656464023-722328252.png', 0, 3, '2022-02-12 17:01:04', NULL),
(22, 'kentucky@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$hZUpjwh7nyXec0vPeRxGxQ$gqa7k+aslGAKK5hqdlAwLUBNSHmhqZeakOcEHJPRyJY', 'Sir Kentucky', NULL, NULL, 'kentucky', 'male', NULL, 'uploads\\user\\user-1644656509324-370169768.png', 0, 3, '2022-02-12 17:01:49', NULL),
(23, 'brucel@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$5a8BpaN/rjjxLlch7oz0Sw$v4BH88V5LCYS5Gh8j2e0WFvjT3MdXxZjxuh5YePDKtg', 'Bruce Lee', NULL, NULL, 'bruce', NULL, NULL, NULL, 0, NULL, '2022-02-13 17:48:19', NULL),
(24, 'mail@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$0DNezPBlXh5ah79n+Q5oEQ$bhg3kZbrDGKHwjtU4Li0UoNqsMdHXmPFC9J+wAtOYCk', 'Mai Lee', NULL, NULL, 'mail', NULL, NULL, NULL, 0, NULL, '2022-02-14 10:25:28', NULL),
(25, 'bakik54318@plexfirm.com', '$argon2i$v=19$m=4096,t=3,p=1$DIH4OzcRYB96S8bOmlg2bA$cLRJstCrlrnxu9DwmYbvlJSK7Nakw5mNMf8nZ5kxLCc', 'Bakik', NULL, NULL, 'bakik', NULL, NULL, NULL, 0, NULL, '2022-02-14 11:06:27', '2022-02-14 11:08:14'),
(26, 'kifavej631@goonby.com', '$argon2i$v=19$m=4096,t=3,p=1$MuJZKOq0Yvh/jnRfdEy6dw$2g2jd4+wrTcBa0i6Cbdy/Fl+eLszoYGFPSCJvfQTBBk', 'Kifa Vej', NULL, NULL, 'kifav', NULL, NULL, NULL, 1, 3, '2022-02-15 09:57:44', '2022-02-16 15:18:40'),
(27, 'feboj27637@nitynote.com', '$argon2i$v=19$m=4096,t=3,p=1$JurLgG3+lLqXyAUZ9aDlPQ$jCSGL6JMdhU2O2Cn6pkG8ZWaSE0bua/dPn/AynT+61c', 'feboj nity', NULL, NULL, 'feboj', NULL, NULL, NULL, 1, 3, '2022-03-06 20:24:55', '2022-03-06 21:49:38'),
(28, 'pelit78570@toudrum.com', '$argon2i$v=19$m=4096,t=3,p=1$fswHI8P4TBtmzdgcahNRZQ$JpcWv/rSwYx62obU/4v5gvTXaVEp459FjcDcR2GgCQc', 'pelit toud', NULL, NULL, 'pelit', NULL, NULL, NULL, 1, 3, '2022-03-06 21:59:59', '2022-03-06 22:09:17'),
(29, 'decociy558@vapaka.com', '$argon2i$v=19$m=4096,t=3,p=1$tsY2yqmFAG2ixrdmp1QxKQ$4zzfrgLaplLh+4Uhq6OFykFqHt3CGXoHDTRg+3R8AHU', 'deco ciy', NULL, NULL, 'decoc', NULL, NULL, NULL, 1, 3, '2022-03-06 22:10:41', '2022-03-06 22:11:43'),
(30, 'xahegej626@vapaka.com', '$argon2i$v=19$m=4096,t=3,p=1$1rK2rHwLYAp5qQ7rtVELxQ$tfS2MqnVcaiBbv+2r7AzBQ2fdVLQmxltZpZrvpUFZbI', 'xahe gej', NULL, NULL, 'xaheg', NULL, NULL, NULL, 1, 3, '2022-03-06 22:13:56', '2022-03-06 22:23:33'),
(31, 'rices13296@toudrum.com', '$argon2i$v=19$m=4096,t=3,p=1$6z0vpb7LkFDwasUvplQQvw$f0V1Z3tpkAb1szL++OYiFNjKcRkjkIhofxb1HJr5ji4', 'rices toud', NULL, NULL, 'rices', NULL, NULL, NULL, 1, 3, '2022-03-06 22:28:16', '2022-03-06 22:30:11'),
(32, 'fosiy18789@nitynote.com', '$argon2i$v=19$m=4096,t=3,p=1$jT/eU85bFqin1PjrSbRmnA$MkAvx+M9YXDEfxaBdebH0WuP9Qkb7bW2Ee1UmX4z4GM', 'fosiy nity', NULL, NULL, 'fosiy', NULL, NULL, NULL, 1, 3, '2022-03-06 22:31:06', '2022-03-06 22:31:44');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `id_category` int(11) DEFAULT NULL,
  `color` varchar(30) NOT NULL,
  `location` varchar(100) NOT NULL,
  `stock` int(11) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `capacity` int(11) NOT NULL,
  `image` text DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 0,
  `has_prepayment` tinyint(1) NOT NULL DEFAULT 0,
  `reservation_deadline` varchar(5) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `name`, `id_category`, `color`, `location`, `stock`, `price`, `capacity`, `image`, `is_available`, `has_prepayment`, `reservation_deadline`, `created_at`, `updated_at`) VALUES
(2, 'Cube Town Sport Hybrid', 2, 'Iridium', 'Jakarta', 3, '300000.00', 0, NULL, 1, 0, '14:00', '2022-01-26 16:28:09', '2022-02-03 12:57:37'),
(3, 'Cube Town Sport Hybrid', 2, 'Grey', 'Jakarta', 2, '300000.00', 0, NULL, 0, 0, '14:00', '2022-01-26 16:28:09', '2022-02-04 15:56:58'),
(4, 'Pedal Coyote Electric Mountain Bike', 2, 'Black', 'Bandung', 3, '199999.98', 0, NULL, 1, 0, NULL, '2022-01-26 16:28:09', '2022-02-03 12:57:43'),
(5, 'Pedal Coyote Electric Mountain Bike', 2, 'Yellow', 'Bandung', 3, '199999.98', 0, NULL, 1, 0, NULL, '2022-01-26 16:28:09', '2022-02-03 12:57:45'),
(6, 'BeAT CBS', 3, 'Black', 'Bogor', 2, '120000.99', 2, 'uploads\\vehicle\\vehicle-1645671743469-200158323.jpg', 1, 1, '10:00', '2022-01-26 16:28:09', '2022-02-24 12:55:05'),
(7, 'Honda Brio', 3, 'Yellow', 'Jakarta', 2, '259999.98', 0, NULL, 1, 0, '10:00', '2022-01-26 16:28:09', '2022-02-03 12:57:53'),
(10, 'Honda Brio', 3, 'Orange', 'Jakarta', 2, '259999.98', 0, NULL, 1, 0, '10:00', '2022-01-26 16:28:09', '2022-02-03 12:57:55'),
(11, 'Honda BRV', 1, 'Silver', 'Jakarta', 2, '259999.98', 0, 'uploads\\vehicle\\vehicle-1645672007395-921460940.jpg', 1, 0, '10:00', '2022-01-26 16:33:06', '2022-02-24 11:07:25'),
(12, 'Honda BRV', 1, 'Black', 'Jakarta', 2, '259999.98', 0, NULL, 1, 0, '10:00', '2022-01-26 16:36:38', '2022-02-03 12:58:01'),
(13, 'E-Green Sport 500', 2, 'Grey', 'Jakarta', 2, '199999.98', 0, NULL, 1, 0, '10:00', '2022-01-26 16:37:08', '2022-02-03 12:58:03'),
(21, 'E-Green Sport 500', 2, 'Dark Satin', 'Jakarta', 2, '199999.98', 0, NULL, 1, 0, '10:00', '2022-01-28 16:52:15', '2022-02-03 12:58:04'),
(22, 'E-Green Sport 500', 2, 'Black', 'Bandung', 5, '199999.99', 1, 'uploads\\vehicle\\vehicle-1646099906728-186925485.jpg', 1, 1, NULL, '2022-01-28 16:52:55', '2022-03-01 09:58:26'),
(23, 'E-Green Sport 500', 2, 'Grey', 'Bandung', 2, '199999.99', 0, NULL, 1, 0, '10:00', '2022-01-28 16:53:03', '2022-02-03 12:58:07'),
(28, 'Toyota GR Supra', 1, 'Black', 'Jakarta', 1, '200000.00', 2, 'uploads\\vehicle\\vehicle-1645672139381-542709130.png', 0, 1, '10:00', '2022-01-31 15:11:24', '2022-02-24 11:08:59'),
(29, 'Kuda', 1, 'Silver', 'Jakarta', 1, '200000.00', 1, 'uploads\\vehicle\\vehicle-1644808925237-141247827.jpg', 1, 1, '10:00', '2022-01-31 18:04:42', '2022-02-14 11:22:05'),
(30, 'Corolla Cross', 1, 'Black', 'Jakarta', 1, '200000.00', 2, NULL, 0, 1, '10:00', '2022-01-31 18:05:36', '2022-02-07 10:03:28'),
(31, 'Corolla Cross', 1, 'Red', 'Jakarta', 1, '200000.00', 2, NULL, 1, 1, '10:00', '2022-01-31 18:08:32', '2022-02-07 10:04:03'),
(32, 'Fortuner GR Sport', 1, 'Black', 'Jakarta', 2, '250000.00', 4, NULL, 1, 1, '10:00', '2022-01-31 21:33:22', '2022-02-07 10:05:52'),
(33, 'Fortuner GR Sport', 1, 'Silver', 'Jakarta', 2, '250000.00', 4, NULL, 1, 1, '10:00', '2022-02-02 16:12:43', '2022-02-07 10:06:18'),
(34, 'Fortuner GR Sport', 1, 'Red', 'Jakarta', 2, '250000.00', 4, NULL, 1, 1, '10:00', '2022-02-02 16:14:32', '2022-02-07 10:06:39'),
(35, 'Rush GR Sport', 1, 'Red', 'Jakarta', 2, '250000.00', 4, NULL, 1, 1, '10:00', '2022-02-02 16:26:44', '2022-02-07 10:06:58'),
(36, 'Rush GR Sport', 1, 'Black', 'Jakarta', 2, '250000.00', 4, NULL, 1, 1, '10:00', '2022-02-02 16:29:39', '2022-02-07 10:07:11'),
(41, 'Rush GR Sport', 1, 'Silver', 'Jakarta', 2, '250000.00', 4, NULL, 1, 1, '23:59', '2022-02-02 17:10:06', '2022-02-07 15:11:58'),
(42, 'Toyota GR Supra', 1, 'Silver', 'Jakarta', 2, '299999.99', 4, NULL, 1, 1, NULL, '2022-02-04 17:08:11', NULL),
(43, 'Toyota GR Supra', 1, 'Red', 'Jakarta', 1, '200000.00', 2, NULL, 0, 1, '10:00', '2022-02-04 18:12:18', '2022-02-04 18:15:56'),
(44, 'KTM Scarp Master', 2, 'Orange', 'Jakarta', 1, '199999.99', 1, 'uploads\\vehicle\\vehicle-1645671755666-269268506.jpg', 1, 1, NULL, '2022-02-07 10:29:42', '2022-02-24 11:08:10'),
(45, 'KTM Scarp Master', 2, 'Black', 'Jakarta', 1, '199999.99', 1, 'uploads\\vehicle\\vehicle-1646101841197-307968651.jpg', 1, 1, NULL, '2022-02-07 10:29:59', '2022-03-01 10:30:41'),
(46, 'KTM Scarp Master', 2, 'Red', 'Jakarta', 1, '199999.99', 1, NULL, 1, 1, NULL, '2022-02-07 10:30:04', NULL),
(47, 'Ribble HT 725 Pro', 2, 'Red', 'Jakarta', 1, '199999.99', 1, NULL, 1, 1, NULL, '2022-02-07 10:30:24', NULL),
(48, 'Ribble HT 725 Pro', 2, 'Black', 'Jakarta', 1, '199999.99', 1, NULL, 1, 1, NULL, '2022-02-07 10:30:28', NULL),
(49, 'Ribble HT 725 Pro', 2, 'Blue', 'Jakarta', 1, '199999.99', 1, NULL, 1, 1, NULL, '2022-02-07 10:30:35', NULL),
(50, 'Kijang', 1, 'White', 'Jakarta', 4, '120000.00', 6, NULL, 1, 0, NULL, '2022-02-08 20:34:33', NULL),
(51, 'Kijang', 1, 'Black', 'Jakarta', 4, '120000.00', 6, NULL, 1, 0, NULL, '2022-02-08 21:35:49', NULL),
(53, 'Kijang', 1, 'yellow', 'Jakarta', 4, '120000.00', 6, 'uploads\\vehicle\\vehicle-1646099779332-301150056.jpg', 1, 0, NULL, '2022-02-08 21:50:46', '2022-03-01 09:56:19'),
(54, 'Kijang', 1, 'red', 'Jakarta', 4, '120000.00', 6, 'uploads\\vehicle\\vehicle-1646099832417-984884268.jpg', 1, 0, NULL, '2022-02-08 21:51:32', '2022-03-01 09:57:12'),
(55, 'Kuda', 1, 'Grey', 'Jakarta', 5, '120000.00', 6, 'uploads\\vehicle\\vehicle-1646099986211-858746890.jpg', 1, 0, NULL, '2022-02-08 21:53:00', '2022-03-01 09:59:46'),
(56, 'Kuda', 1, 'Black', 'Jakarta', 4, '120000.00', 6, 'uploads\\vehicle\\vehicle-1646099529457-775413328.jpg', 1, 0, NULL, '2022-02-09 17:02:21', '2022-03-01 09:52:09'),
(57, 'Kuda', 1, 'Red', 'Jakarta', 4, '120000.00', 6, 'uploads\\vehicle\\vehicle-1646099603104-204348942.jpg', 1, 0, NULL, '2022-02-09 17:04:11', '2022-03-01 09:53:23'),
(58, 'Kuda', 1, 'Orange', 'Jakarta', 4, '120000.00', 6, 'uploads\\vehicle\\vehicle-1646099642210-742061652.jpg', 1, 0, NULL, '2022-02-09 17:17:28', '2022-03-01 09:54:02'),
(60, 'Kuda', 2, 'Orange', 'Jakarta', 4, '120000.00', 6, 'uploads\\vehicle\\vehicle-1644409698155-658859381.PNG', 1, 0, NULL, '2022-02-09 20:28:18', NULL),
(61, 'BMX Max', 2, 'Black', 'Jakarta', 3, '69999.99', 1, NULL, 0, 0, NULL, '2022-02-12 11:45:48', '2022-02-12 11:51:08'),
(62, 'BMX Max', 2, 'Red', 'Jakarta', 3, '69999.99', 1, 'uploads\\vehicle\\vehicle-1644637653464-870587260.jpg', 0, 0, NULL, '2022-02-12 11:47:33', NULL),
(63, 'BMX Max', 2, 'White', 'Jakarta', 3, '69999.99', 1, 'uploads\\vehicle\\vehicle-1644638736648-486826510.jpg', 0, 0, NULL, '2022-02-12 12:05:36', '2022-02-12 12:38:02'),
(65, 'BMX Max 2', 2, 'White', 'Jakarta', 32, '69999.99', 1, NULL, 0, 0, NULL, '2022-02-14 10:59:39', NULL),
(66, 'BMX Max3', 2, 'White', 'Jakarta', 32, '69999.99', 1, NULL, 0, 0, NULL, '2022-02-14 11:07:07', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `histories`
--
ALTER TABLE `histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_vehicle` (`id_vehicle`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_otp_type` (`id_otp_type`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `otp_type`
--
ALTER TABLE `otp_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_role` (`id_role`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`id_category`),
  ADD KEY `category_id_2` (`id_category`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `histories`
--
ALTER TABLE `histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `otp_type`
--
ALTER TABLE `otp_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `histories`
--
ALTER TABLE `histories`
  ADD CONSTRAINT `histories_ibfk_1` FOREIGN KEY (`id_vehicle`) REFERENCES `vehicles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `histories_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `otp`
--
ALTER TABLE `otp`
  ADD CONSTRAINT `otp_ibfk_1` FOREIGN KEY (`id_otp_type`) REFERENCES `otp_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `otp_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
