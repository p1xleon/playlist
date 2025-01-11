import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

//navigation
import { RootStackParamList } from '../routes/Navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//hooks and functions
import { useDiscoverGames, usePopularGames, useUpcomingGames, useNewGames, useGenres } from '../hooks/gameHooks';
import { DiscoverSortOptions, GenreOptions } from '../data/discoverMaps';

import Icon from 'react-native-vector-icons/FontAwesome6';
import { pxStyles } from '../theme/useTheme';

//components
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { Loading } from '../components/Loading';
import { DiscoverCard } from '../components/GameCard';
import Sheet, { SheetHandle } from '../components/ActionSheet';
import Reload from '../components/Reload';
import { RadioGroup } from '../components/Utils';

type DiscoverProps = NativeStackScreenProps<RootStackParamList, 'Discover'>;

const Discover = ({navigation}: DiscoverProps) => {
  const styles = useStyles();

  const [order, setOrder] = useState('popular');
  const [genre, setGenre] = useState('');

  const { data: games, isLoading, error, refetch: refetchGames } = useDiscoverGames(order);
  const { data: popularGames, isLoading: popularLoading, error: popularError, refetch: refetchPopularGames } = usePopularGames();
  const { data: upcomingGames, isLoading: upcomingLoading, error: upconmingError, refetch: refetchUpcomingGames  } = useUpcomingGames();
  const { data: newGames, isLoading: newLoading, error: newError, refetch: refetchNewGames } = useNewGames();
  const { data: genres, isLoading: genreLoading, error: genreError, refetch: refetchGenres } = useGenres(order, genre);

  const orderSheet = useRef<SheetHandle>(null);
  const genreSheet = useRef<SheetHandle>(null);


  const handleSelect = (value: string) => {
    setOrder(value);
    setGenre('');
    orderSheet.current?.dismiss()
  };

  const handleGenre = (value: string) => {
    setGenre(value);
    setOrder('');
    genreSheet.current?.dismiss()
  };

  // Function to shuffle an array randomly
  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  //combine and sort games for the 'relevance' option
  let sortedGames;
  if (order === 'relevance') {
    const combinedGames = [...(popularGames || []), ...(upcomingGames || []), ...(newGames || [])];
    sortedGames = shuffleArray(combinedGames); // Randomize the order
  } else if (order === 'popular') {
    sortedGames = popularGames;
  } else if (order === 'upcoming') {
    sortedGames = upcomingGames;
  } else if (order === 'new') {
    sortedGames = newGames;
  } else {
    sortedGames = games?.sort((a: { [x: string]: string | number | Date; }, b: { [x: string]: string | number | Date; }) => {
      if (order === 'released' || order === 'created' || order === 'updated') {
        return new Date(b[order]).getTime() - new Date(a[order]).getTime();
      }
      return 0;
    });
  }

  //retry the games api request
  const retryFetch = () => {
    refetchGames();
  };

  //render loading and error checks
  if (isLoading || popularLoading || upcomingLoading || newLoading || genreLoading) return <Loading />;
  if (error || popularError || upconmingError || newError || genreError) return (
    <Reload onPress={retryFetch} />
  );

  const orderLabel = (value: string) => {
    const option = DiscoverSortOptions.find(option => option.value === value);
    return option ? option.label : value;
  };

  const genreLabel = (value: string) => {
    const option = GenreOptions.find(option => option.value === value);
    return option ? option.label : value;
  }

  return (
    <View style={styles.container}>

      <Header title="Discover" />
      <SearchBar />

      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={() => orderSheet.current?.present()} style={styles.sortButton}>
          <Icon name="arrow-right-arrow-left" size={14} style={styles.icon} />
          <Text style={styles.sortText}>{order ? orderLabel(order) : 'Order By'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => genreSheet.current?.present()} style={styles.sortButton}>
          <Icon name="arrow-right-arrow-left" size={14} style={styles.icon} />
          <Text style={styles.sortText}>{genre ? genreLabel(genre) : 'Genre'}</Text>
        </TouchableOpacity>
      </View>

      {/* flatlist for ordered games */}
      <FlatList
        data={sortedGames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <DiscoverCard game={item} />}
      />
      {/* flatlist for genres */}
      <FlatList
        data={genres}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <DiscoverCard game={item} />}
      />

      {/* order sheet */}
      <Sheet ref={orderSheet} title="Order by">
        <View>
          <RadioGroup options={DiscoverSortOptions} selectedOption={order} onChange={handleSelect} />
        </View>
      </Sheet>

      {/* genre sheet */}
      <Sheet ref={genreSheet} title="Order by">
        <View>
          <RadioGroup options={GenreOptions} selectedOption={genre} onChange={handleGenre} />
        </View>
      </Sheet>
    </View>
  );
};

const useStyles = pxStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderColor: theme.secondary
  },
  sortText: {
    fontSize: 16,
    color: theme.secondary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  icon: {
    color: theme.secondary,
    transform: [{ rotate: '90deg' }]
}
}));

export default Discover;
