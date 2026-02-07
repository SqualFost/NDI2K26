import React from 'react';
import { StyleSheet, View, Platform, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapProps {
  url: string;
  style?: ViewStyle; // Permet de passer des styles depuis le parent
}

export function MapComp({ url, style }: MapProps) {
  return (
      <View style={[styles.container, style]}>
        {Platform.OS === 'web' ? (
            <iframe
                src={url}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="map-paca"
                allow="geolocation"
            />
        ) : (
            <WebView
                source={{ uri: url }}
                style={{ flex: 1 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                geolocationEnabled={true}
                startInLoadingState={true}
                // Astuce pour que la map ne vole pas le focus trop vite
                scrollEnabled={true}
            />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Plus de hauteur fixe, on laisse le parent décider (flex: 1)
    flex: 1,
    backgroundColor: '#eee',
  },
});