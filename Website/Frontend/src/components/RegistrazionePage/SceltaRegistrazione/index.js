import React, {useState, useEffect} from 'react'
import {ProgressBar, Button, Form, Row, Col} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import $ from 'jquery';
import {Register, RegisterChoice, RegisterChoiceEmail, RegisterChoiceH1, RegisterChoiceWrapper, RegisterChoiceWrapperEmail, RegisterChoiceCard, RegisterChoiceIcon, RegisterChoiceH2, RegisterStructureEmail, RegisterSuccesfully, RegisterH2, RegisterPetsitterEmail, RegisterUserEmail} from './SceltaRegistrazioneElements'
import FacebookLogin from 'react-facebook-login';
import {FaFacebookF} from 'react-icons/fa';
import {ErrorMessage, Formik} from 'formik';
import CryptoAES from 'crypto-js/aes';
import * as yup from 'yup';
import jwt_decode from 'jwt-decode';

const Registrazione = () => {
    const [percentage, setPercentage] = useState(25);
    const [registerChoice, setRegisterChoice] = useState('');
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const [usernameSocial, setUsernameSocial] = useState('');
    const [emailSocial, setEmailSocial] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [cognomeSocial, setCognomeSocial] = useState('');

    const [loginSocial, setLoginSocial] = useState('');

    const navigate = useNavigate();
    const [validateAfterSubmitStructure, setValidateAfterSubmitStructure] = useState(false);
    const [validateAfterSubmitPetsitter, setValidateAfterSubmitPetsitter] = useState(false);
    const [validateAfterSubmitUser, setValidateAfterSubmitUser] = useState(false);
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const priceRegExp = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)€?$/

    const responseFacebook = (response) => {
        console.log(response);
        if (response.status !== "unknown") {
            setLoginSocial('Facebook');
            let facebookProfile = response;
            var splitName = facebookProfile['name'].split(" ");
            setUsernameSocial(splitName[0].toLowerCase() + "." + splitName[1].toLowerCase());
            setEmailSocial(facebookProfile['email']);
            setNomeSocial(splitName[0]);
            setCognomeSocial(splitName[1]);
            if (registerChoice === 'struttura') {
                return (
                    $("#registerChoiceEmail").fadeOut(400, function() {
                        $("#registerStructureEmail").css("display", "flex").hide().fadeIn(400, function(){
                            $("#registerStructureEmail").css("display", "flex");
                        });
                    }),                
                    setPercentage(75)
                )
            } else if (registerChoice === 'petsitter') {
                return (
                    $("#registerChoiceEmail").fadeOut(400, function() {
                        $("#registerPetsitterEmail").css("display", "flex").hide().fadeIn(400, function(){
                            $("#registerPetsitterEmail").css("display", "flex");
                        });
                    }),                
                    setPercentage(75)
                )
            } else if (registerChoice === 'utente') {
                return (
                    $("#registerChoiceEmail").fadeOut(400, function() {
                        $("#registerUserEmail").css("display", "flex").hide().fadeIn(400, function(){
                            $("#registerUserEmail").css("display", "flex");
                        });
                    }),                
                    setPercentage(75)
                )
            }
        }
    }
    
    const responseGoogle = (response) => {
        setLoginSocial('Google');
        let googleProfile = jwt_decode(response.credential);
        setUsernameSocial(googleProfile.given_name.toLowerCase() + "." + googleProfile.family_name.toLowerCase());
        setEmailSocial(googleProfile.email);
        setNomeSocial(googleProfile.given_name);
        setCognomeSocial(googleProfile.family_name);
        if (registerChoice === 'struttura') {
            return (
                $("#registerChoiceEmail").fadeOut(400, function() {
                    $("#registerStructureEmail").css("display", "flex").hide().fadeIn(400, function(){
                        $("#registerStructureEmail").css("display", "flex");
                    });
                }),                
                setPercentage(75)
            )
        } else if (registerChoice === 'petsitter') {
            return (
                $("#registerChoiceEmail").fadeOut(400, function() {
                    $("#registerPetsitterEmail").css("display", "flex").hide().fadeIn(400, function(){
                        $("#registerPetsitterEmail").css("display", "flex");
                    });
                }),                
                setPercentage(75)
            )
        } else if (registerChoice === 'utente') {
            return (
                $("#registerChoiceEmail").fadeOut(400, function() {
                    $("#registerUserEmail").css("display", "flex").hide().fadeIn(400, function(){
                        $("#registerUserEmail").css("display", "flex");
                    });
                }),                
                setPercentage(75)
            )
        }
    }

    const schemaPetsitter = yup.object().shape({
        firstName: yup.string().required('Il nome è obbligatorio.'),
        lastName: yup.string().required('Il cognome è obbligatorio.'),
        email: yup.string().email("L'email non è valida.").required("L'email è obbligatoria.").max(50, "L'email deve avere massimo 50 caratteri.")
                  .test({
                        message: () => "L'email è già esistente",
                        test: async (values) => {
                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "username": values
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
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
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "username": values
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
                            if (response.ok) {
                                return true;
                                } else {
                                return false;
                                }
                        }
                    }),
        password: yup.string().required('La password è obbligatoria.').min(6, 'La password deve essere minimo di 6 caratteri.').max(40, 'La password deve essere massimo di 40 caratteri.'),
        address: yup.string().required("L'indirizzo è obbligatorio."),
        city: yup.string().required("La città è obbligatoria."),
        cap: yup.string().required("Il Cap è obbligatorio.").max(15, 'Il Cap deve avere massimo 15 caratteri.'),
        telephoneNumber: yup.string().matches(phoneRegExp, 'Numero di telefono non valido.').required("Il numero di telefono è obbligatorio.").max(20, 'Il numero di telefono deve avere massimo 20 caratteri.'),
        price: yup.string().matches(priceRegExp, 'Prezzo non valido.').required('Il prezzo è obbligatorio.'),
        workingDay: yup.array().required('Selezionare almeno un giorno di lavoro.').min(1, 'Selezionare almeno un giorno di lavoro.'),
        animali: yup.array().required('Selezionare almeno una categoria di animali.').min(1, 'Selezionare almeno una categoria di animali.'),
    })

    const schemaPetsitterSocial = yup.object().shape({
        firstName: yup.string().required('Il nome è obbligatorio.'),
        lastName: yup.string().required('Il cognome è obbligatorio.'),
        email: yup.string().email("L'email non è valida.").required("L'email è obbligatoria.").max(50, "L'email deve avere massimo 50 caratteri.")
                  .test({
                        message: () => "L'email è già esistente",
                        test: async (values) => {
                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "username": values
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
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
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "username": values
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
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

    const schemaStructure = yup.object().shape({
        email: yup.string().email("L'email non è valida.").required("L'email è obbligatoria.").max(50, "L'email deve avere massimo 50 caratteri.")
                .test({
                    message: () => "L'email è già esistente",
                    test: async (values) => {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "username": values
                            })
                        };
                        let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
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
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "username": values
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
                            if (response.ok) {
                                return true;
                                } else {
                                return false;
                                }
                        }
                    }),
        password: yup.string().required('La password è obbligatoria.').min(6, 'La password deve essere minimo di 6 caratteri.').max(40, 'La password deve essere massimo di 40 caratteri.'),
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

    const schemaStructureSocial = yup.object().shape({
        email: yup.string().email("L'email non è valida.").required("L'email è obbligatoria.").max(50, "L'email deve avere massimo 50 caratteri.")
                .test({
                    message: () => "L'email è già esistente",
                    test: async (values) => {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "username": values
                            })
                        };
                        let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
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
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "username": values
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
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

    const schemaUser = yup.object().shape({
        email: yup.string().email("L'email non è valida.").required("L'email è obbligatoria.").max(50, "L'email deve avere massimo 50 caratteri.")
                .test({
                    message: () => "L'email è già esistente",
                    test: async (values) => {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "username": values
                            })
                        };
                        let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
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
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "username": values
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
                            if (response.ok) {
                                return true;
                                } else {
                                return false;
                                }
                        }
                    }),
        password: yup.string().required('La password è obbligatoria.').min(6, 'La password deve essere minimo di 6 caratteri.').max(40, 'La password deve essere massimo di 40 caratteri.'),
        firstName: yup.string().required('Il nome è obbligatorio.'),
        lastName: yup.string().required('Il cognome è obbligatorio.'),
        telephoneNumber: yup.string().matches(phoneRegExp, 'Numero di telefono non valido.').required("Il numero di telefono è obbligatorio.").max(20, 'Il numero di telefono deve avere massimo 20 caratteri.'),
        address: yup.string(),
        city: yup.string(),
        cap: yup.string().max(15, 'Il Cap deve avere massimo 15 caratteri.'),
    });

    const schemaUserSocial = yup.object().shape({
        email: yup.string().email("L'email non è valida.").required("L'email è obbligatoria.").max(50, "L'email deve avere massimo 50 caratteri.")
                .test({
                    message: () => "L'email è già esistente",
                    test: async (values) => {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "username": values
                            })
                        };
                        let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
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
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "username": values
                                })
                            };
                            let response = await fetch("http://localhost:30000/api/v1/auth/signup/available", requestOptions)
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

    const RegisterChoiceClicked = (choice) => {
        return (
            setRegisterChoice(choice),
            $("#registerChoice").fadeOut(400, function() {
                $("#registerChoiceEmail").css("display", "flex").hide().fadeIn(400, function(){
                    $("#registerChoiceEmail").css("display", "flex");
                });
            }),
            setPercentage(50)
        )
    }

    const EmailChoiced = () => {
        setLoginSocial('');
        setUsernameSocial('');
        setEmailSocial('');
        setNomeSocial('');
        setCognomeSocial('');
        if (registerChoice === 'struttura') {
            return (
                $("#registerChoiceEmail").fadeOut(400, function() {
                    $("#registerStructureEmail").css("display", "flex").hide().fadeIn(400, function(){
                        $("#registerStructureEmail").css("display", "flex");
                    });
                }),                
                setPercentage(75)
            )
        } else if (registerChoice === 'petsitter') {
            return (
                $("#registerChoiceEmail").fadeOut(400, function() {
                    $("#registerPetsitterEmail").css("display", "flex").hide().fadeIn(400, function(){
                        $("#registerPetsitterEmail").css("display", "flex");
                    });
                }),                
                setPercentage(75)
            )
        } else if (registerChoice === 'utente') {
            return (
                $("#registerChoiceEmail").fadeOut(400, function() {
                    $("#registerUserEmail").css("display", "flex").hide().fadeIn(400, function(){
                        $("#registerUserEmail").css("display", "flex");
                    });
                }),                
                setPercentage(75)
            )
        }
    } 
    const returnAndLogin = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"username": username, "password": password})
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
            sessionStorage.setItem("password", CryptoAES.encrypt(password, "taass").toString())
            navigate("/");
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_KEY,
            callback: responseGoogle,
            context: "signup"
        });

        window.google.accounts.id.renderButton(
            document.getElementById("g_id_signup"), {theme: "filled_blue", size: "large", type: "standard", locale: "it_IT", width: "400", text: "signup_with"}
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerChoice])

    return (
        <Register>
            <RegisterChoice id="registerChoice">
                <RegisterChoiceH1>Sei una struttura, vuoi diventare un pet sitter o un cliente?</RegisterChoiceH1>
                <RegisterChoiceWrapper>
                    <RegisterChoiceCard onClick={() => RegisterChoiceClicked('struttura')}>
                        <RegisterChoiceIcon src={require('../../../images/pet-shop.png').default}/>
                        <RegisterChoiceH2>Struttura</RegisterChoiceH2>
                    </RegisterChoiceCard>
                    <RegisterChoiceCard onClick={() => RegisterChoiceClicked('petsitter')}>
                        <RegisterChoiceIcon src={require('../../../images/pet-friendly.png').default}/>
                        <RegisterChoiceH2>Pet sitter</RegisterChoiceH2>
                    </RegisterChoiceCard>
                    <RegisterChoiceCard onClick={() => RegisterChoiceClicked('utente')}>
                        <RegisterChoiceIcon src={require('../../../images/user.png').default}/>
                        <RegisterChoiceH2>Cliente</RegisterChoiceH2>
                    </RegisterChoiceCard>
                </RegisterChoiceWrapper>
            </RegisterChoice>
        <RegisterChoiceEmail id="registerChoiceEmail">
            <RegisterChoiceH1>Come vuoi registrarti?</RegisterChoiceH1>
            <RegisterChoiceWrapperEmail>
                <Button variant="primary " style={{margin: "20px auto", height: "40px", width: "400px"}} onClick={EmailChoiced}>Registrati con l'email</Button>
                <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_CLIENT_KEY}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    textButton="Registrati con Facebook"
                    icon={<FaFacebookF  style={{marginRight: "10px", marginBottom: "3px"}}></FaFacebookF>}
                    cssClass="btnFacebookRegister"
                    language="it_IT"
                    containerStyle={{margin: "20px auto", width: "400px", height: "40px"}}
                />
                <div id="g_id_signup" style={{margin: "20px auto", display: "flex", justifyContent: "center"}}/>
                <Button style={{height: "40px", width: "400px", margin: "20px auto"}} onClick={() => {
                    $("#registerChoiceEmail").fadeOut(400, function() {
                        $("#registerChoice").css("display", "flex").hide().fadeIn(400, function(){
                            $("#registerChoice").css("display", "flex");
                        });
                    });               
                    setPercentage(25);
                }}>Indietro</Button>
            </RegisterChoiceWrapperEmail>
        </RegisterChoiceEmail>
        <RegisterStructureEmail id="registerStructureEmail">
            <RegisterChoiceH1>Registrazione struttura</RegisterChoiceH1>
            <Formik
                validationSchema={loginSocial === '' ? schemaStructure : schemaStructureSocial}
                enableReinitialize={true}
                validateOnChange={validateAfterSubmitStructure}
                validateOnBlur={false}
                onSubmit={(values) => {
                    setUsername(values.username);
                    setPassword(values.password);
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
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
                            "role": ['structure'],
                            "animaliDaAccudire": 'entrambi',
                            "provider": loginSocial === '' ? 'Local' : loginSocial
                        })
                    };
                    fetch("http://localhost:30000/api/v1/auth/signup", requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data['message'].includes('User registered successfully!')) {
                            $("#registerStructureEmail").fadeOut(400, function() {
                                $("#registerSuccesfully").css("display", "flex").hide().fadeIn(400, function(){
                                    $("#registerSuccesfully").css("display", "flex");
                                });
                            });                
                            setPercentage(100);
                        }
                    })
                    .catch(err => console.log(err))
                }}
                initialValues={{
                    email: emailSocial,
                    username: usernameSocial,
                    password: '',
                    telephoneNumber: '',
                    nomeStruttura: '',
                    capienza: '5',
                    price: '',
                    nomeTitolareStruttura: nomeSocial,
                    cognomeTitolareStruttura: cognomeSocial,
                    address: '',
                    city: '',
                    cap: '',
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
                            <Form.Group as={Col} controlId="validationFormik01" className="position-relative">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                    readOnly={loginSocial === '' ? false : true}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} controlId="validationFormik02" className="position-relative">
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
                            {loginSocial === '' && <Form.Group as={Col} controlId="validationFormik03" className="position-relative">
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
                                    defaultValue="5"
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
                        <Button onClick={() => {
                            setValidateAfterSubmitStructure(true);
                            handleSubmit();
                        }}>Registrati</Button>
                        <Button style={{marginLeft: "20px"}} onClick={() => {
                            $("#registerStructureEmail").fadeOut(400, function() {
                                $("#registerChoiceEmail").css("display", "flex").hide().fadeIn(400, function(){
                                    $("#registerChoiceEmail").css("display", "flex");
                                });
                            });               
                            setPercentage(50);
                        }}>Indietro</Button>
                    </Form>
                )}
            </Formik>
        </RegisterStructureEmail>
        <RegisterPetsitterEmail id="registerPetsitterEmail">
            <RegisterChoiceH1>Registrazione PetSitter</RegisterChoiceH1>
            <Formik
                validationSchema={loginSocial === '' ? schemaPetsitter : schemaPetsitterSocial}
                enableReinitialize={true}
                validateOnChange={validateAfterSubmitPetsitter}
                validateOnBlur={false}
                onSubmit={(values) => {
                    setUsername(values.username);
                    setPassword(values.password);
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
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
                            "role": ['petsitter'], 
                            "provider": loginSocial === '' ? 'Local' : loginSocial
                        })
                    };
                    fetch("http://localhost:30000/api/v1/auth/signup", requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data['message'].includes('User registered successfully!')) {
                            $("#registerPetsitterEmail").fadeOut(400, function() {
                                $("#registerSuccesfully").css("display", "flex").hide().fadeIn(400, function(){
                                    $("#registerSuccesfully").css("display", "flex");
                                });
                            });                
                            setPercentage(100);
                        }
                    })
                    .catch(err => console.log(err))
                }}
                initialValues={{
                    firstName: nomeSocial,
                    lastName: cognomeSocial,
                    email: emailSocial,
                    username: usernameSocial,
                    password: '',
                    address: '',
                    city: '',
                    cap: '',
                    telephoneNumber: '',
                    price: '',
                    workingDay: [],
                    animali: [],
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
                        <Form.Group as={Col} controlId="validationFormik12" className="position-relative">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={values.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                            readOnly={loginSocial === '' ? false : true}
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                            {errors.email}
                        </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="validationFormik13" className="position-relative">
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
                        {loginSocial === '' && <Form.Group as={Col} controlId="validationFormik14" className="position-relative">
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
                        <Form.Group as={Col} md="4" controlId="validationFormik21" className="position-relative formPrice">
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
                    <Row className="checkForm mb-2">
                        <Form.Label>Giorni di disponibilità</Form.Label>
                        <Form.Group as={Col}>
                            <Form.Check
                            inline
                            name="workingDay"
                            label="Lunedì"
                            isInvalid={!!errors.workingDay}
                            onChange={handleChange}
                            value="lunedi"
                            id="validationFormik22"
                            />
                            <Form.Check
                            inline
                            name="workingDay"
                            label="Martedì"
                            isInvalid={!!errors.workingDay}
                            onChange={handleChange}
                            value="martedi"
                            id="validationFormik24"
                            />
                            <Form.Check
                            inline
                            name="workingDay"
                            label="Mercoledì"
                            onChange={handleChange}
                            value="mercoledi"
                            isInvalid={!!errors.workingDay}
                            id="validationFormik26"
                            />
                            <Form.Check
                            inline
                            name="workingDay"
                            label="Giovedì"
                            isInvalid={!!errors.workingDay}
                            onChange={handleChange}
                            value="giovedi"
                            id="validationFormik28"
                            />
                        </Form.Group>
                    </Row>
                    <Row className="checkForm mb-4">
                        <Form.Group as={Col} className="position-relative">
                            <Form.Check
                            inline
                            name="workingDay"
                            label="Venerdì"
                            isInvalid={!!errors.workingDay}
                            onChange={handleChange}
                            value="venerdi"
                            id="validationFormik23"
                            />
                            <Form.Check
                            inline
                            name="workingDay"
                            label="Sabato"
                            isInvalid={!!errors.workingDay}
                            onChange={handleChange}
                            value="sabato"
                            id="validationFormik25"
                            />
                            <Form.Check
                            inline
                            name="workingDay"
                            label="Domenica"
                            isInvalid={!!errors.workingDay}
                            onChange={handleChange}
                            value="domenica"
                            id="validationFormik27"
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-4" style={{marginTop: "-0.5rem"}}>
                        <ErrorMessage name="workingDay">
                            { msg => <div style={{ color: '#dc3545' }}>{msg}</div> }
                        </ErrorMessage>
                    </Row>
                    <Row className="checkForm mb-4">
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
                                if ($("#validationFormik30").is(':checked')){
                                    values.animali = '';
                                    $('#validationFormik30').prop('checked', false);
                                }
                                if ($('#validationFormik31').is(':checked')){
                                    values.animali = '';
                                    $('#validationFormik31').prop('checked', false);
                                }
                            }}
                            id="validationFormik29"
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
                                if ($("#validationFormik29").is(':checked')){
                                    values.animali = '';
                                    $('#validationFormik29').prop('checked', false);
                                }
                                if ($("#validationFormik31").is(':checked')){
                                    values.animali = '';
                                    $('#validationFormik31').prop('checked', false);
                                }
                            }}
                            id="validationFormik30"
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
                                if ($("#validationFormik29").is(':checked')){
                                    values.animali = '';
                                    $('#validationFormik29').prop('checked', false);
                                }
                                if ($('#validationFormik30').is(':checked')){
                                    values.animali = '';
                                    $('#validationFormik30').prop('checked', false);
                                }
                            }}
                            id="validationFormik31"
                            />
                        </Form.Group>
                    </Row>
                    <Row className="errorAnimali mb-4" style={{marginTop: "-0.5rem"}}>
                        <ErrorMessage name="animali">
                            { msg => <div style={{ color: '#dc3545' }}>{msg}</div> }
                        </ErrorMessage>
                    </Row>
                    <Button onClick={() => {
                        setValidateAfterSubmitPetsitter(true);
                        handleSubmit();
                    }}>Registrati</Button>
                    <Button style={{marginLeft: "20px"}} onClick={() => {
                        $("#registerPetsitterEmail").fadeOut(400, function() {
                            $("#registerChoiceEmail").css("display", "flex").hide().fadeIn(400, function(){
                                $("#registerChoiceEmail").css("display", "flex");
                            });
                        });               
                        setPercentage(50);
                    }}>Indietro</Button>
                </Form>
                )}
            </Formik>
        </RegisterPetsitterEmail>
        <RegisterUserEmail id="registerUserEmail">
            <RegisterChoiceH1>Registrazione Cliente</RegisterChoiceH1>
            <Formik
                validationSchema={loginSocial === '' ? schemaUser : schemaUserSocial}
                enableReinitialize={true}
                validateOnChange={validateAfterSubmitUser}
                validateOnBlur={validateAfterSubmitUser}
                onSubmit={(values) => { 
                    setUsername(values.username);
                    setPassword(values.password);
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            "email": values.email,
                            "username": values.username,
                            "password": values.password,
                            "nome": values.firstName,
                            "cognome": values.lastName,
                            "telefono": values.telephoneNumber,
                            "indirizzo": values.address,
                            "citta": values.city,
                            "cap": values.cap,
                            "role": ['user'],
                            "provider": loginSocial === '' ? 'Local' : loginSocial 
                        })
                    };
                    fetch("http://localhost:30000/api/v1/auth/signup", requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data['message'].includes('User registered successfully!')) {
                            $("#registerUserEmail").fadeOut(400, function() {
                                $("#registerSuccesfully").css("display", "flex").hide().fadeIn(400, function(){
                                    $("#registerSuccesfully").css("display", "flex");
                                });
                            });                
                            setPercentage(100);
                        }
                    })
                    .catch(err => console.log(err))
                }}
                initialValues={{
                    email: emailSocial,
                    username: usernameSocial,
                    password: '',
                    firstName: nomeSocial,
                    lastName: cognomeSocial,
                    telephoneNumber: '',
                    address: '',
                    city: '',
                    cap: '',
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
                            <Form.Group as={Col} controlId="validationFormik32" className="position-relative">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                    readOnly={loginSocial === '' ? false : true}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} controlId="validationFormik33" className="position-relative">
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
                            {loginSocial === '' && <Form.Group as={Col} controlId="validationFormik34" className="position-relative">
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
                        <Button onClick={() => {
                            setValidateAfterSubmitUser(true);
                            handleSubmit();
                        }}>Registrati</Button>
                        <Button style={{marginLeft: "20px"}} onClick={() => {
                            $("#registerUserEmail").fadeOut(400, function() {
                                $("#registerChoiceEmail").css("display", "flex").hide().fadeIn(400, function(){
                                    $("#registerChoiceEmail").css("display", "flex");
                                });
                            });               
                            setPercentage(50);
                        }}>Indietro</Button>
                    </Form>
                )}
            </Formik>
        </RegisterUserEmail>
        <RegisterSuccesfully id="registerSuccesfully">
            <RegisterH2>Registrazione completata!</RegisterH2>
            <Button variant="primary" onClick={returnAndLogin} style={{alignItems: "center", display: "flex"}}>
                Accedi e torna alla Homepage
            </Button>
        </RegisterSuccesfully>
        <ProgressBar id="progressBar" striped animated variant="success" now={percentage} style={{width: "70%", margin: "90px auto"}} />
    </Register>
    )
}

export default Registrazione
