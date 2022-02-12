import React from 'react';
import Navbar from '../../Navbar/Navbar';
import { CommunicationProvider } from './Components/CommunicationWindow/communicationContext';
import CommunicationWindowMain from './Components/CommunicationWindow/CommunicationWindowMain';
import Sidepanel from './Components/Sidepanel/Sidepanel';
import './mainpanel.css'

const MainPanel = () => {

  return <>
    <Navbar/>
    <CommunicationProvider>
    <div className='mainpanel_main'>
      <Sidepanel/>
      <CommunicationWindowMain/>
    </div>
    </CommunicationProvider>
  </>;
};

export default MainPanel;
