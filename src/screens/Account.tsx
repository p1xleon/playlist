import React from 'react';
import { View, Text } from 'react-native';

//auth
import auth from '@react-native-firebase/auth'

//components
import { SmallLoader } from '../components/Loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { pxStyles } from '../theme/useTheme';

//utils
import { listColors, listIcons } from '../data/ListMaps';
import { useGameCount, useListGameCounts } from '../hooks/listHooks';
import { formatDate } from '../utils/dateTime';

const Account = () => {
  const styles = useStyles();

  const user = auth().currentUser;
  const userJoinDate = user?.metadata.creationTime;
  const userLastSignIn = user?.metadata.lastSignInTime;
  const { totalGames, loading } = useGameCount();
  const { listGameCounts, loading: listCountLoading } = useListGameCounts();

  const backlogCount = listGameCounts?.['backlog'] || 0;
  const playlistCount = listGameCounts?.['playlist'] || 0;
  const wishlistCount = listGameCounts?.['wishlist'] || 0;
  const completedCount = listGameCounts?.['completed'] || 0;
  const droppedCount = listGameCounts?.['dropped'] || 0;

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={styles.card}>
            <Text style={styles.key}>Username</Text>
            <Text style={styles.value}>{user.displayName}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.key}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.key}>Joined</Text>
            <Text style={styles.value}>{userJoinDate ? formatDate(userJoinDate) : (<SmallLoader />)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.key}>Last Signed in</Text>
            <Text style={styles.value}>{userLastSignIn ? formatDate(userLastSignIn) : (<SmallLoader />)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.key}>Collection</Text>
            <Text style={styles.value}>
              {totalGames ? `${totalGames} Games` : loading ? (<SmallLoader />) : '0 Games'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.key}>Games in Lists</Text>

            <View style={styles.listInfo}>
              <View style={styles.badge}>
                <Text style={styles.count}>{backlogCount}</Text>
                <View style={styles.strip}>
                  <Icon name={listIcons.backlog} size={22} color={listColors.backlog} />
                  <Text style={styles.listName}> Backlogs</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.count}>{playlistCount}</Text>
                <View style={styles.strip}>
                  <Icon name={listIcons.playlist} size={22} color={listColors.playlist} />
                  <Text style={styles.listName}> Playing</Text>
                </View>
              </View>
            </View>

            <View style={styles.listInfo}>
              <View style={styles.badge}>
                <Text style={styles.count}>{wishlistCount}</Text>
                <View style={styles.strip}>
                  <Icon name={listIcons.wishlist} size={22} color={listColors.wishlist} />
                  <Text style={styles.listName}> WIshlisted</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.count}>{completedCount}</Text>
                <View style={styles.strip}>
                  <Icon name={listIcons.completed} size={22} color={listColors.completed} />
                  <Text style={styles.listName}> Completed</Text>
                </View>
              </View>
            </View>            
            
            <View style={[styles.listInfo, {justifyContent: 'center'}]}>
              <View style={styles.badge}>
                <Text style={styles.count}>{droppedCount}</Text>
                <View style={styles.strip}>
                  <Icon name={listIcons.dropped} size={22} color={listColors.dropped} />
                  <Text style={styles.listName}> Dropped/Ignored</Text>
                </View>
              </View>
            </View>

          </View>

        </>
      ) : (
        <Text style={styles.error}>User not logged in</Text>
      )}
    </View>
  );
};

const useStyles = pxStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 10,
  },
  card: {
    backgroundColor: theme.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    marginBottom: 7,
    elevation: 3
  },
  label: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
  },
  key: {
    fontSize: 16,
    color: theme.secondary,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
  listInfo: {
    flexDirection: 'row',
    marginVertical: 10
  },
  badge: {
    alignItems: 'center',
    width: '45%',
    marginHorizontal: 10,
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  listName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.secondary,
  },
  count: {
    fontSize: 28,
    color: theme.primary,
    fontWeight: '900'
  },
}));

export default Account;
