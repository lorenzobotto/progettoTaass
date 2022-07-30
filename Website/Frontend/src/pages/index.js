import React, {useState} from 'react';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import CarouselSection from '../components/Homepage/CarouselSection';
import Working from '../components/Homepage/Working';
import Footer from '../components/Common/Footer';

const Home = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <CarouselSection />
            <Working />
            <Footer />
        </>
    )
}

export default Home
