import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext/Authcontext';
import { AiOutlineMenu } from 'react-icons/ai'
import './navbar.css'

const Navbar = () => {
    const links = ['about', 'contact', 'info']
    const [toggleMenu, setToggleMenu] = useState(false)
    const AuthCon = useContext(AuthContext)

    const Loginbox = ({classname}) => {
        return <div className={classname}>
                {AuthCon.isAuthenticated()?
                    <button className='navbar_login-link_button' onClick={() => AuthCon.logout()}>Log out</button>
                    :<>
                    <Link to='/register' className='navbar_login-link'>Sign up</Link>
                    <Link to='/login' className='navbar_login-link navbar_login-link_button'>Login</Link>
                    </>
                }
                </div>
    }

    return <div className='navbar_main'>
                <div className='navbar_header'>
                    <h1>Hermes</h1>
                </div>
                <div className='navbar_links'>
                    {links.map((link) => {
                        return <h3>{link}</h3>
                    })}
                </div>
                {<Loginbox classname='navbar_login'/>}
                <div className='navbar_toggle_menu'>
                    <AiOutlineMenu onClick={() => setToggleMenu((state) => {return !state})}/>
                </div>
                {toggleMenu &&
                    <div className='navbar_popup_menu'>
                        {links.map((link) => {
                        return <h3>{link}</h3>
                        })}
                        {<Loginbox classname='navbar_login_popup'/>}
                    </div>
                }
            </div>
};

export default Navbar;
