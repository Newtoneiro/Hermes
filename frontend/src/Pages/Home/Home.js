import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import './home.css'
import {AiFillGithub} from 'react-icons/ai'
import {TiLightbulb} from 'react-icons/ti'
import {GiOpenBook} from 'react-icons/gi'
import {IoPeopleCircleOutline} from 'react-icons/io5'

import logo from '../../resources/logo.png'
import { Link } from 'react-router-dom';

const Home = () => {
    const [messages, setMessages] = useState([])
    const greetings = ["Hello!", "Hi!", "Cześć!", "Bonjour", "Ciao!", "Howdy!", "ちは!", "Привет", "Hola!", "Shalom", "Yo!", ":)"]

    useEffect(() => {
        const interval = setInterval(() => {
            setMessages((prev) => {
            if (prev.length < 50){
                return [...prev,  greetings[Math.floor(Math.random()*greetings.length)]]
            }
            else{
                return prev
            }
        })
        }, 2500)
        window.addEventListener('scroll', () => {
            let value = window.scrollY;
            document.getElementById('home_main-bottom').style.marginTop = -0.7*value + 'px';
        })
        return () => clearInterval(interval)
    }, [greetings])
    

    return <div id='home_main' className='home_main'>
        <Navbar/>
        <div className='home_main-box'>
            <div className='home_main-box_text'>
                <h1>Future of communication?</h1>
                <h4>Probably not, but it was a fun project!</h4>
                <div className='home_main-box_links'>
                    <AiFillGithub className='icon' onClick={() => window.open("https://github.com/Newtoneiro/Hermes")}/>
                    <div className='home_main-box_links-logins'>
                        <Link to='/login' className='home_main-box_links-login'>Login</Link>
                        <Link to='/register' className='home_main-box_links-signup'>Sign Up</Link>
                    </div>
                </div>
            </div>
            <div className='phone'>
                <div className='home_main-phone'/>
                <div className='home_main-phone_screen'>
                    {messages.map((message, n) => {
                        return <div key={n} className={`home_main-phone_screen-message ${n%2 === 0 ? 'even' : 'odd'}`}>
                            <h2>{message}</h2>
                        </div>
                    })}
                </div>
            </div>
        </div>
        <div id='home_main-bottom' className='home_main-bottom'>
            <div className='home_main-separator'>
                <div className='home_main-separator_left'/>
                <div className='home_main-separator_right'/>
                <div className='home_main-separator_center'/>
            </div>
            <div className='home_main-description'>
                <div className='home_main-description_logo-holder'>
                    <img className='home_main-description-logo' src={logo} alt='logo'/>
                </div>
                <div className='home_main-description_main'>
                    <h1>What is Hermes?</h1>
                    <div className='home_main-description_main-sections'>
                        <div className='home_main-description_main-sections_section'>
                            <TiLightbulb className='home_main-description_main-sections_section-icon'/>
                            <h2>AN IDEA</h2>
                            <h4>I had and wanted to implement. It may not be the best communicator on the market, but It's something I've done myself.</h4>
                        </div>
                        <div className='home_main-description_main-sections_section'>
                            <GiOpenBook className='home_main-description_main-sections_section-icon'/>
                            <h2>WAY TO LEARN</h2>
                            <h4>New things. I wanted to put my current React knowledge into use and also learn something new. This project taught me a lot about many aspects of web developement.</h4>
                        </div>
                        <div className='home_main-description_main-sections_section'>
                            <IoPeopleCircleOutline className='home_main-description_main-sections_section-icon'/>
                            <h2>WAY TO SHOW</h2>
                            <h4>What I'm already capable of doing, both as a way to impress my friends with simmilar skills and a solid base for future job interviews.</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default Home;
