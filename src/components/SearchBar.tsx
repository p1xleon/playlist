import React, { useState, useRef } from 'react';
import { View, TextInput, Pressable, Keyboard } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//navigation
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../routes/Navigator';

import { pxStyles } from '../theme/useTheme';

interface SearchBarProps {
  searchIcon?: string;
  clearIcon?: string;
  exitIcon?: string;
  onExitPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchIcon = "magnify", clearIcon = "close", exitIcon = "arrow-left", onExitPress, value, onChangeText, autoFocus }: SearchBarProps) => {

  const styles = useStyles();
  
  const [inputValue, setInputValue] = useState<string>(value ?? '');
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();

  const tabScreens = ['Home', 'Lists', 'Discover'];

  const handleChangeText = (text: string) => {
    setInputValue(text);
    onChangeText && onChangeText(text);
  };

  const handleClear = () => {
    setInputValue('');
    onChangeText && onChangeText('');
  };

  const handleExitPress = () => {
    handleClear();
    Keyboard.dismiss();
    inputRef.current?.blur();
    onExitPress && onExitPress();
    if (tabScreens.includes(route.name)) {
      navigation.navigate('Search');
    } else {
      navigation.goBack();
    }
  }

  const handleFocus = () => {
    setIsFocused(true);
    navigation.navigate('Search');
  }

  const handleBlur = () => {
    setIsFocused(false);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handleExitPress}>
        <Icon name={isFocused || inputValue.length > 0 ? exitIcon : searchIcon} size={26} color="#acacac" style={styles.icon} />
      </Pressable>
      <TextInput
        style={styles.input}
        value={inputValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        placeholder="Search for games"
        placeholderTextColor="#acacac"
        cursorColor='#fff'
        autoFocus={autoFocus}
      />
      {inputValue.length > 0 && (
        <Pressable onPress={handleClear}>
          <Icon name={clearIcon} size={26} color="#acacac" style={styles.icon} />
        </Pressable>
      )}
    </View>
  );
};

const useStyles = pxStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 25,
    paddingHorizontal: 10,
    elevation: 5,
    marginBottom: 10,
    width: '100%',
  },
  icon: {
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    color: '#fff'
  },
}));

export default SearchBar;
