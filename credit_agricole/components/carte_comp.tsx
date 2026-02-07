import React, { useRef, useState, useEffect, memo } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';

export interface Project {
  id: string;
  name: string;
  budget: string;
  desc: string;
  category: string;
  lat: number;
  lng: number;
}

interface MapProps {
  markers?: Project[];
  onMarkerPress?: (item: Project) => void;
  onRegionChange?: (region: Region) => void;
}

// --- 1. COMPOSANT MARQUEUR ISOLÉ (Anti-Freeze / Anti-Crash) ---
const CustomMarker = memo(({ project, onPress }: { project: Project, onPress: () => void }) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    // Stop le rendu après 100ms pour figer l'image et libérer le CPU
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
      <Marker
          coordinate={{ latitude: project.lat, longitude: project.lng }}
          onPress={onPress}
          tracksViewChanges={tracksViewChanges}
          stopPropagation={true}
      >
        <View style={styles.markerContainer}>
          <View style={styles.pillContainer}>
            {/* PRIX (Vert) */}
            <View style={styles.priceSection}>
              <Text style={styles.priceText}>{project.budget}</Text>
            </View>
            {/* NOM (Blanc) */}
            <View style={styles.nameSection}>
              <Text style={styles.nameText} numberOfLines={1}>
                {project.name}
              </Text>
            </View>
          </View>
          {/* Flèche */}
          <View style={styles.arrow} />
        </View>
      </Marker>
  );
});

// --- 2. COMPOSANT CARTE PRINCIPAL ---
export function MapComp({ markers = [], onMarkerPress, onRegionChange }: MapProps) {
  const mapRef = useRef<MapView>(null);

  const INITIAL_REGION = {
    latitude: 43.7000,
    longitude: 7.2600, // Centré sur Nice
    latitudeDelta: 0.15, // Zoom assez proche
    longitudeDelta: 0.15,
  };

  return (
      <View style={styles.container}>
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={INITIAL_REGION}
            provider={PROVIDER_DEFAULT} // Utilise Apple Maps sur iOS (Fluide)

            // Optimisations
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsPointsOfInterest={false}
            showsScale={false}
            showsTraffic={false}
            rotateEnabled={false}
            pitchEnabled={false}
            minZoomLevel={8.5} // Empêche de trop dézoomer

            // C'est ici qu'on détecte le mouvement pour filtrer la liste
            onRegionChangeComplete={(region) => {
              if (onRegionChange) onRegionChange(region);
            }}
        >
          {markers.map((project) => (
              <CustomMarker
                  key={project.id}
                  project={project}
                  onPress={() => onMarkerPress && onMarkerPress(project)}
              />
          ))}
        </MapView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },

  // Styles Marqueurs (Airbnb)
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  priceSection: {
    backgroundColor: '#397262', // Vert CA
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  nameSection: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    maxWidth: 120,
  },
  nameText: { color: '#333', fontSize: 12, fontWeight: '600' },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#397262',
    marginTop: -1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
});