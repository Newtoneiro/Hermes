import React from 'react';
import Navbar from '../../Navbar/Navbar';
import { CommunicationProvider } from './Components/CommunicationWindow/communicationContext';
import CommunicationWindowMain from './Components/CommunicationWindow/CommunicationWindowMain';
import { FriendlistProvider } from './Components/Friendlist/FriendlistContext';
import Sidepanel from './Components/Sidepanel/Sidepanel';
import './mainpanel.css'

const MainPanel = () => {

  return <FriendlistProvider>
  <CommunicationProvider>
    <div className='mainpanel_container'>
      <Navbar/>
      <div className='mainpanel_main'>
        <Sidepanel/>
        <CommunicationWindowMain/>
      </div>
    </div>
    </CommunicationProvider>
  </FriendlistProvider>
};

export default MainPanel;
