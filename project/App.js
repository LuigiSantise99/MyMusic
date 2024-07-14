import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigator from './components/navigation/TabNavigator';
import SongScreen from './components/screens/SongScreen';
import ArtistScreen from './components/screens/ArtistScreen';
import FavoriteArtists from './components/screens/FavoriteArtists';
import FavoriteSongs from './components/screens/FavoriteSongs';
import ManageProfile from './components/screens/ManageProfile';

const Stack = createStackNavigator();
const colorStatusBar = Platform.OS === 'android' ? '#4527A0' : '#673AB7';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={colorStatusBar} />
      <Stack.Navigator>
        <Stack.Screen
          name="MyMusic"
          component={TabNavigator}
          options={{
            title: 'MyMusic',
            headerStyle: {
              backgroundColor: '#673AB7',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="Search song"
          component={SongScreen}
          options={{
            title: 'Song Video & Lyrics',
            headerStyle: {
              backgroundColor: '#673AB7',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="Search artist"
          component={ArtistScreen}
          options={{
            title: 'Artist Details',
            headerStyle: {
              backgroundColor: '#673AB7',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="Favorite artist"
          component={FavoriteArtists}
          options={{
            title: 'Favorite Artist',
            headerStyle: {
              backgroundColor: '#673AB7',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="Favorite song"
          component={FavoriteSongs}
          options={{
            title: 'Favorite Song',
            headerStyle: {
              backgroundColor: '#673AB7',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="Manage profile"
          component={ManageProfile}
          options={{
            title: 'Manage Profile',
            headerStyle: {
              backgroundColor: '#673AB7',
            },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
