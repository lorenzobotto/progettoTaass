import React, {useState} from 'react';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import QandA from '../components/FaqPage/QandA';

const FaqPage = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }
    
    return (
        <div>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <QandA />
            <Footer />
        </div>
    )
}

export default FaqPage
