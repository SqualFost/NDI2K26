import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MapComp } from '@/components/carte_comp';
import { ThemedText } from '@/components/themed-text';

// Données fictives
const PROJECTS = [
  { id: '1', name: 'Refroidissement urbain', budget: '12 500€', desc: 'Installation de toits végétalisés sur la mairie.' },
  { id: '2', name: 'Handi-Sport 2026', budget: '8 000€', desc: 'Achat de fauteuils roulants multisports.' },
  { id: '3', name: 'Rucher Partagé', budget: '3 200€', desc: 'Installation de 5 ruches en centre-ville.' },
  { id: '4', name: 'Potager Solidaire', budget: '4 500€', desc: 'Création de parcelles cultivables pour tous.' },
  { id: '5', name: 'Piste Cyclable Sud', budget: '25 000€', desc: 'Rénovation de la piste cyclable du bord de mer.' },
  { id: '6', name: 'Atelier Numérique', budget: '2 000€', desc: 'Cours informatique pour les séniors.' },
];

export default function HomeScreen() {
// Zoom ~8.5 | Latitude ~43.8 | Longitude ~6.1
  const PACA_EMBED_URL = "https://api.maptiler.com/maps/019c3561-0ec2-7775-bce3-88c947b4d20b/?key=66qh2RWXlu4nKogaX1Ns#6/43.1257311/5.9304919";
  // Référence pour contrôler le BottomSheet si besoin
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Points d'ancrage (Snap Points) :
  // 15% : Juste le titre visible (mode carte)
  // 45% : La moitié de l'écran (mode mixte)
  // 90% : Presque tout l'écran (mode liste)
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // Rendu d'un item de la liste (Carte Projet)
  const renderItem = useCallback(({ item }: { item: typeof PROJECTS[0] }) => (
      <TouchableOpacity style={styles.projectCard}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={24} color="#4e8076" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <Text style={styles.projectBudget}>{item.budget}</Text>
          <Text style={styles.projectDesc} numberOfLines={2}>
            {item.desc}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
      </TouchableOpacity>
  ), []);

  return (
      <GestureHandlerRootView style={styles.container}>

        {/* 1. LA CARTE EN ARRIÈRE-PLAN (PLEIN ÉCRAN) */}
        <View style={styles.mapContainer}>
          <MapComp url={PACA_EMBED_URL} />
        </View>

        {/* 2. HEADER FLOTTANT (Recherche / Titre) */}
        {/* On le met en absolute pour qu'il flotte au-dessus de la map */}
        <SafeAreaView style={styles.floatingHeader} pointerEvents="box-none">
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#397262" />
            <Text style={styles.searchText}>Trouver un projet...</Text>
            <View style={styles.filterIcon}>
              <Ionicons name="options" size={16} color="#FFF" />
            </View>
          </View>
        </SafeAreaView>

        {/* 3. LE BOTTOM SHEET MAGIQUE */}
        <BottomSheet
            ref={bottomSheetRef}
            index={1} // Commence à l'index 1 (45%)
            snapPoints={snapPoints}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.sheetTitle}>Projets à proximité</Text>
            <Text style={styles.sheetSubtitle}>{PROJECTS.length} projets trouvés</Text>

            {/* Utiliser BottomSheetFlatList est CRUCIAL pour le scroll fluide */}
            <BottomSheetFlatList
                data={PROJECTS}
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
  // Map occupe tout l'espace derrière
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  // Header flottant façon Airbnb
  floatingHeader: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    zIndex: 1, // Au-dessus de la map mais en dessous du sheet s'il monte haut
  },
  searchBar: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchText: {
    flex: 1,
    marginLeft: 10,
    color: '#397262',
    fontWeight: '600',
  },
  filterIcon: {
    backgroundColor: '#397262',
    padding: 6,
    borderRadius: 50,
  },

  // Styles du Bottom Sheet
  sheetBackground: {
    backgroundColor: '#f5f9f3',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  handleIndicator: {
    backgroundColor: '#4e807650',
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#397262',
    marginTop: 5,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#4e8076',
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 40, // Espace en bas pour le scroll
  },

  // Cartes Projets
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
  projectBudget: {
    color: '#447fab',
    fontSize: 13,
    fontWeight: '600',
    marginVertical: 2,
  },
  projectDesc: {
    color: '#4e8076',
    fontSize: 12,
    lineHeight: 16,
  },
});