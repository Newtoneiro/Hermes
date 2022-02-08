import React from 'react';
import Navbar from '../../Navbar/Navbar';
import Friendlist from './Components/Friendlist/Friendlist';
import './mainpanel.css'

const MainPanel = () => {
  return <>
    <Navbar/>
    <Friendlist/>
  </>;
};

export default MainPanel;
