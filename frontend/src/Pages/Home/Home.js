import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext/Authcontext';
import Navbar from '../../Navbar/Navbar';
import './home.css'

const Home = () => {
    const AuthCon = useContext(AuthContext)
    
    return <div className='home_main'>
        <Navbar/>
    </div>
};

export default Home;
