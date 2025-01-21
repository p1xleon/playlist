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
        <Text style={styles.text}>{'\u25CF'} Introduced a new "Dropped" list for games you've played but didn't enjoy.</Text>
        <Text style={styles.text}>{'\u25CF'} Improved game result filtering for a more refined user experience.</Text>
        <Text style={styles.text}>{'\u25CF'} Implemented a cache management system to optimize app performance.</Text>
        <Text style={styles.text}>{'\u25CF'} Various minor UI improvements.</Text>
      </Card>

      {/* v1.1 */}
      <Card>
        <Text style={styles.badgeText}>v1.2</Text>
        <Text style={styles.text}>{'\u25CF'} Optimized user lists for enhanced performance.</Text>
        <Text style={styles.text}>{'\u25CF'} Resolved bugs in the user lists action sheet.</Text>
      </Card>

      {/* v1.3 */}
      <Card>
        <Text style={styles.badgeText}>v1.3</Text>
        <Text style={styles.text}>{'\u25CF'} Introduced the "Favorites" library, allowing users to add games as favorites from the lists screen.</Text>
        <Text style={styles.text}>{'\u25CF'} Various minor UI enhancements.</Text>
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
