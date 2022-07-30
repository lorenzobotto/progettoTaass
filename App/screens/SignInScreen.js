import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Dimensions,
    Platform,
    StyleSheet,
    StatusBar,
    Image,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../components/context';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconIsto from 'react-native-vector-icons/Fontisto';
import {REACT_APP_GOOGLE_CLIENT_KEY, REACT_APP_FACEBOOK_CLIENT_KEY} from '@env';

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = ({navigation}) => {
    const {signIn, signInGoogle, signInFacebook} = React.useContext(AuthContext);
    const { colors } = useTheme();

    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const handleValidUser = (val) => {
        setData({
            ...data,
            username: val,
            check_textInputChange: true,
            isValidUser: true
        });
    }

    const handlePasswordChange = (val) => {
        if( val && val.trim().length >= 6 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const loginHandle = (userName, password) => {
        if ( userName && userName.length == 0 || password && password.length == 0 ) {
            Alert.alert('Input errato!', 'Username o password non possono essere campi vuoti!', [
                {text: 'Okay'}
            ]);
            return;
        }
        signIn(userName, password);
    }

    const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
        expoClientId: REACT_APP_GOOGLE_CLIENT_KEY,
        webClientId: REACT_APP_GOOGLE_CLIENT_KEY
    });

    const [requestFacebook, responseFacebook, promptAsyncFacebook] = Facebook.useAuthRequest({
        clientId: REACT_APP_FACEBOOK_CLIENT_KEY,
    });

    React.useEffect(() => {
        if (responseGoogle?.type === 'success') {
            const { authentication } = responseGoogle;
            async function getInformations(token) {
                const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    method: 'GET',
                    headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            let responseJson = await response.json();
            signInGoogle(responseJson);
          }
          getInformations(authentication.accessToken);
        }
        if (responseFacebook?.type === 'success') {
            const { authentication } = responseFacebook;
            async function getInformations(token) {
                const response = await fetch('https://graph.facebook.com/me?fields=email,name,friends&access_token=' + token);
                let responseJson = await response.json();
                signInFacebook(responseJson);
          }
          getInformations(authentication.accessToken);
        }
    }, [responseGoogle, responseFacebook]);

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="stretch"
            />
        </View>
        <Animatable.View 
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
            animation="fadeInUpBig"
        >
            <Text style={[styles.text_footer, {
                color: colors.text
            }]}>Username</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Username"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val)=>handleValidUser(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>            

            <Text style={[styles.text_footer, {
                color: colors.text,
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>La password deve contenere almeno 6 caratteri.</Text>
            </Animatable.View>
            }
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {loginHandle( data.username, data.password )}}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonSocial}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {promptAsyncGoogle();}}
                >
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Icon name='google' size={20} style={{color: '#fff', marginRight: 10}}/>
                        <Text style={[styles.textSign, {
                            color:'#fff'
                        }]}>Login con Google</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonSocial}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {promptAsyncFacebook();}}
                >
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <IconIsto name='facebook' size={20} style={{color: '#fff', marginRight: 10}}/>
                        <Text style={[styles.textSign, {
                            color:'#fff'
                        }]}>Login con Facebook</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Animatable.View>
      </View>
    );
};

export default SignInScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#009387'
  },
  header: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 50,
      paddingTop: 60
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18
  },
  footer: {
      flex: 22,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'center',
      marginTop: 70,
      backgroundColor: '#009387',
      textAlign: 'center',
      justifyContent: 'center',
      borderRadius: 5
  },
  buttonSocial: {
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#009387',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 5
},
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingBottom: 5
},
actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5
},
textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
},
errorMsg: {
    color: '#FF0000',
    fontSize: 14,
},
signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
},
textSign: {
    fontSize: 18,
    fontWeight: 'bold'
}
});