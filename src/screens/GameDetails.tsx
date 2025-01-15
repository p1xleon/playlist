import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ScrollView, Linking, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';

//navigation
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../routes/Navigator';

//hooks and util functions
import { useFetchScreenShots, useFetchGameDetails, useFetchGameStores, useFetchAddtions, useFetchBaseGame, useFetchSeriesGames } from '../hooks/gameHooks';
import { esrb_rating } from '../data/esrb';
import { platformIcons, storeIcons } from '../data/iconMaps';
import { listOptions, listLabels } from '../data/ListMaps';

//firebase
import { addGameToList, getGameList } from '../services/auth/firebase';
import auth from '@react-native-firebase/auth';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

//components
import { Franchise } from '../types/Game';
import SearchBar from '../components/SearchBar';
import ScreenshotsCarousel from '../components/ScreenshotCarousel';
import { GameCard } from '../components/GameCard';
import { Button } from '../components/Utils';
import Sheet, { SheetHandle } from '../components/ActionSheet';
import { RadioGroup } from '../components/Utils';
import Snackbar from 'react-native-snackbar';
import { Loading } from '../components/Loading';
import Reload from '../components/Reload';

import { pxStyles } from '../theme/useTheme';


const GameDetails: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'GameDetails'>>();
  const { game } = route.params;
  const styles = useStyles();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // State for selected list
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [listName, setListName] = useState<string | null>(null);
  // Ref for the action sheet
  const sheetRef = useRef<SheetHandle>(null);

  const [tag, setTag] = useState('');

  // Fetch game details
  const { data: gameDetails, error: gameDetailsError, isLoading: gameDetailsLoading, refetch: refetchGames } = useFetchGameDetails(game.id);
  const { data: screenshots, error: screenshotsError, isLoading: screenshotsLoading } = useFetchScreenShots(game.id);
  const { data: stores, error: storesError, isLoading: storesLoading } = useFetchGameStores(game.id);
  const { data: additions, error: additionsError, isLoading: additionsLoading } = useFetchAddtions(game.id);
  const { data: baseGame, error: baseGameError, isLoading: baseGameLoading } = useFetchBaseGame(game.id);
  const { data: series, error: seriesError, isLoading: seriesLoading } = useFetchSeriesGames(game.id);

  useEffect(() => {
    const fetchGameList = async () => {
      const userId = auth().currentUser?.uid;
      if (userId) {
        try {
          const list = await getGameList(userId, game.id);
          setListName(list);
        } catch (error) {
          // console.error('Error fetching game list status', error);
        }
      }
    };
    fetchGameList();
  }, [game.id]);


  // Render loading indicator
  if (gameDetailsLoading || screenshotsLoading || storesLoading || additionsLoading || baseGameLoading || seriesLoading) {
    return <Loading />;
  }

  //retry the games api request
  const retryFetch = () => {
    refetchGames();
  };

  // Render error message
  if (!gameDetails) {
    return (
      <Reload onPress={retryFetch} />
    );
  }

  // Function to open store link
  const openStore = (url: string) => {
    Linking.openURL(url).catch((error) => console.error('Could not open link', error));
  };

  // Render platform icons
  const platforms = game.parent_platforms?.map(platform => {
    const iconName = platformIcons[platform.platform.name as keyof typeof platformIcons] || platformIcons.defaultIcon;
    return <Icon key={platform.platform.id} name={iconName} size={22} style={styles.platIcon} />;
  }) || null;

  // Handlers for list selection and adding game to the list
  const handleListSelection = (listName: string) => {
    setSelectedList(listName);
  };
  const handleAddToCollection = async () => {
    if (!selectedList) return;
    try {
      const currentUser = auth().currentUser;
      const toastText = listLabels[selectedList]
      if (currentUser) {
        await addGameToList(currentUser.uid, selectedList, {
          id: gameDetails.id,
          name: gameDetails.name,
          background_image: gameDetails.background_image || '',
          released: gameDetails.released || '',
          addedDate: new Date(),
        });
        setListName(selectedList);
        // console.log(`Game added to ${toastText}`);
        //show snackbar
        Snackbar.show({
          text: `Added to ${toastText}`,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        // console.log('User not authenticated');
      }
    } catch (error) {
      // console.error(`Error adding game to ${selectedList}`, error);
    } finally {
      sheetRef.current?.dismiss(); // Dismiss the sheet after adding the game
      setSelectedList(null); // Reset the selected list
    }
  };

  const gameListToast = (listName: string) => {
    const toastText = listLabels[listName];
    Snackbar.show({
      text: `This game exists in your collection: ${toastText}`,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  return (
    <SafeAreaView style={styles.container} >
      <SearchBar />
      <Text style={styles.title}>{gameDetails.name}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ marginBottom: 20 }}>
          </View>
          <Image source={gameDetails.background_image ? { uri: gameDetails.background_image } : require('../assets/images/noImg.jpg')}
            style={{ width: '100%', height: 200, borderRadius: 5, marginBottom: 10 }} />
          <View style={styles.badges}>
            <View style={{ flexDirection: 'row', }}>
              <Icon name='star' size={20} color={'gold'} />
              <Text style={styles.rating}>{gameDetails.rating}</Text>
            </View>
            <View style={[styles.platforms]}>
              {platforms}
            </View>
          </View>

          <View style={styles.infoCard}>

            <View style={styles.infos}>
              <Text style={styles.key}>Developers</Text>
              <View style={styles.devContainer}>
                {gameDetails.developers.map((developer, index) => (
                  <TouchableOpacity key={index} onPress={() => navigation.navigate('Games', { developer: developer.slug, devName: developer.name })}>
                    <Text style={styles.value}>
                      {developer.name}{index < gameDetails.developers.length - 1 ? ', ' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>


            <View style={styles.infos}>
              <Text style={styles.key}>Publishers</Text>
              <View style={styles.devContainer}>
                {gameDetails.publishers.map((publisher, index) => (
                  <TouchableOpacity key={index} onPress={() => navigation.navigate('Games', { publisher: publisher.slug, pubName: publisher.name })}>
                    <Text style={styles.value}>
                      {publisher.name}{index < gameDetails.publishers.length - 1 ? ', ' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.infos}>
              <Text style={styles.key}>Release Date</Text>
              <Text style={styles.value}>
                {gameDetails.released ? gameDetails.released.split('-').reverse().join('/') : 'TBA'}
              </Text>
            </View>

            <View style={[styles.infos, { alignItems: 'center' }]}>
              <Text style={styles.key}>Metacritic Score </Text>
              <Text style={styles.value}>
                {gameDetails.metacritic || 'NA'}
              </Text>
            </View>

            <View style={styles.infos}>
              <Text style={styles.key}>ESRB Rating</Text>
              <Text style={styles.value}>
                {gameDetails.esrb_rating ? esrb_rating[gameDetails.esrb_rating.id] : 'Not Rated'}
              </Text>
            </View>

            <View style={[styles.infos, { alignItems: 'center' }]}>
              <Text style={styles.key}>Website</Text>
              <Text style={[styles.value, { textDecorationLine: 'underline' }]} onPress={() => Linking.openURL(gameDetails.website)}>Official Website </Text>
              <MaterialIcon name='open-in-new' size={12} style={styles.icon} />
            </View>

          </View>

          {listName ?
            <Button title={listLabels[listName]} onPress={() => gameListToast(listName)} />
            :
            <Button title='ADD TO COLLECTION' onPress={() => sheetRef.current?.present()} />
          }
          {/* {listName ? <Text style={styles.heading}>{listName}</Text> : null} */}

          {/* Screenshots */}
          {screenshots && screenshots.length > 0 && (
            <View style={styles.separator}>
              <Text style={styles.heading}>Screenshots</Text>
              <ScreenshotsCarousel screenshots={screenshots || []} />
            </View>
          )}

          {/* Description */}
          {gameDetails.description_raw?.length > 0 && (
            <View style={styles.separator}>
              <Text style={styles.heading}>About {gameDetails.name}</Text>
              <Text style={styles.desc}>{gameDetails.description_raw}</Text>
            </View>
          )}

          {/* stores */}
          {gameDetails.stores?.length > 0 && (
            <View style={styles.separator}>
              <Text style={styles.heading}>Stores</Text>
              <View style={styles.storeContainer}>
                {stores?.map((store) => {
                  const storeMatch = gameDetails.stores.find((gameStore) => gameStore.store.id === store.store_id);
                  if (storeMatch) {
                    // const iconName = storeIcons[storeMatch.store.name] || 'store';
                    const imageUri = storeIcons[storeMatch.store.name] || storeIcons['default'];
                    return (
                      <Pressable key={store.id} onPress={() => openStore(store.url)} style={styles.store}>
                        {/* <Icon name={iconName} size={24} color={'#ffffff'} /> */}
                        <Image source={{ uri: imageUri }} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                        {/* {imageUri && <Image source={imageUri} style={styles.storeImage} />} */}
                        <Text style={styles.storeText}>{storeMatch.store.name}</Text>
                      </Pressable>
                    );
                  }
                  return null;
                })}
              </View>
            </View>
          )}

          {/* dlcs and additions */}
          {gameDetails.additions_count > 1 && additions && (
            <View style={styles.separator}>
              <Text style={styles.heading}>DLC's and Editions</Text>
              {additions?.map((addition: Franchise) => (
                <GameCard key={addition.id} game={addition} />
              ))}
              <Text style={styles.desc}></Text>
            </View>
          )}

          {/* baseGame */}
          {gameDetails.parents_count === 1 && baseGame && (
            <View style={styles.separator}>
              <Text style={styles.heading}>Base Game</Text>
              {baseGame?.map(base => (
                <View key={base.id}>
                  <GameCard game={base} />
                </View>
              ))}
              <Text style={styles.desc}></Text>
            </View>
          )}

          {/* games in series */}
          {gameDetails.game_series_count > 0 && series && (
            <View style={styles.separator}>
              <Text style={styles.heading}>Games in the Series</Text>
              {series?.map((series: Franchise) => (
                <View key={series.id}>
                  <GameCard key={series.id} game={series} />
                </View>
              ))}
              <Text style={styles.desc}></Text>
            </View>
          )}

          {/* metacritic */}
          {gameDetails.metacritic && (
            <View style={[styles.separator, { flexDirection: 'row', alignItems: 'center' }]}>
              <View style={styles.metascore}>
                <Text style={styles.metanumber}>{gameDetails.metacritic || 'NA'}</Text>
              </View>
              <Image source={{ uri: 'https://img.icons8.com/?size=48&id=YaSzxFsOJh3a&format=png' }} style={{ width: 50, height: 50, marginRight: 2 }} />
              <View>
                <Text style={styles.metaText}>metacritic</Text>
                <Pressable onPress={() => Linking.openURL(gameDetails.metacritic_url)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.key}>Read critic reviews </Text>
                  <MaterialIcon name='open-in-new' size={12} color='white' />
                </Pressable>
              </View>
            </View>
          )}

          {/* platforms */}
          <View style={styles.separator}>
            <Text style={styles.heading}>Available On</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {gameDetails.platforms.map((platform, index) => (
                <TouchableOpacity key={index} onPress={() => navigation.navigate('Games', { platform: platform.platform.id, platName: platform.platform.name })}>
                <Text style={styles.badge}>{platform.platform.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* genres */}
          {gameDetails.genres?.length > 0 && (
            <View style={styles.separator}>
              <Text style={styles.heading}>Genres</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {gameDetails.genres.map((genre, index) => (
                  <TouchableOpacity key={index} onPress={() => navigation.navigate('Games', { genre: genre.slug, genreName: genre.name })}>
                    <Text style={styles.badge} >
                      {genre.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* <Text style={styles.desc}>{gameDetails.genres.map(genre => genre.name).join(', ')}</Text> */}
            </View>
          )}


          {/* requirements */}
          <View style={styles.separator}>
            {gameDetails.platforms.map((platform) => {
              if (platform.platform.slug === 'pc') {
                const gotReq = platform.requirements.minimum || platform.requirements.recommended;
                if (gotReq) {

                  return (
                    <View key={platform.platform.id}>
                      <Text style={styles.heading}>{gameDetails.name} System Requirements</Text>
                      {platform.requirements.minimum && (
                        <Text style={styles.key}>{platform.requirements.minimum}</Text>
                      )}
                      {platform.requirements.recommended && (
                        <Text style={styles.key}>{platform.requirements.recommended}</Text>
                      )}
                    </View>
                  );
                }
                return null;
              }
            })}
          </View>

          {/* tags */}
          {gameDetails.tags?.length > 0 && (
            <View style={styles.separator}>
              <Text style={styles.heading}>Tags</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {gameDetails.tags.map((tag, index) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Games', { tag: tag.slug, tagName: tag.name })}
                    key={index} >
                    <Text style={styles.badge}>{tag.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Action Sheet for adding game to collection */}
      <Sheet ref={sheetRef} title='Select List'>
        <View>
          <RadioGroup options={listOptions} selectedOption={selectedList} onChange={handleListSelection} />
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <Button title='ADD TO COLLECTION' onPress={handleAddToCollection} />
        </View>
      </Sheet>
    </SafeAreaView>
  );
};

const useStyles = pxStyles((theme) => ({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.primary
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
  errorText: {
    color: '#ff3c00',
    fontWeight: 'bold',
    fontSize: 22,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: theme.primary,
    color: theme.background,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginEnd: 5,
    marginBottom: 5,
    borderRadius: 3
  },
  platforms: {
    flexDirection: 'row',
    marginVertical: 5,
    backgroundColor: theme.primary,
    borderRadius: 3,
    padding: 2,
    elevation: 5
  },
  rating: {
    fontWeight: 'bold',
    color: theme.primary,
    fontSize: 14
  },
  platIcon: {
    color: theme.background,
    marginHorizontal: 3
  },
  infoCard: {},
  infos: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  devContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  key: {
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.secondary
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    color: theme.primary
  },
  devBar: {
    flex: 1,
    textAlign: 'right',
  },
  desc: {
    color: theme.secondary,
    fontWeight: 'bold',
    // marginVertical: 10,
    fontSize: 16,
  },
  separator: {
    marginTop: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.tertiary,
    marginBottom: 2,
  },
  storeContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // overflow: 'visible',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  store: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.tertiary,
    paddingHorizontal: 10,
    paddingVertical: 12,
    // marginEnd: 5,
    marginBottom: 5,
    borderRadius: 3,
    width: '49%'
  },
  storeText: {
    fontSize: 16,
    color: theme.background,
    fontWeight: 'bold',
    marginLeft: 7,
  },
  metascore: {
    width: 50,
    height: 50,
    backgroundColor: theme.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    marginRight: 5,
  },
  metanumber: {
    fontSize: 24,
    color: theme.background,
    fontWeight: 'bold'
  },
  metaText: {
    fontSize: 22,
    color: theme.primary,
    fontWeight: 'bold'
  },
  icon: {
    color: theme.primary,
    fontWeight: 'bold'
  },
}));

export default GameDetails;
