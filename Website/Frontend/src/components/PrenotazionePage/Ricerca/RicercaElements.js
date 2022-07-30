import styled from 'styled-components';

export const ResearchWrapper = styled.div`
    background: #0c0c0c;
    position: relative;
    min-height: 500px;
    margin-top: 80px;
    z-index: 1;
    padding-bottom: 30px;
`

export const InputWrapper = styled.div`
    background: #fff;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    border-radius: 20px;
    margin: 0 auto;
    gap: 20px 50px;
    width: 65%;
    justify-content: flex-start;
    padding: 40px;
    align-items: center;
`

export const SectionTitle = styled.h1`
    font-size: 42px;
    padding: 30px;
    padding-left: 100px;
    padding-top: 50px;
    padding-bottom: 40px;
    color: #fff;

    @media screen and (max-width: 968px) {
        font-size: 36px;
    }

    @media screen and (max-width: 600px) {
        font-size: 30px;
    }
`