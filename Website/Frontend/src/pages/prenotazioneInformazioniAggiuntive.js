import React, {useState} from 'react';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import InfoAggPage from '../components/PrenotazioneInfoAggPage/InfoAgg'; 

const PrenotazioneInfoAggPage = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }
    
    return (
        <div>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <InfoAggPage /> 
            <Footer />
        </div>
    )
}

export default PrenotazioneInfoAggPage