import React, {useState} from 'react'
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import SceltaRegistrazione from '../components/RegistrazionePage/SceltaRegistrazione';

const RegistrazionePage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <SceltaRegistrazione />
        </>
    )
}

export default RegistrazionePage
