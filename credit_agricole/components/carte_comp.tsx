import React, { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

interface Project {
  id: string;
  name: string;
  budget: string;
  lat: number;
  lng: number;
}

interface MapProps {
  markers?: Project[];
  onMarkerPress?: (item: Project) => void;
}

export function MapComp({ markers = [], onMarkerPress }: MapProps) {
  const mapRef = useRef<MapView>(null);

  const INITIAL_REGION = {
    latitude: 43.7000,
    longitude: 7.1500,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
      <View style={styles.container}>
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={INITIAL_REGION}
            provider={PROVIDER_DEFAULT}

            // Optimisations iOS
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsPointsOfInterest={false}
            showsScale={false}
            showsTraffic={false}
            rotateEnabled={false}
            pitchEnabled={false}
            minZoomLevel={8.5}
        >
          {markers.map((project) => (
              <Marker
                  key={project.id}
                  coordinate={{ latitude: project.lat, longitude: project.lng }}
                  onPress={() => onMarkerPress && onMarkerPress(project)}
                  tracksViewChanges={false} // Toujours vital pour éviter le freeze
                  stopPropagation={true}
              >
                {/* CONTENEUR GLOBAL DU MARQUEUR */}
                <View style={styles.markerContainer}>

                  {/* LA PILULE (PRIX + NOM) */}
                  <View style={styles.pillContainer}>

                    {/* Partie Gauche : PRIX (Fond Vert) */}
                    <View style={styles.priceSection}>
                      <Text style={styles.priceText}>{project.budget}</Text>
                    </View>

                    {/* Partie Droite : NOM (Fond Blanc) */}
                    <View style={styles.nameSection}>
                      <Text style={styles.nameText} numberOfLines={1}>
                        {project.name}
                      </Text>
                    </View>

                  </View>

                  {/* La petite flèche en bas */}
                  <View style={styles.arrow} />
                </View>
              </Marker>
          ))}
        </MapView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },

  // Conteneur pour aligner la pilule et la flèche
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // La "Pilule" principale
  pillContainer: {
    flexDirection: 'row', // Alignement horizontal
    backgroundColor: 'white',
    borderRadius: 20, // Bords très arrondis
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },

  priceSection: {
    backgroundColor: '#397262',
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Section Nom
  nameSection: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    maxWidth: 120,
  },
  nameText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },

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