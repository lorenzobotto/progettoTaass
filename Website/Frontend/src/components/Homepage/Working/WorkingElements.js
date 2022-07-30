import styled from "styled-components";

export const WorkingContainer = styled.div`
    min-height: 700px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #010606;

    @media screen and (max-width: 1250px) {
        padding: 20px;
    }

    @media screen and (max-width: 980px) {
        padding: 20px;
    }

    @media screen and (max-width: 768px) {
        padding: 20px;
    }

    @media screen and (max-width: 480px) {
        padding: 20px;
    }
`

export const WorkingWrapper = styled.div`
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
    grid-gap: 16px;
    padding: 0 50px;

    @media screen and (max-width: 1250px){
        grid-template-columns: 1fr 1fr 1fr 1fr;
        padding: 20px 20px;
    }

    @media screen and (max-width: 980px){
        grid-template-columns: 1fr 1fr 1fr;
        padding: 20px 20px;
    }

    @media screen and (max-width: 768px){
        grid-template-columns: 1fr;
        padding: 20px 20px;
    }
`

export const WorkingCard = styled.div`
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px;
    min-height: 300px;
    max-height: 340px;
    padding: 30px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: all 0.2 ease-in-out;

    &:hover {
        transform: scale(1.02);
        transition: all 0.2s ease-in-out;
    }
`

export const WorkingIcon = styled.img`
    height: 160px;
    width: 160px;
    margin-bottom: 30px;
`

export const WorkingH1 = styled.h1`
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 64px;

    @media screen and (max-width: 480px) {
        font-size: 2rem;
    }
`

export const WorkingH2 = styled.h2`
    font-size: 1rem;
    margin-bottom: 10px;
    font-weight: bold;
`