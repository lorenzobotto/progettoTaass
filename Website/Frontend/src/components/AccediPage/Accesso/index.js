import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {Form, Button} from 'react-bootstrap';
import {LoginWrapper, LoginForm, IconImg, SocialLogin} from './AccessoElements';
import FacebookLogin from 'react-facebook-login';
import {FaFacebookF} from 'react-icons/fa';
import {Formik} from 'formik';
import * as yup from 'yup';
import CryptoAES from 'crypto-js/aes';
import {Link as LinkR} from 'react-router-dom'
import jwt_decode from 'jwt-decode';

const Accesso = () => {
    const [invalidUser, setInvalidUser] = React.useState(false);
    const [invalidUserSocial, setInvalidUserSocial] = React.useState(false)
    const testUser = async (values) => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "username": values.username,
                    "password": values.password
                })
            };
            let response = await fetch("http://localhost:30000/api/v1/auth/signin/available", requestOptions)
            setInvalidUser(!response.ok)
            return response.ok
    }
    const schemaLogin = yup.object().shape({
        username: yup.string().required("L'username o l'email è obbligatorio."),
        password: yup.string().required('La password è obbligatoria.'),
    });

    const navigate = useNavigate();

    const responseGoogle = (response) => {
        const user = jwt_decode(response.credential);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"email": user.email, "provider": "Google"})
        };
        fetch("http://localhost:30000/api/v1/auth/signinSocial", requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data['message'] != null && data['message'].includes("Utente non registrato con questa email!")) {
                setInvalidUserSocial(!response.ok);
            } else {
                sessionStorage.setItem("username", data['username']);
                sessionStorage.setItem("email", data['email']);
                sessionStorage.setItem("roles", data['roles']);
                sessionStorage.setItem("isLoggedIn", true);  
                sessionStorage.setItem("tokenType", data['tokenType']);
                sessionStorage.setItem("accessToken", data['accessToken']);
                sessionStorage.setItem("password", CryptoAES.encrypt("", "taass").toString())
                navigate("/");
            }
        })
        .catch(err => console.log(err))
    }
    
    const responseFacebook = (response) => {
        if (response.status !== "unknown"){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"email": response['email'], "provider": "Facebook"})
            };
            fetch("http://localhost:30000/api/v1/auth/signinSocial", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data['message'] != null && data['message'].includes("Utente non registrato con questa email!")) {
                    setInvalidUserSocial(true);
                } else {
                    sessionStorage.setItem("username", data['username']);
                    sessionStorage.setItem("email", data['email']);
                    sessionStorage.setItem("roles", data['roles']);
                    sessionStorage.setItem("isLoggedIn", true);  
                    sessionStorage.setItem("tokenType", data['tokenType']);
                    sessionStorage.setItem("accessToken", data['accessToken']);
                    sessionStorage.setItem("password", CryptoAES.encrypt("", "taass").toString())
                    navigate("/");
                }
            })
            .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_KEY,
            callback: responseGoogle,
            context: "signin"
        });

        window.google.accounts.id.renderButton(
            document.getElementById("g_id_signin"), {theme: "filled_blue", size: "large", type: "standard", logo_alignment: "left", locale: "it_IT", width: "244", text: "signin_with"}
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <LoginWrapper>
            <LoginForm>    
                <IconImg src={require('../../../images/avatarUser.png').default} alt="icon" />
                <Formik
                    validationSchema={schemaLogin}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={async (values) => {
                        const isValid = await testUser(values);
                        if (isValid) {
                          const requestOptions = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({"username": values.username, "password": values.password})
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
                              sessionStorage.setItem("password", CryptoAES.encrypt(values.password, "taass").toString())
                              navigate("/");
                          })
                          .catch(err => console.log(err))
                        }
                    }}
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                    >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                    }) => (
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="position-relative mb-3" controlId="formBasicEmail">
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
                    <Form.Group className="position-relative mb-3" controlId="formBasicPassword">
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
                    </Form.Group>
                    <Button variant="primary w-100" type="submit">Login</Button>
                </Form>
                )}
            </Formik>
            {invalidUser && <div id="errorMsg" style={{marginTop: "20px"}} class="alert alert-danger" role="alert">
                Email/Username o password invalidi.
            </div>}
            {invalidUserSocial && <div id="errorSocialLogin" style={{marginTop: "20px"}} class="alert alert-danger" role="alert">
                Email non registrata o Account non trovato. Effettua prima la <LinkR to="/registrazione">registrazione</LinkR>.
            </div>}
            </LoginForm>
            <div className="divider"><span></span><span>Oppure</span><span></span></div>
            <SocialLogin>
                <div className="container">
                    <FacebookLogin
                        appId={process.env.REACT_APP_FACEBOOK_CLIENT_KEY}
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook}
                        textButton="Accedi con Facebook"
                        icon={<FaFacebookF  style={{marginRight: "10px", marginBottom: "3px"}}></FaFacebookF>}
                        cssClass="btnFacebookAccess"
                        language="it_IT"
                        buttonStyle={{marginBottom: "20px"}}
                    />
                </div>
                <div className="container">
                    <div id="g_id_signin" style={{justifyContent: "center", display: "flex"}} />
                </div>
            </SocialLogin>
        </LoginWrapper>
    )
}

export default Accesso
