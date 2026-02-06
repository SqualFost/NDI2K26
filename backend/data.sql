-- 1. Utilisateurs (Fondation + Associations)
INSERT INTO Utilisateur (id, nom, prenom, adresse, dob, mot_de_passe, role) VALUES 
(1, 'Admin', 'Fondation CA', 'Draguignan', '1990-01-01', 'admin2025', 'ADMIN'),
(2, 'Assoc', 'Chant des Dauphins', 'Port-Fréjus', '2000-06-15', 'mer83', 'USER'),
(3, 'Assoc', 'Recyclerie Gare', 'Hyères', '2015-03-10', 'velo83', 'USER'),
(4, 'Assoc', 'AVATH', 'Toulon', '1998-09-22', 'miam83', 'USER'),
(5, 'Musée', 'Dinosaures', 'Fox-Amphoux', '2025-06-07', 'raptor83', 'USER');

-- 2. Projets (Mécénat & AAP 2025)
INSERT INTO Projet (id, nom, longitude, latitude, description, utilisateur_id, date_debut) VALUES 
(1, 'Voile Bonheur', 6768000, 43433000, 'Sorties en mer pour public handicapé (autisme) à la rencontre des dauphins (Sanctuaire Pélagos).', 2, '2025-05-01'),
(2, 'Atelier Vélo Solidaire', 6120000, 43120000, 'Équipement pour réparation de vélos et formation de salariés en insertion.', 3, '2025-02-15'),
(3, 'Comptoir Bistrot Chalucet', 5930000, 43124000, 'Restauration solidaire et inclusive pour lutter contre la précarité alimentaire (Lauréat AAP).', 4, '2025-10-01'),
(4, 'Musée Dinosaures', 6100000, 43580000, 'Ouverture du musée sur site paléontologique majeur (Veriraptor).', 5, '2025-06-07');

-- 3. Images (Illustrations)
INSERT INTO Image (id, url, projet_id, isMain, isPreview) VALUES 
(1, 'https://cdn/voile_handicap.jpg', 1, TRUE, TRUE),
(2, 'https://cdn/dauphins.jpg', 1, FALSE, FALSE),
(3, 'https://cdn/atelier_velo.jpg', 2, TRUE, TRUE),
(4, 'https://cdn/bistrot_devanture.jpg', 3, TRUE, TRUE),
(5, 'https://cdn/cuisine_inclusive.jpg', 3, FALSE, TRUE),
(6, 'https://cdn/raptor_museum.jpg', 4, TRUE, TRUE),
(7, 'https://cdn/inauguration.jpg', 4, FALSE, FALSE);
