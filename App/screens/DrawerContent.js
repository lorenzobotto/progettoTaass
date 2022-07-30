import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';

import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function DrawerContent(props) {
    const [username, setUsername] = React.useState(null);
    const findUsername = async () => {
        try {
            setUsername(await AsyncStorage.getItem('username'));
        } catch(e) {
            console.log(e);
        }
    }
    findUsername();
    const {signOut} = React.useContext(AuthContext);
    
    return(
        <View style={{flex: 1}}>
            <DrawerContentScrollView {... props}>
                <View style={styles.drawerContent}> 
                    <View style={styles.userInfoSection}> 
                        <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 40}}>
                            <Avatar.Image 
                                source={
                                    require("../assets/user.png")
                                }
                                size={50}
                                style={{backgroundColor: '#fff', marginTop: 7}}
                            />
                            <View style={{marginLeft: 15, flexDirection:'column'}}>
                                <Title style={{marginBottom: 0}}>Benvenuto</Title>
                                <Title style={{marginTop: 0}}>{username}</Title>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profilo"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="format-list-bulleted-square" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Lista prenotazioni"
                            onPress={() => {props.navigation.navigate('Reservations')}}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Esci"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    userInfoText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });