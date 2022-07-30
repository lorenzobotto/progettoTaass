import React, {useState} from 'react'
import Footer from '../components/Common/Footer';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import Conferma from '../components/ConfermaPrenotazionePage/Conferma';

const ConfermaPrenotazionePage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Conferma />
            <Footer />
        </>
    )
}

export default ConfermaPrenotazionePage
