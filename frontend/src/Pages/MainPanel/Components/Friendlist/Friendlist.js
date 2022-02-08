import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../../AuthContext/Authcontext';
import { BsFillPersonPlusFill, BsFillPersonLinesFill } from 'react-icons/bs'
import './friendlist.css'
import AddFriend from '../AddFriend/AddFriend';

const Friendlist = () => {
  const AuthCon = useContext(AuthContext)
  const [addFriend, setAddFriend] = useState(false) 
  
  return <>
    <div className='friendlist_main'>
      <div className='friendlist_navbar'>
        <button className='friendlist_navbar-button' type='button' onClick={() => setAddFriend(false)}><BsFillPersonLinesFill/></button>
        <button className='friendlist_navbar-button' type='button' onClick={() => setAddFriend(true)}><BsFillPersonPlusFill/></button>
      </div>
      <div className='friendlist_navbar-footer'/>
      {addFriend ? <AddFriend/>:
      'dupa'}
    </div>
  </>
};

export default Friendlist;
