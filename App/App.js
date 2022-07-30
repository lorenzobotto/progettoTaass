import * as React from 'react';
import { Alert } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { DrawerContent } from './screens/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from './screens/ProfileScreen';
import MainTabScreen from './screens/MainTabScreen';
import ReservationScreen from './screens/ReservationsScreen';
import RootStackScreen from './screens/RootStackScreen';
import { AuthContext } from './components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';

const Drawer = createDrawerNavigator();

export default function App() { 

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);

  const authContext = React.useMemo(() => ({
    signIn: async (username, password) => {
        try {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"username": username, "password": password})
          };
          const available = await fetch("http://localhost:30000/api/v1/auth/signin/available", requestOptions);
          if (available.ok) {
            const response = await fetch('http://localhost:30000/api/v1/auth/signin', requestOptions);
            const responseJson = await response.json();
            try {
              await AsyncStorage.setItem('username', responseJson.username);
              await AsyncStorage.setItem('email', responseJson.email);
              await AsyncStorage.setItem('roles', responseJson.roles[0]);
              await AsyncStorage.setItem('isLoggedIn', 'true');
              await AsyncStorage.setItem('tokenType', responseJson.tokenType);
              await AsyncStorage.setItem('accessToken', responseJson.accessToken);
              setIsLoggedIn(true);
            } catch(e) {
              console.log(e);
            }
          } else {
            Alert.alert('Input errato!', 'Username o password errati!', [
              {text: 'Okay'}
            ]);
          }
        } catch (error) {
          console.error(error);
        }
    },
    signOut: async() => {
      try {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('roles');
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('tokenType');
        await AsyncStorage.removeItem('accessToken');
        setIsLoggedIn(false);
      } catch(e) {
        console.log(e);
      }
    },
    signInGoogle: async (userInformations) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"email": userInformations.email, "provider": "Google"})
      };
      const response = await fetch("http://localhost:30000/api/v1/auth/signinSocial", requestOptions);
      const responseJson = await response.json();
      if (response.ok) {
        try {
          await AsyncStorage.setItem('username', responseJson.username);
          await AsyncStorage.setItem('email', responseJson.email);
          await AsyncStorage.setItem('roles', responseJson.roles[0]);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('tokenType', responseJson.tokenType);
          await AsyncStorage.setItem('accessToken', responseJson.accessToken);
          setIsLoggedIn(true);
        } catch(e) {
          console.log(e);
        }
      } else {
        Alert.alert('Errore!', 'Email non registrata!', [
          {text: 'Okay'}
        ]);
      }
    },
    signInFacebook: async (userInformations) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"email": userInformations.email, "provider": "Facebook"})
      };
      const response = await fetch("http://localhost:30000/api/v1/auth/signinSocial", requestOptions);
      const responseJson = await response.json();
      if (response.ok) {
        try {
          await AsyncStorage.setItem('username', responseJson.username);
          await AsyncStorage.setItem('email', responseJson.email);
          await AsyncStorage.setItem('roles', responseJson.roles[0]);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('tokenType', responseJson.tokenType);
          await AsyncStorage.setItem('accessToken', responseJson.accessToken);
          setIsLoggedIn(true);
        } catch(e) {
          console.log(e);
        }
      } else {
        Alert.alert('Errore!', 'Email non registrata!', [
          {text: 'Okay'}
        ]);
      }
    }
  }), []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
      { isLoggedIn === true ? (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
          <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
          <Drawer.Screen name="ReservationScreen" component={ReservationScreen} />
        </Drawer.Navigator>
      )
      :
        <RootStackScreen />
      }
      </NavigationContainer>
  </AuthContext.Provider>
  );
}
