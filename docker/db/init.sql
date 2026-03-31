-- ============================================================
-- SEED DATA - Projet Pretetgo
-- Base : MySQL / MariaDB
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ============================================================
-- TABLE : user
-- Contient : 1 admin, 8 étudiants, 6 professeurs (total 15)
-- ============================================================
TRUNCATE TABLE `user`;

INSERT INTO `user` (`user_type`, `id`, `created_at`, `email`, `enabled`, `first_name`, `last_name`, `password`) VALUES
-- Admin
('ADMIN',    1,  '2025-09-01 08:00:00.000000', 'admin@agora.fr',              b'1', 'Alice',   'Martin',    '$2a$10$hashed_password_admin'),
-- Étudiants
('STUDENT',  2,  '2025-09-02 09:15:00.000000', 'lucas.bernard@etud.agora.fr', b'1', 'Lucas',   'Bernard',   '$2a$10$hashed_password_student1'),
('STUDENT',  3,  '2025-09-02 09:20:00.000000', 'emma.dupont@etud.agora.fr',   b'1', 'Emma',    'Dupont',    '$2a$10$hashed_password_student2'),
('STUDENT',  4,  '2025-09-03 10:00:00.000000', 'noah.lefevre@etud.agora.fr',  b'1', 'Noah',    'Lefèvre',   '$2a$10$hashed_password_student3'),
('STUDENT',  5,  '2025-09-03 10:05:00.000000', 'chloe.moreau@etud.agora.fr',  b'1', 'Chloé',   'Moreau',    '$2a$10$hashed_password_student4'),
('STUDENT',  6,  '2025-09-04 11:00:00.000000', 'hugo.simon@etud.agora.fr',    b'1', 'Hugo',    'Simon',     '$2a$10$hashed_password_student5'),
('STUDENT',  7,  '2025-09-04 11:30:00.000000', 'lea.michel@etud.agora.fr',    b'1', 'Léa',     'Michel',    '$2a$10$hashed_password_student6'),
('STUDENT',  8,  '2025-09-05 14:00:00.000000', 'theo.garcia@etud.agora.fr',   b'1', 'Théo',    'Garcia',    '$2a$10$hashed_password_student7'),
('STUDENT',  9,  '2025-09-05 14:10:00.000000', 'camille.roux@etud.agora.fr',  b'0', 'Camille', 'Roux',      '$2a$10$hashed_password_student8'),
-- Professeurs
('PROFESSOR',10, '2025-09-01 08:30:00.000000', 'fares.zaidi@agora.fr',        b'1', 'Fares',   'Zaidi',     '$2a$10$hashed_password_prof1'),
('PROFESSOR',11, '2025-09-01 08:35:00.000000', 'reda.laroussi@agora.fr',      b'1', 'Reda',    'Laroussi',  '$2a$10$hashed_password_prof2'),
('PROFESSOR',12, '2025-09-01 08:40:00.000000', 'thierry.caron@agora.fr',      b'1', 'Thierry', 'Caron',     '$2a$10$hashed_password_prof3'),
('PROFESSOR',13, '2025-09-01 09:00:00.000000', 'marie.nguyen@agora.fr',       b'1', 'Marie',   'Nguyen',    '$2a$10$hashed_password_prof4'),
('PROFESSOR',14, '2025-09-01 09:05:00.000000', 'julien.blanc@agora.fr',       b'1', 'Julien',  'Blanc',     '$2a$10$hashed_password_prof5'),
('PROFESSOR',15, '2025-09-01 09:10:00.000000', 'sophie.lambert@agora.fr',     b'0', 'Sophie',  'Lambert',   '$2a$10$hashed_password_prof6');

-- ============================================================
-- TABLE : admin
-- ============================================================
TRUNCATE TABLE `admin`;

INSERT INTO `admin` (`id`) VALUES (1);

-- ============================================================
-- TABLE : student
-- ============================================================
TRUNCATE TABLE `student`;

INSERT INTO `student` (`student_number`, `id`) VALUES
(230001, 2),
(230002, 3),
(230003, 4),
(230004, 5),
(230005, 6),
(230006, 7),
(230007, 8),
(230008, 9);

-- ============================================================
-- TABLE : professor
-- ============================================================
TRUNCATE TABLE `professor`;

INSERT INTO `professor` (`id`) VALUES (10),(11),(12),(13),(14),(15);

-- ============================================================
-- TABLE : subject
-- ============================================================
TRUNCATE TABLE `subject`;

INSERT INTO `subject` (`id`, `name`, `description`) VALUES
(1,  'Réalité Virtuelle',         'Conception et développement d''expériences immersives en VR/AR'),
(2,  'Développement Front-End',   'Frameworks modernes : React, Vue, Angular et bonnes pratiques UI'),
(3,  'Audiovisuel',               'Production vidéo, montage, prise de son et post-production'),
(4,  'Dispositif Interactif',     'Design d''installations interactives et capteurs physiques'),
(5,  'Modélisation 3D',           'Blender, Maya, textures PBR et pipelines de rendu'),
(6,  'Programmation Créative',    'Processing, p5.js, génération algorithmique'),
(7,  'Design UX/UI',              'Méthodes centrées utilisateur, wireframes, prototypage'),
(8,  'Son & Musique',             'Production musicale, sound design, spatialisation audio');

-- ============================================================
-- TABLE : professor_subject  (many-to-many)
-- ============================================================
TRUNCATE TABLE `professor_subject`;

INSERT INTO `professor_subject` (`professor_id`, `subject_id`) VALUES
(10, 1),(10, 5),
(11, 2),(11, 6),
(12, 3),(12, 8),
(13, 4),(13, 7),
(14, 2),(14, 7),
(15, 1),(15, 3);

-- ============================================================
-- TABLE : file_meta_data
-- ============================================================
TRUNCATE TABLE `file_meta_data`;

INSERT INTO `file_meta_data` (`id`, `filename`, `uploaded_at`, `uri`) VALUES
(1,  'casque_vr.jpg',              '2025-09-10 10:00:00.000000', 'uploads/images/casque_vr.jpg'),
(2,  'imprimante_3d.jpg',          '2025-09-10 10:05:00.000000', 'uploads/images/imprimante_3d.jpg'),
(3,  'camera_sony.jpg',            '2025-09-10 10:10:00.000000', 'uploads/images/camera_sony.jpg'),
(4,  'salle_b204.jpg',             '2025-09-10 10:15:00.000000', 'uploads/images/salle_b204.jpg'),
(5,  'salle_c101.jpg',             '2025-09-10 10:20:00.000000', 'uploads/images/salle_c101.jpg'),
(6,  'drone_dji.jpg',              '2025-09-10 10:25:00.000000', 'uploads/images/drone_dji.jpg'),
(7,  'tablette_wacom.jpg',         '2025-09-10 10:30:00.000000', 'uploads/images/tablette_wacom.jpg'),
(8,  'micro_rode.jpg',             '2025-09-10 10:35:00.000000', 'uploads/images/micro_rode.jpg'),
(9,  'guide_vr.pdf',               '2025-09-11 09:00:00.000000', 'uploads/docs/guide_vr.pdf'),
(10, 'notice_imprimante.pdf',      '2025-09-11 09:05:00.000000', 'uploads/docs/notice_imprimante.pdf'),
(11, 'fiche_securite_drone.pdf',   '2025-09-11 09:10:00.000000', 'uploads/docs/fiche_securite_drone.pdf'),
(12, 'manuel_camera.pdf',          '2025-09-11 09:15:00.000000', 'uploads/docs/manuel_camera.pdf'),
(13, 'raspberry_pi.jpg',           '2025-09-12 11:00:00.000000', 'uploads/images/raspberry_pi.jpg'),
(14, 'arduino_kit.jpg',            '2025-09-12 11:05:00.000000', 'uploads/images/arduino_kit.jpg'),
(15, 'kinect_sensor.jpg',          '2025-09-12 11:10:00.000000', 'uploads/images/kinect_sensor.jpg');

-- ============================================================
-- TABLE : resource
-- resource_type : 'Classroom' ou 'Item'
-- managed_by_id → professor.id
-- ============================================================
TRUNCATE TABLE `resource`;

INSERT INTO `resource` (`resource_type`, `id`, `available`, `created_at`, `description`, `name`, `managed_by_id`) VALUES
-- Salles
('Classroom', 1,  b'1', '2025-09-01 09:00:00.000000', 'Salle équipée pour les cours de VR avec 15 postes',          'Salle VR B204',          10),
('Classroom', 2,  b'1', '2025-09-01 09:05:00.000000', 'Studio audiovisuel avec fond vert et éclairage professionnel','Studio Audiovisuel C101', 12),
('Classroom', 3,  b'1', '2025-09-01 09:10:00.000000', 'Salle informatique avec stations graphiques haute performance','Lab Graphique A310',      11),
('Classroom', 4,  b'0', '2025-09-01 09:15:00.000000', 'Espace de fabrication numérique (FabLab)',                   'FabLab D202',            13),
('Classroom', 5,  b'1', '2025-09-01 09:20:00.000000', 'Salle de cours standard avec vidéoprojecteur',               'Amphi E001',              14),
-- Équipements
('Item',      6,  b'1', '2025-09-05 10:00:00.000000', 'Casque Meta Quest 3, avec manettes',                         'Casque VR Meta Quest 3',  10),
('Item',      7,  b'1', '2025-09-05 10:05:00.000000', 'Imprimante 3D Bambu Lab X1C',                                'Imprimante 3D Bambu X1C', 13),
('Item',      8,  b'1', '2025-09-05 10:10:00.000000', 'Appareil photo hybride Sony A7 IV + objectif 24-70mm',       'Sony A7 IV',              12),
('Item',      9,  b'0', '2025-09-05 10:15:00.000000', 'Drone DJI Air 3 avec 3 batteries',                           'Drone DJI Air 3',         12),
('Item',      10, b'1', '2025-09-05 10:20:00.000000', 'Tablette graphique Wacom Cintiq 22',                         'Wacom Cintiq 22',         11),
('Item',      11, b'1', '2025-09-05 10:25:00.000000', 'Microphone de studio Rode NT1',                              'Microphone Rode NT1',     12),
('Item',      12, b'1', '2025-09-05 10:30:00.000000', 'Kit Arduino Uno + capteurs divers',                          'Kit Arduino',             13),
('Item',      13, b'1', '2025-09-05 10:35:00.000000', 'Raspberry Pi 4 (4 Go RAM)',                                  'Raspberry Pi 4',          13),
('Item',      14, b'1', '2025-09-05 10:40:00.000000', 'Capteur de mouvement Microsoft Kinect v2',                   'Kinect v2',               13),
('Item',      15, b'0', '2025-09-05 10:45:00.000000', 'Casque Meta Quest 3 (unité 2)',                              'Casque VR Meta Quest 3 #2',10),
('Item',      16, b'1', '2025-09-05 11:00:00.000000', 'Interface audio Focusrite Scarlett 2i2',                     'Focusrite Scarlett 2i2',  12),
('Item',      17, b'1', '2025-09-05 11:05:00.000000', 'Casque audio Sony MDR-7506',                                 'Casque Sony MDR-7506',    12),
('Item',      18, b'1', '2025-09-05 11:10:00.000000', 'Caméra 360° Insta360 X4',                                    'Caméra 360° Insta360 X4', 10),
('Item',      19, b'0', '2025-09-05 11:15:00.000000', 'Trépied professionnel Manfrotto',                            'Trépied Manfrotto',       12),
('Item',      20, b'1', '2025-09-05 11:20:00.000000', 'LED Panel Elgato Key Light (x2)',                            'Éclairage Elgato x2',     12);

-- ============================================================
-- TABLE : classroom
-- id → resource.id où resource_type = 'Classroom'
-- ============================================================
TRUNCATE TABLE `classroom`;

INSERT INTO `classroom` (`room_number`, `id`) VALUES
(204, 1),
(101, 2),
(310, 3),
(202, 4),
(1,   5);

-- ============================================================
-- TABLE : item_type
-- created_by_id → professor.id
-- ============================================================
TRUNCATE TABLE `item_type`;

INSERT INTO `item_type` (`id`, `name`, `created_at`, `created_by_id`) VALUES
(1,  'Casque VR',          '2025-09-06 09:00:00.000000', 10),
(2,  'Imprimante 3D',      '2025-09-06 09:05:00.000000', 13),
(3,  'Appareil photo',     '2025-09-06 09:10:00.000000', 12),
(4,  'Drone',              '2025-09-06 09:15:00.000000', 12),
(5,  'Tablette graphique', '2025-09-06 09:20:00.000000', 11),
(6,  'Microphone',         '2025-09-06 09:25:00.000000', 12),
(7,  'Kit électronique',   '2025-09-06 09:30:00.000000', 13),
(8,  'Capteur',            '2025-09-06 09:35:00.000000', 13),
(9,  'Interface audio',    '2025-09-06 09:40:00.000000', 12),
(10, 'Caméra 360°',        '2025-09-06 09:45:00.000000', 10),
(11, 'Accessoire photo',   '2025-09-06 09:50:00.000000', 12),
(12, 'Éclairage',          '2025-09-06 09:55:00.000000', 12),
(13, 'Casque audio',       '2025-09-06 10:00:00.000000', 12);

-- ============================================================
-- TABLE : item
-- id → resource.id où resource_type = 'Item'
-- type_id → item_type.id
-- ============================================================
TRUNCATE TABLE `item`;

INSERT INTO `item` (`serial_number`, `id`, `type_id`) VALUES
(1001, 6,  1),  -- Casque VR Meta Quest 3 #1
(2001, 7,  2),  -- Imprimante 3D
(3001, 8,  3),  -- Sony A7 IV
(4001, 9,  4),  -- Drone DJI
(5001, 10, 5),  -- Wacom Cintiq
(6001, 11, 6),  -- Microphone Rode
(7001, 12, 7),  -- Kit Arduino
(7002, 13, 7),  -- Raspberry Pi
(8001, 14, 8),  -- Kinect v2
(1002, 15, 1),  -- Casque VR Meta Quest 3 #2
(9001, 16, 9),  -- Focusrite Scarlett
(13001,17, 13), -- Casque Sony MDR-7506
(10001,18, 10), -- Caméra 360°
(11001,19, 11), -- Trépied Manfrotto
(12001,20, 12); -- Éclairage Elgato

-- ============================================================
-- TABLE : notification
-- ============================================================
TRUNCATE TABLE `notification`;

INSERT INTO `notification` (`id`, `created_at`, `message`) VALUES
(1,  '2025-09-15 08:00:00.000000', 'Bienvenue sur la plateforme Pretetgo !'),
(2,  '2025-10-01 09:00:00.000000', 'Votre réservation du Casque VR a été approuvée.'),
(3,  '2025-10-02 10:00:00.000000', 'Rappel : retour du Drone DJI prévu demain avant 18h.'),
(4,  '2025-10-05 11:00:00.000000', 'Votre demande de réservation est en attente de validation.'),
(5,  '2025-10-10 14:00:00.000000', 'La Salle VR B204 est de nouveau disponible.'),
(6,  '2025-10-15 08:30:00.000000', 'Votre réservation de la Sony A7 IV a été rejetée. Motif : créneau déjà pris.'),
(7,  '2025-10-20 09:00:00.000000', 'Nouveau matériel ajouté : Caméra 360° Insta360 X4.'),
(8,  '2025-10-22 10:00:00.000000', 'Le FabLab D202 est temporairement indisponible pour maintenance.'),
(9,  '2025-11-01 08:00:00.000000', 'Rappel : fin de semestre le 20 janvier, pensez à anticiper vos réservations.'),
(10, '2025-11-05 15:00:00.000000', 'Votre signalement concernant l''imprimante 3D a été pris en compte.'),
(11, '2025-11-10 09:00:00.000000', 'Votre réservation du Kit Arduino a été approuvée.'),
(12, '2025-11-15 10:00:00.000000', 'Mise à jour : le Drone DJI Air 3 est de nouveau disponible après réparation.'),
(13, '2025-12-01 08:00:00.000000', 'Fermeture de l''établissement du 24 décembre au 2 janvier.'),
(14, '2026-01-10 09:00:00.000000', 'Votre réservation du Studio Audiovisuel a été approuvée.'),
(15, '2026-01-15 10:00:00.000000', 'Signalement résolu : l''imprimante 3D est opérationnelle.');

-- ============================================================
-- TABLE : user_notification
-- ============================================================
TRUNCATE TABLE `user_notification`;

INSERT INTO `user_notification` (`id`, `is_read`, `read_at`, `notification_id`, `user_id`) VALUES
-- Notification de bienvenue → tous les users
(1,  b'1', '2025-09-15 08:05:00.000000', 1,  1),
(2,  b'1', '2025-09-15 08:10:00.000000', 1,  2),
(3,  b'1', '2025-09-15 08:15:00.000000', 1,  3),
(4,  b'1', '2025-09-15 08:20:00.000000', 1,  4),
(5,  b'1', '2025-09-15 08:25:00.000000', 1,  5),
(6,  b'0', NULL,                          1,  6),
(7,  b'0', NULL,                          1,  7),
(8,  b'0', NULL,                          1,  8),
-- Notifications spécifiques
(9,  b'1', '2025-10-01 09:10:00.000000', 2,  2),   -- Lucas : réservation approuvée
(10, b'1', '2025-10-02 10:30:00.000000', 3,  3),   -- Emma : rappel retour drone
(11, b'0', NULL,                          4,  4),   -- Noah : en attente
(12, b'1', '2025-10-05 11:15:00.000000', 5,  2),   -- Lucas : salle disponible
(13, b'1', '2025-10-15 09:00:00.000000', 6,  5),   -- Chloé : réservation rejetée
(14, b'1', '2025-10-20 09:30:00.000000', 7,  1),   -- Admin : nouveau matériel
(15, b'0', NULL,                          8,  1),   -- Admin : fablab indisponible
(16, b'1', '2025-11-01 08:30:00.000000', 9,  2),
(17, b'1', '2025-11-01 08:35:00.000000', 9,  3),
(18, b'1', '2025-11-01 08:40:00.000000', 9,  4),
(19, b'1', '2025-11-05 15:15:00.000000', 10, 10),  -- Prof Zaidi : signalement traité
(20, b'1', '2025-11-10 09:15:00.000000', 11, 4),   -- Noah : arduino approuvé
(21, b'0', NULL,                          12, 3),   -- Emma : drone disponible
(22, b'1', '2025-12-01 08:15:00.000000', 13, 1),
(23, b'1', '2026-01-10 09:15:00.000000', 14, 3),   -- Emma : studio approuvé
(24, b'0', NULL,                          15, 10);  -- Zaidi : signalement résolu

-- ============================================================
-- TABLE : report
-- reported_by_id → user.id
-- resource_id    → resource.id
-- status : OPEN | IN_PROGRESS | RESOLVED
-- ============================================================
TRUNCATE TABLE `report`;

INSERT INTO `report` (`id`, `created_at`, `description`, `status`, `reported_by_id`, `resource_id`) VALUES
(1,  '2025-10-20 14:00:00.000000', 'L''imprimante 3D présente un bourrage filament répétitif sur le plateau chauffant.',                       'RESOLVED',    2,  7),
(2,  '2025-10-25 09:30:00.000000', 'La batterie 2 du drone DJI Air 3 ne tient plus la charge correctement.',                                   'IN_PROGRESS', 3,  9),
(3,  '2025-11-02 11:00:00.000000', 'Le microphone Rode NT1 génère un souffle parasite au-dessus de 48V phantom.',                              'OPEN',        6,  11),
(4,  '2025-11-08 16:00:00.000000', 'Le câble USB du Kit Arduino est endommagé, connexion instable.',                                           'RESOLVED',    4,  12),
(5,  '2025-11-12 10:00:00.000000', 'Le trépied Manfrotto présente une rotule bloquée, réglage en hauteur impossible.',                         'OPEN',        8,  19),
(6,  '2025-11-20 08:30:00.000000', 'Le casque VR Meta Quest 3 #2 a l''objectif gauche rayé, affectant l''expérience immersive.',               'IN_PROGRESS', 5,  15),
(7,  '2025-12-05 14:00:00.000000', 'La Kinect v2 n''est plus reconnue par les PC de la salle A310, problème de driver probable.',              'OPEN',        7,  14),
(8,  '2026-01-08 09:00:00.000000', 'L''interface audio Focusrite Scarlett 2i2 génère des clics aléatoires lors de l''enregistrement.',         'OPEN',        2,  16),
(9,  '2026-01-12 15:30:00.000000', 'La Wacom Cintiq 22 présente des lignes mortes dans le coin inférieur gauche de l''écran.',                 'IN_PROGRESS', 3,  10),
(10, '2026-01-18 10:00:00.000000', 'Le vidéoprojecteur de l''Amphi E001 a une ampoule défectueuse, image trop sombre.',                       'OPEN',        6,  5);

-- ============================================================
-- TABLE : reservation_group
-- ============================================================
TRUNCATE TABLE `reservation_group`;

INSERT INTO `reservation_group` (`id`, `created_at`, `name`) VALUES
(1,  '2025-09-20 10:00:00.000000', 'Groupe Projet VR - Lucas & Emma'),
(2,  '2025-09-22 11:00:00.000000', 'Duo Audiovisuel - Noah & Chloé'),
(3,  '2025-10-01 09:00:00.000000', 'Équipe FabLab - Hugo & Léa & Théo'),
(4,  '2025-10-05 14:00:00.000000', 'Solo Emma - Studio'),
(5,  '2025-10-10 08:00:00.000000', 'Solo Lucas - Casque VR'),
(6,  '2025-10-12 10:00:00.000000', 'Groupe Interactif - Noah & Camille'),
(7,  '2025-11-03 09:00:00.000000', 'Duo Son - Hugo & Léa'),
(8,  '2025-11-15 10:00:00.000000', 'Équipe 360° - Emma & Théo & Lucas'),
(9,  '2025-12-01 08:00:00.000000', 'Solo Noah - Arduino'),
(10, '2026-01-10 09:00:00.000000', 'Duo Cinéma - Emma & Chloé');

-- ============================================================
-- TABLE : reservation_group_student
-- role : LEADER | MEMBER
-- ============================================================
TRUNCATE TABLE `reservation_group_student`;

INSERT INTO `reservation_group_student` (`id`, `created_at`, `role`, `reservation_group_id`, `student_id`) VALUES
(1,  '2025-09-20 10:00:00.000000', 'LEADER', 1, 2),
(2,  '2025-09-20 10:01:00.000000', 'MEMBER', 1, 3),
(3,  '2025-09-22 11:00:00.000000', 'LEADER', 2, 4),
(4,  '2025-09-22 11:01:00.000000', 'MEMBER', 2, 5),
(5,  '2025-10-01 09:00:00.000000', 'LEADER', 3, 6),
(6,  '2025-10-01 09:01:00.000000', 'MEMBER', 3, 7),
(7,  '2025-10-01 09:02:00.000000', 'MEMBER', 3, 8),
(8,  '2025-10-05 14:00:00.000000', 'LEADER', 4, 3),
(9,  '2025-10-10 08:00:00.000000', 'LEADER', 5, 2),
(10, '2025-10-12 10:00:00.000000', 'LEADER', 6, 4),
(11, '2025-10-12 10:01:00.000000', 'MEMBER', 6, 9),
(12, '2025-11-03 09:00:00.000000', 'LEADER', 7, 6),
(13, '2025-11-03 09:01:00.000000', 'MEMBER', 7, 7),
(14, '2025-11-15 10:00:00.000000', 'LEADER', 8, 3),
(15, '2025-11-15 10:01:00.000000', 'MEMBER', 8, 8),
(16, '2025-11-15 10:02:00.000000', 'MEMBER', 8, 2),
(17, '2025-12-01 08:00:00.000000', 'LEADER', 9, 4),
(18, '2026-01-10 09:00:00.000000', 'LEADER', 10, 3),
(19, '2026-01-10 09:01:00.000000', 'MEMBER', 10, 5);

-- ============================================================
-- TABLE : reservation
-- reserved_by_id → reservation_group.id
-- resource_id    → resource.id
-- status : PENDING | APPROVED | REJECTED | CANCELLED
-- ============================================================
TRUNCATE TABLE `reservation`;

INSERT INTO `reservation` (`id`, `created_at`, `start_date`, `end_date`, `status`, `validation_date`, `reserved_by_id`, `resource_id`) VALUES
-- Approuvées
(1,  '2025-09-21 08:00:00.000000', '2025-09-25 09:00:00.000000', '2025-09-25 12:00:00.000000', 'APPROVED',   '2025-09-22 10:00:00.000000', 1,  1),  -- Groupe 1 → Salle VR
(2,  '2025-09-23 09:00:00.000000', '2025-09-28 14:00:00.000000', '2025-09-29 14:00:00.000000', 'APPROVED',   '2025-09-24 11:00:00.000000', 2,  8),  -- Groupe 2 → Sony A7 IV
(3,  '2025-10-02 10:00:00.000000', '2025-10-08 09:00:00.000000', '2025-10-10 18:00:00.000000', 'APPROVED',   '2025-10-03 08:30:00.000000', 3,  7),  -- Groupe 3 → Imprimante 3D
(4,  '2025-10-06 08:00:00.000000', '2025-10-15 10:00:00.000000', '2025-10-15 18:00:00.000000', 'APPROVED',   '2025-10-07 09:00:00.000000', 4,  2),  -- Emma solo → Studio
(5,  '2025-10-11 07:00:00.000000', '2025-10-18 08:00:00.000000', '2025-10-18 12:00:00.000000', 'APPROVED',   '2025-10-12 08:00:00.000000', 5,  6),  -- Lucas solo → Casque VR #1
(6,  '2025-11-04 09:00:00.000000', '2025-11-10 14:00:00.000000', '2025-11-10 18:00:00.000000', 'APPROVED',   '2025-11-05 10:00:00.000000', 7,  11), -- Duo son → Microphone
(7,  '2025-11-16 08:30:00.000000', '2025-11-25 09:00:00.000000', '2025-11-25 17:00:00.000000', 'APPROVED',   '2025-11-17 09:00:00.000000', 8,  18), -- Équipe 360° → Caméra 360°
(8,  '2025-12-02 09:00:00.000000', '2025-12-10 10:00:00.000000', '2025-12-12 18:00:00.000000', 'APPROVED',   '2025-12-03 08:00:00.000000', 9,  12), -- Noah → Arduino
(9,  '2026-01-11 08:00:00.000000', '2026-01-20 10:00:00.000000', '2026-01-20 18:00:00.000000', 'APPROVED',   '2026-01-12 09:00:00.000000', 10, 2),  -- Duo cinéma → Studio
-- En attente
(10, '2025-10-13 11:00:00.000000', '2025-10-22 09:00:00.000000', '2025-10-22 12:00:00.000000', 'PENDING',    NULL,                          6,  13), -- Groupe interactif → Raspberry Pi
(11, '2026-01-20 09:00:00.000000', '2026-02-05 14:00:00.000000', '2026-02-05 18:00:00.000000', 'PENDING',    NULL,                          1,  1),  -- Groupe 1 → Salle VR
(12, '2026-01-22 10:00:00.000000', '2026-02-10 09:00:00.000000', '2026-02-12 18:00:00.000000', 'PENDING',    NULL,                          5,  7),  -- Lucas → Imprimante 3D
-- Rejetées
(13, '2025-10-14 10:00:00.000000', '2025-10-22 09:00:00.000000', '2025-10-22 12:00:00.000000', 'REJECTED',   '2025-10-15 08:30:00.000000', 2,  8),  -- Créneau déjà pris
(14, '2025-11-20 08:00:00.000000', '2025-11-25 09:00:00.000000', '2025-11-25 17:00:00.000000', 'REJECTED',   '2025-11-21 09:00:00.000000', 6,  9),  -- Drone indisponible
-- Annulées
(15, '2025-09-30 10:00:00.000000', '2025-10-05 14:00:00.000000', '2025-10-05 18:00:00.000000', 'CANCELLED',  '2025-10-01 09:00:00.000000', 4,  3),  -- Lab graphique (annulé)
(16, '2025-11-01 09:00:00.000000', '2025-11-08 10:00:00.000000', '2025-11-08 18:00:00.000000', 'CANCELLED',  NULL,                          3,  10), -- Wacom (annulé par l'étudiant)
-- Historique passé approuvé
(17, '2025-09-10 08:00:00.000000', '2025-09-15 09:00:00.000000', '2025-09-15 12:00:00.000000', 'APPROVED',   '2025-09-11 10:00:00.000000', 1,  6),  -- Early test Casque VR
(18, '2025-09-12 09:00:00.000000', '2025-09-18 14:00:00.000000', '2025-09-18 18:00:00.000000', 'APPROVED',   '2025-09-13 08:00:00.000000', 2,  2),  -- Studio audiovisuel
(19, '2025-09-16 10:00:00.000000', '2025-09-20 09:00:00.000000', '2025-09-22 18:00:00.000000', 'APPROVED',   '2025-09-17 09:00:00.000000', 3,  7),  -- Imprimante 3D (première fois)
(20, '2025-10-20 08:00:00.000000', '2025-10-28 10:00:00.000000', '2025-10-28 18:00:00.000000', 'APPROVED',   '2025-10-21 09:00:00.000000', 4,  8);  -- Sony A7 IV (suite)

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- FIN DU FICHIER SEED
-- ============================================================
-- Récapitulatif des données insérées :
--   users               : 15  (1 admin, 8 étudiants, 6 professeurs)
--   subjects            : 8
--   professor_subject   : 12  (liens prof ↔ matière)
--   file_meta_data      : 15  (images + PDFs)
--   resources           : 20  (5 salles + 15 équipements)
--   classrooms          : 5
--   item_types          : 13
--   items               : 15
--   notifications       : 15
--   user_notifications  : 24
--   reports             : 10  (OPEN / IN_PROGRESS / RESOLVED)
--   reservation_groups  : 10
--   reservation_group_students : 19
--   reservations        : 20  (APPROVED / PENDING / REJECTED / CANCELLED)
-- ============================================================
