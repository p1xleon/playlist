import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

//function to clear cache
export const clearAppCache = async () => {
  try {
    const cacheDir = RNFS.CachesDirectoryPath;
    const exists = await RNFS.exists(cacheDir);
    if (exists) {
      const files = await RNFS.readDir(cacheDir);
      for (const file of files) {
        await RNFS.unlink(file.path);
      }
    }

    // console.log('App cache cleared successfully');
  } catch (error) {
    // console.error('Error clearing app cache:', error);
  }
};

const CACHE_CLEAR_INTERVAL = 1 * 60 * 60 * 1000; // set interval to 1 hour

//function to check last cache cleared time and clear cache
export const autoClearCache = async () => {
  try {
    const lastClearTime = await AsyncStorage.getItem('lastCacheClearTime');
    const now = Date.now();

    if (
      !lastClearTime ||
      now - parseInt(lastClearTime, 10) >= CACHE_CLEAR_INTERVAL
    ) {
      await clearAppCache();
      await AsyncStorage.setItem('lastCacheClearTime', now.toString());
      // console.log('Cache cleared on app start');
    }
  } catch (error) {
    // console.error('Error checking/clearing cache:', error);
  }
};
