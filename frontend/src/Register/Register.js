import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RegisterContext } from './registercontext';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading/Loading';


const Register = () => {
  const RegisterCon = useContext(RegisterContext)

  const handleSubmit = async (e) => {
      const data = await RegisterCon.handleSubmit(e);
      if (data){
          RegisterCon.setRedirectOnRegister(true)
      }
  }

  return <>
    {RegisterCon.redirectOnRegister && <Redirect to='/login'/>}
        <div className='Login_main'>
        <div className='Login_main-header'>
            <h1>Register to Hermes</h1>
        </div>
        <form className='Login_main-form'>
           <div className={`Login_main-input_box ${RegisterCon.inputs[0] && 'Login_main-input_box-incorrect'}`}>
                <label htmlFor='username'>Username</label>
                <input id='username' type='text' value={RegisterCon.crudentials.username} onChange={(e) => RegisterCon.dispatch({type: 'set_username', payload: e.target.value})}></input>
                <p>{RegisterCon.message.username}</p>
            </div>
            <div className={`Login_main-input_box ${RegisterCon.inputs[1] && 'Login_main-input_box-incorrect'}`}>
                <label htmlFor='email'>Email</label>
                <input id='email' type='email' value={RegisterCon.crudentials.email} onChange={(e) => RegisterCon.dispatch({type: 'set_email', payload: e.target.value})}></input>
                <p>{RegisterCon.message.email}</p>
            </div>
            <div className={`Login_main-input_box ${RegisterCon.inputs[2] && 'Login_main-input_box-incorrect'}`}>
                <label htmlFor='password'>Password</label>
                <input id='password' type='password' value={RegisterCon.crudentials.password} onChange={(e) => RegisterCon.dispatch({type: 'set_password', payload: e.target.value})}></input>
                <p>{RegisterCon.message.password}</p>
            </div>
            <div className={`Login_main-input_box ${RegisterCon.inputs[3] && 'Login_main-input_box-incorrect'}`}>
                <label htmlFor='confirm_password'>Confirm Password</label>
                <input id='confirm_password' type='password' value={RegisterCon.crudentials.confirm_password} onChange={(e) => RegisterCon.dispatch({type: 'set_confirm_password', payload: e.target.value})}></input>
                <p>{RegisterCon.message.confirm_password}</p>
            </div>
            <div className='Login_main-submit'>
                <button type='submit' onClick={(e) => handleSubmit(e)}>{RegisterCon.loading?<Loading/>:'Register'}</button>
            </div>
        </form>
        <div className='Login_main-register'>
            <h3>Already have an account?</h3>
            <Link to="/login">Login</Link>
        </div>
    </div>
    </>
};

export default Register;
