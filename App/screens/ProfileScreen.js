import * as React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
    Title
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const [username, setUsername] = React.useState(null);
    const [role, setRole] = React.useState(null);
    const [id, setId] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [nome, setNome] = React.useState('');
    const [cognome, setCognome] = React.useState('');
    const [telefono, setTelefono] = React.useState('');
    const [nomeStruttura, setNomeStruttura] = React.useState('');
    const [capienza, setCapienza] = React.useState('');
    const [prezzo, setPrezzo] = React.useState('');
    const [indirizzo, setIndirizzo] = React.useState('');
    const [citta, setCitta] = React.useState('');
    const [cap, setCap] = React.useState('');
    const [workingDays, setWorkingDays] = React.useState([]);
    const [animali, setAnimali] = React.useState([]);
    const [provider, setProvider] = React.useState('');

    React.useEffect(() => {
        async function getReservations() {
            let username = await AsyncStorage.getItem('username');
            setUsername(username);
            let tokenType = await AsyncStorage.getItem('tokenType');
            let accessToken = await AsyncStorage.getItem('accessToken');
            setRole(await AsyncStorage.getItem('roles'));
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 
                           'Authorization': tokenType + " " + accessToken },
                body: JSON.stringify({"username": username})
            };
            let response = await fetch("http://localhost:30000/api/v1/users/getUserUsername", requestOptions);
            let responseJson = await response.json();
            setId(responseJson['id']);
            setEmail(responseJson['email']);
            setNome(responseJson['nome']);
            setCognome(responseJson['cognome']);
            setTelefono(responseJson['telefono']);
            setNomeStruttura(responseJson['nomeStruttura']);
            setCapienza(responseJson['capienza']);
            setPrezzo(responseJson['prezzo']);
            setIndirizzo(responseJson['indirizzo']);
            setCitta(responseJson['citta']);
            setCap(responseJson['cap']);
            setWorkingDays(responseJson['giorniLavoro']);
            setAnimali([responseJson['animaliDaAccudire']]);
            setProvider(responseJson['provider']);
        }
        getReservations();
    }, [])


    if (role != null && role === 'ROLE_USER') {
        return (
            <ScrollView>
                <View style={{textAlign: 'center', justifyContent: 'center'}}>
                    <Title style={{marginBottom: 30, textAlign: 'center', marginTop: 30, fontSize: 26}}>Informazioni profilo '{username}'</Title>
                    <View style={styles.informations}>
                        <View style={{paddingTop: 20}}>
                            <Title style={styles.titleInformations}>Email: {email}</Title>
                            <Title style={styles.titleInformations}>Username: {username}</Title>
                            <Title style={styles.titleInformations}>Nome: {nome}</Title>
                            <Title style={styles.titleInformations}>Cognome: {cognome}</Title>
                            <Title style={styles.titleInformations}>Numero di telefono: {telefono}</Title>
                            <Title style={styles.titleInformations}>Indirizzo: {indirizzo + ", " + citta + ", " + cap}</Title>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    } else if (role != null && role === 'ROLE_PETSITTER') {
        return(
            <ScrollView>
                <View>
                    <Title style={{marginBottom: 30, textAlign: 'center', marginTop: 30, fontSize: 26}}>Informazioni profilo '{username}'</Title>
                    <View style={styles.informations}>
                        <Title style={styles.titleInformations}>Email: {email}</Title>
                        <Title style={styles.titleInformations}>Username: {username}</Title>
                        <Title style={styles.titleInformations}>Nome petsitter: {nome}</Title>
                        <Title style={styles.titleInformations}>Cognome petsitter: {cognome}</Title>
                        <Title style={styles.titleInformations}>Numero di telefono: {telefono}</Title>
                        <Title style={styles.titleInformations}>Indirizzo: {indirizzo + ", " + citta + ", " + cap}</Title>
                        <Title style={styles.titleInformations}>Prezzo: {prezzo}€</Title>
                        <Title style={styles.titleInformations}>Giorni di disponibilità: {workingDays.join(', ')}</Title>
                        <Title style={styles.titleInformations}>Animali da accudire: {animali}</Title>
                    </View>
                </View>
            </ScrollView>
        )
    } else if (role != null && role === 'ROLE_STRUCTURE') {
        return(
            <ScrollView>
                <View>
                    <Title style={{marginBottom: 30, textAlign: 'center', marginTop: 30, fontSize: 26}}>Informazioni struttura '{nomeStruttura}'</Title>
                    <View style={styles.informations}>
                        <Title style={styles.titleInformations}>Email: {email}</Title>
                        <Title style={styles.titleInformations}>Username: {username}</Title>
                        <Title style={styles.titleInformations}>Nome titolare struttura: {nome}</Title>
                        <Title style={styles.titleInformations}>Cognome titolare struttura: {cognome}</Title>
                        <Title style={styles.titleInformations}>Numero di telefono: {telefono}</Title>
                        <Title style={styles.titleInformations}>Nome Struttura: {nomeStruttura}</Title>
                        <Title style={styles.titleInformations}>Capienza: {capienza}</Title>
                        <Title style={styles.titleInformations}>Prezzo: {prezzo}€</Title>
                        <Title style={styles.titleInformations}>Indirizzo: {indirizzo + ", " + citta + ", " + cap}</Title>
                    </View>
                </View>
            </ScrollView>
        )
    } else {
        return null;
    }
}

const styles = StyleSheet.create({
    informations: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginVertical: 20,
      marginHorizontal: 20,
      paddingTop: 25,
      borderRadius: 5,
      backgroundColor: '#009387'
    },
    titleInformations: {
        marginBottom: 20
    }
});