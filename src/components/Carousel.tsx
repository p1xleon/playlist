import { Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';

//navigation
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../routes/Navigator';

//firebase
import { ReGame } from '../services/auth/firebase';

//hooks and functions
import { getRelativeTime } from '../utils/dateTime';

import { pxStyles } from '../theme/useTheme';

interface CarouselProps {
    games: ReGame[];
}

const Carousel: React.FC<CarouselProps> = ({ games }) => {
    const styles = useStyles();

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemWidth = Dimensions.get('window').width * 0.87;
    const flatListRef = useRef<FlatList<ReGame>>(null);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / itemWidth);
        setCurrentIndex(index);
    };

    const handleIndicatorPress = (index: number) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index });
            setCurrentIndex(index);
        }
    };
    const handleGamePress = (game: ReGame) => {
        const { addedDate, ...gameDetails } = game;
        navigation.navigate('GameDetails', { game: gameDetails });
    };
    const renderItem = ({ item }: { item: ReGame }) => (
        <View style={styles.gameItem}>
            <Image source={{ uri: item.background_image || 'https://cdn-icons-png.freepik.com/256/5726/5726517.png?semt=ais_hybrid' }} style={{ flex: 1, resizeMode: 'cover', borderRadius: 5 }} />
            <TouchableOpacity onPress={() => handleGamePress(item)}
            >
                <View style={{ marginVertical: 5 }}>
                    <Text style={styles.gameTitle} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.gameDate} numberOfLines={1}>{getRelativeTime(item.addedDate)}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={games}
                ref={flatListRef}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={itemWidth}
                snapToAlignment='center'
            />
            <View style={styles.indicatorContainer}>
                {games.map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => handleIndicatorPress(index)}>
                        <View
                            style={[styles.indicator, index === currentIndex ? styles.active : styles.inactive]}></View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}


const useStyles = pxStyles((theme) => ({
    container: {
        alignItems: 'center',
    },
    gameItem: {
        width: Dimensions.get('window').width * 0.9,
        height: 240,
        overflow: 'hidden',
        borderRadius: 2,
        marginEnd: 10,
    },
    gameTitle: {
        fontSize: 18,
        color: theme.primary,
        fontWeight: '900',
    },
    gameDate: {
        fontSize: 16,
        color: theme.secondary,
        fontWeight: 'bold',
    },
    indicatorContainer: {
        flexDirection: 'row',
    },
    indicator: {
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 5
    },
    active: {
        backgroundColor: theme.primary,
        width: 6,
        height: 6,
    },
    inactive: {
        backgroundColor: theme.secondary,
    },
}));

export default Carousel;
