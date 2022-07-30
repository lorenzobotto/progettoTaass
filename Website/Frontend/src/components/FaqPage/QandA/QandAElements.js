import styled from 'styled-components';
import {Accordion} from 'react-bootstrap';
import {Link as LinkR} from 'react-router-dom'

export const QuestionsWrapper = styled.div`
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
    text-align: center;

    @media screen and (max-width: 1000px) {
        width: 80%;
    }

    @media screen and (max-width: 768px) {
        width: 100%;
    }
`

export const Questions = styled.div`
    align-items: center;
    height: 850px;
    background: #0c0c0c;
`

export const SectionTitle = styled.h1`
    font-size: 42px;
    padding: 30px;
    padding-top: 50px;
    padding-bottom: 40px;
    color: #fff;
`

export const AccordionContainer = () => {
    return (
        <Accordion style={{padding: "30px"}}>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Come faccio a prenotarmi?</Accordion.Header>
                <Accordion.Body>
                Nella pagina <LinkR to='/prenotazione'>prenotazione</LinkR> è possibile scegliere il periodo e altre informazioni utili alla prenotazione, dopodichè si sceglie la struttura o il pet sitter a cui si vuole lasciare il proprio cucciolo.
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
                <Accordion.Header>Se ho più animali devo aprire più account?</Accordion.Header>
                <Accordion.Body>
                No, un account è più che sufficiente. Basta effettuare più prenotazioni, una per ogni animale.
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
                <Accordion.Header>PetCare è solo per cani e gatti?</Accordion.Header>
                <Accordion.Body>
                Attualmente si. In futuro vogliamo espandere la platea di animali accettati!
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
                <Accordion.Header>Come faccio a cancellare una prenotazione?</Accordion.Header>
                <Accordion.Body>
                E' sufficiente andare nella sezione personale in cui è presente l'elenco delle prenotazioni e premere il pulsante "Annulla prenotazione"
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
                <Accordion.Header>Il pagamento in contati quando dovrà essere effettuato?</Accordion.Header>
                <Accordion.Body>
                Dovrà essere effettuato nel momento in cui si porta l'animale presso la struttura o il petsitter
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
                <Accordion.Header>E' presente un servizio che viene a prendere l'animale direttamente a casa?</Accordion.Header>
                <Accordion.Body>
                Attualmente in questa prima fase non è previsto. In futuro vogliamo inserirlo tra i servizi disponibili alle strutture registrate alla nostra piattaforma
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
                <Accordion.Header>Il mio animale ha bisogno di cure specifiche, come faccio?</Accordion.Header>
                <Accordion.Body>
                Nessun problema, durante la prenotazione è possibile specificare se l'animale ha bisogno di medicine o cure specifiche
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
                <Accordion.Header>Una volta effettuata la prenotazione dove la posso trovare?</Accordion.Header>
                <Accordion.Body>
                Nella sezione del <LinkR to='/profilo'>profilo</LinkR> oltre a visualizzare i dati personali inseriti, 
                è possibile vedere tutte le prenotazioni effettuate.
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
                <Accordion.Header>Il mio animale non è abituato a stare con altri animali, come posso fare?</Accordion.Header>
                <Accordion.Body>
                Qualora si scelga una struttura è possibile indicarlo in fase di prenotazione. In questo modo la struttura lo saprà e terrà il vostro animale in una stanza singola.
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}