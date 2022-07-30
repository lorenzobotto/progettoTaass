import styled from "styled-components";

export const MappaRisultatiContainer = styled.div`
    display: flex;
    min-height: 80vh;
    margin: 0 auto;
    margin-top: 70px;
    background: #010606;

    @media screen and (max-width: 1000px) {
        flex-direction: column;
        flex-wrap: wrap;
    }
`

export const MapContainer = styled.div`
    display: flex;
    flex: 60%;
    padding: 1em;
    border: solid #010606;
    flex-direction: column;

    @media screen and (max-width: 1000px) {
        width: 100%;
        margin: 0 auto;
    }
`

export const MarkerInfoContainer = styled.div`
    display: none;
    flex: 40%;
    padding: 1em;
    border: solid #010606;
    width: 70%;
    margin: 0 auto;
`

export const MarkerInfoContainerH1 = styled.h1`
    font-size: 2rem;
    color: #fff;
    margin-bottom: 30px;

    @media screen and (max-width: 480px) {
        font-size: 2rem;
    }
`

export const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    color: #fff;
`