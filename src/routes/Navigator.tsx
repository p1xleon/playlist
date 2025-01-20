import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Screens
import Home from '../screens/Home';
import Account from '../screens/Account';
import Settings from '../screens/Settings';
import Lists from '../screens/Lists';
import Search from '../screens/Search';
import GameDetails from '../screens/GameDetails';
import Discover from '../screens/Discover';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import Landing from '../screens/Landing';
import Collection from '../screens/Collection';
import Dummy from '../screens/Dummy';
import Data from '../screens/Data';
import Acknowledgements from '../screens/Acknowledgements';
import About from '../screens/About';
import Changelog from '../screens/Changelog';
import Games from '../screens/Games';
import Favorites from '../screens/Favorites';

// Types
import { Franchise, Game } from '../types/Game';

export type RootStackParamList = {
  Tabs: undefined;
  Home: undefined;
  Lists: undefined;
  HomeStack: undefined;
  ListsStack: undefined;
  Discover: undefined;
  Settings: undefined;
  About: undefined;
  Search: undefined;
  GameDetails: { game: Game | Franchise };
  Login: undefined;
  Signup: undefined;
  Landing: undefined;
  Collection: undefined;
  Dummy: undefined;
  Data: undefined;
  Account: undefined;
  Changelog: undefined;
  Games: { tag?: string, tagName?: string, developer?: string, publisher?: string, pubName?: string, devName?: string, genre?: string, genreName?: string, platform?: number, platName?: string };
  Acknowledgements: undefined;
  Favorites: undefined;
};

// Initialize QueryClient
const queryClient = new QueryClient();
const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Stack for Home screen
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="GameDetails" component={GameDetails} />
    </Stack.Navigator>
  );
}

// Stack for Lists screen
const ListsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Lists" component={Lists} />
      <Stack.Screen name="GameDetails" component={GameDetails} />
      <Stack.Screen name="Collection" component={Collection} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ListsStack') {
            iconName = focused ? 'format-list-text' : 'format-list-checks';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else {
            iconName = 'help';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        headerShown: false, 
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          backgroundColor: 'black',
        },
        tabBarItemStyle: {
          marginTop: 5,
          padding: 5,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
      })
    }
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="ListsStack" component={ListsStack} options={{ title: 'Lists' }} />
      <Tab.Screen name="Discover" component={Discover} options={{ title: 'Discover' }} />
    </Tab.Navigator>
  );
}

// Main Navigator
const MainNavigator: React.FC<{ user: FirebaseAuthTypes.User | null }> = ({ user }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack.Navigator screenOptions={{ headerTintColor: '#fff', headerStyle: { backgroundColor: '#000' }, headerTitleStyle: { fontWeight: '900' } }}>
          {user ? (
            <>
              <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }}/>
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="Account" component={Account} />
              <Stack.Screen name="GameDetails" component={GameDetails} options={{ headerShown: false }} />
              <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
              <Stack.Screen name="Collection" component={Collection} options={{headerTitle: 'Game Collection'}} />
              <Stack.Screen name="Dummy" component={Dummy} options={{ headerShown: false }} />
              <Stack.Screen name="Data" component={Data} options={{headerTitle: 'Data and Storage'}} />
              <Stack.Screen name="Acknowledgements" component={Acknowledgements} />
              <Stack.Screen name="About" component={About} />
              <Stack.Screen name="Changelog" component={Changelog} />
              <Stack.Screen name="Games" component={Games} />
              <Stack.Screen name="Favorites" component={Favorites} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={Signup}  options={{ headerShown: false }} />
              {/* Uncomment the following line if you want to include Landing screen */}
              {/* <Stack.Screen name="Landing" component={Landing} /> */}
            </>
          )}
        </Stack.Navigator>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default MainNavigator;
