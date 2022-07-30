import * as React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
    Title
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReservationScreen() {

    const [informations, setInformations] = React.useState(null);
    const [role, setRole] = React.useState(null);
    const [username, setUsername] = React.useState(null);

    React.useEffect(() => {
        async function getReservations() {
            let tokenType = await AsyncStorage.getItem('tokenType');
            let username = await AsyncStorage.getItem('username');
            setUsername(username);
            let accessToken = await AsyncStorage.getItem('accessToken');
            let role = await AsyncStorage.getItem('roles');
            setRole(role);
              let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 
                'Authorization': tokenType + " " + accessToken},
                body: JSON.stringify({"username": username})
              };
              let response = await fetch("http://localhost:30000/api/v1/users/getUserUsername", requestOptions);
              let responseJson = await response.json();
              let id = responseJson['id'];
              requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 
                'Authorization': tokenType + " " + accessToken},
                body: JSON.stringify({"id": id})
              };
              if (role === 'ROLE_USER') {
                response = await fetch("http://localhost:30000/api/v1/reservations/getReservationUser", requestOptions);
                responseJson = await response.json();
                setInformations(responseJson);
              } else {
                response = await fetch("http://localhost:30000/api/v1/reservations/getReservationOther", requestOptions);
                responseJson = await response.json();
                setInformations(responseJson);
              }
              
        }
        getReservations();
    }, [])

    return(
        <View>
            <ScrollView>
                <Title style={{marginBottom: 30, textAlign: 'center', marginTop: 30, fontSize: 26}}>Lista prenotazioni di '{username}'</Title>
                {informations != null && informations.map((reservation, i) => {
                    let dateOfCancellation = new Date(reservation.dateOfCancellation);
                    dateOfCancellation.setHours(0, 0, 0, 0);
                    let today = new Date();
                    let DateToday = new Date((today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear())
                    let dateOfReservation = new Date(reservation.dateOfReservation);
                    let dateOfReservationStart = new Date(reservation.startDate);
                    let dateOfReservationEnd = new Date(reservation.endDate);
                    if (role != null && role === 'ROLE_USER') {
                        if (reservation['userTo']['roles'][0]['name'] === 'ROLE_STRUCTURE') {
                            return (
                                <View style={styles.informations} key={i}>
                                <Title>Prenotazione {reservation.id} - Effettuata il: {('0' + dateOfReservation.getDate()).slice(-2) + '/' + ('0' + (dateOfReservation.getMonth()+1)).slice(-2) + '/' + dateOfReservation.getFullYear()}</Title>
                                    <Title>Prezzo totale: {parseFloat(reservation.prezzo).toFixed(2) + "€"}</Title>
                                    <View
                                        style={{
                                            borderBottomColor: 'black',
                                            borderBottomWidth: 1,
                                            marginTop: 10,
                                            marginBottom: 10
                                        }}
                                    />
                                    <Title>Data inizio: {('0' + dateOfReservationStart.getDate()).slice(-2) + '/' + ('0' + (dateOfReservationStart.getMonth()+1)).slice(-2) + '/' + dateOfReservationStart.getFullYear()}</Title>
                                    <Title>Data fine: {('0' + dateOfReservationEnd.getDate()).slice(-2) + '/' + ('0' + (dateOfReservationEnd.getMonth()+1)).slice(-2) + '/' + dateOfReservationEnd.getFullYear()}</Title>
                                    <Title>Nome struttura: {reservation.userTo.nomeStruttura}</Title>
                                    <Title>Nome e cognome titolare: {reservation.userTo.nome + " " + reservation.userTo.cognome}</Title>
                                    <Title>Email: {reservation.userTo.email}</Title>
                                    <Title>Telefono: {reservation.userTo.telefono}</Title>
                                    <Title>Indirizzo: {reservation.userTo.indirizzo + ", " + reservation.userTo.citta + ", " + reservation.userTo.cap}</Title>
                                    {reservation.cure !== null && <Title>Cure: {reservation.cure}</Title>}
                                    {reservation.socievole !== null && <Title>Socievole: {reservation.socievole}</Title>}
                                    <Title>Pagamento: {reservation.transactionId === null ? "Contanti" : "Pagato online con Paypal"}</Title>
                                    {dateOfCancellation >= DateToday && <Title>Termine massimo di annullamento: {dateOfCancellation.getDate() + "-"+ parseInt(dateOfCancellation.getMonth()+1) +"-"+dateOfCancellation.getFullYear()}</Title>}
                                </View>
                            );
                        } else {
                            return (
                                <View style={styles.informations} key={i}>
                                <Title>Prenotazione {reservation.id} - Effettuata il: {('0' + dateOfReservation.getDate()).slice(-2) + '/' + ('0' + (dateOfReservation.getMonth()+1)).slice(-2) + '/' + dateOfReservation.getFullYear()}</Title>
                                    <Title>Prezzo totale: {parseFloat(reservation.prezzo).toFixed(2) + "€"}</Title>
                                    <View
                                        style={{
                                            borderBottomColor: 'black',
                                            borderBottomWidth: 1,
                                            marginTop: 10,
                                            marginBottom: 10
                                        }}
                                    />
                                    <Title>Data inizio: {('0' + dateOfReservationStart.getDate()).slice(-2) + '/' + ('0' + (dateOfReservationStart.getMonth()+1)).slice(-2) + '/' + dateOfReservationStart.getFullYear()}</Title>
                                    <Title>Data fine: {('0' + dateOfReservationEnd.getDate()).slice(-2) + '/' + ('0' + (dateOfReservationEnd.getMonth()+1)).slice(-2) + '/' + dateOfReservationEnd.getFullYear()}</Title>
                                    <Title>Nome petsitter: {reservation.userTo.nomeStruttura}</Title>
                                    <Title>Nome e cognome petsitter: {reservation.userTo.nome + " " + reservation.userTo.cognome}</Title>
                                    <Title>Email: {reservation.userTo.email}</Title>
                                    <Title>Telefono: {reservation.userTo.telefono}</Title>
                                    <Title>Indirizzo: {reservation.userTo.indirizzo + ", " + reservation.userTo.citta + ", " + reservation.userTo.cap}</Title>
                                    {reservation.cure !== null && <Title>Cure: {reservation.cure}</Title>}
                                    {reservation.socievole !== null && <Title>Socievole: {reservation.socievole}</Title>}
                                    <Title>Pagamento: {reservation.transactionId === null ? "Contanti" : "Pagato online con Paypal"}</Title>
                                    {dateOfCancellation >= DateToday && <Title>Termine massimo di annullamento: {('0' + dateOfCancellation.getDate()).slice(-2) + '/' + ('0' + (dateOfCancellation.getMonth()+1)).slice(-2) + '/' + dateOfCancellation.getFullYear()}</Title>}
                                </View>
                            );
                        }
                    } else {
                        return (
                            <View style={styles.informations} key={i}>
                                <Title>Prenotazione {reservation.id} - Effettuata il: {('0' + dateOfReservation.getDate()).slice(-2) + '/' + ('0' + (dateOfReservation.getMonth()+1)).slice(-2) + '/' + dateOfReservation.getFullYear()}</Title>
                                <Title>Prezzo totale: {parseFloat(reservation.prezzo).toFixed(2) + "€"}</Title>
                                <View
                                    style={{
                                        borderBottomColor: 'black',
                                        borderBottomWidth: 1,
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}
                                />
                                <Title>Data inizio: {('0' + dateOfReservationStart.getDate()).slice(-2) + '/' + ('0' + (dateOfReservationStart.getMonth()+1)).slice(-2) + '/' + dateOfReservationStart.getFullYear()}</Title>
                                <Title>Data fine: {('0' + dateOfReservationEnd.getDate()).slice(-2) + '/' + ('0' + (dateOfReservationEnd.getMonth()+1)).slice(-2) + '/' + dateOfReservationEnd.getFullYear()}</Title>
                                <Title>Nome cliente: {reservation.user.nome}</Title>
                                <Title>Cognome cliente: {reservation.user.cognome}</Title>
                                <Title>Email: {reservation.user.email}</Title>
                                <Title>Telefono: {reservation.user.telefono}</Title>
                                <Title>Indirizzo: {reservation.user.indirizzo + ", " + reservation.user.citta + ", " + reservation.user.cap}</Title>
                                {reservation.cure !== null && <Title>Cure: {reservation.cure}</Title>}
                                {reservation.socievole !== null && <Title>Socievole: {reservation.socievole}</Title>}
                                <Title>Pagamento: {reservation.transactionId === null ? "Contanti" : "Pagato online con Paypal"}</Title>
                                {dateOfCancellation >= DateToday && <Title>Termine massimo di annullamento: {('0' + dateOfCancellation.getDate()).slice(-2) + '/' + ('0' + (dateOfCancellation.getMonth()+1)).slice(-2) + '/' + dateOfCancellation.getFullYear()}</Title>}
                            </View>
                        )
                    }
                })}
            </ScrollView>
        </View>
    )
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