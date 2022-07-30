import styled from "styled-components";

export const Register = styled.div`
    min-height: 100vh;
    background: #010606;
    padding-bottom: 30px;
    clear: both;
    overflow: auto;
    padding: 0px 10px 10px 10px;
`

export const RegisterChoice = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    clear: both;

    @media screen and (max-width: 1250px) {
        padding: 20px;
    }
`

export const RegisterChoiceEmail = styled.div`
    flex-direction: column;
    align-items: center;
    display: none;

    @media screen and (max-width: 1250px) {
        padding: 20px;
    }

    @media screen and (max-width: 1000px) {
        padding: 20px;
    }
`

export const RegisterChoiceWrapper = styled.div`
    justify-content: center;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 16px;
    padding: 40px 50px;
    width: 70%;

    @media screen and (max-width: 1250px){
        grid-template-columns: 1fr 1fr;
        padding: 0px 0px;
    }

    @media screen and (max-width: 980px){
        grid-template-columns: 1fr;
        padding: 20px 0px;
    }
`

export const RegisterChoiceWrapperEmail = styled.div`
    display: flex;
    flex-direction: column;
    padding: 40px 50px;
    width: 70%;
    justify-content: center;
    > {
        text-align: center;
    }

    @media screen and (max-width: 1250px){
        width: 80%;
    }

    @media screen and (max-width: 980px){
        grid-template-columns: 1fr;
        padding: 20px 0px;
        width: 90%;
    }
`

export const RegisterChoiceCard = styled.div`
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    min-height: 300px;
    max-height: 340px;
    padding: 30px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: all 0.2 ease-in-out;
    cursor: pointer;

    &:hover {
        transform: scale(1.02);
        transition: all 0.2s ease-in-out;
    }
`

export const RegisterChoiceIcon = styled.img`
    height: 240px;
    width: 240px;
    margin-bottom: 30px;
`

export const RegisterChoiceH1 = styled.h1`
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 30px;
    padding-top: 150px;

    @media screen and (max-width: 480px) {
        font-size: 2rem;
    }
`

export const RegisterChoiceH2 = styled.h2`
    font-size: 1rem;
    margin-bottom: 10px;
    font-weight: bold;
`

export const RegisterStructureEmail = styled.div`
    display: none;
    flex-direction: column;
    align-items: center;
    clear: both;

    @media screen and (max-width: 1250px) {
        padding: 20px;
    }
`

export const RegisterSuccesfully = styled.div`
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    clear: both;
    height: 70vh;

    @media screen and (max-width: 1250px) {
        padding: 20px;
    }
`

export const RegisterH2 = styled.h2`
    font-size: 2rem;
    color: #fff;
    margin-bottom: 50px;
    padding-top: 150px;
    align-items: center;

    @media screen and (max-width: 480px) {
        font-size: 1.5rem;
    }
`

export const RegisterPetsitterEmail = styled.div`
    display: none;
    flex-direction: column;
    align-items: center;
    clear: both;

    @media screen and (max-width: 1250px) {
        padding: 20px;
    }
`

export const RegisterUserEmail = styled.div`
    display: none;
    flex-direction: column;
    align-items: center;
    clear: both;

    @media screen and (max-width: 1250px) {
        padding: 20px;
    }
`