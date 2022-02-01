import React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import "./login.css"
import { LoginContext } from './logincontext';

const Login = () => {
    const LoginCon = useContext(LoginContext)

    return <>
        <div className='Login_main'>
            <div className='Login_main-header'>
                <h1>Login to Hermes</h1>
            </div>
            <form className='Login_main-form'>
                <div className={`Login_main-input_box ${LoginCon.inputs[0] && 'Login_main-input_box-incorrect'}`}>
                    <label htmlFor='username'>Username</label>
                    <input id='username' type='text' value={LoginCon.crudentials.username} onChange={(e) => LoginCon.dispatch({type: 'set_username', payload: e.target.value})}></input>
                    <p>{LoginCon.message.username}</p>
                </div>
                <div className={`Login_main-input_box ${LoginCon.inputs[1] && 'Login_main-input_box-incorrect'}`}>
                    <label htmlFor='password'>Password</label>
                    <input id='password' type='password' value={LoginCon.crudentials.password} onChange={(e) => LoginCon.dispatch({type: 'set_password', payload: e.target.value})}></input>
                    <p>{LoginCon.message.password}</p>
                </div>
                <div className='Login_main-submit'>
                    <button type='submit' onClick={(e) => LoginCon.handleSubmit(e)}>Login</button>
                </div>
            </form>
            <div className='Login_main-register'>
                <h3>Don't have an account yet?</h3>
                <Link to="/register">Sign up</Link>
            </div>
        </div>
    </>
};

export default Login;
