import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Region } from 'react-native-maps';

// Import du composant carte
import { MapComp, Project } from '@/components/carte_comp';
import { getAllProjets } from '@/api/projet';

// --- DONNÉES ---


const CATEGORIES = ['Tous', 'Ecologie', 'Social', 'Sport', 'Transport'];

export default function HomeScreen() {
  // États
  const [projects, setProjects] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showFilters, setShowFilters] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);

  const fetchProjects = async () => {
    const rep = await getAllProjets();
    setProjects(rep);
  }

  useEffect(() => {
    fetchProjects();
  }, []);


  // --- FILTRAGE POUR LA CARTE (Texte + Catégorie uniquement) ---
  const mapMarkers = useMemo(() => {
    return projects.filter((item) => {
      const matchesText = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
      return matchesText && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  // --- FILTRAGE POUR LA LISTE (Texte + Catégorie + RÉGION VISIBLE) ---
  const listProjects = useMemo(() => {
    return mapMarkers.filter((item) => {
      // Si la carte n'est pas encore chargée, on montre tout ce qui correspond aux filtres
      if (!currentRegion) return true;

      // Calcul des bordures de l'écran
      const minLat = currentRegion.latitude - (currentRegion.latitudeDelta / 2);
      const maxLat = currentRegion.latitude + (currentRegion.latitudeDelta / 2);
      const minLng = currentRegion.longitude - (currentRegion.longitudeDelta / 2);
      const maxLng = currentRegion.longitude + (currentRegion.longitudeDelta / 2);

      // On garde si le projet est dans l'écran
      return (
          item.lat >= minLat &&
          item.lat <= maxLat &&
          item.lng >= minLng &&
          item.lng <= maxLng
      );
    });
  }, [mapMarkers, currentRegion]);

  // Refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // Gestion Clic
  const handleMarkerPress = (project: Project) => {
    Alert.alert(project.name, `${project.desc}\nBudget: ${project.budget}`);
  };

  // Rendu Liste
  const renderItem = useCallback(({ item }: { item: Project }) => (
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

        {/* 1. CARTE (Affiche tous les projets filtrés, même hors écran pour savoir où aller) */}
        <View style={styles.mapContainer}>
          <MapComp
              markers={mapMarkers}
              onMarkerPress={handleMarkerPress}
              onRegionChange={setCurrentRegion} // Met à jour la zone visible
          />
        </View>

        {/* 2. HEADER */}
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
                          // CORRECTION DU BUG DE CRASH ICI
                          onPress={() => {
                            if (selectedCategory !== cat) setSelectedCategory(cat);
                          }}
                      >
                        <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextSelected]}>{cat}</Text>
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
                {listProjects.length > 0 ? "Dans cette zone" : "Aucun projet ici"}
              </Text>
              <Text style={styles.sheetCount}>{listProjects.length}</Text>
            </View>
            <Text style={styles.sheetSubtitle}>Déplacez la carte pour voir plus</Text>

            <BottomSheetFlatList
                data={listProjects} // Affiche uniquement ce qui est dans l'écran
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