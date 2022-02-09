import React from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidepanel from './Components/Sidepanel/Sidepanel';
import './mainpanel.css'

const MainPanel = () => {
  return <>
    <Navbar/>
    <div className='mainpanel_main'>
      <Sidepanel/>
    </div>
  </>;
};

export default MainPanel;
