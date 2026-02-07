import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
  Alert
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import du nouveau composant MapComp (Native)
import { MapComp } from '@/components/carte_comp';

// DONNÉES AVEC COORDONNÉES GPS (Nice & Alentours)
const PROJECTS = [
  { id: '1', name: 'Refroidissement urbain', budget: '12k€', desc: 'Toits végétalisés Mairie.', category: 'Ecologie', lat: 43.7034, lng: 7.2663 },
  { id: '2', name: 'Handi-Sport 2026', budget: '8k€', desc: 'Fauteuils roulants Port.', category: 'Sport', lat: 43.6950, lng: 7.2800 },
  { id: '3', name: 'Rucher Partagé', budget: '3k€', desc: 'Ruches Gare Thiers.', category: 'Ecologie', lat: 43.7050, lng: 7.2620 },
  { id: '4', name: 'Potager Solidaire', budget: '4.5k€', desc: 'Jardins partagés Aéroport.', category: 'Social', lat: 43.6650, lng: 7.2050 },
  { id: '5', name: 'Piste Cyclable Sud', budget: '25k€', desc: 'Promenade des Anglais.', category: 'Transport', lat: 43.6900, lng: 7.2400 },
  { id: '6', name: 'Atelier Numérique', budget: '2k€', desc: 'Cours séniors Cimiez.', category: 'Social', lat: 43.7200, lng: 7.2750 },
  { id: '7', name: 'Nettoyage Plage', budget: '1.5k€', desc: 'Journée citoyenne Cannes.', category: 'Ecologie', lat: 43.5528, lng: 7.0174 },
];

const CATEGORIES = ['Tous', 'Ecologie', 'Social', 'Sport', 'Transport'];

export default function HomeScreen() {
  // --- ÉTATS ---
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showFilters, setShowFilters] = useState(false);

  // --- FILTRAGE ---
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((item) => {
      const matchesText = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
      return matchesText && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  // --- CONFIG BOTTOM SHEET ---
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // Gestion du clic sur un marqueur de la carte
  const handleMarkerPress = (project: any) => {
    // Ici, tu pourrais faire scroller la liste vers cet item
    Alert.alert(project.name, `${project.desc}\nBudget: ${project.budget}`);
  };

  // Rendu Carte Liste
  const renderItem = useCallback(({ item }: { item: typeof PROJECTS[0] }) => (
      <TouchableOpacity style={styles.projectCard} onPress={() => handleMarkerPress(item)}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={24} color="#4e8076" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <View style={styles.budgetRow}>
            <Text style={styles.projectBudget}>{item.budget}</Text>
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

        {/* 1. LA CARTE NATIVE (Expo Maps) */}
        <View style={styles.mapContainer}>
          <MapComp
              markers={filteredProjects}
              onMarkerPress={handleMarkerPress}
          />
        </View>

        {/* 2. HEADER FLOTTANT (Recherche + Filtres) */}
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
              />
              <TouchableOpacity
                  style={[styles.filterButton, showFilters && styles.filterButtonActive]}
                  onPress={() => { setShowFilters(!showFilters); Keyboard.dismiss(); }}
              >
                <Ionicons name="options" size={16} color={showFilters ? "#397262" : "#FFF"} />
              </TouchableOpacity>
            </View>
          </View>

          {showFilters && (
              <View style={styles.filtersWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
                  {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                          key={cat}
                          style={[styles.filterChip, selectedCategory === cat && styles.filterChipSelected]}

                          onPress={() => {
                            if (selectedCategory !== cat) {
                              setSelectedCategory(cat);
                            }
                          }}
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

        {/* 3. BOTTOM SHEET */}
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            keyboardBlurBehavior="restore"
        >
          <View style={styles.contentContainer}>
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>
                {filteredProjects.length > 0 ? "Projets à proximité" : "Aucun résultat"}
              </Text>
              <Text style={styles.sheetCount}>{filteredProjects.length}</Text>
            </View>
            <Text style={styles.sheetSubtitle}>Découvrez les initiatives locales</Text>

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
  container: { flex: 1, backgroundColor: '#000' },
  mapContainer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },

  // Header
  floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 },
  searchBarContainer: { paddingHorizontal: 20, marginTop: 10 },
  searchBar: {
    backgroundColor: '#FFF', borderRadius: 30, paddingVertical: 8, paddingHorizontal: 15,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 6,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333', height: 40 },
  filterButton: { backgroundColor: '#397262', padding: 8, borderRadius: 50 },
  filterButtonActive: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#397262' },

  // Filtres
  filtersWrapper: { marginTop: 10 },
  filtersContent: { paddingHorizontal: 20, paddingBottom: 5 },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.9)', paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 20, marginRight: 8, shadowOpacity: 0.05, elevation: 2,
  },
  filterChipSelected: { backgroundColor: '#397262' },
  filterText: { color: '#397262', fontWeight: '600', fontSize: 13 },
  filterTextSelected: { color: '#FFF' },

  // Bottom Sheet
  sheetBackground: {
    backgroundColor: '#f5f9f3', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10,
  },
  handleIndicator: { backgroundColor: '#4e807650', width: 40 },
  contentContainer: { flex: 1, paddingHorizontal: 20 },
  sheetHeaderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  sheetTitle: { fontSize: 20, fontWeight: '700', color: '#397262' },
  sheetCount: {
    marginLeft: 8, backgroundColor: '#e5f3f5', color: '#447fab',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 12, fontWeight: 'bold', overflow: 'hidden',
  },
  sheetSubtitle: { fontSize: 13, color: '#4e8076', marginBottom: 15, marginTop: 2 },
  listContent: { paddingBottom: 40 },

  // Cards
  projectCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5f3f5',
  },
  imagePlaceholder: { width: 60, height: 60, backgroundColor: '#f5f9f3', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, marginLeft: 15 },
  projectName: { fontWeight: '700', color: '#397262', fontSize: 15 },
  budgetRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4, justifyContent: 'space-between', paddingRight: 10 },
  projectBudget: { color: '#447fab', fontSize: 13, fontWeight: '600' },
  smallBadge: { backgroundColor: '#f0f0f0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  smallBadgeText: { fontSize: 10, color: '#666', fontWeight: '600' },
  projectDesc: { color: '#4e8076', fontSize: 12, lineHeight: 16 },
});