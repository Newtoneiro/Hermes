import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext/Authcontext';

const Home = () => {
    const AuthCon = useContext(AuthContext)
    return <div>{console.log(AuthCon.authState.expiresAt < 20)}</div>; /* global BigInt */
};

export default Home;
