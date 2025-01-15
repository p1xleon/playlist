import { Image, Pressable, Text, View } from 'react-native';
import React from 'react';


//navigation
import { NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../routes/Navigator';

//utils and functions
import { Game } from '../types/Game';
import { platformIcons } from '../data/iconMaps';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//components
import { Button } from './Utils';

import { pxStyles } from '../theme/useTheme';

interface GameCardProps {
    game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
    const styles = useStyles();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const platforms =
        game.parent_platforms && game.parent_platforms.length > 0 ?
            game.parent_platforms.map(platform => {
                const iconName = platformIcons[platform.platform.name as keyof typeof platformIcons] ||
                    platformIcons.defaultIcon;
                return <Icon key={platform.platform.id} name={iconName} size={22} style={styles.icon} />
            }) : null;

    const releaseDate = game.released === "TBA" ? "TBA" : game.released?.slice(0, 4);

    const openGame = () => {
        navigation.dispatch(StackActions.push('GameDetails', { game }));
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={openGame}>
                <Image source={game.background_image ? { uri: game.background_image } : require('../assets/images/noImg.jpg')} style={{ width: '100%', height: 200, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} />
                <View style={styles.infos}>
                    <Text style={styles.title}>{game.name}
                        <Text style={styles.text}>{releaseDate ? `(${releaseDate})` : ""}</Text>
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={styles.badgeStrip}>
                            {platforms}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='star' size={20} color={'gold'} />
                            <Text style={styles.rating}>{game.rating}</Text>
                            {/* <View style={{ flexDirection: 'row' }}>
                            <Image source={{ uri: 'https://img.icons8.com/?size=48&id=YaSzxFsOJh3a&format=png' }} style={{ width: 20, height: 20 }} />
                        </View> */}
                        </View>
                    </View>
                    <Button
                        title='ADD TO COLLECTION'
                        onPress={openGame}
                    />
                </View>
            </Pressable>
        </View>
    )
}

//card for discover component
const DiscoverCard: React.FC<GameCardProps> = ({ game }) => {
    const styles = useStyles();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const platforms =
        game.parent_platforms && game.parent_platforms.length > 0 ?
            game.parent_platforms.map(platform => {
                const iconName = platformIcons[platform.platform.name as keyof typeof platformIcons] ||
                    platformIcons.defaultIcon;
                return <Icon key={platform.platform.id} name={iconName} size={22} style={styles.icon} />
            }) : null;

    const releaseDate = game.released === "TBA" ? "TBA" : game.released?.slice(0, 4);

    const openGame = () => {
        navigation.dispatch(StackActions.push('GameDetails', { game }));
        // console.log(game.additions_count)
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={openGame}>
                <Image source={game.background_image ? { uri: game.background_image } : require('../assets/images/noImg.jpg')} style={{
                    width: '100%', height: 200, borderTopLeftRadius: 5, borderTopRightRadius: 5
                }} />
                <View style={styles.infos}>
                    <Text style={styles.title}>{game.name}
                        <Text style={styles.text}>{releaseDate ? `(${releaseDate})` : ""}</Text>
                    </Text>
                    <View style={styles.badgeStrip}>
                        <View style={styles.badge}>
                            {platforms}
                        </View>
                        <View style={styles.badge}>
                            <Icon name='star' size={20} color={'gold'} />
                            <Text style={styles.rating}>{game.rating}</Text>
                        </View>
                        <View style={styles.badge}>
                            <Image source={{ uri: 'https://img.icons8.com/?size=48&id=YaSzxFsOJh3a&format=png' }} style={{ width: 20, height: 20 }} />
                            <Text style={styles.rating}> {game.metacritic || 'NA'}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        </View>
    )
}


const useStyles = pxStyles((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.card,
        elevation: 2,
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 2
    },
    text: {
        color: theme.secondary
    },
    infos: {
        padding: 10,
        // alignItems: 'center'
    },
    title: {
        color: theme.primary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    rating: {
        color: theme.primary,
        fontWeight: '600'
    },
    badgeStrip: {
        flexDirection: 'row',
        marginVertical: 5,
        height: 'auto',
        // backgroundColor: '#050505',
        // borderRadius: 3,
        // paddingHorizontal: 5
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.card,
        elevation: 5,
        paddingVertical: 2,
        paddingHorizontal: 7,
        marginEnd: 5,
        borderRadius: 3
    },
    icon: {
        color: theme.primary
    }
}));

export { GameCard, DiscoverCard };