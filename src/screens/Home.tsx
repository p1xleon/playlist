import { Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';

//navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/Navigator';

//auth
import auth from '@react-native-firebase/auth';

//custom components
import SearchBar from '../components/SearchBar';
import Carousel from '../components/Carousel';
import Header from '../components/Header';
import { ReGame, getUserLists } from '../services/auth/firebase';
import { Loading } from '../components/Loading';
import { dashList } from '../data/ListMaps';

//styles
import { pxStyles } from '../theme/useTheme';

//type cheking
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>

//main functional component
const Home = ({ navigation }: HomeProps) => {
  const styles = useStyles();

  const [games, setGames] = useState<{ [key: string]: ReGame[] }>({});
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser?.uid;

  //list order for sorting
  const listOrder = ['backlog', 'playlist', 'completed', 'wishlist', 'dropped'];

  useEffect(() => {
    if (userId) {
      const unsubscribe = getUserLists(userId, (listData) => {
        const gamesByList: { [key: string]: ReGame[] } = {};
        listData.forEach((list: any) => {
          const sortedGames = list.games.sort((a: ReGame, b: ReGame) => {
            return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
          });
          gamesByList[list.id] = sortedGames.slice(0, 5); //select 5 games from the list
        });
        setGames(gamesByList);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [userId]);

  if (loading) {
    return <Loading />
  }

  //sort lists based on order
  const sortedListKeys = Object.keys(games).sort((a, b) => {
    const indexA = listOrder.indexOf(a);
    const indexB = listOrder.indexOf(b);
    return indexA - indexB;
  });

  // Check if there are no games in any list
  const noGamesInAnyList = sortedListKeys.every((listName) => games[listName].length === 0);

  return (
    <View style={styles.container}>
      <Header title='Playlist' />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar />
        {noGamesInAnyList ? (
          <View style={styles.noGamesContainer}>
            <Text style={styles.noGamesText}>No games in your collection yet.</Text>
            <Text style={styles.noGamesText}>Search for games or go to Discover to add some games to your collection.</Text>
          </View>
        ) : (
          <View style={{ marginVertical: 15 }}>
            {sortedListKeys.map((listName) => (
              games[listName].length > 0 && (
                <View key={listName} style={styles.listSection}>
                  <Text style={styles.listTitle}>{dashList[listName]}</Text>
                  <Carousel games={games[listName]} />
                </View>
              )
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const useStyles = pxStyles((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: theme.background,
  },
  listTitle: {
    color: theme.secondary,
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 7,
  },
  listSection: {
    marginBottom: 20
  },
  button: {
    backgroundColor: 'gold',
    padding: 10,
  },
  noGamesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noGamesText: {
    color: theme.secondary,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600'
  },
}));

export default Home;
