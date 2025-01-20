import React, {useEffect, useState} from 'react';
import {Text, View, FlatList, Image, TouchableOpacity} from 'react-native';

//firebase
import auth from '@react-native-firebase/auth';
import {ReGame, getUserLists} from '../services/auth/firebase';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes/Navigator';

//utils
import {listColors, listSort} from '../data/ListMaps';
import {getRelativeTime} from '../utils/dateTime';

//components
import SearchBar from '../components/SearchBar';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {pxStyles} from '../theme/useTheme';
import {Loading} from '../components/Loading';

type CollectionProps = NativeStackScreenProps<RootStackParamList, 'Collection'>;

const Collection = ({navigation}: CollectionProps) => {
  const styles = useStyles();

  const [allGames, setAllGames] = useState<{game: ReGame; listId: string}[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState<string>('name');

  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (userId) {
      const unsubscribe = getUserLists(userId, listsData => {
        // Collect all games into a single array
        const games = listsData.flatMap(list =>
          list.games.map((game: any) => ({
            ...game,
            listName: list.id,
          })),
        );
        setAllGames(games);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  //sorting function
  const sortGames = (games: any[]) => {
    return games.sort((a, b) => {
      switch (sortCriteria) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'addedDate':
          return (
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          );
        case 'listName':
          return a.listName.localeCompare(b.listName);
      }
    });
  };
  const toggleSortCriteria = () => {
    const criteria = ['name', 'addedDate', 'listName'];
    const currentIndex = criteria.indexOf(sortCriteria);
    const nextIndex = (currentIndex + 1) % criteria.length;
    setSortCriteria(criteria[nextIndex]);
  };

  const sortedGames = sortGames(allGames);
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
        <Text style={[styles.title, {fontSize: 22}]}>All Games</Text>
        <Text style={styles.count}>{allGames.length} Titles</Text>
      </View>

      <TouchableOpacity style={styles.sortButton} onPress={toggleSortCriteria}>
        <Icon name="arrow-right-arrow-left" size={14} style={styles.icon} />
        <Text style={styles.sortText}>{listSort[sortCriteria]}</Text>
      </TouchableOpacity>

      <FlatList
        data={sortedGames}
        keyExtractor={game => game.id.toString()}
        renderItem={({item: game}) => (
          <TouchableOpacity
            style={styles.gameCard}
            onPress={() => {
              const {addedDate, ...gameDetails} = game;
              navigation.navigate('GameDetails', {game: gameDetails});
            }}>
            <Image
              source={{uri: game.background_image}}
              style={{width: 50, height: 50, borderRadius: 2}}
            />
            <View style={styles.gameDetails}>
              <Text style={styles.title} numberOfLines={1}>
                {game.name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[styles.badge, {color: listColors[game.listName]}]}>
                  {game.listName.charAt(0).toUpperCase() +
                    game.listName.slice(1)}
                  <Text style={styles.date}>
                    {' '}
                    | {getRelativeTime(new Date(game.addedDate))}
                  </Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
  count: {
    fontSize: 18,
    color: theme.primary,
    fontWeight: '800',
  },
  gameCard: {
    flexDirection: 'row',
    padding: 10,
  },
  gameDetails: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    color: theme.primary,
    fontWeight: '900',
    fontSize: 16,
  },
  date: {
    color: theme.secondary,
  },
  badge: {
    borderRadius: 1,
    fontWeight: '600',
    marginRight: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginHorizontal: 10,
  },
  sortText: {
    marginRight: 5,
    fontSize: 14,
    color: theme.secondary,
    fontWeight: '900',
    marginLeft: 5,
  },
  icon: {
    color: theme.secondary,
    transform: [{rotate: '90deg'}],
  },
}));

export default Collection;
