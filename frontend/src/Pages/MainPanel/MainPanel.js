import React from 'react';
import Navbar from '../../Navbar/Navbar';
import { CommunicationProvider } from './Components/CommunicationWindow/communicationContext';
import CommunicationWindowMain from './Components/CommunicationWindow/CommunicationWindowMain';
import { FriendlistProvider } from './Components/Friendlist/FriendlistContext';
import { GroupsProvider } from './Components/Friendlist/Groups/GroupsContext';
import { FriendRequestProvider } from './Components/FriendRequests/FriendRequestsContext';
import Sidepanel from './Components/Sidepanel/Sidepanel';
import './mainpanel.css'

const MainPanel = () => {

  return <FriendlistProvider>
          <FriendRequestProvider>
            <CommunicationProvider>
              <GroupsProvider>
              <div className='mainpanel_container'>
                <Navbar/>
                <div className='mainpanel_main'>
                  <Sidepanel/>
                  <CommunicationWindowMain/>
                </div>
              </div>
              </GroupsProvider>
            </CommunicationProvider>
          </FriendRequestProvider>
        </FriendlistProvider>
};

export default MainPanel;
