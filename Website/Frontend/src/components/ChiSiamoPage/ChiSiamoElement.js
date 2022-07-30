import styled from 'styled-components';

export const ChiSiamoWrapper = styled.div`
    background: #0c0c0c;
    position: relative;
    min-height: 80vh;
    margin-top: 80px;
    z-index: 1;
    padding-bottom: 30px;
`

export const ChiSiamoH1 = styled.h1`
    font-size: 42px;
    padding: 30px;
    padding-left: 100px;
    padding-top: 50px;
    padding-bottom: 40px;
    color: #fff;
`

export const BodyWrapper = styled.div`
    display: flex;
    width: 80%;
    margin: 0 auto;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 1000px) {
        flex-wrap: wrap;
        width: 90%;
    }

    @media screen and (max-width: 768px) {
        width: 100%;
    }
`

export const Icon = styled.img`
    height: 50%;
    width: 50%;

    @media screen and (max-width: 1000px) {
        height: 70%;
        width: 70%;
    }

    @media screen and (max-width: 768px) {
        height: 70%;
        width: 70%;
    }
`

export const SectionText = styled.div`
    margin-left: 20px;
    font-size: 18px;
    text-align: justify;
    color: #fff;

    @media screen and (max-width: 1000px) {
        margin: 20px;
        margin-top: 40px;
    }
`