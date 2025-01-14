import React from 'react';
import {View, Alert, TouchableOpacity, Text, Linking} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//navigation
import {RootStackParamList} from '../routes/Navigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

//firebase
import auth from '@react-native-firebase/auth';
import {deleteCollectionGames} from '../services/auth/firebase';

import {pxStyles} from '../theme/useTheme';

//utils
import {clearAppCache} from '../utils/cachemanager';

type DataProps = NativeStackScreenProps<RootStackParamList, 'Data'>;

const Data = ({navigation}: DataProps) => {
  const styles = useStyles();
  const userId = auth().currentUser?.uid;

  //function to delete collection
  const handleDeleteAllGames = async () => {
    if (userId) {
      Alert.alert(
        'Delete All Games',
        'Are you sure you want to delete all games from your collection?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Yes',
            onPress: async () => {
              try {
                await deleteCollectionGames(userId);
                Alert.alert('Success', 'All games have been deleted.');
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Failed to delete games. Please try again.',
                );
              }
            },
          },
        ],
      );
    } else {
      Alert.alert('Error', 'User not found.');
    }
  };

  //function to open app settings
  const openStorageSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Delete Games Collection</Text>
          <Text style={styles.text}>
            This action will permanantly delete all your games from the app and
            clear the online cloud storage. There will be no way to restore it.
          </Text>
          <Text style={styles.text}>
            All the games you added will be lost forever.
          </Text>
          <TouchableOpacity style={styles.links} onPress={handleDeleteAllGames}>
            <Text style={styles.linkText}>Delete Everything</Text>
            <Icon name="delete-outline" color="tomato" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Clear Cache</Text>
          <Text style={styles.text}>
            The app size may become too big if the cache is not cleared.
          </Text>
          <Text style={styles.text}>
            Go to Storage & Cache and tap Clear Cache to clear the app cache.
          </Text>
          <TouchableOpacity style={styles.links} onPress={clearAppCache}>
            <Text style={styles.linkText}>Clear Cache with RNFS</Text>
            <Icon name="database-remove-outline" color="tomato" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Open System Settings</Text>
          <Text style={styles.text}>Go to the apps System Settings.</Text>
          <TouchableOpacity style={styles.links} onPress={openStorageSettings}>
            <Text style={styles.linkText}>Open Settings</Text>
            <Icon name="cog-outline" color="tomato" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const useStyles = pxStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  innerContainer: {
    marginHorizontal: '3%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.secondary,
    marginBottom: 15,
  },
  card: {
    backgroundColor: theme.card,
    elevation: 10,
    padding: 15,
    borderRadius: 3,
    marginVertical: 10,
  },
  links: {
    flexDirection: 'row',
    backgroundColor: theme.primary,
    elevation: 10,
    padding: 10,
    borderRadius: 3,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  linkText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.background,
  },
}));

export default Data;
