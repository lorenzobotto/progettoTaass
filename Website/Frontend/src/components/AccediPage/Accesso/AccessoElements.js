import styled from 'styled-components';

export const LoginWrapper = styled.div`
    align-items: center;
    min-height: 100vh;
    background: #0c0c0c;
`

export const LoginForm = styled.div`
    width: 25%;
    margin: 0 auto;
    margin-bottom: 50px;
    padding-top: 140px;
    text-align: center;

    @media screen and (max-width: 968px) {
        width: 45%;
    }

    @media screen and (max-width: 768px) {
        width: 55%;
    }
`

export const SocialLogin = styled.div`
    display: flex;
    width: 30%;
    margin: 0 auto;
    justify-content: center;
    text-align: center;

    @media screen and (max-width: 968px) {
        width: 55%;
    }

    @media screen and (max-width: 600px) {
        flex-wrap: wrap;
        width: 100%;
    }
`

export const IconImg = styled.img`
    width: 70px;
    height: 70px;
    margin-bottom: 2rem;
`

export const ErrorMessage = styled.div`
    
    color: #dc3545;
    margin-top: 1rem;

    p {
        margin-bottom: 0rem;
    }
`