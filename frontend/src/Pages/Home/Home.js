import React from 'react';
import Navbar from '../../Navbar/Navbar';
import './home.css'

import logo from '../../resources/logo.png'

const Home = () => {
    return <div className='home_main'>
        <Navbar/>
        <div className='home_main-title'>
            <h1>The future of communication?</h1>
            <img className='home_main-logo' src={logo} alt='logo'/>
        </div>
    </div>
};

export default Home;
