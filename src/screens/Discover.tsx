import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { RootStackParamList } from '../routes/Navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDiscoverGames, usePopularGames, useUpcomingGames, useNewGames } from '../hooks/gameHooks';
import { Loading } from '../components/Loading';
import { DiscoverCard } from '../components/GameCard';
import Sheet, { SheetHandle } from '../components/ActionSheet';
import { RadioGroup } from '../components/Utils';
import Icon from 'react-native-vector-icons/FontAwesome6';

type DiscoverProps = NativeStackScreenProps<RootStackParamList, 'Discover'>;

const Discover = () => {
  const [order, setOrder] = useState('popular');
  const { data: games, isLoading, error } = useDiscoverGames(order);
  const { data: popularGames } = usePopularGames();
  const { data: upcomingGames } = useUpcomingGames();
  const { data: newGames } = useNewGames();
  const sheetRef = useRef<SheetHandle>(null);

  const DiscoverSortOptions = [
    { label: 'Popularity', value: 'popular' },
    // { label: 'Relevance', value: 'relevance' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'New', value: 'new' },
    { label: 'Metacritic', value: '-metacritic' },
    { label: 'Rating', value: '-rating' },
    { label: 'Released', value: 'released' },
    // { label: 'Added', value: '-added' },
  ];

  const handleSelect = (value: string) => {
    setOrder(value);
  };

  // Function to shuffle an array randomly
  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Combine and sort games for the 'relevance' option
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

  if (isLoading) return <Loading />;
  if (error) return <Text>Something went wrong</Text>;
  const getSortLabel = (value: string) => {
    const option = DiscoverSortOptions.find(option => option.value === value);
    return option ? option.label : value;
  };
  return (
    <View style={styles.container}>
      <Header title="Discover" />
      <SearchBar />
      <TouchableOpacity onPress={() => sheetRef.current?.present()} style={styles.sortButton}>
        <Icon name="arrow-right-arrow-left" size={18} color="#fdfdfd" style={{ transform: [{ rotate: '90deg' }] }} />
        <Text style={styles.sortText}>{getSortLabel(order)}</Text>
      </TouchableOpacity>
      <FlatList
        data={sortedGames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <DiscoverCard game={item} />}
      />

      <Sheet ref={sheetRef} title="Order by">
        <View>
          <RadioGroup options={DiscoverSortOptions} selectedOption={order} onChange={handleSelect} />
        </View>
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  sortText: {
    marginRight: 5,
    fontSize: 18,
    color: '#e9e9e9',
    fontWeight: '900',
    marginLeft: 5
  },
  header: {
    color: 'white',
    fontSize: 22,
    marginVertical: 10,
  },
});

export default Discover;
