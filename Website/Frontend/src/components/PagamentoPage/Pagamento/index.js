import React, {useState, useEffect, useRef} from 'react'
import { useLocation } from 'react-router-dom';
import 'moment/locale/it'
import moment from 'moment'
import $ from 'jquery';
import { Row, Col, Form, Button, FloatingLabel } from 'react-bootstrap';
import { Pagamento, PagamentoH1, PagamentoWrapper } from './PagamentoElements';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router';

const PagamentoPage = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const [informations, setInformations] = useState('');
    const [stringPrice, setStringPrice] = useState('');
    const price = useRef();

    useEffect(() => {
        async function getInformations() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                           'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                body: JSON.stringify({
                    "id": state.idChoice
                })
            };
    
            let response = await fetch("http://localhost:30000/api/v1/users/getUser", requestOptions);
            let responseJson = await response.json();
            setInformations(responseJson);
            let newStartDate = moment(state.startDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
            let newEndDate = moment(state.endDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
            const dateStart = new Date(newStartDate);
            const endDate = new Date(newEndDate);
            const oneDay = 1000 * 60 * 60 * 24;
            const diffInTime = endDate.getTime() - dateStart.getTime();
            const diffInDays = Math.round(diffInTime / oneDay);
            price.current = ((parseInt(diffInDays) + 1) * parseFloat(responseJson['prezzo']));
            setStringPrice(((parseInt(diffInDays) + 1) * parseFloat(responseJson['prezzo'])).toFixed(2) + "€");
            if (responseJson['nomeStruttura'] != null) {
                $("#formStruttura").css("display", "block");
                $("#textNomeStruttura").val(responseJson['nomeStruttura']);
                $("#labelNome").text('Nome del titolare');
                $("#labelCognome").text('Cognome del titolare');
                $("#textNome").val(responseJson['nome']);
                $("#textCognome").val(responseJson['cognome']);
            } else {
                $("#formStruttura").css("display", "none");
                $("#labelNome").text('Nome del Petsitter');
                $("#labelCognome").text('Cognome del Petsitter');
                $("#textNome").val(responseJson['nome']);
                $("#textCognome").val(responseJson['cognome']);
                $("#pOnl").css("display", "none");
                $("#pCont").text("Conferma e paga direttamente al Petsitter");
                $("#pCont").css("margin-right", "0");
            }
            if (state.cure === null) {
                $("#divCure").css("display", "none");
            }
            if (state.socievole === null) {
                $("#divSoc").css("display", "none");
            }
        }
        getInformations().catch(err => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleSubmitPayment = (orderId) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                       'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
            body: JSON.stringify({
                "username": sessionStorage.getItem("username")
            })
        }
        fetch("http://localhost:30000/api/v1/users/getIdOfUser", requestOptions)
        .then(response => response.json())
        .then(data => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                           'Authorization': sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken") },
                body: JSON.stringify({
                    "user_id": data["message"],
                    "user_to": state.idChoice,
                    "startDate": state.startDate,
                    "endDate": state.endDate,
                    "prezzo": price.current,
                    "cure": state.cure,
                    "socievole": state.socievole,
                    "transactionId": orderId
                })
            };
            fetch("http://localhost:30000/api/v1/reservations/save", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data['message'].includes('Reservation registered successfully!')) {
                    navigate("/confermaPrenotazione");
                }
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }

    return (
        <div>
            <Pagamento>
                <PagamentoH1>Resoconto e pagamento</PagamentoH1>
                <Form>
                    <PagamentoWrapper>
                        <Row className="mb-4">
                            <Form.Group as={Col}>
                                <Form.Label>Data di inizio</Form.Label>
                                <Form.Control type="text" value={state.startDate} readOnly={true}></Form.Control>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Data di fine</Form.Label>
                                <Form.Control type="text" value={state.endDate} readOnly={true}></Form.Control>
                            </Form.Group>
                        </Row>
                        <Row className="mb-4">
                            <Form.Group id="formStruttura" style={{display: "none"}} as={Col}>
                                <Form.Label id="labelNomeStruttura">Nome Struttura</Form.Label>
                                <Form.Control id="textNomeStruttura" type="text"  readOnly={true}></Form.Control>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label id="labelNome"></Form.Label>
                                <Form.Control id="textNome" type="text"  readOnly={true}></Form.Control>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label id="labelCognome"></Form.Label>
                                <Form.Control id="textCognome" type="text"  readOnly={true}></Form.Control>
                            </Form.Group>
                        </Row>
                        <Row className="mb-4">
                            <Form.Group as={Col}>
                                <Form.Label>Indirizzo della struttura</Form.Label>
                                <Form.Control type="text" value={informations['indirizzo'] + ", " + informations['citta'] + ", " + informations['cap']} readOnly={true}></Form.Control>
                            </Form.Group>
                        </Row>
                        <Row className="mb-4">
                            <Form.Group as={Col}>
                                <Form.Label>Telefono</Form.Label>
                                <Form.Control type="text" value={informations['telefono']} readOnly={true}></Form.Control>
                            </Form.Group>
                        </Row>
                        <div id="divCure">
                            <Form.Label>Dettagli sulle cure</Form.Label>
                            <FloatingLabel className="mb-4" style={{color: "#999"}} label="Dettagli">
                                <Form.Control readOnly={true} type="text" value={state.cure} placeholder="Dettagli" />
                            </FloatingLabel >
                        </div>
                        <div id="divSoc">
                            <Form.Label>Dettagli sulla socialità</Form.Label>
                            <FloatingLabel className="mb-4" style={{color: "#999"}} label="Dettagli">
                                <Form.Control readOnly={true} type="text" value={state.socievole} placeholder="Dettagli" />
                            </FloatingLabel>
                        </div>
                        <Row className="mb-5">
                            <Form.Group as={Col}>
                                <Form.Label>Totale da pagare</Form.Label>
                                <Form.Control id="textPrice" type="text" value={stringPrice} readOnly={true}></Form.Control>
                            </Form.Group>
                        </Row>
                        <div style={{textAlign: "center"}}>
                            <div className='bntPay'>
                                <Button id="pCont" variant="primary"  onClick={() => {
                                    handleSubmitPayment(null);
                                }}>Conferma e paga in contanti</Button>
                                {console.log(process.env)}
                                <PayPalScriptProvider options={{"client-id": process.env.REACT_APP_PAYPAL_CLIENT, currency: "EUR"}}>
                                    <div style={{width: "50%", marginLeft: "10px"}}>
                                        <PayPalButtons 
                                            disabled={false}
                                            onApprove={function (data, actions) {
                                                return actions.order.capture().then(function (details) {
                                                    handleSubmitPayment(details['purchase_units'][0]['payments']['captures'][0]['id']);
                                                });
                                            }} 
                                            createOrder={(data, actions) => {
                                                return actions.order
                                                    .create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    description: "Petcare Website Payment",
                                                                    currency_code: "EUR",
                                                                    value: price.current,
                                                                },
                                                            },
                                                        ],
                                                    })
                                            }}
                                            style={{ layout: "horizontal", height: 55}}
                                        />
                                    </div>
                                </PayPalScriptProvider>
                            </div>
                        </div>
                    </PagamentoWrapper>
                </Form>
            </Pagamento>
        </div>
    )
}

export default PagamentoPage
