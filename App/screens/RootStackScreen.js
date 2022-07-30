import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from './SignInScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="PetcareApp" component={SignInScreen}/>
    </RootStack.Navigator>
);

export default RootStackScreen;