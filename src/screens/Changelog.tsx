import {ScrollView, Text, View} from 'react-native';
import React from 'react';

//navigation
import {RootStackParamList} from '../routes/Navigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {pxStyles} from '../theme/useTheme';

//components
import Card from '../components/Card';

type ChangelogProps = NativeStackScreenProps<RootStackParamList, 'Changelog'>;

const Changelog = () => {
  const styles = useStyles();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* v1.0 */}
      <Card>
        <Text style={styles.badgeText}>v1.0</Text>
        <Text style={styles.text}>{'\u25CF'} Initial build</Text>
      </Card>

      {/* v1.1 */}
      <Card>
        <Text style={styles.badgeText}>v1.1</Text>
        <Text style={styles.text}>{'\u25CF'} Added new list - Dropped, for games you have played, but are not your type =(</Text>
        <Text style={styles.text}>{'\u25CF'} Enhanced filtering in game results for a more refined experience.</Text>
        <Text style={styles.text}>{'\u25CF'} Implemented a cache manager, to keep the cache in check =)</Text>
        <Text style={styles.text}>{'\u25CF'} Minor UI changes</Text>
      </Card>
    </ScrollView>
  );
};

export default Changelog;

const useStyles = pxStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.primary,
  },
  text: {
    color: theme.primary,
    fontWeight: '500',
  },
}));
