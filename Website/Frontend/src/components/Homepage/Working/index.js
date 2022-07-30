import React from 'react';
import {WorkingContainer, WorkingH1, WorkingWrapper, WorkingCard, WorkingIcon, WorkingH2} from './WorkingElements';



const Working = () => {
    return (
        <WorkingContainer>
            <WorkingH1>Come funziona il nostro servizio</WorkingH1>
            <WorkingWrapper>
                <WorkingCard>
                    <WorkingIcon src={require('../../../images/cerca.PNG').default}/>
                    <WorkingH2>1. Cerca</WorkingH2>
                </WorkingCard>
                <WorkingCard>
                    <WorkingIcon src={require('../../../images/Risultati.PNG').default}/>
                    <WorkingH2>2. Visualizza i risultati</WorkingH2>
                </WorkingCard>
                <WorkingCard>
                    <WorkingIcon src={require('../../../images/ScegliStruttura.PNG').default}/>
                    <WorkingH2>3. Scegli la struttura o il pet sitter</WorkingH2>
                </WorkingCard>
                <WorkingCard>
                    <WorkingIcon src={require('../../../images/prenotazione.PNG').default}/>
                    <WorkingH2>4. Prenota</WorkingH2>
                </WorkingCard>
                <WorkingCard>
                    <WorkingIcon src={require('../../../images/Pagamento.PNG').default}/>
                    <WorkingH2>5. Paga</WorkingH2>
                </WorkingCard>
            </WorkingWrapper>
        </WorkingContainer>
    )
}

export default Working
