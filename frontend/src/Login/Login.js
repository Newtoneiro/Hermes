import React from 'react';
import { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { LoginContext } from './logincontext';
import Loading from '../Loading/Loading';
import { AuthContext } from '../AuthContext/Authcontext';

import "./login.css"

const Login = () => {
    const LoginCon = useContext(LoginContext)
    const AuthCon = useContext(AuthContext)

    const handleSubmit = async (e) => {
        const data = await LoginCon.handleSubmit(e);
        if (data){
            AuthCon.setAuthInfo(data)
        }
    }

    return <>
        {LoginCon.redirectOnLogin && <Redirect to='/'/>}
        <div className='Form_main'>
            <div className='Form_main-header'>
                <h1>Login to Hermes</h1>
            </div>
            <form className='Form_main-form'>
                <div className={`Form_main-input_box ${LoginCon.inputs[0] && 'Form_main-input_box-incorrect'}`}>
                    <label htmlFor='username'>Username</label>
                    <input id='username' type='text' value={LoginCon.crudentials.username} onChange={(e) => LoginCon.dispatch({type: 'set_username', payload: e.target.value})}></input>
                    <p>{LoginCon.message.username}</p>
                </div>
                <div className={`Form_main-input_box ${LoginCon.inputs[1] && 'Form_main-input_box-incorrect'}`}>
                    <label htmlFor='password'>Password</label>
                    <input id='password' type='password' value={LoginCon.crudentials.password} onChange={(e) => LoginCon.dispatch({type: 'set_password', payload: e.target.value})}></input>
                    <p>{LoginCon.message.password}</p>
                </div>
                <div className='Form_main-submit'>
                    <button type='submit' onClick={(e) => handleSubmit(e)}>{LoginCon.loading?<Loading/>:'Login'}</button>
                </div>
            </form>
            <div className='Form_main-register'>
                <h3>Don't have an account yet?</h3>
                <Link to="/register">Sign up</Link>
            </div>
        </div>
    </>
};

export default Login;
