import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions, 
  Image, 
  Pressable, 
  Platform, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { GestureHandlerRootView, TapGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// 1. IMPORTS API
import { getAllProjets } from '@/api/projet'; 
// IMPORTANT : Change ce chemin selon où tu as mis ton URL (ex: 'http://10.0.2.2:3000')
import { API_URL, BASE_URL } from '@/api/url'; 

const { width } = Dimensions.get('window');
const numColumns = 2;
const CARD_WIDTH = width * 0.43;
// On augmente la hauteur (ex: 0.65 fois la largeur de l'écran ou un ratio plus grand)
const CARD_HEIGHT = width * 0.6;

// --- TYPES ---
type ProjectUI = {
    id: string;
    category: string;
    title: string;
    description: string;
    img: string;
    randomRotate: number;
    randomY: number;
};

// --- COMPOSANT CARTE ---
const NewsCard = ({ item }: { item: ProjectUI }) => {
    
    const [liked, setLiked] = useState(false);
    const heartScale = useSharedValue(1);

    const onDoubleTap = (event: any) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            setLiked(!liked);
            heartScale.value = withSequence(withSpring(1.4), withSpring(1));
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        // On retire le changement de couleur de fond car l'image prend toute la place
        transform: [
            { rotate: `${item.randomRotate}deg` },
            { translateY: item.randomY }
        ],
    }));

    const heartAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }]
    }));

    return (
        <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
            <View style={styles.shadowWrapper}>
                <Animated.View style={[styles.card, animatedStyle]}>
                    
                    {/* 1. GRANDE IMAGE (Prend le haut de la carte) */}
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: item.img }} 
                            style={styles.cardImage} 
                            resizeMode="cover"
                        />
                        {/* Coeur en superposition */}
                        <Pressable
                            onPress={() => {
                                setLiked(!liked);
                                heartScale.value = withSequence(withSpring(1.3), withSpring(1));
                            }}
                            style={styles.heartOverlay}
                        >
                            <Animated.View style={heartAnimatedStyle}>
                                <Ionicons
                                    name={liked ? "heart" : "heart-outline"}
                                    size={20}
                                    color={liked ? "#FF4D4D" : "#FFF"} // Rouge si liké, Blanc sinon
                                />
                            </Animated.View>
                        </Pressable>
                    </View>

                    {/* 2. INFOS (En dessous) */}
                    <View style={styles.infoContainer}>
                        <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
                        <ThemedText style={styles.productTitle} numberOfLines={2}>{item.title}</ThemedText>
                        {/* On affiche la description seulement s'il reste de la place, ou on l'enlève pour épuré */}
                        <ThemedText style={styles.productDesc} numberOfLines={1}>{item.description}</ThemedText>
                    </View>

                </Animated.View>
            </View>
        </TapGestureHandler>
    );
};
// --- ECRAN PRINCIPAL ---
export default function HomeScreen() {
    const [data, setData] = useState<ProjectUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const apiData = await getAllProjets();
            
           // Dans HomeScreen.tsx

const formattedData: ProjectUI[] = apiData.map((item: any, index: number) => {
    
    // 1. Image par défaut (Lorem Picsum)
    let finalImageUrl = `https://picsum.photos/id/${(index % 50) + 150}/200/200`;

    // 2. Récupération des images du projet
    // Sequelize renvoie souvent 'Images' (Majuscule) ou 'images' (minuscule) selon la config
    const imagesDuProjet = item.Images || item.images || [];

    if (imagesDuProjet.length > 0) {
        // On prend la principale ou la première
        const imageObj = imagesDuProjet.find((img: any) => img.isMain) || imagesDuProjet[0];
        
        if (imageObj && imageObj.url) {
            // Si l'URL commence par 'http', c'est une image externe (CDN)
            if (imageObj.url.startsWith('http')) {
                finalImageUrl = imageObj.url;
            } 
            // Si l'URL est locale (ex: /images/projets/photo.png)
           else {
                const cleanPath = imageObj.url.startsWith('/') ? imageObj.url : `/${imageObj.url}`;
                
                // CORRECTION ICI : On utilise BASE_URL au lieu de API_URL
                finalImageUrl = `${BASE_URL}${cleanPath}`;
            }
        }
    }

    return {
        id: item.id.toString(),
        category: item.categorie ? item.categorie.toUpperCase() : "PROJET", 
        title: item.nom, 
        description: item.description,
        img: finalImageUrl, 
        randomRotate: (Math.random() - 0.5) * 1.5,
        randomY: (Math.random() - 0.5) * 6,
    };
});

            setData(formattedData);
        } catch (error) {
            console.error("Erreur chargement home:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <ThemedText style={styles.mainTitle}>Actus</ThemedText>
                    <View style={styles.headerUnderline} />
                </View>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#007d8f" />
                    </View>
                ) : (
                    <Animated.FlatList
                        data={data}
                        numColumns={numColumns}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.scrollContent}
                        columnWrapperStyle={styles.columnWrapper}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <NewsCard item={item} />}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007d8f']} />
                        }
                    />
                )}
            </ThemedView>
        </GestureHandlerRootView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7F9', paddingTop: 40 },
    header: { paddingHorizontal: 20, marginBottom: 20, marginTop: 10 },
    mainTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
    headerUnderline: { width: 30, height: 4, backgroundColor: '#007d8f', marginTop: 4, borderRadius: 2 },
    
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    scrollContent: { paddingBottom: 50, paddingHorizontal: 15 },
    columnWrapper: { justifyContent: 'space-between', marginBottom: 25 }, // Plus d'espace vertical entre les cartes

    shadowWrapper: {
        width: CARD_WIDTH,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 5,
            },
        }),
    },

    card: {
        width: '100%',
        height: CARD_HEIGHT,
        borderRadius: 20, // Plus arrondi
        backgroundColor: '#FFF',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EBF0F3',
    },

    // --- NOUVEAUX STYLES IMAGE ---
    imageContainer: {
        width: '100%',
        height: '65%', // L'image prend 65% de la hauteur de la carte
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    heartOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.3)', // Fond semi-transparent pour voir le coeur sur n'importe quelle image
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- STYLES INFO ---
    infoContainer: { 
        flex: 1, 
        padding: 12, 
        justifyContent: 'center' 
    },
    categoryText: { 
        fontSize: 10, 
        fontWeight: '800', 
        color: '#007d8f', 
        marginBottom: 4,
        textTransform: 'uppercase'
    },
    productTitle: { 
        fontSize: 14, 
        fontWeight: '700', 
        color: '#1A1A1A',
        lineHeight: 18,
        marginBottom: 4
    },
    productDesc: { 
        fontSize: 11, 
        color: '#7C878E', 
        lineHeight: 14 
    },
});