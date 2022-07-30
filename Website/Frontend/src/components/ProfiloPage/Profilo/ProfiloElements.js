import styled from 'styled-components';
import {FaUserCircle, FaList} from "react-icons/fa";
import {MdLogout} from "react-icons/md";
import { useState } from 'react';
import { useEffect } from 'react';
import {ErrorMessage, Formik} from 'formik';
import {Button, Form, Row, Col} from 'react-bootstrap';
import * as yup from 'yup';
import moment from 'moment';
import $ from 'jquery';
import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';

const ListContainer = styled.div`
    width: 90%;
    margin: 0 auto;

    @media screen and (max-width: 790px) {
        width: 100%;
    }
`

const ReservationContainer = styled.div`
    background-color: #121826;
    padding: 1rem;
    border-radius: 10px;
    margin: 30px auto;
`

const Separator = styled.hr`
    border-top: 5px solid white;
    border-radius: 2px;
`

const HeaderWrapper = styled.div`
    display: flex;

    .headerPrice {
        width: 30%;
        text-align: right;
    }

    .headerDate {
        width: 70%;
    }

    @media screen and (max-width: 1290px) {
        display: flex;
        flex-wrap: wrap;
        
        label {
            text-align: left !important;
            width: 100% !important;
        }
    }
`

const BodyWrapper = styled.div`
    display: flex;
    margin-bottom: 20px;

    @media screen and (max-width: 1290px) {
        display: flex;
        flex-wrap: wrap;
        
        label {
            width: 100% !important;
        }
    }
`

const TitleH1 = styled.h1`
    margin-bottom: 50px;
    @media screen and (max-width: 968px) {
        font-size: 36px;
        margin-bottom: 40px;
    }

    @media screen and (max-width: 600px) {
        font-size: 30px;
        margin-bottom: 30px;
    }
`

export const Profile = () => {
    const [activeProfilo, setActiveProfilo] = useState(true);
    const [activeLista, setActiveLista] = useState(false);
    const [edit, setEdit] = useState(false);
    const [change, setChange] = useState(false);


    const handleClickProfilo = () => {
        setActiveProfilo(true);
        setActiveLista(false);
    }
    
    const handleClickLista = () => {
        setActiveProfilo(false);
        setActiveLista(true);
    }
    
    const handleClickLogout = () => {
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("roles");
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("password");
    }

    const handleCancel = () => {
        setEdit(false);
    }

    const handleModify = () => {
        setEdit(true);
    }

    async function handleCancelReservation(id, transactionId) {
        if (transactionId != null) {
            // 1b. Point your server to the PayPal API
            let PAYPAL_OAUTH_API    = 'https://api-m.sandbox.paypal.com/v1/oauth2/token/';
            let PAYPAL_PAYMENTS_API = 'https://api-m.sandbox.paypal.com/v2/payments/captures/';

            // 1c. Get an access token from the PayPal API
            let auth = await fetch(PAYPAL_OAUTH_API, { 
                method: 'POST',
                headers: { 
                     'Accept': 'application/json', 
                     'Accept-Language': 'en_US',
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'Authorization': 'Basic ' + btoa(process.env.REACT_APP_PAYPAL_CLIENT + ":" + process.env.REACT_APP_PAYPAL_SECRET)
                },
                body: 'grant_type=client_credentials'
            
            })
            .catch(err => console.log(err))

            let responseJson = await auth.json();

            // 2. Get the capture ID from your database
            let captureID = transactionId;

            // 3. Call PayPal to refund the transaction
            fetch(PAYPAL_PAYMENTS_API + captureID + '/refund', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + responseJson['access_token']
                }
            })
            .then(function (response) {
                if (response.ok) {
                    const requestOptions = {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json', 
                                   'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") }
                    };
                    fetch("http://localhost:30000/api/v1/reservations/deleteReservation/" + id, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data['message'].includes("Prenotazione cancellata!")) {
                            setChange(!change);
                            window.scrollTo(0, 0);
                            $("#successCancellation").fadeIn().delay(5000).fadeOut();
                        }
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        } else {
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 
                           'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") }
            };
            fetch("http://localhost:30000/api/v1/reservations/deleteReservation/" + id, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data['message'].includes("Prenotazione cancellata!")) {
                    setChange(!change);
                    window.scrollTo(0, 0);
                    $("#successCancellation").fadeIn().delay(5000).fadeOut();
                }
            })
            .catch(err => console.log(err));
        }
    }

    const [validateAfterSubmitStructure, setValidateAfterSubmitStructure] = useState(false);
    const [validateAfterSubmitPetsitter, setValidateAfterSubmitPetsitter] = useState(false);
    const [validateAfterSubmitUser, setValidateAfterSubmitUser] = useState(false);
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const priceRegExp = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)€?$/

    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [telefono, setTelefono] = useState('');
    const [nomeStruttura, setNomeStruttura] = useState('');
    const [capienza, setCapienza] = useState('');
    const [prezzo, setPrezzo] = useState('');
    const [indirizzo, setIndirizzo] = useState('');
    const [citta, setCitta] = useState('');
    const [cap, setCap] = useState('');
    const [workingDays, setWorkingDays] = useState([]);
    const [animali, setAnimali] = useState([]);
    const [provider, setProvider] = useState('');

    const [informations, setInformations] = useState(null);

    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                       'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
            body: JSON.stringify({
              "username": sessionStorage.getItem("username"),
            })
        };
        async function getInformations() {
            let response = await fetch("http://localhost:30000/api/v1/users/getUserUsername", requestOptions);
            let responseJson = await response.json();
            setId(responseJson['id']);
            setEmail(responseJson['email']);
            setUsername(responseJson['username']);
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
            let giorniLavoro = responseJson['giorniLavoro'];
            let animali = responseJson['animaliDaAccudire'];
            if (edit) {
                $('#'+giorniLavoro.join('Form, #')+'Form').prop('checked', true);
                $('#'+animali+'Form').prop('checked', true);
            }
        }
        getInformations();
    }, [edit])

    useEffect(() => {
        if (id !== '') {
            if (sessionStorage.getItem('roles') === 'ROLE_USER'){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',
                            'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                    body: JSON.stringify({
                        "id": id
                    })
                };
                async function getInformations() {
                    let response = await fetch("http://localhost:30000/api/v1/reservations/getReservationUser", requestOptions)
                    setInformations(await response.json())
                }
                getInformations();
            } else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',
                            'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                    body: JSON.stringify({
                        "id": id
                    })
                };
                async function getInformations() {
                    let response = await fetch("http://localhost:30000/api/v1/reservations/getReservationOther", requestOptions)
                    setInformations(await response.json())
                }
                getInformations();
            }
        }
    }, [id, change])

    const schemaStructure = yup.object().shape({
        email: yup.string().email("L'email non è valida.").required("L'email è obbligatoria.").max(50, "L'email deve avere massimo 50 caratteri.")
                .test({
                    message: () => "L'email è già esistente",
                    test: async (values) => {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json',
                                       'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                            body: JSON.stringify({
                                "username": values,
                                "id": id
                            })
                        };
                        console.log(id);
                        let response = await fetch("http://localhost:30000/api/v1/users/availableUser", requestOptions)
                        if (response.ok) {
                            return true;
                            } else {
                            return false;
                            }
                    }
                }),
        username: yup.string().required("L'username è obbligatorio.").max(20, "L'username deve avere massimo 20 caratteri.")
                    .test({
                        message: () => "L'username è già esistente",
                        test: async (values) => {
                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json',
                                           'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                                body: JSON.stringify({
                                    "username": values,
                                    "id": id
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/users/availableUser", requestOptions)
                            if (response.ok) {
                                return true;
                                } else {
                                return false;
                                }
                        }
                    }),
        password: yup.string().min(6, 'La password deve essere minimo di 6 caratteri.').max(40, 'La password deve essere massimo di 40 caratteri.'),
        telephoneNumber: yup.string().matches(phoneRegExp, 'Numero di telefono non valido.').required("Il numero di telefono è obbligatorio.").max(20, 'Il numero di telefono deve avere massimo 20 caratteri.'),
        nomeStruttura: yup.string().required("Il nome della struttura è obbligatorio."),
        capienza: yup.string().required("La capienza è obbligatoria.").oneOf(['5', '10', '15', '20', '30', '40', '50'], 'Capienza non valida.'),
        price: yup.string().matches(priceRegExp, 'Prezzo non valido.').required('Il prezzo è obbligatorio.'),
        nomeTitolareStruttura: yup.string().required("Il nome titolare della struttura è obbligatorio."),
        cognomeTitolareStruttura: yup.string().required("Il cognome titolare della struttura è obbligatorio."),
        address: yup.string().required("L'indirizzo è obbligatorio."),
        city: yup.string().required("La città è obbligatoria."),
        cap: yup.string().required("Il Cap è obbligatorio.").max(15, 'Il Cap deve avere massimo 15 caratteri.'),
    });

    const schemaStructureLogin = yup.object().shape({
        username: yup.string().required("L'username è obbligatorio.").max(20, "L'username deve avere massimo 20 caratteri.")
                    .test({
                        message: () => "L'username è già esistente",
                        test: async (values) => {
                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json',
                                           'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                                body: JSON.stringify({
                                    "username": values,
                                    "id": id
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/users/availableUser", requestOptions)
                            if (response.ok) {
                                return true;
                                } else {
                                return false;
                                }
                        }
                    }),
        telephoneNumber: yup.string().matches(phoneRegExp, 'Numero di telefono non valido.').required("Il numero di telefono è obbligatorio.").max(20, 'Il numero di telefono deve avere massimo 20 caratteri.'),
        nomeStruttura: yup.string().required("Il nome della struttura è obbligatorio."),
        capienza: yup.string().required("La capienza è obbligatoria.").oneOf(['5', '10', '15', '20', '30', '40', '50'], 'Capienza non valida.'),
        price: yup.string().matches(priceRegExp, 'Prezzo non valido.').required('Il prezzo è obbligatorio.'),
        nomeTitolareStruttura: yup.string().required("Il nome titolare della struttura è obbligatorio."),
        cognomeTitolareStruttura: yup.string().required("Il cognome titolare della struttura è obbligatorio."),
        address: yup.string().required("L'indirizzo è obbligatorio."),
        city: yup.string().required("La città è obbligatoria."),
        cap: yup.string().required("Il Cap è obbligatorio.").max(15, 'Il Cap deve avere massimo 15 caratteri.'),
    });

    const schemaPetsitter = yup.object().shape({
        firstName: yup.string().required('Il nome è obbligatorio.'),
        lastName: yup.string().required('Il cognome è obbligatorio.'),
        email: yup.string().email("L'email non è valida.").required("L'email è obbligatoria.").max(50, "L'email deve avere massimo 50 caratteri.")
                        .test({
                            message: () => "L'email è già esistente",
                            test: async (values) => {
                                const requestOptions = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json',
                                            'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                                    body: JSON.stringify({
                                        "username": values,
                                        "id": id
                                    })
                                };
                                console.log(id);
                                let response = await fetch("http://localhost:30000/api/v1/users/availableUser", requestOptions)
                                if (response.ok) {
                                    return true;
                                    } else {
                                    return false;
                                    }
                            }
                        }),
        username: yup.string().required("L'username è obbligatorio.").max(20, "L'username deve avere massimo 20 caratteri.")
                            .test({
                                message: () => "L'username è già esistente",
                                test: async (values) => {
                                    const requestOptions = {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json',
                                                'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                                        body: JSON.stringify({
                                            "username": values,
                                            "id": id
                                        })
                                    };
                                    let response = await fetch("http://localhost:30000/api/v1/users/availableUser", requestOptions)
                                    if (response.ok) {
                                        return true;
                                        } else {
                                        return false;
                                        }
                                }
                            }),
        password: yup.string().min(6, 'La password deve essere minimo di 6 caratteri.').max(40, 'La password deve essere massimo di 40 caratteri.'),
        address: yup.string().required("L'indirizzo è obbligatorio."),
        city: yup.string().required("La città è obbligatoria."),
        cap: yup.string().required("Il Cap è obbligatorio.").max(15, 'Il Cap deve avere massimo 15 caratteri.'),
        telephoneNumber: yup.string().matches(phoneRegExp, 'Numero di telefono non valido.').required("Il numero di telefono è obbligatorio.").max(20, 'Il numero di telefono deve avere massimo 20 caratteri.'),
        price: yup.string().matches(priceRegExp, 'Prezzo non valido.').required('Il prezzo è obbligatorio.'),
        workingDay: yup.array().required('Selezionare almeno un giorno di lavoro.').min(1, 'Selezionare almeno un giorno di lavoro.'),
        animali: yup.array().required('Selezionare almeno una categoria di animali.').min(1, 'Selezionare almeno una categoria di animali.'),
    })

    const schemaPetsitterLogin = yup.object().shape({
        firstName: yup.string().required('Il nome è obbligatorio.'),
        lastName: yup.string().required('Il cognome è obbligatorio.'),
        username: yup.string().required("L'username è obbligatorio.").max(20, "L'username deve avere massimo 20 caratteri.")
                            .test({
                                message: () => "L'username è già esistente",
                                test: async (values) => {
                                    const requestOptions = {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json',
                                                'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                                        body: JSON.stringify({
                                            "username": values,
                                            "id": id
                                        })
                                    };
                                    let response = await fetch("http://localhost:30000/api/v1/users/availableUser", requestOptions)
                                    if (response.ok) {
                                        return true;
                                        } else {
                                        return false;
                                        }
                                }
                            }),
        address: yup.string().required("L'indirizzo è obbligatorio."),
        city: yup.string().required("La città è obbligatoria."),
        cap: yup.string().required("Il Cap è obbligatorio.").max(15, 'Il Cap deve avere massimo 15 caratteri.'),
        telephoneNumber: yup.string().matches(phoneRegExp, 'Numero di telefono non valido.').required("Il numero di telefono è obbligatorio.").max(20, 'Il numero di telefono deve avere massimo 20 caratteri.'),
        price: yup.string().matches(priceRegExp, 'Prezzo non valido.').required('Il prezzo è obbligatorio.'),
        workingDay: yup.array().required('Selezionare almeno un giorno di lavoro.').min(1, 'Selezionare almeno un giorno di lavoro.'),
        animali: yup.array().required('Selezionare almeno una categoria di animali.').min(1, 'Selezionare almeno una categoria di animali.'),
    })

    const schemaUser = yup.object().shape({
        email: yup.string().email("L'email non è valida.").required("L'email è obbligatoria.").max(50, "L'email deve avere massimo 50 caratteri.")
                        .test({
                            message: () => "L'email è già esistente",
                            test: async (values) => {
                                const requestOptions = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json',
                                            'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                                    body: JSON.stringify({
                                        "username": values,
                                        "id": id
                                    })
                                };
                                console.log(id);
                                let response = await fetch("http://localhost:30000/api/v1/users/availableUser", requestOptions)
                                if (response.ok) {
                                    return true;
                                    } else {
                                    return false;
                                    }
                            }
                        }),
        username: yup.string().required("L'username è obbligatorio.").max(20, "L'username deve avere massimo 20 caratteri.")
                            .test({
                                message: () => "L'username è già esistente",
                                test: async (values) => {
                                    const requestOptions = {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json',
                                                'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                                        body: JSON.stringify({
                                            "username": values,
                                            "id": id
                                        })
                                    };
                                    let response = await fetch("http://localhost:30000/api/v1/users/availableUser", requestOptions)
                                    if (response.ok) {
                                        return true;
                                        } else {
                                        return false;
                                    }
                                }
                            }),
        password: yup.string().min(6, 'La password deve essere minimo di 6 caratteri.').max(40, 'La password deve essere massimo di 40 caratteri.'),
        firstName: yup.string().required('Il nome è obbligatorio.'),
        lastName: yup.string().required('Il cognome è obbligatorio.'),
        telephoneNumber: yup.string().matches(phoneRegExp, 'Numero di telefono non valido.').required("Il numero di telefono è obbligatorio.").max(20, 'Il numero di telefono deve avere massimo 20 caratteri.'),
        address: yup.string(),
        city: yup.string(),
        cap: yup.string().max(15, 'Il Cap deve avere massimo 15 caratteri.'),
    });

    const schemaUserLogin = yup.object().shape({
        username: yup.string().required("L'username è obbligatorio.").max(20, "L'username deve avere massimo 20 caratteri.")
                            .test({
                                message: () => "L'username è già esistente",
                                test: async (values) => {
                                    const requestOptions = {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json',
                                                'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                                        body: JSON.stringify({
                                            "username": values,
                                            "id": id
                                        })
                                    };
                                    let response = await fetch("http://localhost:30000/api/v1/users/availableUser", requestOptions)
                                    if (response.ok) {
                                        return true;
                                        } else {
                                        return false;
                                    }
                                }
                            }),
        firstName: yup.string().required('Il nome è obbligatorio.'),
        lastName: yup.string().required('Il cognome è obbligatorio.'),
        telephoneNumber: yup.string().matches(phoneRegExp, 'Numero di telefono non valido.').required("Il numero di telefono è obbligatorio.").max(20, 'Il numero di telefono deve avere massimo 20 caratteri.'),
        address: yup.string(),
        city: yup.string(),
        cap: yup.string().max(15, 'Il Cap deve avere massimo 15 caratteri.'),
    });

    const ListaPrenotazioni = () => {
        if (informations != null){
            moment.locale('it');
            if (sessionStorage.getItem('roles') === 'ROLE_USER') {
                return(
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <TitleH1>Lista delle prenotazioni di "{username}"</TitleH1>
                        <ListContainer>
                            <div id="successCancellation" style={{display: "none", marginTop: "20px"}} class="alert alert-success" role="alert">
                                Prenotazione cancellata con successo!
                            </div>
                            {informations.map(reservation => {
                                let dateOfCancellation = new Date(reservation['dateOfCancellation']);
                                dateOfCancellation.setHours(0, 0, 0, 0);
                                let today = new Date();
                                let DateToday = new Date((today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear())
                                if (reservation['userTo']['roles'][0]['name'] === 'ROLE_STRUCTURE') {
                                    return (
                                        <ReservationContainer>
                                            <HeaderWrapper>
                                                <Form.Label className="headerDate">Prenotazione {reservation['id']} - Effettuata il: {moment(reservation['dateOfReservation']).format('DD/MM/yyyy')}</Form.Label>
                                                <Form.Label className="headerPrice">Prezzo totale: {parseFloat(reservation['prezzo']).toFixed(2) + "€"}</Form.Label>
                                            </HeaderWrapper>
                                            <Separator></Separator>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "50%"}}>Data di inizio: {moment(reservation['startDate']).format('DD/MM/yyyy')}</Form.Label>
                                                <Form.Label style={{width: "50%"}}>Data di fine: {moment(reservation['endDate']).format('DD/MM/yyyy')}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "50%"}}>Nome struttura: {reservation['userTo']['nomeStruttura']}</Form.Label>
                                                <Form.Label style={{width: "50%"}}>Nome e cognome titolare: {reservation['userTo']['nome'] + " " + reservation['userTo']['cognome']}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "50%"}}>Email: {reservation['userTo']['email']}</Form.Label>
                                                <Form.Label style={{width: "50%"}}>Telefono: {reservation['userTo']['telefono']}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "100%"}}>Indirizzo: {reservation['userTo']['indirizzo'] + ", " + reservation['userTo']['citta'] + ", " + reservation['userTo']['cap']}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper style={{display: reservation['cure'] === null && reservation['socievole'] === null ? "none" : "flex"}}>
                                                <Form.Label style={{width: "50%", display: reservation['cure'] === null ? "none" : "block"}}>Cure: {reservation['cure']}</Form.Label>
                                                <Form.Label style={{width: "50%", display: reservation['socievole'] === null ? "none" : "block"}}>Socievole: {reservation['socievole']}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "100%"}}>Pagamento: {reservation['transactionId'] === null ? "Contanti" : "Pagato online con Paypal"}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper style={{display: dateOfCancellation < DateToday ? "none" : "block"}}>
                                                <Form.Label style={{width: "100%"}}>Termine massimo di annullamento: {moment(reservation['dateOfCancellation']).format('DD/MM/yyyy')}</Form.Label>
                                            </BodyWrapper>
                                            <Button onClick={() => handleCancelReservation(reservation['id'], reservation['transactionId'], reservation['prezzo'])} style={{display: dateOfCancellation >= DateToday && reservation['transactionId'] === null ? "flex" : "none", margin: "0 auto"}}>Annulla prenotazione</Button>
                                            <Button onClick={() => handleCancelReservation(reservation['id'], reservation['transactionId'], reservation['prezzo'])} style={{display: dateOfCancellation >= DateToday && reservation['transactionId'] !== null ? "flex" : "none", margin: "0 auto"}}>Annulla prenotazione e richiedi rimborso tramite Paypal</Button>
                                        </ReservationContainer>
                                    )
                                } else {
                                    return (
                                        <ReservationContainer>
                                            <div id="successCancellation" style={{display: "none"}} class="alert alert-success" role="alert">
                                                Prenotazione cancellata con successo!
                                            </div>
                                            <HeaderWrapper>
                                                <Form.Label className="headerDate">Prenotazione {reservation['id']} - Effettuata il: {moment(reservation['dateOfReservation']).format('DD/MM/yyyy')}</Form.Label>
                                                <Form.Label className="headerPrice">Prezzo totale: {parseFloat(reservation['prezzo']).toFixed(2) + "€"}</Form.Label>
                                            </HeaderWrapper>
                                            <Separator></Separator>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "50%"}}>Data di inizio: {moment(reservation['startDate']).format('DD/MM/yyyy')}</Form.Label>
                                                <Form.Label style={{width: "50%"}}>Data di fine: {moment(reservation['endDate']).format('DD/MM/yyyy')}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "50%"}}>Nome petsitter: {reservation['userTo']['nome']}</Form.Label>
                                                <Form.Label style={{width: "50%"}}>Cognome petsitter: {reservation['userTo']['cognome']}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "50%"}}>Email: {reservation['userTo']['email']}</Form.Label>
                                                <Form.Label style={{width: "50%"}}>Telefono: {reservation['userTo']['telefono']}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "100%"}}>Indirizzo: {reservation['userTo']['indirizzo'] + ", " + reservation['userTo']['citta'] + ", " + reservation['userTo']['cap']}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper style={{display: reservation['cure'] === null && reservation['socievole'] === null ? "none" : "flex"}}>
                                                <Form.Label style={{width: "50%", display: reservation['cure'] === null ? "none" : "block"}}>Cure: {reservation['cure']}</Form.Label>
                                                <Form.Label style={{width: "50%", display: reservation['socievole'] === null ? "none" : "block"}}>Socievole: {reservation['socievole']}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper>
                                                <Form.Label style={{width: "100%"}}>Pagamento: {reservation['transactionId'] === null ? "Contanti" : "Pagato online con Paypal"}</Form.Label>
                                            </BodyWrapper>
                                            <BodyWrapper style={{display: dateOfCancellation < DateToday ? "none" : "block"}}>
                                                <Form.Label style={{width: "100%"}}>Termine massimo di annullamento: {moment(reservation['dateOfCancellation']).format('DD/MM/yyyy')}</Form.Label>
                                            </BodyWrapper>
                                            <Button onClick={() => handleCancelReservation(reservation['id'], reservation['transactionId'], reservation['prezzo'])} style={{display: dateOfCancellation >= DateToday && reservation['transactionId'] === null ? "flex" : "none", margin: "0 auto"}}>Annulla prenotazione</Button>
                                            <Button onClick={() => handleCancelReservation(reservation['id'], reservation['transactionId'], reservation['prezzo'])} style={{display: dateOfCancellation >= DateToday && reservation['transactionId'] !== null ? "flex" : "none", margin: "0 auto"}}>Annulla prenotazione e richiedi rimborso tramite Paypal</Button>
                                        </ReservationContainer>
                                    )
                                }
                            })}
                        </ListContainer>
                    </div>
                )
            } else {
                return(
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <TitleH1>Lista delle prenotazioni per "{username}"</TitleH1>
                        <ListContainer>
                            {informations.map(reservation => {
                                let dateOfCancellation = new Date(reservation['dateOfCancellation']);
                                dateOfCancellation.setHours(0, 0, 0, 0);
                                let today = new Date();
                                let DateToday = new Date((today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear())
                                return (
                                    <ReservationContainer>
                                        <div id="successCancellation" style={{display: "none"}} class="alert alert-success" role="alert">
                                            Prenotazione cancellata con successo!
                                        </div>
                                        <HeaderWrapper>
                                            <Form.Label className="headerDate">Prenotazione {reservation['id']} - Effettuata il: {moment(reservation['dateOfReservation']).format('DD/MM/yyyy')}</Form.Label>
                                            <Form.Label className="headerPrice">Prezzo totale: {parseFloat(reservation['prezzo']).toFixed(2) + "€"}</Form.Label>
                                        </HeaderWrapper>
                                        <Separator></Separator>
                                        <BodyWrapper>
                                            <Form.Label style={{width: "50%"}}>Data di inizio: {moment(reservation['startDate']).format('DD/MM/yyyy')}</Form.Label>
                                            <Form.Label style={{width: "50%"}}>Data di fine: {moment(reservation['endDate']).format('DD/MM/yyyy')}</Form.Label>
                                        </BodyWrapper>
                                        <BodyWrapper>
                                            <Form.Label style={{width: "50%"}}>Nome cliente: {reservation['user']['nome']}</Form.Label>
                                            <Form.Label style={{width: "50%"}}>Cognome cliente: {reservation['user']['cognome']}</Form.Label>
                                        </BodyWrapper>
                                        <BodyWrapper>
                                            <Form.Label style={{width: "50%"}}>Email: {reservation['user']['email']}</Form.Label>
                                            <Form.Label style={{width: "50%"}}>Telefono: {reservation['user']['telefono']}</Form.Label>
                                        </BodyWrapper>
                                        <BodyWrapper>
                                            <Form.Label style={{width: "100%"}}>Indirizzo: {reservation['user']['indirizzo'] + ", " + reservation['user']['citta'] + ", " + reservation['user']['cap']}</Form.Label>
                                        </BodyWrapper>
                                        <BodyWrapper style={{display: reservation['cure'] === null && reservation['socievole'] === null ? "none" : "flex"}}>
                                            <Form.Label style={{width: "50%", display: reservation['cure'] === null ? "none" : "block"}}>Cure: {reservation['cure']}</Form.Label>
                                            <Form.Label style={{width: "50%", display: reservation['socievole'] === null ? "none" : "block"}}>Socievole: {reservation['socievole']}</Form.Label>
                                        </BodyWrapper>
                                        <BodyWrapper>
                                            <Form.Label style={{width: "100%"}}>Pagamento: {reservation['transactionId'] === null ? "Contanti" : "Pagato online con Paypal"}</Form.Label>
                                        </BodyWrapper>
                                        <BodyWrapper style={{display: dateOfCancellation < DateToday ? "none" : "block"}}>
                                            <Form.Label style={{width: "100%"}}>Termine massimo di annullamento: {moment(reservation['dateOfCancellation']).format('DD/MM/yyyy')}</Form.Label>
                                        </BodyWrapper>
                                    </ReservationContainer>
                                )
                            })}
                        </ListContainer>
                    </div>
                )
            }            
        }
    }

    const ProfiloStruttura = () => {
        if (sessionStorage.getItem("roles") === 'ROLE_STRUCTURE' && !edit) {
            return(
                <div>
                    <TitleH1>Profilo "{nomeStruttura}"</TitleH1>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            email: email,
                            username: username,
                            telephoneNumber: telefono,
                            nomeStruttura: nomeStruttura,
                            capienza: capienza,
                            price: prezzo + "€",
                            nomeTitolareStruttura: nome,
                            cognomeTitolareStruttura: cognome,
                            address: indirizzo,
                            city: citta,
                            cap: cap,
                            }}
                        >
                        {({
                            values,
                        }) => (
                            <Form className="profileForm" style={{color: "#fff"}}>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="validationFormik01" className="position-relative">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            readOnly={true}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik02" className="position-relative">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={values.username}
                                            readOnly={true}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="validationFormik07" className="position-relative">
                                        <Form.Label>Nome titolare struttura</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nomeTitolareStruttura"
                                            value={values.nomeTitolareStruttura}
                                            readOnly={true}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik08" className="position-relative">
                                        <Form.Label>Cognome titolare struttura</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cognomeTitolareStruttura"
                                            value={values.cognomeTitolareStruttura}
                                            readOnly={true}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik04" className="position-relative">
                                        <Form.Label>Numero di telefono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telephoneNumber"
                                            value={values.telephoneNumber}
                                            readOnly={true}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="validationFormik05" className="position-relative">
                                        <Form.Label>Nome struttura</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nomeStruttura"
                                            value={values.nomeStruttura}
                                            readOnly={true}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik06" className="position-relative">
                                        <Form.Label>Capienza</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="capienza"
                                            value={values.capienza}
                                            readOnly={true}
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" controlId="validationFormik41" className="position-relative">
                                    <Form.Label>Prezzo (in euro)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="price"
                                        readOnly={true}
                                        value={values.price}
                                    />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="validationFormik09" className="position-relative">
                                        <Form.Label>Indirizzo e numero civico</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            readOnly={true}
                                            value={values.address}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik10" className="position-relative">
                                        <Form.Label>Città</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            readOnly={true}
                                            value={values.city}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik11" className="position-relative">
                                        <Form.Label>Cap</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cap"
                                            readOnly={true}
                                            value={values.cap}
                                        />
                                    </Form.Group>
                                </Row>
                                <Button onClick={() => {
                                    handleModify();
                                }}>Modifica profilo</Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )
        } else if (sessionStorage.getItem("roles") === 'ROLE_STRUCTURE' && edit) {
            return (
                <div>
                    <TitleH1>Modifica profilo "{nomeStruttura}"</TitleH1>
                    <Formik
                    validationSchema={provider === 'Local' ? schemaStructure : schemaStructureLogin}
                    enableReinitialize={true}
                    validateOnChange={validateAfterSubmitStructure}
                    validateOnBlur={false}
                    onSubmit={(values) => {
                        sessionStorage.setItem("username", values.username);
                        sessionStorage.setItem("email", values.email);
                        let body = null;
                        if (values.password === '') {
                            body = JSON.stringify({
                                "username": values.username,
                                "email": values.email,
                                "telefono": values.telephoneNumber,
                                "nomeStruttura": values.nomeStruttura,
                                "capienza": parseInt(values.capienza),
                                "prezzo": values.price,
                                "nome": values.nomeTitolareStruttura,
                                "cognome": values.cognomeTitolareStruttura,
                                "indirizzo": values.address,
                                "citta": values.city,
                                "cap": values.cap,
                                "role": ['structure']
                            })
                        } else {
                            body = JSON.stringify({
                                "username": values.username,
                                "password": values.password,
                                "email": values.email,
                                "telefono": values.telephoneNumber,
                                "nomeStruttura": values.nomeStruttura,
                                "capienza": parseInt(values.capienza),
                                "prezzo": values.price,
                                "nome": values.nomeTitolareStruttura,
                                "cognome": values.cognomeTitolareStruttura,
                                "indirizzo": values.address,
                                "citta": values.city,
                                "cap": values.cap,
                                "role": ['structure']
                            })
                        }
                        const requestOptions = {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 
                                       'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                            body: body
                        };
                        fetch("http://localhost:30000/api/v1/users/updateProfile/" + id, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            if (data['message'].includes('User updated!')) {
                                let password = CryptoAES.decrypt(sessionStorage.getItem("password"), "taass").toString(CryptoENC);
                                if (values.password !== '') {
                                    password = values.password;
                                }
                                const requestOptions = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({"username": values.username, "password": password})
                                };
                                fetch("http://localhost:30000/api/v1/auth/signin", requestOptions)
                                .then(response => response.json())
                                .then(data => {
                                    sessionStorage.setItem("username", data['username']);
                                    sessionStorage.setItem("email", data['email']);
                                    sessionStorage.setItem("roles", data['roles']);
                                    sessionStorage.setItem("isLoggedIn", true);  
                                    sessionStorage.setItem("tokenType", data['tokenType']);
                                    sessionStorage.setItem("accessToken", data['accessToken']);
                                    sessionStorage.setItem("password", CryptoAES.encrypt(password, "taass"))
                                    window.location.reload(false);
                                })
                                .catch(err => console.log(err))
                            }
                        })
                        .catch(err => console.log(err))
                    }}
                    initialValues={{
                        email: email,
                        username: username,
                        password: '',
                        telephoneNumber: telefono,
                        nomeStruttura: nomeStruttura,
                        capienza: capienza,
                        price: prezzo + "€",
                        nomeTitolareStruttura: nome,
                        cognomeTitolareStruttura: cognome,
                        address: indirizzo,
                        city: citta,
                        cap: cap,
                    }}
                    >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                    }) => (
                        <Form className="profileForm" noValidate style={{color: "#fff"}} onSubmit={handleSubmit}>
                            <Row className="mb-3">
                            {provider === 'Local' && <Form.Group as={Col} controlId="validationFormik01" className="position-relative">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>}
                                <Form.Group as={Col} md="4" controlId="validationFormik02" className="position-relative">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={values.username}
                                        onChange={handleChange}
                                        isInvalid={!!errors.username}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {provider === 'Local' && <Form.Group as={Col} controlId="validationFormik03" className="position-relative">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={values.password}
                                        onChange={handleChange}
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>}
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="validationFormik07" className="position-relative">
                                    <Form.Label>Nome titolare struttura</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nomeTitolareStruttura"
                                        placeholder="Nome"
                                        onChange={handleChange}
                                        value={values.nomeTitolareStruttura}
                                        isInvalid={!!errors.nomeTitolareStruttura}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.nomeTitolareStruttura}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className="position-relative">
                                    <Form.Label>Cognome titolare struttura</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cognomeTitolareStruttura"
                                        placeholder="Nome"
                                        onChange={handleChange}
                                        value={values.cognomeTitolareStruttura}
                                        isInvalid={!!errors.cognomeTitolareStruttura}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.cognomeTitolareStruttura}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik04" className="position-relative">
                                    <Form.Label>Numero di telefono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="telephoneNumber"
                                        placeholder="Numero di telefono"
                                        value={values.telephoneNumber}
                                        onChange={handleChange}
                                        isInvalid={!!errors.telephoneNumber}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.telephoneNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="validationFormik05" className="position-relative">
                                    <Form.Label>Nome struttura</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nomeStruttura"
                                        placeholder="Nome della struttura"
                                        value={values.nomeStruttura}
                                        onChange={handleChange}
                                        isInvalid={!!errors.nomeStruttura}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.nomeStruttura}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik06" className="position-relative">
                                    <Form.Label>Capienza</Form.Label>
                                    <Form.Control 
                                        as="select"
                                        name="capienza"
                                        className='form-select'
                                        value={values.capienza}
                                        onChange={handleChange}
                                        isInvalid={!!errors.capienza}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="40">40</option>
                                        <option value="50">50</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.capienza}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="validationFormik41" className="position-relative">
                                <Form.Label>Prezzo (in euro)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    placeholder="Prezzo (in euro)"
                                    value={values.price}
                                    onChange={handleChange}
                                    isInvalid={!!errors.price}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.price}
                                </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="validationFormik09" className="position-relative">
                                    <Form.Label>Indirizzo e numero civico</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Strada Torino 24"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        isInvalid={!!errors.address}
                                    />
                                    <Form.Control.Feedback tooltip type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik10" className="position-relative">
                                    <Form.Label>Città</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Torino"
                                        name="city"
                                        value={values.city}
                                        onChange={handleChange}
                                        isInvalid={!!errors.city}
                                    />
                                    <Form.Control.Feedback tooltip type="invalid">
                                        {errors.city}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik11" className="position-relative">
                                    <Form.Label>Cap</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="10121"
                                        name="cap"
                                        value={values.cap}
                                        onChange={handleChange}
                                        isInvalid={!!errors.cap}
                                    />
                                    <Form.Control.Feedback tooltip type="invalid">
                                        {errors.cap}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Button style={{marginRight: "20px", marginTop: "20px"}} onClick={() => {
                                setValidateAfterSubmitStructure(true);
                                handleSubmit();
                            }}>Applica modifiche</Button>
                            <Button style={{marginTop: "20px"}} onClick={() => {
                                handleCancel();
                            }}>Annulla modifiche</Button>
                        </Form>
                    )}
                </Formik>
            </div>
            )    
        } else if (sessionStorage.getItem("roles") === 'ROLE_PETSITTER' && !edit) {
            return(
                <div>
                    <TitleH1>Profilo "{username}"</TitleH1>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            firstName: nome,
                            lastName: cognome,
                            email: email,
                            username: username,
                            address: indirizzo,
                            city: citta,
                            cap: cap,
                            telephoneNumber: telefono,
                            price: prezzo + '€',
                            working: workingDays,
                            animals: animali,
                            }}
                        >
                        {({
                            values,
                        }) => {
                            return(
                                <Form className="profileForm" style={{color: "#fff"}}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={values.username}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Nome petsitter</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={values.firstName}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Cognome petsitter</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={values.lastName}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Numero di telefono</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="telephoneNumber"
                                                value={values.telephoneNumber}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Indirizzo e numero civico</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                readOnly={true}
                                                value={values.address}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Città</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                readOnly={true}
                                                value={values.city}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Cap</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="cap"
                                                readOnly={true}
                                                value={values.cap}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="4" className="position-relative">
                                        <Form.Label>Prezzo (in euro)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="price"
                                            readOnly={true}
                                            value={values.price}
                                        />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-2" style={{width: "70%"}}>
                                        <Form.Group as={Col}>
                                        <Form.Label>Giorni di disponibilità</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="working"
                                            readOnly={true}
                                            value={values.working}
                                        />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                        <Form.Label>Animali che vuoi accudire</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="animals"
                                            readOnly={true}
                                            value={values.animals}
                                        />
                                        </Form.Group>
                                    </Row>
                                    <Button style={{marginTop: "20px"}} onClick={() => {
                                        handleModify();
                                    }}>Modifica profilo</Button>
                                </Form>
                            )
                    }}
                    </Formik>
                </div>
            )
        } else if (sessionStorage.getItem("roles") === 'ROLE_PETSITTER' && edit) {
            return (
                <div>
                    <TitleH1>Modifica profilo "{username}"</TitleH1>
                    <Formik
                    validationSchema={provider === 'Local' ? schemaPetsitter : schemaPetsitterLogin}
                    enableReinitialize={true}
                    validateOnChange={validateAfterSubmitPetsitter}
                    validateOnBlur={false}
                    onSubmit={(values) => {
                        sessionStorage.setItem("username", values.username);
                        sessionStorage.setItem("email", values.email);
                        let body = null;
                        if (values.password === '') {
                            body = JSON.stringify({
                                "nome": values.firstName,
                                "cognome": values.lastName,
                                "email": values.email,
                                "username": values.username,
                                "indirizzo": values.address,
                                "citta": values.city,
                                "cap": values.cap,
                                "telefono": values.telephoneNumber,
                                "prezzo": values.price,
                                "giorniLavoro": values.workingDay,
                                "animaliDaAccudire": values.animali[0],
                                "role": ['petsitter']
                            })
                        } else {
                            body = JSON.stringify({
                                "nome": values.firstName,
                                "cognome": values.lastName,
                                "email": values.email,
                                "username": values.username,
                                "password": values.password,
                                "indirizzo": values.address,
                                "citta": values.city,
                                "cap": values.cap,
                                "telefono": values.telephoneNumber,
                                "prezzo": values.price,
                                "giorniLavoro": values.workingDay,
                                "animaliDaAccudire": values.animali[0],
                                "role": ['petsitter']
                            })
                        }
                        const requestOptions = {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 
                                    'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                            body: body
                        };
                        fetch("http://localhost:30000/api/v1/users/updateProfile/" + id, requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            if (data['message'].includes('User updated!')) {
                                let password = CryptoAES.decrypt(sessionStorage.getItem("password"), "taass").toString(CryptoENC);
                                if (values.password !== '') {
                                    password = values.password;
                                }
                                const requestOptions = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({"username": values.username, "password": password})
                                };
                                fetch("http://localhost:30000/api/v1/auth/signin", requestOptions)
                                .then(response => response.json())
                                .then(data => {
                                    sessionStorage.setItem("username", data['username']);
                                    sessionStorage.setItem("email", data['email']);
                                    sessionStorage.setItem("roles", data['roles']);
                                    sessionStorage.setItem("isLoggedIn", true);  
                                    sessionStorage.setItem("tokenType", data['tokenType']);
                                    sessionStorage.setItem("accessToken", data['accessToken']);
                                    sessionStorage.setItem("password", CryptoAES.encrypt(password, "taass"))
                                    window.location.reload(false);
                                })
                                .catch(err => console.log(err))
                            }
                        })
                        .catch(err => console.log(err))
                    }}
                    initialValues={{
                        firstName: nome,
                        lastName: cognome,
                        password: '',
                        email: email,
                        username: username,
                        address: indirizzo,
                        city: citta,
                        cap: cap,
                        telephoneNumber: telefono,
                        price: prezzo + '€',
                        workingDay: workingDays,
                        animali: animali,
                        }}
                    >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                    }) => {
                        return(
                            <Form className="profileForm" noValidate style={{color: "#fff"}} onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                {provider === 'Local' && <Form.Group as={Col} controlId="validationFormik12" className="position-relative">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.email}
                                </Form.Control.Feedback>
                                </Form.Group>}
                                <Form.Group as={Col} md="4" controlId="validationFormik13" className="position-relative">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={values.username}
                                    onChange={handleChange}
                                    isInvalid={!!errors.username}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.username}
                                </Form.Control.Feedback>
                                </Form.Group>
                                {provider === 'Local' &&<Form.Group as={Col} controlId="validationFormik14" className="position-relative">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={values.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.password}
                                </Form.Control.Feedback>
                                </Form.Group>}
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="validationFormik15" className="position-relative">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    placeholder="Nome"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.firstName}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.firstName}
                                </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik16" className="position-relative">
                                <Form.Label>Cognome</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    placeholder="Cognome"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.lastName}
                                </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik20" className="position-relative">
                                <Form.Label>Numero di cellulare</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telephoneNumber"
                                    placeholder="Numero di cellulare"
                                    value={values.telephoneNumber}
                                    onChange={handleChange}
                                    isInvalid={!!errors.telephoneNumber}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.telephoneNumber}
                                </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="validationFormik17" className="position-relative">
                                <Form.Label>Indirizzo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Indirizzo e numero civico"
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    isInvalid={!!errors.address}
                                />
                                <Form.Control.Feedback tooltip type="invalid">
                                    {errors.address}
                                </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik18" className="position-relative">
                                <Form.Label>Città</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Città"
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    isInvalid={!!errors.city}
                                />
                                <Form.Control.Feedback tooltip type="invalid">
                                    {errors.city}
                                </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik19" className="position-relative">
                                <Form.Label>Cap</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Cap"
                                    name="cap"
                                    value={values.cap}
                                    onChange={handleChange}
                                    isInvalid={!!errors.cap}
                                />
                                <Form.Control.Feedback tooltip type="invalid">
                                    {errors.cap}
                                </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="4" controlId="validationFormik21" className="position-relative">
                                <Form.Label>Prezzo (in euro)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    placeholder="Prezzo (in euro)"
                                    value={values.price}
                                    onChange={handleChange}
                                    isInvalid={!!errors.price}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.price}
                                </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-2" style={{width: "70%"}}>
                                <Form.Label>Giorni di disponibilità</Form.Label>
                                <Form.Group as={Col}>
                                    <Form.Check
                                    inline
                                    name="workingDay"
                                    label="Lunedì"
                                    isInvalid={!!errors.workingDay}
                                    onChange={handleChange}
                                    value="lunedi"
                                    id="lunediForm"
                                    />
                                    <Form.Check
                                    inline
                                    name="workingDay"
                                    label="Martedì"
                                    isInvalid={!!errors.workingDay}
                                    onChange={handleChange}
                                    value="martedi"
                                    id="martediForm"
                                    />
                                    <Form.Check
                                    inline
                                    name="workingDay"
                                    label="Mercoledì"
                                    onChange={handleChange}
                                    value="mercoledi"
                                    isInvalid={!!errors.workingDay}
                                    id="mercolediForm"
                                    />
                                    <Form.Check
                                    inline
                                    name="workingDay"
                                    label="Giovedì"
                                    isInvalid={!!errors.workingDay}
                                    onChange={handleChange}
                                    value="giovedi"
                                    id="giovediForm"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-2" style={{width: "70%"}}>
                                <Form.Group as={Col} className="position-relative">
                                    <Form.Check
                                    inline
                                    name="workingDay"
                                    label="Venerdì"
                                    isInvalid={!!errors.workingDay}
                                    onChange={handleChange}
                                    value="venerdi"
                                    id="venerdiForm"
                                    />
                                    <Form.Check
                                    inline
                                    name="workingDay"
                                    label="Sabato"
                                    isInvalid={!!errors.workingDay}
                                    onChange={handleChange}
                                    value="sabato"
                                    id="sabatoForm"
                                    />
                                    <Form.Check
                                    inline
                                    name="workingDay"
                                    label="Domenica"
                                    isInvalid={!!errors.workingDay}
                                    onChange={handleChange}
                                    value="domenica"
                                    id="domenicaForm"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-2">
                                <ErrorMessage name="workingDay">
                                    { msg => <div style={{ color: '#dc3545' }}>{msg}</div> }
                                </ErrorMessage>
                            </Row>
                            <Row className="mb-2" style={{width: "70%"}}>
                                <Form.Label>Animali che vuoi accudire</Form.Label>
                                <Form.Group as={Col}>
                                    <Form.Check
                                    inline
                                    name="animali"
                                    label="Cani"
                                    type="switch"
                                    value="cani"
                                    isInvalid={!!errors.animali}
                                    onChange={handleChange}
                                    onClick={() => {
                                        if ($("#gattiForm").is(':checked')){
                                            values.animali = '';
                                            $('#gattiForm').prop('checked', false);
                                        }
                                        if ($('#entrambiForm').is(':checked')){
                                            values.animali = '';
                                            $('#entrambiForm').prop('checked', false);
                                        }
                                    }}
                                    id="caniForm"
                                    />
                                    <Form.Check
                                    inline
                                    name="animali"
                                    label="Gatti"
                                    type="switch"
                                    value="gatti"
                                    isInvalid={!!errors.animali}
                                    onChange={handleChange}
                                    onClick={() => {
                                        if ($("#caniForm").is(':checked')){
                                            values.animali = '';
                                            $('#caniForm').prop('checked', false);
                                        }
                                        if ($("#entrambiForm").is(':checked')){
                                            values.animali = '';
                                            $('#entrambiForm').prop('checked', false);
                                        }
                                    }}
                                    id="gattiForm"
                                    />
                                    <Form.Check
                                    inline
                                    name="animali"
                                    label="Entrambi"
                                    type="switch"
                                    value="entrambi"
                                    isInvalid={!!errors.animali}
                                    onChange={handleChange}
                                    onClick={() => {
                                        if ($("#caniForm").is(':checked')){
                                            values.animali = '';
                                            $('#caniForm').prop('checked', false);
                                        }
                                        if ($('#gattiForm').is(':checked')){
                                            values.animali = '';
                                            $('#gattiForm').prop('checked', false);
                                        }
                                    }}
                                    id="entrambiForm"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-2">
                                <ErrorMessage name="animali">
                                    { msg => <div style={{ color: '#dc3545' }}>{msg}</div> }
                                </ErrorMessage>
                            </Row>
                            <Button style={{marginRight: "20px", marginTop: "20px"}} onClick={() => {
                                setValidateAfterSubmitPetsitter(true);
                                handleSubmit();
                            }}>Applica modifiche</Button>
                            <Button style={{marginTop: "20px"}} onClick={() => {
                                handleCancel();
                            }}>Annulla modifiche</Button>
                        </Form>
                        )
                    }}
                </Formik>
            </div>
            )
        } else if (sessionStorage.getItem("roles") === 'ROLE_USER' && !edit) {
            return(
                <div>
                    <TitleH1>Profilo "{username}"</TitleH1>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            firstName: nome,
                            lastName: cognome,
                            email: email,
                            username: username,
                            address: indirizzo,
                            city: citta,
                            cap: cap,
                            telephoneNumber: telefono,
                            price: prezzo + '€',
                            working: workingDays,
                            animals: animali,
                            }}
                        >
                        {({
                            values,
                        }) => {
                            return(
                                <Form className="profileForm" style={{color: "#fff"}}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={values.username}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Nome</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={values.firstName}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Cognome</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={values.lastName}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Numero di telefono</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="telephoneNumber"
                                                value={values.telephoneNumber}
                                                readOnly={true}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Indirizzo e numero civico</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                readOnly={true}
                                                value={values.address}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Città</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                readOnly={true}
                                                value={values.city}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="position-relative">
                                            <Form.Label>Cap</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="cap"
                                                readOnly={true}
                                                value={values.cap}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Button style={{marginTop: "20px"}} onClick={() => {
                                        handleModify();
                                    }}>Modifica profilo</Button>
                                </Form>
                            )
                    }}
                    </Formik>
                </div>
            )
        } else if (sessionStorage.getItem("roles") === 'ROLE_USER' && edit) {
            return (
                <div>
                    <TitleH1>Modifica profilo "{username}"</TitleH1>
                    <Formik
                        validationSchema={provider === 'Local' ? schemaUser : schemaUserLogin}
                        enableReinitialize={true}
                        validateOnChange={validateAfterSubmitUser}
                        validateOnBlur={validateAfterSubmitUser}
                        onSubmit={(values) => {
                            sessionStorage.setItem("username", values.username);
                            sessionStorage.setItem("email", values.email);
                            let body = null;
                            if (values.password === '') {
                                body = JSON.stringify({
                                    "email": values.email,
                                    "username": values.username,
                                    "nome": values.firstName,
                                    "cognome": values.lastName,
                                    "telefono": values.telephoneNumber,
                                    "indirizzo": values.address,
                                    "citta": values.city,
                                    "cap": values.cap,
                                    "role": ['user']
                                })
                            } else {
                                body = JSON.stringify({
                                    "email": values.email,
                                    "username": values.username,
                                    "password": values.password,
                                    "nome": values.firstName,
                                    "cognome": values.lastName,
                                    "telefono": values.telephoneNumber,
                                    "indirizzo": values.address,
                                    "citta": values.city,
                                    "cap": values.cap,
                                    "role": ['user']
                                })
                            }
                            const requestOptions = {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json', 
                                        'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                                body: body
                            };
                            fetch("http://localhost:30000/api/v1/users/updateProfile/" + id, requestOptions)
                            .then(response => response.json())
                            .then(data => {
                                if (data['message'].includes('User updated!')) {
                                    let password = CryptoAES.decrypt(sessionStorage.getItem("password"), "taass").toString(CryptoENC);
                                    if (values.password !== '') {
                                        password = values.password;
                                    }
                                    const requestOptions = {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({"username": values.username, "password": password})
                                    };
                                    fetch("http://localhost:30000/api/v1/auth/signin", requestOptions)
                                    .then(response => response.json())
                                    .then(data => {
                                        sessionStorage.setItem("username", data['username']);
                                        sessionStorage.setItem("email", data['email']);
                                        sessionStorage.setItem("roles", data['roles']);
                                        sessionStorage.setItem("isLoggedIn", true);  
                                        sessionStorage.setItem("tokenType", data['tokenType']);
                                        sessionStorage.setItem("accessToken", data['accessToken']);
                                        sessionStorage.setItem("password", CryptoAES.encrypt(password, "taass"))
                                        window.location.reload(false);
                                    })
                                    .catch(err => console.log(err))
                                }
                            })
                            .catch(err => console.log(err))
                        }}
                        initialValues={{
                            email: email,
                            username: username,
                            password: '',
                            firstName: nome,
                            lastName: cognome,
                            telephoneNumber: telefono,
                            address: indirizzo,
                            city: citta,
                            cap: cap,
                        }}
                        >
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            errors,
                        }) => (
                            <Form className="profileForm" noValidate style={{color: "#fff"}} onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                {provider === 'Local' && <Form.Group as={Col} controlId="validationFormik32" className="position-relative">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={values.email}
                                            onChange={handleChange}
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>}
                                    <Form.Group as={Col} md="4" controlId="validationFormik33" className="position-relative">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={values.username}
                                            onChange={handleChange}
                                            isInvalid={!!errors.username}
                                        />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {provider === 'Local' && <Form.Group as={Col} controlId="validationFormik34" className="position-relative">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={values.password}
                                            onChange={handleChange}
                                            isInvalid={!!errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>}
                                </Row>
                                <Row className="mb-3">
                                <Form.Group as={Col} controlId="validationFormik35" className="position-relative">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        placeholder="Nome"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        isInvalid={!!errors.firstName}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.firstName}
                                    </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik36" className="position-relative">
                                    <Form.Label>Cognome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        placeholder="Cognome"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        isInvalid={!!errors.lastName}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {errors.lastName}
                                    </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik37" className="position-relative">
                                        <Form.Label>Numero di telefono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telephoneNumber"
                                            placeholder="Numero di telefono"
                                            value={values.telephoneNumber}
                                            onChange={handleChange}
                                            isInvalid={!!errors.telephoneNumber}
                                        />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.telephoneNumber}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="validationFormik38" className="position-relative">
                                        <Form.Label>Indirizzo e numero civico</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Strada Torino 24"
                                            name="address"
                                            value={values.address}
                                            onChange={handleChange}
                                            isInvalid={!!errors.address}
                                        />
                                        <Form.Control.Feedback tooltip type="invalid">
                                            {errors.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik39" className="position-relative">
                                        <Form.Label>Città</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Torino"
                                            name="city"
                                            value={values.city}
                                            onChange={handleChange}
                                            isInvalid={!!errors.city}
                                        />
                                        <Form.Control.Feedback tooltip type="invalid">
                                            {errors.city}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="validationFormik40" className="position-relative">
                                        <Form.Label>Cap</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="10121"
                                            name="cap"
                                            value={values.cap}
                                            onChange={handleChange}
                                            isInvalid={!!errors.cap}
                                        />
                                        <Form.Control.Feedback tooltip type="invalid">
                                            {errors.cap}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Button style={{marginRight: "20px", marginTop: "20px"}} onClick={() => {
                                    setValidateAfterSubmitUser(true);
                                    handleSubmit();
                                }}>Applica modifiche</Button>
                                <Button style={{marginTop: "20px"}} onClick={() => {
                                    handleCancel();
                                }}>Annulla modifiche</Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )
        }
    }

    const link = [
        {
            text: "Profilo",
            icon: FaUserCircle,
            active: activeProfilo,
            onclick: handleClickProfilo,
            href: "#/profilo"
        },
        {
            text: "Lista prenotazioni",
            icon: FaList,
            active: activeLista,
            onclick: handleClickLista,
            href: "#/profilo"
        },
        {
            text: "Logout",
            icon: MdLogout,
            onclick: handleClickLogout,
            href: "/"
        }
    ]

    return (
        <div id="profiloContainer">
            <div className='sidebar'>
                <div className='sidebarTitle'>{sessionStorage.getItem("username") + " Dashboard"}</div>
                <div className='sidebarLinks'><Links links={link} /></div>
                <div className='sidebarLogo'>
                    <img src={require('../../../images/logo.png').default} alt="PetCare Logo"/>
                </div>
            </div>
            <div className='dashboard'>
                <div id="lista" style={{display: activeLista ? 'block' : 'none'}}>
                   {ListaPrenotazioni()}
                </div>
                <div id="profilo" style={{display: activeProfilo ? 'block' : 'none'}} >
                    {ProfiloStruttura()}
                </div>
            </div>
        </div>
    )
}

export const Links = ({links}) => {
    return (
        <ul>
            {links.map((link) => {
                return (
                    <li className={link.active ? "active" : ""}>
                        <a href={link.href} onClick={link.onclick}>
                            <link.icon />
                            {link.text}
                        </a>
                    </li>
                );
            })}
        </ul>
    )
}

export const ProfiloWrapper = styled.div`
    min-height: 90vh;
    margin-top: 80px;
    background: #0d121c;
`