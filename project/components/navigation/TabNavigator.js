import React from 'react';
import { } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Home from '../screens/Home';
import SongSearch from '../screens/SongSearch';
import ArtistSearch from '../screens/ArtistSearch';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#673AB7',
        inactiveTintColor: 'grey',
        keyboardHidesTabBar: 'false',
        tabStyle: {
          backgroundColor: 'white',
        },
        labelStyle: {
          marginBottom: 5,
          marginTop: -5,
        },
        labelPosition: 'below-icon'
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Song"
        component={SongSearch}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="queue-music" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Artist"
        component={ArtistSearch}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person-search" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;