import React, { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../../../Fetch/AuthFetchContext';
import Loading from '../../../../Loading/Loading';
import { communicaitonContext } from '../CommunicationWindow/communicationContext';
import './friendlist.css'

const Friendlist = () => {
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(false)
    const AuthFetchCon = useContext(FetchContext)
    const comCon = useContext(communicaitonContext)

    const loadData = async () => {
        const {data} = await AuthFetchCon.authFetch.get('users/getFriends')
        if (data.status === 0){
            setFriends(data.result)
        }
    }

    useEffect(async () => {
        setLoading(true)
        await loadData()
        setLoading(false)
    }, [])

    const handleClick = (room) => {
        comCon.joinRoom(room)
    }

    return <div className='Friendlist_main'>
        {loading ? <Loading/>:
        friends.length == 0?
        <h2>No friends yet!</h2>:
        friends.map((friend) => {
            return <div key={friend.friendships_id} className='Friendlist_main-friend'
                    onClick={() => handleClick(friend.friendships_id)}>
                <h3>{friend.username}</h3>
            </div>
        })}
    </div>;
};

export default Friendlist;
