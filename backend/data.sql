-- 1. Utilisateurs (Fondation + Associations)
INSERT INTO Utilisateur (id, nom, prenom, adresse, dob, mot_de_passe, role) VALUES
                                                                                (1, 'Admin', 'Fondation CA', 'Draguignan', '1990-01-01', 'admin2025', 'ADMIN'),
                                                                                (2, 'Assoc', 'Chant des Dauphins', 'Port-Fréjus', '2000-06-15', 'mer83', 'USER'),
                                                                                (3, 'Assoc', 'Recyclerie Gare', 'Hyères', '2015-03-10', 'velo83', 'USER'),
                                                                                (4, 'Assoc', 'AVATH', 'Toulon', '1998-09-22', 'miam83', 'USER'),
                                                                                (5, 'Musée', 'Dinosaures', 'Fox-Amphoux', '2025-06-07', 'raptor83', 'USER');

-- 2. Projets (Mécénat & AAP 2025) adaptés PACA
INSERT INTO Projet (id, nom, longitude, latitude, description, utilisateur_id, date_debut, budget, categorie, localisation) VALUES
                                                                                                                                (1, 'Voile Bonheur', 6.733, 43.433, 'Sorties en mer pour public handicapé (autisme) à la rencontre des dauphins.', 2, '2025-05-01', 5000, 'Social', 'Port-Fréjus'),
                                                                                                                                (2, 'Atelier Vélo Solidaire', 5.435, 43.124, 'Équipement pour réparation de vélos et formation de salariés en insertion.', 3, '2025-02-15', 2500, 'Environnement', 'Hyères'),
                                                                                                                                (3, 'Comptoir Bistrot Chalucet', 5.927, 43.124, 'Restauration solidaire et inclusive pour lutter contre la précarité alimentaire.', 4, '2025-10-01', 3200, 'Social', 'Toulon'),
                                                                                                                                (4, 'Musée Dinosaures', 6.100, 43.580, 'Ouverture du musée sur site paléontologique majeur.', 5, '2025-06-07', 7000, 'Culture', 'Fox-Amphoux');

-- 3. Images (Illustrations)
INSERT INTO Image (id, url, projet_id, isMain, isPreview) VALUES
(1, 'https://cdn/voile_handicap.jpg', 1, TRUE, TRUE),
(2, 'https://cdn/dauphins.jpg', 1, FALSE, FALSE),
(3, 'https://cdn/atelier_velo.jpg', 2, TRUE, TRUE),
(4, 'https://cdn/bistrot_devanture.jpg', 3, TRUE, TRUE),
(5, 'https://cdn/cuisine_inclusive.jpg', 3, FALSE, TRUE),
(6, 'https://cdn/raptor_museum.jpg', 4, TRUE, TRUE),
(7, 'https://cdn/inauguration.jpg', 4, FALSE, FALSE);


-- 4. Projets supplémentaires PACA
INSERT INTO Projet (id, nom, longitude, latitude, description, utilisateur_id, date_debut, budget, categorie, localisation) VALUES
                                                                                                                                (5, 'Randonnée Éco-Trail', 6.146, 43.610, 'Organisation de randonnées guidées pour sensibiliser à l’écologie.', 2, '2025-03-12', 1800, 'Environnement', 'Marseille'),
                                                                                                                                (6, 'Jardin Partagé Toulonnais', 5.930, 43.125, 'Création d’un jardin partagé pour les habitants de Toulon.', 4, '2025-04-20', 1200, 'Social', 'Toulon'),
                                                                                                                                (7, 'Atelier Peinture Nice', 7.260, 43.710, 'Cours de peinture inclusifs pour enfants et adultes.', 3, '2025-06-05', 2000, 'Culture', 'Nice'),
                                                                                                                                (8, 'Nettoyage Plage Cannes', 7.010, 43.552, 'Mobilisation citoyenne pour nettoyer les plages de Cannes.', 2, '2025-07-10', 1500, 'Environnement', 'Cannes'),
                                                                                                                                (9, 'Bistrot Solidaire Marseille', 5.370, 43.300, 'Repas gratuits et activités pour les personnes précaires.', 4, '2025-08-15', 3500, 'Social', 'Marseille'),
                                                                                                                                (10, 'Musée du Patrimoine Menton', 7.500, 43.780, 'Expositions temporaires pour valoriser le patrimoine local.', 5, '2025-05-30', 6000, 'Culture', 'Menton'),
                                                                                                                                (11, 'Atelier Cirque Saint-Raphaël', 6.740, 43.430, 'Cours de cirque pour enfants et adolescents.', 3, '2025-09-01', 2200, 'Culture', 'Saint-Raphaël'),
                                                                                                                                (12, 'Festival du Livre Hyères', 6.140, 43.120, 'Organisation d’un festival du livre et d’ateliers d’écriture.', 3, '2025-10-12', 3000, 'Culture', 'Hyères'),
                                                                                                                                (13, 'Randonnée Seniors Provence', 6.050, 43.220, 'Activités de plein air pour les seniors.', 2, '2025-03-20', 1000, 'Social', 'Draguignan'),
                                                                                                                                (14, 'Éco-Cyclo Nice', 7.280, 43.710, 'Ateliers de réparation de vélos pour promouvoir la mobilité durable.', 3, '2025-04-18', 1800, 'Environnement', 'Nice'),
                                                                                                                                (15, 'Théâtre Inclusif Marseille', 5.370, 43.295, 'Cours de théâtre pour personnes en situation de handicap.', 4, '2025-06-25', 2500, 'Culture', 'Marseille'),
                                                                                                                                (16, 'Atelier Cuisine Solidaire Toulon', 5.930, 43.125, 'Cours de cuisine pour apprendre à cuisiner avec peu de ressources.', 4, '2025-05-10', 2000, 'Social', 'Toulon'),
                                                                                                                                (17, 'Observatoire des Oiseaux Camargue', 4.650, 43.550, 'Activités d’observation et protection des oiseaux.', 2, '2025-07-05', 2200, 'Environnement', 'Camargue'),
                                                                                                                                (18, 'Festival Jazz Nice', 7.270, 43.705, 'Organisation d’un festival de jazz et concerts gratuits.', 5, '2025-08-20', 4000, 'Culture', 'Nice'),
                                                                                                                                (19, 'Nettoyage Parc National Esterel', 6.780, 43.420, 'Opération de nettoyage et sensibilisation écologique.', 2, '2025-09-10', 1300, 'Environnement', 'Fréjus'),
                                                                                                                                (20, 'Club Lecture Hyères', 6.140, 43.120, 'Club de lecture pour adolescents et jeunes adultes.', 3, '2025-10-01', 900, 'Culture', 'Hyères'),
                                                                                                                                (21, 'Récup’ Vélos Marseille', 5.370, 43.300, 'Collecte et réparation de vélos pour les étudiants et familles.', 3, '2025-03-15', 2000, 'Environnement', 'Marseille'),
                                                                                                                                (22, 'Danse Inclusive Cannes', 7.010, 43.552, 'Cours de danse pour tous publics, incluant personnes handicapées.', 4, '2025-05-12', 1800, 'Culture', 'Cannes'),
                                                                                                                                (23, 'Bibliothèque Mobile Provence', 6.050, 43.220, 'Création d’une bibliothèque mobile pour les zones rurales.', 5, '2025-06-08', 2500, 'Culture', 'Draguignan'),
                                                                                                                                (24, 'Atelier Jardinage Menton', 7.500, 43.780, 'Cours de jardinage pour enfants et familles.', 2, '2025-07-15', 1500, 'Environnement', 'Menton');

-- 5. Images associées aux nouveaux projets (exemples)
INSERT INTO Image (id, url, projet_id, isMain, isPreview) VALUES
                                                              (8, 'https://cdn/randonnee_ecotrail.jpg', 5, TRUE, TRUE),
                                                              (9, 'https://cdn/jardin_partage.jpg', 6, TRUE, TRUE),
                                                              (10, 'https://cdn/atelier_peinture.jpg', 7, TRUE, TRUE),
                                                              (11, 'https://cdn/nettoyage_plage.jpg', 8, TRUE, TRUE),
                                                              (12, 'https://cdn/bistrot_solidaire.jpg', 9, TRUE, TRUE),
                                                              (13, 'https://cdn/musee_menton.jpg', 10, TRUE, TRUE),
                                                              (14, 'https://cdn/atelier_cirque.jpg', 11, TRUE, TRUE),
                                                              (15, 'https://cdn/festival_livre.jpg', 12, TRUE, TRUE),
                                                              (16, 'https://cdn/randonnee_seniors.jpg', 13, TRUE, TRUE),
                                                              (17, 'https://cdn/eco_cyclo.jpg', 14, TRUE, TRUE),
                                                              (18, 'https://cdn/theatre_inclusif.jpg', 15, TRUE, TRUE),
                                                              (19, 'https://cdn/cuisine_solidaire.jpg', 16, TRUE, TRUE),
                                                              (20, 'https://cdn/observatoire_oiseaux.jpg', 17, TRUE, TRUE),
                                                              (21, 'https://cdn/festival_jazz.jpg', 18, TRUE, TRUE),
                                                              (22, 'https://cdn/nettoyage_esterel.jpg', 19, TRUE, TRUE),
                                                              (23, 'https://cdn/club_lecture.jpg', 20, TRUE, TRUE),
                                                              (24, 'https://cdn/recup_velos.jpg', 21, TRUE, TRUE),
                                                              (25, 'https://cdn/danse_inclusive.jpg', 22, TRUE, TRUE),
                                                              (26, 'https://cdn/biblio_mobile.jpg', 23, TRUE, TRUE),
                                                              (27, 'https://cdn/atelier_jardinage.jpg', 24, TRUE, TRUE);