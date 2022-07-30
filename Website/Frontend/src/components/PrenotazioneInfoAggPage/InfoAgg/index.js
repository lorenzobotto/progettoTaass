import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import { InfoAgg, InfoAggH1, FormWrapper } from './InfoAggElements';
import {Formik, ErrorMessage} from 'formik';
import {useNavigate} from "react-router-dom";
import $ from 'jquery';
import {Button, Form, Row, Col, FloatingLabel} from 'react-bootstrap';
import * as yup from 'yup';

const InfoAggPage = () => {
    const { state } = useLocation();
    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const navigate = useNavigate();

    const schema = yup.object().shape({
        cure: yup.array().required('Selezionare se ha bisogno di cure.').min(1, 'Selezionare se ha bisogno di cure.'),
        socievole: yup.array().required('Selezionare se è socievole.').min(1, 'Selezionare se è socievole.'),
    })

    return (
        <InfoAgg>
            <InfoAggH1>Informazioni aggiuntive prenotazione</InfoAggH1>
            <FormWrapper>
                <Formik
                    validationSchema={schema}
                    enableReinitialize={true}
                    validateOnChange={validateAfterSubmit}
                    validateOnBlur={false}
                    onSubmit={(values) => {
                        let validate = true;
                        if (values.cure[0] === 'si') {
                            if ($("#dettagliCureText").val() === '' ){
                                $("#errorMsgCure").css("display", "block");
                                validate = false;
                            }
                        }
                        if (values.socievole[0] === 'si') {
                            if ($("#dettagliSocText").val() === '' ){
                                $("#errorMsgSoc").css("display", "block");
                                validate = false;
                            }
                        }
                        if (validate) {
                            let cure = null;
                            let socievole = null;
                            if (values.cure[0] === 'si') {
                                cure = $("#dettagliCureText").val();
                            }
                            if (values.socievole[0] === 'si') {
                                socievole = $("#dettagliSocText").val();
                            }
                            navigate('/pagamento', {
                                state: {
                                    idChoice: state.idChoice,
                                    startDate: state.startDate,
                                    endDate: state.endDate,
                                    cure: cure,
                                    socievole: socievole
                                }
                            });
                        }
                    }}
                    initialValues={{
                        cure: '',
                        socievole: '',
                        }}
                    >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                    }) => (
                        <Form noValidate style={{color: "#fff"}} onSubmit={handleSubmit}>
                            <Row className="mb-2">
                                <Form.Label as={Col} xs lg="6">Ha bisogno di cure specifiche?</Form.Label>
                                <Form.Group as={Col}>
                                    <Form.Check
                                    inline
                                    name="cure"
                                    label="Si"
                                    type="switch"
                                    value="si"
                                    isInvalid={!!errors.cure}
                                    onChange={handleChange}
                                    onClick={() => {
                                        if ($("#validationFormik02").is(':checked')){
                                            values.cure = '';
                                            $('#validationFormik02').prop('checked', false);
                                        }
                                        if ($("#validationFormik01").is(':checked')) {
                                            $('#dettagliCure').css("display", "block");
                                        } else {
                                            $('#dettagliCure').css("display", "none");
                                        }
                                        $("#errorMsgCure").css("display", "none");
                                    }}
                                    id="validationFormik01"
                                    />
                                    <Form.Check
                                    inline
                                    name="cure"
                                    label="No"
                                    type="switch"
                                    value="no"
                                    isInvalid={!!errors.cure}
                                    onChange={handleChange}
                                    onClick={() => {
                                        if ($("#validationFormik01").is(':checked')){
                                            values.cure = '';
                                            $('#validationFormik01').prop('checked', false);
                                            $('#dettagliCure').css("display", "block");
                                        }
                                        if ($("#validationFormik02").is(':checked')) {
                                            $('#dettagliCure').css("display", "none");
                                        }
                                        $("#errorMsgCure").css("display", "none");
                                    }}
                                    id="validationFormik02"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-2">
                                <ErrorMessage name="cure">
                                    { msg => <div className="mb-2" style={{ color: '#dc3545' }}>{msg}</div> }
                                </ErrorMessage>
                            </Row>
                            <FloatingLabel className="dettagliTextArea" id="dettagliCure" as={Col} label="Dettagli cure">
                                    <Form.Control
                                    as="textarea"
                                    placeholder="Inserisci i dettagli sulle cure"
                                    id="dettagliCureText"
                                    style={{minHeight: "103px"}}
                                    onChange={() => {
                                        $("#errorMsgCure").css("display", "none");
                                    }}
                                    />
                            </FloatingLabel>
                            <div className="errorMsg" id="errorMsgCure">Inserisci i dettagli sulle cure.</div>
                            <Row className="mb-2">
                                <Form.Label xs lg="6" as={Col}>L'animale è socievole?</Form.Label>
                                <Form.Group as={Col}>
                                    <Form.Check
                                    inline
                                    name="socievole"
                                    label="Si"
                                    type="switch"
                                    value="si"
                                    isInvalid={!!errors.socievole}
                                    onChange={handleChange}
                                    onClick={() => {
                                        if ($("#validationFormik04").is(':checked')){
                                            values.socievole = '';
                                            $('#validationFormik04').prop('checked', false);
                                        }
                                        if ($("#validationFormik03").is(':checked')) {
                                            $('#dettagliSocialita').css("display", "block");
                                        } else {
                                            $('#dettagliSocialita').css("display", "none");
                                        }
                                        $("#errorMsgSoc").css("display", "none");
                                    }}
                                    id="validationFormik03"
                                    />
                                    <Form.Check
                                    inline
                                    name="socievole"
                                    label="No"
                                    type="switch"
                                    value="no"
                                    isInvalid={!!errors.socievole}
                                    onChange={handleChange}
                                    onClick={() => {
                                        if ($("#validationFormik03").is(':checked')){
                                            values.socievole = '';
                                            $('#validationFormik03').prop('checked', false);
                                        }
                                        if ($("#validationFormik04").is(':checked')) {
                                            $('#dettagliSocialita').css("display", "none");
                                        }
                                        $("#errorMsgSoc").css("display", "none");
                                    }}
                                    id="validationFormik04"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-2">
                                <ErrorMessage name="socievole">
                                    { msg => <div className="mb-4" style={{ color: '#dc3545' }}>{msg}</div> }
                                </ErrorMessage>
                            </Row>
                            <FloatingLabel className="dettagliTextArea" id="dettagliSocialita" as={Col} label="Dettagli socialità">
                                    <Form.Control
                                    as="textarea"
                                    placeholder="Inserisci i dettagli sulla socialità"
                                    id="dettagliSocText"
                                    style={{minHeight: "103px"}}
                                    onChange={() => {
                                        $("#errorMsgSoc").css("display", "none");
                                    }}
                                    />
                            </FloatingLabel>
                            <div className="errorMsg" id="errorMsgSoc">Inserisci i dettagli sulla socialità.</div>
                            <Button onClick={() => {
                                setValidateAfterSubmit(true);
                                handleSubmit();
                            }}>Prosegui</Button>
                        </Form>
                    )}
                </Formik>
            </FormWrapper>
        </InfoAgg>
    )
}

export default InfoAggPage
