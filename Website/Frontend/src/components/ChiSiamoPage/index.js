import React from 'react';
import {ChiSiamoWrapper, Icon, ChiSiamoH1, BodyWrapper, SectionText} from './ChiSiamoElement';

const Chisiamo = () => {
    return (
        <ChiSiamoWrapper>
            <ChiSiamoH1>Chi siamo</ChiSiamoH1>
            <BodyWrapper>
                <Icon src={require('../../images/Chisiamo.png').default}/>
                <SectionText>
                La piattaforma PetCare nasce dall'idea di fornire un servizio che unisce alcuni servizi già presenti online, ossia, 
                il servizio di petsitting e quello relativo all'accoglienza degli animali nelle strutture convenzionate. 
                In questo modo sarà molto più veloce e semplice trovare una sistemazione al proprio animale. Tramite la piattaforma infatti
                è possibile selezionare la posizione e il periodo di interesse per vedere sull'apposita mappa tutti i risultati inerenti alla ricerca. 
                Una volta scelta la struttura o il pet sitter, basterà proseguire con la prenotazione. Il pagamento può essere fatto direttamente online 
                tramite PayPal o in contanti. Le prenotazioni possono essere modificate o cancellate fino al termine massimo di 1 giorno prima.
                Inoltre, per chi dovesse riscontrare problemi nelle varie procedure o avesse dubbi e/o domande, può contattare il nostro centro assistenza petcare@gmail.com
                o andare nella sezione FAQ. 
                </SectionText>  
            </BodyWrapper>
        </ChiSiamoWrapper>
    )   
}


export default Chisiamo
