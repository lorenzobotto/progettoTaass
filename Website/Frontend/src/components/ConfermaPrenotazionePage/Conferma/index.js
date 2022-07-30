import React from 'react'
import {Link as LinkR} from 'react-router-dom'
import { Container, ContainerH1 } from './ConfermaElements'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'

const Conferma = () => {
    const navigate = useNavigate();
    return (
        <Container>
            <ContainerH1>Conferma della prenotazione</ContainerH1>
            <div style={{width: "50%", margin: "50px auto", whiteSpace: "pre-wrap", textAlign: "center"}} class="alert alert-success" role="alert">
                Prenotazione confermata!<br />Vai nella sezione delle prenotazioni nel tuo <LinkR to="/profilo">profilo</LinkR> per vedere tutte le prenotazioni effettuate.<br /><br />
                <Button onClick={() => {
                    navigate("/");
                }}>Torna alla Homepage</Button>
            </div>
        </Container>
    )
}

export default Conferma
