import React from 'react';
import Navbar from '../../Navbar/Navbar';
import Background from '../Background/Background';
import './home.css'

import stars from '../../resources/images/stars.png'
import moon from '../../resources/images/moon.png'
import mountains_behind from '../../resources/images/mountains_behind.png'
import mountains_front from '../../resources/images/mountains_front.png'

const Home = () => {
    window.addEventListener('scroll', function(){
        let value=window.scrollY;
        this.document.getElementById("stars").style.top = -0.2*value + 'px';
        this.document.getElementById("floating_title").style.marginLeft = 5*value + 'px';
    })

    return <div className='home_main'>
        <Navbar/>
        {/* <Background/> */}
    </div>
};

export default Home;
