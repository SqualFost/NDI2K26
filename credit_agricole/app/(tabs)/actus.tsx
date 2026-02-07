import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, Pressable, Platform } from 'react-native';
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

const { width } = Dimensions.get('window');
const numColumns = 2;
const CARD_WIDTH = width * 0.43;
const CARD_HEIGHT = (CARD_WIDTH * 2) / 3;

const DATA = Array.from({ length: 14 }).map((_, i) => ({
    id: `${i}`,
    category: "ACTUALITÉ",
    title: `Article #${i + 1}`,
    description: "Détails de l'actualité locale et des initiatives régionales.",
    img: `https://picsum.photos/id/${i + 165}/200/200`,
    randomRotate: (Math.random() - 0.5) * 1.5,
    randomY: (Math.random() - 0.5) * 6,
}));

const NewsCard = ({ item }: { item: any }) => {
    const [liked, setLiked] = useState(false);
    const heartScale = useSharedValue(1);

    const onDoubleTap = (event: any) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            setLiked(!liked);
            heartScale.value = withSequence(withSpring(1.4), withSpring(1));
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(liked ? '#BFE7E8' : '#ffffff'),
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
            {/* CONSEIL : On met l'ombre sur un View statique et l'animation sur un View enfant
        pour éviter les bugs de rendu Reanimated/Shadow
      */}
            <View style={styles.shadowWrapper}>
                <Animated.View style={[styles.card, animatedStyle]}>
                    <View style={styles.topRow}>
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: item.img }} style={styles.tinyImg} />
                        </View>
                        <Pressable
                            onPress={() => {
                                setLiked(!liked);
                                heartScale.value = withSequence(withSpring(1.3), withSpring(1));
                            }}
                            style={styles.heartCircle}
                        >
                            <Animated.View style={heartAnimatedStyle}>
                                <Ionicons
                                    name={liked ? "heart" : "heart-outline"}
                                    size={16}
                                    color={liked ? "#007d8f" : "#999"}
                                />
                            </Animated.View>
                        </Pressable>
                    </View>

                    <View style={styles.infoContainer}>
                        <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
                        <ThemedText style={styles.productTitle} numberOfLines={1}>{item.title}</ThemedText>
                        <ThemedText style={styles.productDesc} numberOfLines={2}>{item.description}</ThemedText>
                    </View>
                </Animated.View>
            </View>
        </TapGestureHandler>
    );
};

export default function HomeScreen() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <ThemedText style={styles.mainTitle}>Actus</ThemedText>
                    <View style={styles.headerUnderline} />
                </View>

                <Animated.FlatList
                    data={DATA}
                    numColumns={numColumns}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.scrollContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <NewsCard item={item} />}
                />
            </ThemedView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7F9', paddingTop: 40 },
    header: { paddingHorizontal: 20, marginBottom: 20, marginTop: 10 },
    mainTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
    headerUnderline: { width: 30, height: 4, backgroundColor: '#007d8f', marginTop: 4, borderRadius: 2 },
    scrollContent: { paddingBottom: 50, paddingHorizontal: 15 },
    columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },

    // ✅ SOLUTION AU BUG : Wrapper statique pour l'ombre
    shadowWrapper: {
        width: CARD_WIDTH,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },

    card: {
        width: '100%',
        height: CARD_HEIGHT + 20,
        borderRadius: 16,
        padding: 12,
        // ✅ On privilégie la bordure pour la structure, l'ombre est dans le wrapper
        borderWidth: 1,
        borderColor: '#EBF0F3',
        overflow: 'hidden',
    },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    imageWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F0F4F8',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E1E8ED'
    },
    tinyImg: { width: '100%', height: '100%' },
    heartCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F8FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: { flex: 1 },
    categoryText: { fontSize: 8, fontWeight: '800', color: '#007d8f', marginBottom: 4 },
    productTitle: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
    productDesc: { fontSize: 10, color: '#7C878E', marginTop: 2, lineHeight: 14 },
});