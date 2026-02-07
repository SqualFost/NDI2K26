import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
  Platform
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Assure-toi que le chemin est correct vers ton composant MapComp
import { MapComp } from '@/components/carte_comp';

// --- DONNÉES (MOCK) ---
const PROJECTS = [
  { id: '1', name: 'Refroidissement urbain', budget: '12 500€', desc: 'Installation de toits végétalisés sur la mairie.', category: 'Ecologie' },
  { id: '2', name: 'Handi-Sport 2026', budget: '8 000€', desc: 'Achat de fauteuils roulants multisports.', category: 'Sport' },
  { id: '3', name: 'Rucher Partagé', budget: '3 200€', desc: 'Installation de 5 ruches en centre-ville.', category: 'Ecologie' },
  { id: '4', name: 'Potager Solidaire', budget: '4 500€', desc: 'Création de parcelles cultivables pour tous.', category: 'Social' },
  { id: '5', name: 'Piste Cyclable Sud', budget: '25 000€', desc: 'Rénovation de la piste cyclable du bord de mer.', category: 'Transport' },
  { id: '6', name: 'Atelier Numérique', budget: '2 000€', desc: 'Cours informatique pour les séniors.', category: 'Social' },
  { id: '7', name: 'Nettoyage Plage', budget: '1 500€', desc: 'Achat de matériel pour la journée citoyenne.', category: 'Ecologie' },
];

const CATEGORIES = ['Tous', 'Ecologie', 'Social', 'Sport', 'Transport'];

export default function HomeScreen() {
  // --- ÉTATS ---
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showFilters, setShowFilters] = useState(false);
  const PACA_EMBED_URL = "https://api.maptiler.com/maps/019c3561-0ec2-7775-bce3-88c947b4d20b/?key=66qh2RWXlu4nKogaX1Ns#6/43.1257311/5.9304919";

  // --- LOGIQUE DE FILTRAGE (Mémoisée pour la perf) ---
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((item) => {
      // 1. Recherche Textuelle (Insensible à la casse)
      const matchesText = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchText.toLowerCase());

      // 2. Filtre Catégorie
      const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;

      return matchesText && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  // --- CONFIGURATION BOTTOM SHEET ---
  const bottomSheetRef = useRef<BottomSheet>(null);
  // Points d'arrêt : 15% (juste le titre), 45% (moitié), 90% (quasi tout l'écran)
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // --- RENDU D'UNE CARTE PROJET ---
  const renderItem = useCallback(({ item }: { item: typeof PROJECTS[0] }) => (
      <TouchableOpacity style={styles.projectCard} onPress={() => console.log('Projet cliqué:', item.name)}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={24} color="#4e8076" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <View style={styles.budgetRow}>
            <Text style={styles.projectBudget}>{item.budget}</Text>
            {/* Badge de catégorie */}
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>{item.category}</Text>
            </View>
          </View>
          <Text style={styles.projectDesc} numberOfLines={2}>{item.desc}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
      </TouchableOpacity>
  ), []);

  return (
      <GestureHandlerRootView style={styles.container}>

        {/* 1. LA CARTE EN ARRIÈRE-PLAN */}
        <View style={styles.mapContainer}>
          {/* MapComp contient déjà ta logique de "lock" PACA */}
          <MapComp url={PACA_EMBED_URL}/>
        </View>

        {/* 2. HEADER FLOTTANT (Recherche + Filtres) */}
        {/* pointerEvents="box-none" permet de cliquer à travers le vide pour toucher la map */}
        <SafeAreaView style={styles.floatingHeader} pointerEvents="box-none">

          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#397262" />

              <TextInput
                  style={styles.searchInput}
                  placeholder="Trouver un projet..."
                  placeholderTextColor="#4e807680"
                  value={searchText}
                  onChangeText={setSearchText}
                  returnKeyType="search"
              />

              {/* Bouton pour afficher/cacher les catégories */}
              <TouchableOpacity
                  style={[styles.filterButton, showFilters && styles.filterButtonActive]}
                  onPress={() => {
                    setShowFilters(!showFilters);
                    Keyboard.dismiss();
                  }}
              >
                <Ionicons name="options" size={16} color={showFilters ? "#397262" : "#FFF"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* LISTE HORIZONTALE DES FILTRES */}
          {showFilters && (
              <View style={styles.filtersWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContent}
                >
                  {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                          key={cat}
                          style={[styles.filterChip, selectedCategory === cat && styles.filterChipSelected]}
                          onPress={() => setSelectedCategory(cat)}
                      >
                        <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextSelected]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
          )}
        </SafeAreaView>

        {/* 3. LE BOTTOM SHEET (Panneau coulissant) */}
        <BottomSheet
            ref={bottomSheetRef}
            index={1} // Commence à 45%
            snapPoints={snapPoints}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            keyboardBlurBehavior="restore" // Gère le clavier proprement
            android_keyboardInputMode="adjustResize"
        >
          <View style={styles.contentContainer}>
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>
                {filteredProjects.length > 0 ? "Projets à proximité" : "Aucun résultat"}
              </Text>
              <Text style={styles.sheetCount}>{filteredProjects.length}</Text>
            </View>

            <Text style={styles.sheetSubtitle}>Découvrez les initiatives locales</Text>

            {/* Liste optimisée pour le BottomSheet */}
            <BottomSheetFlatList
                data={filteredProjects}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
          </View>
        </BottomSheet>

      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject, // Prend tout l'écran
    zIndex: 0,
  },

  // --- STYLES HEADER (Recherche) ---
  floatingHeader: {
    position: 'absolute',
    top: 0, // SafeAreaView gère le notch
    left: 0,
    right: 0,
    zIndex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchBar: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    // Ombre portée
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    height: 40,
  },
  filterButton: {
    backgroundColor: '#397262', // Vert Crédit Agricole
    padding: 8,
    borderRadius: 50,
  },
  filterButtonActive: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#397262',
  },

  // --- STYLES FILTRES (Chips) ---
  filtersWrapper: {
    marginTop: 10,
  },
  filtersContent: {
    paddingHorizontal: 20, // Alignement avec la barre de recherche
    paddingBottom: 5,
  },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterChipSelected: {
    backgroundColor: '#397262',
  },
  filterText: {
    color: '#397262',
    fontWeight: '600',
    fontSize: 13,
  },
  filterTextSelected: {
    color: '#FFF',
  },

  // --- STYLES BOTTOM SHEET ---
  sheetBackground: {
    backgroundColor: '#f5f9f3', // Fond très clair vert
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  handleIndicator: {
    backgroundColor: '#4e807650', // Couleur du petit trait
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#397262',
  },
  sheetCount: {
    marginLeft: 8,
    backgroundColor: '#e5f3f5',
    color: '#447fab',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#4e8076',
    marginBottom: 15,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 40, // Espace pour scroller confortablement en bas
  },

  // --- CARTE PROJET ---
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5f3f5',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f5f9f3',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  projectName: {
    fontWeight: '700',
    color: '#397262',
    fontSize: 15,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  projectBudget: {
    color: '#447fab', // Bleu
    fontSize: 13,
    fontWeight: '600',
  },
  smallBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  smallBadgeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  projectDesc: {
    color: '#4e8076',
    fontSize: 12,
    lineHeight: 16,
  },
});