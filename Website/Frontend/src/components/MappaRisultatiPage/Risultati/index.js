import React from 'react'
import { MappaRisultatiContainer, MapContainer, MarkerInfoContainer, MarkerInfoContainerH1, InfoContainer } from './RisultatiElements'
import {Row, Col, Form, Button} from 'react-bootstrap';
import { useLoadScript } from "@react-google-maps/api";
import { useLocation } from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import Map from "./Map";
import $ from 'jquery';

const Risultati = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
    });   

    let idChoice = null;

    const setIdChoice = (id) => {
        idChoice = id;
    }

    const controlAccess = () => {
        if (sessionStorage.getItem("isLoggedIn") !== null && sessionStorage.getItem("roles") === 'ROLE_USER'){
            $("#errorMsg").css("display", "none");
            return true;
        } else {
            $("#errorMsg").css("display", "block");
            return false;
        }
    }

    return isLoaded ? (
        <MappaRisultatiContainer>
            <MapContainer>
            <MarkerInfoContainerH1>Seleziona un segnaposto dalla mappa</MarkerInfoContainerH1>
                <Map centeredAddress={state.searchedAddress} startDate={state.startDate} endDate={state.endDate} animal={state.animal} setId={setIdChoice}/>
            </MapContainer>
            <MarkerInfoContainer id="infoContainer">
                <MarkerInfoContainerH1 id="infoTitolo">Informazioni</MarkerInfoContainerH1>
                <InfoContainer>
                    <Row className="mb-3">
                        <Form.Label as={Col} xs lg="4">Nome:</Form.Label>
                        <Form.Label id="infoNome" as={Col}></Form.Label>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label as={Col} xs lg="4">Cognome:</Form.Label>
                        <Form.Label id="infoCognome" as={Col}></Form.Label>
                    </Row>
                    <Row className="mb-3" id="rowNomeStruttura">
                        <Form.Label as={Col} xs lg="4">Nome Struttura:</Form.Label>
                        <Form.Label id="infoNomeStruttura" as={Col}></Form.Label>
                    </Row>
                    <Row className="mb-3" id="rowCapienza">
                        <Form.Label as={Col} xs lg="4">Capienza struttura:</Form.Label>
                        <Form.Label id="infoCapienza" as={Col}></Form.Label>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label as={Col} xs lg="4">Email:</Form.Label>
                        <Form.Label id="infoEmail" as={Col}></Form.Label>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label as={Col} xs lg="4">Telefono:</Form.Label>
                        <Form.Label id="infoTelefono" as={Col}></Form.Label>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label as={Col} xs lg="4">Indirizzo:</Form.Label>
                        <Form.Label id="infoIndirizzo" as={Col}></Form.Label>
                    </Row>
                    <Row className="mb-3" id="rowPrezzo">
                        <Form.Label as={Col} xs lg="4">Prezzo giornaliero:</Form.Label>
                        <Form.Label id="infoPrezzo" as={Col}></Form.Label>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label as={Col} xs lg="4">Animali che accudisce:</Form.Label>
                        <Form.Label id="infoAnimali" as={Col}></Form.Label>
                    </Row>
                    <Row className="mb-3">
                        <Button onClick={() => {
                            if (controlAccess()) {
                                console.log(idChoice);
                                navigate('/prenotazioneinformazioniaggiuntive', {
                                    state: {
                                        idChoice: idChoice,
                                        startDate: state.startDate,
                                        endDate: state.endDate
                                    }
                                });
                            };
                        }}>Prosegui con la prenotazione</Button>
                    </Row>
                    <Row className="mb-3">
                        <div id="errorMsg" class="alert alert-danger" role="alert" style={{textAlign: "center", display: "none"}}>
                            <p>Per proseguire è necessario aver effettuato l'accesso come utente.</p>
                            {sessionStorage.getItem("isLogged") === null && <Button onClick={() => {
                                navigate('/accedi');
                            }}>Accedi</Button>}
                        </div>
                    </Row>
                </InfoContainer>
            </MarkerInfoContainer>
        </MappaRisultatiContainer>
    ) : null;
        
}

export default Risultati
