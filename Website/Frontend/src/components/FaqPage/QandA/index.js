import React from 'react';
import {QuestionsWrapper, AccordionContainer, SectionTitle, Questions} from './QandAElements';

const QandA = () => {
    return (
        <div>
            <Questions>
                <QuestionsWrapper>
                    <SectionTitle>FAQ (Frequently Asked Questions)</SectionTitle>
                    <AccordionContainer />
                </QuestionsWrapper>
            </Questions>
        </div>
    )
}

export default QandA
