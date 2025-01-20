import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';

//firebase
import auth from '@react-native-firebase/auth';
import {GameProps, ReGame, getAllFavorites, getUserLists, removeFavorite} from '../services/auth/firebase';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes/Navigator';

//utils
import {listColors, listSort} from '../data/ListMaps';
import {getRelativeTime} from '../utils/dateTime';

//components
import SearchBar from '../components/SearchBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {pxStyles} from '../theme/useTheme';
import {Loading} from '../components/Loading';
import Snackbar from 'react-native-snackbar';

type FavoritesProps = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

const Favorites = ({navigation}: FavoritesProps) => {
  const styles = useStyles();

  const [games, setGames] = useState<ReGame[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        if (userId) {
          const games = await getAllFavorites(userId);
          setGames(games);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [userId]);

  //function to delete games from favorites
  const handleDeleteGame = async (gameId: number) => {
    try {
        await removeFavorite(userId, gameId);
        setGames((prevGames) => prevGames.filter((game) => game.id !== gameId ))
    } catch (error) {
        Snackbar.show({
            text: 'Failed to remove from favorites',
            duration: Snackbar.LENGTH_SHORT,
          }); 
    }
  }

  //sorting function
  //do not remove this, stuff breaks if removed, dont understand why
  //something wrong with types, check in future
  const sortGames = (games: any[]) => {
    return games;
  };
  const sortedGames = sortGames(games);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* <FloatBack onPress={() => navigation.goBack()}/> */}
      {/* <View style={{paddingHorizontal: 10}}>
        <SearchBar />
      </View> */}

      <View style={styles.header}>
        <Text style={[styles.title, {fontSize: 22}]}>Your Favorite Games</Text>
        <Text style={styles.count}>{games.length} Titles</Text>
      </View>
      {games.length === 0 ? (
        <Text style={styles.emptyText}>
          No favorites added. Go to your lists to add a game.
        </Text>
      ) : (
        <>
          <FlatList
            data={sortedGames}
            keyExtractor={game => game.id.toString()}
            renderItem={({item: game}) => (
              <View style={styles.gameItem}>
                <TouchableOpacity
                  style={styles.gameCard}
                  onPress={() => {
                    const {addedDate, ...gameDetails} = game;
                    navigation.navigate('GameDetails', {game: gameDetails});
                  }}>
                  <Image
                    source={{
                      uri:
                        game.background_image ||
                        'https://cdn-icons-png.freepik.com/256/5726/5726517.png?semt=ais_hybrid',
                    }}
                    style={{width: 50, height: 50, borderRadius: 2}}
                  />
                  <View style={styles.gameDetails}>
                    <Text style={styles.title} numberOfLines={1}>
                      {game.name}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.info}>
                        {game.released.slice(0, 4)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <Pressable onPress={() => handleDeleteGame(game.id)}>
                  <Icon
                    name="close-circle-outline"
                    color="#ff0000"
                    size={24}
                    style={{marginRight: 20}}
                  />
                </Pressable>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const useStyles = pxStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontSize: 18,
    color: theme.secondary,
  },
  gameCard: {
    flexDirection: 'row',
    padding: 10,
    flex: 1,
  },
  gameDetails: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: theme.primary,
    fontWeight: '900',
    fontSize: 16,
  },
  emptyText: {
    color: theme.secondary,
    borderRadius: 1,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  info: {
    color: theme.secondary,
    fontWeight: '400',
  },
}));

export default Favorites;
