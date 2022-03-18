import React, { useContext } from 'react';
import {FaUsers, FaUser} from 'react-icons/fa'
import Loading from '../../../../Loading/Loading';
import { communicaitonContext } from '../CommunicationWindow/communicationContext';
import './friendlist.css'
import { FriendlistContext } from './FriendlistContext';
import Friends from './Friends/Friends';
import Groups from './Groups/Groups';

const Friendlist = ({hidePanel}) => {
    const comCon = useContext(communicaitonContext)
    const FriendlistCon = useContext(FriendlistContext)

    const handleClick = (room, img) => {
        comCon.joinRoom(room)
        comCon.setReceiversInfo(img)
        if (window.screen.width <= 900){
            hidePanel()
        }
    }

    return <>
        <div className='Friendlist_main'>
            <div className='Friendlist_choice'>
                <div className={`Friendlist_choice-friends ${FriendlistCon.friendsgroups === 0 && 'Friendlist_choice-chosen'}`} onClick={() => FriendlistCon.setFriendsgroups(0)}>
                    <FaUser/>
                </div>
                <div className={`Friendlist_choice-groups ${FriendlistCon.friendsgroups === 1 && 'Friendlist_choice-chosen'}`} onClick={() => FriendlistCon.setFriendsgroups(1)}>
                    <FaUsers/>
                </div>
            </div>
            {FriendlistCon.loading ? <div className='Friendlist_main-loading'><Loading/></div>:
            FriendlistCon.friendsgroups === 0 ? 
            <Friends clickHandle={handleClick}/>
            :
            <Groups clickHandle={handleClick}/>
            }
        </div>
    </>
};

export default Friendlist;
