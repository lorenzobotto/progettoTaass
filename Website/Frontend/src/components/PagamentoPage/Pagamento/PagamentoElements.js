import styled from "styled-components";

export const Pagamento = styled.div`
    min-height: 100vh;
    background: #010606;
    padding-bottom: 30px;
    clear: both;
    overflow: auto;
    padding: 0px 10px 10px 10px;
`

export const PagamentoH1 = styled.h1`
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 30px;
    padding-top: 150px;
    text-align: center;

    @media screen and (max-width: 480px) {
        font-size: 2rem;
    }
`

export const PagamentoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    border-radius: 20px;
    margin: 0 auto;
    width: 60%;
    padding: 40px;
    color: #fff;

    @media screen and (max-width: 1100px) {
        width: 45%;
    }

    @media screen and (max-width: 968px) {
        width: 60%;
    }

    @media screen and (max-width: 768px) {
        width: 80%;
    }
`