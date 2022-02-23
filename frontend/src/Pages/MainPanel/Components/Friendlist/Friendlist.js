import React, { useContext, useEffect, useState } from 'react';
import {FaUsers, FaUser} from 'react-icons/fa'
import { FetchContext } from '../../../../Fetch/AuthFetchContext';
import Loading from '../../../../Loading/Loading';
import { communicaitonContext } from '../CommunicationWindow/communicationContext';
import './friendlist.css'
import Friends from './Friends/Friends';
import Groups from './Groups/Groups';

const Friendlist = ({hidePanel}) => {
    const [friends, setFriends] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(false)
    const [friendsgroups, setFriendsgroups] = useState(0)
    const AuthFetchCon = useContext(FetchContext)
    const comCon = useContext(communicaitonContext)

    useEffect(() => {
        async function execute(){
            setLoading(true)
            
            var {data} = await AuthFetchCon.authFetch.get('users/getFriends')
            if (data.status === 0){
                setFriends(data.result)
            }

            const data2 = await AuthFetchCon.authFetch.get('users/getGroups')
            if (data2.data.status === 0){
                setGroups(data2.data.result)
            }

            setLoading(false)
        }

        execute()
    }, [AuthFetchCon.authFetch])

    const handleClick = (room, img) => {
        comCon.joinRoom(room)
        comCon.setFriendImage(img)
        if (window.screen.width <= 900){
            hidePanel()
        }
    }

    return <>
        <div className='Friendlist_main'>
            <div className='Friendlist_choice'>
                <div className={`Friendlist_choice-friends ${friendsgroups === 0 && 'Friendlist_choice-chosen'}`} onClick={() => setFriendsgroups(0)}>
                    <FaUser/>
                </div>
                <div className={`Friendlist_choice-groups ${friendsgroups === 1 && 'Friendlist_choice-chosen'}`} onClick={() => setFriendsgroups(1)}>
                    <FaUsers/>
                </div>
            </div>
            {loading ? <div className='Friendlist_main-loading'><Loading/></div>:
            friendsgroups === 0 ? 
            <Friends friends={friends} handleClick={handleClick}/>
            :
            <Groups friends={friends} groups={groups} setGroups={setGroups} handleClick={handleClick}/>
            }
        </div>
    </>
};

export default Friendlist;
