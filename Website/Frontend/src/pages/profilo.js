import React, {useState} from 'react'
import Footer from '../components/Common/Footer';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import Profilo from '../components/ProfiloPage/Profilo';

const ProfiloPage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Profilo />
            <Footer />
        </>
    )
}

export default ProfiloPage
