import React from 'react';
import {NewsWrapper, News, SectionTitle, Card1Container, Card2Container, Space} from './NewsPageElement';

const Newspage = () => {
    return (
        
            <News>
                <NewsWrapper>
                    <SectionTitle>Sezione News</SectionTitle>
                    <Card1Container/> 
                    <Space></Space>   
                    <Card2Container/>
                </NewsWrapper>
            </News>
        
    )
}

export default Newspage
