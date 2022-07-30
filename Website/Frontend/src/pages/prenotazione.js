import React, {useState} from 'react'
import Footer from '../components/Common/Footer';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import Ricerca from '../components/PrenotazionePage/Ricerca';

const PrenotazionePage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Ricerca />
            <Footer />
        </>
    )
}

export default PrenotazionePage
