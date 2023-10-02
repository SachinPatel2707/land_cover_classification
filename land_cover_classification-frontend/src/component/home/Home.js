import React, { useEffect } from 'react'
import Navbar2 from '../navbar/Navbar2'
import Introduction from './Introduction'
import image1 from "./image1.png";
import image2 from "./image2.png";
import image3 from "./image3.png";
import Slider from './Slider';
import Team from './Team';
import "../home/Home.css";
import Header from './Header';
import eventBus from '../eventBus/EventBus';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0,0)
    }, []);
    
    const handleOnClick = () => {
        eventBus.emit('goToLogin', 'Hello from navbar');
    }
    const images = [image1, image2, image3];
    return (
        <div className='main'>
            {/* <div className="header">
                <img src={image2} alt="Logo" className="logo" />
                <h1>LAND COVER CLASSIFICATION</h1>
                <button className="login-button" onClick={handleOnClick}><a href="/login">Login</a></button>
            </div> */}
            <Introduction />
            <Team />
        </div>
    )
}

export default Home