import React, { useRef, useState, useEffect, memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';

export type Project = {
  id: number;
  nom: string;
  description: string;
  budget: number;
  categorie: string;
  latitude: number;
  longitude: number;
};

interface MapProps {
  markers: Project[];
  onMarkerPress?: (item: Project) => void;
  onRegionChange?: (region: Region) => void;
  initialRegion?: Region;
}

// --- MARQUEUR ---
const CustomMarker = memo(
    ({ project, onPress }: { project: Project; onPress: () => void }) => {
      const [tracksViewChanges, setTracksViewChanges] = useState(true);

      useEffect(() => {
        const timer = setTimeout(() => setTracksViewChanges(false), 100);
        return () => clearTimeout(timer);
      }, []);

      return (
          <Marker
              coordinate={{
                latitude: project.latitude,
                longitude: project.longitude,
              }}
              onPress={onPress}
              tracksViewChanges={tracksViewChanges}
          >
            <View style={styles.markerContainer}>
              <View style={styles.pillContainer}>
                <View style={styles.priceSection}>
                  <Text style={styles.priceText}>{project.categorie}</Text>
                </View>
                <View style={styles.nameSection}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {project.nom}
                  </Text>
                </View>
              </View>
              <View style={styles.arrow} />
            </View>
          </Marker>
      );
    }
);

// --- CARTE ---
export function MapComp({
                          markers,
                          onMarkerPress,
                          onRegionChange,
                          initialRegion,
                        }: MapProps) {
  const mapRef = useRef<MapView>(null);

  const DEFAULT_REGION: Region = initialRegion ?? {
    latitude: 43.1167,
    longitude: 5.93333,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  // 🔴 POINT CRITIQUE : on pousse la région dès le montage
  useEffect(() => {
    onRegionChange?.(DEFAULT_REGION);
  }, []);

  return (
      <View style={styles.container}>
        <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={DEFAULT_REGION}
            showsUserLocation
            rotateEnabled={false}
            pitchEnabled={false}
            onRegionChangeComplete={(region) => onRegionChange?.(region)}
        >
          {markers.map((project) => (
              <CustomMarker
                  key={project.id}
                  project={project}
                  onPress={() => onMarkerPress?.(project)}
              />
          ))}
        </MapView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },

  markerContainer: { alignItems: 'center' },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    overflow: 'hidden',
  },
  priceSection: {
    backgroundColor: '#397262',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  priceText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  nameSection: { paddingVertical: 6, paddingHorizontal: 10, maxWidth: 120 },
  nameText: { color: '#333', fontSize: 12, fontWeight: '600' },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#397262',
    marginTop: -1,
  },
});