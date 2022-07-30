import React, {useState} from 'react';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import Newspage from '../components/NewsPage'; 

const NewsPage = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }
    
    return (
        <div>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Newspage /> 
            <Footer />
        </div>
    )
}

export default NewsPage