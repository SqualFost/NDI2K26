import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
  Alert,
  Image
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Region } from 'react-native-maps';

// Import du composant carte
import { MapComp, Project } from '@/components/carte_comp';
import { getAllProjets } from '@/api/projet';
import { BASE_URL } from '@/api/url'; 

// --- DONNÉES ---
export type ProjectType = {
  id: number;
  nom: string;
  description: string;
  budget: number;
  categorie: string;
  latitude: number;
  longitude: number;
  img: string;
};

const CATEGORIES = ['Tous', 'Environnement', 'Social', 'Culture', 'Economie'];

export default function HomeScreen() {
  // États
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showFilters, setShowFilters] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);

  // --- RÉCUPÉRATION ET FORMATAGE DES DONNÉES ---
  const fetchProjects = async () => {
    try {
      const rep = await getAllProjets();
      
      // On vérifie que rep est bien un tableau pour éviter le crash .map
      if (!Array.isArray(rep)) {
          console.warn("L'API n'a pas renvoyé un tableau :", rep);
          return;
      }

      const formatted = rep.map((item: any, index: number) => {
          let finalImageUrl = `https://picsum.photos/id/${(index % 50) + 150}/200/200`;
          
          const imagesDuProjet = item.Images || item.images || [];

          if (imagesDuProjet.length > 0) {
              const imageObj = imagesDuProjet.find((img: any) => img.isMain) || imagesDuProjet[0];
              
              if (imageObj && imageObj.url) {
                  if (imageObj.url.startsWith('http')) {
                      finalImageUrl = imageObj.url;
                  } else {
                      const cleanPath = imageObj.url.startsWith('/') ? imageObj.url : `/${imageObj.url}`;
                      finalImageUrl = `${BASE_URL}${cleanPath}`;
                  }
              }
          }

          return {
              ...item,
              img: finalImageUrl
          };
      });

      setProjects(formatted);
    } catch (e) {
      console.error("Erreur fetch carte:", e);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);


  // --- FILTRAGE SÉCURISÉ (CORRECTION DU CRASH) ---
  const mapMarkers = useMemo(() => {
    if (!projects) return [];

    return projects.filter((item) => {
      // 1. PROTECTION CRASH : On utilise (valeur || "") pour garantir que ce soit une string
      const nameSafe = (item.nom || "").toLowerCase();
      const descSafe = (item.description || "").toLowerCase();
      const searchSafe = searchText.toLowerCase();

      const matchesText = nameSafe.includes(searchSafe) || descSafe.includes(searchSafe);
      
      // 2. Filtre catégorie
      const matchesCategory = selectedCategory === 'Tous' || item.categorie === selectedCategory;
      
      // 3. Filtre coordonnées (La map plante si lat/lng sont null)
      const hasCoords = item.latitude != null && item.longitude != null;

      return matchesText && matchesCategory && hasCoords;
    });
  }, [projects, searchText, selectedCategory]);

  // --- FILTRAGE POUR LA LISTE (Texte + Catégorie + RÉGION VISIBLE) ---
  const listProjects = useMemo(() => {
    return mapMarkers.filter((item) => {
      if (!currentRegion) return true;

      const minLat = currentRegion.latitude - (currentRegion.latitudeDelta / 2);
      const maxLat = currentRegion.latitude + (currentRegion.latitudeDelta / 2);
      const minLng = currentRegion.longitude - (currentRegion.longitudeDelta / 2);
      const maxLng = currentRegion.longitude + (currentRegion.longitudeDelta / 2);

      return (
          item.latitude >= minLat &&
          item.latitude <= maxLat &&
          item.longitude >= minLng &&
          item.longitude <= maxLng
      );
    });
  }, [mapMarkers, currentRegion]);

  // Refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // Gestion Clic
  const handleMarkerPress = (project: any) => {
    Alert.alert(project.nom || "Projet", `${project.description || "Pas de description"}\nBudget: ${project.budget || 0} €`);
  };

  // Rendu Liste
  const renderItem = useCallback(({ item }: { item: ProjectType }) => (
      <TouchableOpacity style={styles.projectCard} onPress={() => handleMarkerPress(item)}>
        <Image 
            source={{ uri: item.img }} 
            style={styles.cardImage}
            resizeMode="cover"
        />
        
        <View style={styles.cardInfo}>
          <Text style={styles.projectName}>{item.nom}</Text>
          <View style={styles.budgetRow}>
            <Text style={styles.projectBudget}>{item.budget} €</Text>
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>{item.categorie}</Text>
            </View>
          </View>
          <Text style={styles.projectDesc} numberOfLines={2}>{item.description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
      </TouchableOpacity>
  ), []);

  return (
      <GestureHandlerRootView style={styles.container}>

        {/* 1. CARTE */}
        <View style={styles.mapContainer}>
          <MapComp
              markers={mapMarkers}
              onMarkerPress={handleMarkerPress}
              onRegionChange={setCurrentRegion}
              initialRegion={{
                latitude: 43.55, 
                longitude: 6.5,
                latitudeDelta: 1.5,
                longitudeDelta: 1.5,
              }}
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
                data={listProjects}
                // Sécurité : on utilise un ID unique même si item.id est manquant (rare)
                keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
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
  cardImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 12, 
    backgroundColor: '#f5f9f3',
    borderWidth: 1,
    borderColor: '#e5f3f5'
  },
  cardInfo: { flex: 1, marginLeft: 15 },
  projectName: { fontWeight: '700', color: '#397262', fontSize: 15 },
  budgetRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4, justifyContent: 'space-between', paddingRight: 10 },
  projectBudget: { color: '#447fab', fontSize: 13, fontWeight: '600' },
  smallBadge: { backgroundColor: '#f0f0f0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  smallBadgeText: { fontSize: 10, color: '#666', fontWeight: '600' },
  projectDesc: { color: '#4e8076', fontSize: 12, lineHeight: 16 },
});