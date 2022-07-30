import {ResearchWrapper, SectionTitle, InputWrapper} from './RicercaElements';
import React, {useState} from 'react'
import "react-dates/initialize";
import {DateRangePicker} from 'react-dates';
import 'moment/locale/it'
import moment from 'moment'
import {Form, Button, Row} from 'react-bootstrap';
import 'react-dates/lib/css/_datepicker.css';
import {useNavigate} from "react-router-dom";
import { usePlacesWidget } from "react-google-autocomplete";
import $ from 'jquery';

const Ricerca = () => {

    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [caneChecked, setCaneChecked] = useState(false);
    const [gattoChecked, setGattoChecked] = useState(false);
    const [address, setAddress] = useState('');

    const handleDatesChange = ({ startDate, endDate }) => {
      setStartDate(startDate);
      setEndDate(endDate);
      $("#errorMsg").css("display", "none");
    };

    const { ref } = usePlacesWidget({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        onPlaceSelected: (place) => {
            console.log(place);
            setAddress(place.formatted_address);
        },
        options: {
          types: ["geocode"],
          componentRestrictions: { country: "it" },
        }
    });

    function validateForm() {
        if (address === '') {
            $("#errorMsg").text("La posizione è obbligatoria.");
            $("#errorMsg").css("display", "block");
            return false;
        }
        if (startDate === null) {
            $("#errorMsg").text("La data di inizio è obbligatoria.");
            $("#errorMsg").css("display", "block");
            return false;
        }
        if (endDate === null) {
            $("#errorMsg").text("La data di fine è obbligatoria.");
            $("#errorMsg").css("display", "block");
            return false;
        }
        if (!caneChecked && !gattoChecked) {
            $("#errorMsg").text("Selezionare almeno un animale.");
            $("#errorMsg").css("display", "block");
            return false;
        }
        return true;
    }

    return (
        <ResearchWrapper>
            <SectionTitle>Ricerca prenotazione</SectionTitle>
            <InputWrapper>
                <Row id="divPrenotazione">
                    <Form.Group id="prenotPos">
                    <Form.Label>Pet sitting soggiorno nelle vicinanze</Form.Label>
                    <Form.Control
                        name="date"
                        type="text"
                        id="inputAddress" 
                        style={{height: "46px"}} 
                        ref={ref}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            $("#errorMsg").css("display", "none");
                        }}
                    />
                    </Form.Group>
                    <Form.Group id="prenotDate">
                        <Form.Label>Per queste date</Form.Label>
                        <DateRangePicker
                            startDate={startDate}
                            startDateId="startID"
                            endDate={endDate}
                            endDateId="endID"
                            onDatesChange={handleDatesChange}
                            focusedInput={focusedInput}
                            onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                            startDatePlaceholderText = {'Data di inizio'}
                            endDatePlaceholderText = {'Data di fine'}
                            displayFormat={() => "DD/MM/YYYY"}
                            monthFormat= {'MMMM YYYY'}
                            readOnly={true}
                        />
                    </Form.Group>
                    <Form.Group id="prenotAnimal">
                    <Form.Label>Per questo animale</Form.Label>
                    <Form.Check 
                        name="animals"
                        label="Cane"
                        type="switch"
                        onChange={(event) => {
                            setCaneChecked(event.currentTarget.checked);
                            $("#errorMsg").css("display", "none");
                        }}
                        onClick={() => {
                            setGattoChecked(false);
                        }}
                        id='caneCheck'
                        checked={caneChecked}
                    />
                    <Form.Check 
                        name="animals"
                        label="Gatto"
                        type="switch"
                        onChange={(event) => {
                            setGattoChecked(event.currentTarget.checked);
                            $("#errorMsg").css("display", "none");
                        }}
                        onClick={() => {
                            setCaneChecked(false);
                        }}
                        id='gattoCheck'
                        checked={gattoChecked}
                    />
                    </Form.Group>
                </Row>
                <Row style={{width: "50%"}}>
                    <Button onClick={() => {
                        if (validateForm()) {
                            let animals = '';
                            if (gattoChecked) {
                                animals = 'gatti';
                            } else {
                                animals = 'cani';
                            }
                            navigate('/mapparisultati', {
                                state: {
                                    searchedAddress: address,
                                    startDate: moment(startDate.toDate()).format('DD/MM/YYYY'),
                                    endDate: moment(endDate.toDate()).format('DD/MM/YYYY'),
                                    animal: animals
                                }
                            });
                        }
                    }}>Prosegui</Button>
                </Row>
                <Row style={{width: "50%"}}>
                    <div id="errorMsg" class="alert alert-danger" role="alert" style={{textAlign: "center", display: "none"}}>
                        
                    </div>
                </Row>
            </InputWrapper>
            
        </ResearchWrapper>
    )
}

export default Ricerca
