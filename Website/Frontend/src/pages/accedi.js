import React, {useState} from 'react';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import Accesso from '../components/AccediPage/Accesso';

const AccediPage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Accesso />
        </div>
    )
}

export default AccediPage
