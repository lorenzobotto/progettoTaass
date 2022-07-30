import styled from 'styled-components';
import {Card} from 'react-bootstrap';
import {Button} from 'react-bootstrap';


export const NewsWrapper = styled.div`
    background: #0c0c0c;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 30px;
    position: relative;
    margin: 0 auto;
    margin-top: 80px;
    z-index: 1;
    width: 50%;
    text-align: left;

    @media screen and (max-width: 1000px) {
        width: 80%;
    }

    @media screen and (max-width: 768px) {
        width: 100%;
    }
`

export const News = styled.div`
    align-items: center;
    height: 800px;
    background: #0c0c0c;
`


export const SectionTitle = styled.h1`
    font-size: 42px;
    padding: 30px;
    padding-top: 50px;
    padding-bottom: 40px;
    color: #fff;
    text-align: center;
`

export const Space = styled.br`
    margin-bottom: 5px;
`

export const Card1Container = () => {
    return (
        <Card>
            <Card.Header as="h5">AVVISO SOSPENSIONE SERVIZIO TEMPORANEA</Card.Header>
                <Card.Body>
                    <Card.Title>PetCare</Card.Title>
                        <Card.Text>
                        Si avvisa che nei giorni 22-23 febbraio il sito sarà sotto manutenzione. Ci scusiamo per il disagio.
                        </Card.Text>
                    <Button variant="primary">Leggi di più</Button>
                </Card.Body>
        </Card>
        
    )
}
export const Card2Container = () => {
    return (
        <Card>
            <Card.Header as="h5">SERVIZIO PETCARE ONLINE!</Card.Header>
                <Card.Body>
                    <Card.Title>PetCare</Card.Title>
                        <Card.Text>
                        Utilizza il nostro servizio per prenotare una struttura o un petsitter per il tuo amico a 4 zampe!!
                        </Card.Text>
                    <Button variant="primary">Leggi di più</Button>
                </Card.Body>
        </Card>
        
    )
}


        