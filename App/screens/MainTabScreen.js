import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './ProfileScreen';
import ReservationScreen from './ReservationsScreen';

const ProfileStack = createStackNavigator();
const ReservationsStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Profile"
      activeColor="#fff"
      barStyle={{ backgroundColor: '#009387' }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Profilo',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Reservations"
        component={ReservationsStackScreen}
        options={{
          tabBarLabel: 'Lista prenotazioni',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <Icon name="list-sharp" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);

export default MainTabScreen;

const ProfileStackScreen = ({navigation}) => (
    <ProfileStack.Navigator screenOptions={{
            headerStyle: {
            backgroundColor: '#009387',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold'
            }
        }}>
            <ProfileStack.Screen name="ProfileStack" component={ProfileScreen} options={{
            title:'Profilo',
            headerLeft: () => (
                <Icon.Button name="ios-menu" size={25} backgroundColor="#009387" onPress={() => navigation.openDrawer()}></Icon.Button>
            )
            }} />
    </ProfileStack.Navigator>
);

const ReservationsStackScreen = ({navigation}) => (
    <ReservationsStack.Navigator screenOptions={{
            headerStyle: {
            backgroundColor: '#009387',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold'
            }
        }}>
            <ReservationsStack.Screen name="ReservationStack" component={ReservationScreen} options={{
            title:'Lista Prenotazioni',
            headerLeft: () => (
                <Icon.Button name="ios-menu" size={25} backgroundColor="#009387" onPress={() => navigation.openDrawer()}></Icon.Button>
            )
            }} />
    </ReservationsStack.Navigator>
);