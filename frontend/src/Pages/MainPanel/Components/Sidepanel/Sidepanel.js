import React, { useState } from 'react';
import { BsFillPersonPlusFill, BsFillPersonLinesFill, BsFillEnvelopeFill } from 'react-icons/bs'
import './sidepanel.css'
import AddFriend from '../AddFriend/AddFriend';
import FriendRequests from '../FriendRequests/FriendRequests';
import Friendlist from '../Friendlist/Friendlist'

const Sidepanel = () => {
  const [state, setState] = useState(0) 
  
  return <>
    <div className='Sidepanel_main'>
      <div className='Sidepanel_navbar'>
        <div className='Sidepanel_navbar-button' onClick={() => setState(0)}><BsFillPersonLinesFill/></div>
        <div className='Sidepanel_navbar-button' onClick={() => setState(1)}><BsFillPersonPlusFill/></div>
        <div className='Sidepanel_navbar-button'  onClick={() => setState(2)}><BsFillEnvelopeFill/></div>
      </div>
      <div className='Sidepanel_navbar-footer'/>
      {state === 0 && <Friendlist/>}
      {state === 1 && <AddFriend/>}
      {state === 2 && <FriendRequests/>}
    </div>
  </>
};

export default Sidepanel;
