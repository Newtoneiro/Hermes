import React, { useContext, useEffect, useState } from 'react';
import { BsPersonFill } from 'react-icons/bs';
import { FetchContext } from '../../../../Fetch/AuthFetchContext';
import Loading from '../../../../Loading/Loading';
import { communicaitonContext } from '../CommunicationWindow/communicationContext';
import './friendlist.css'

const Friendlist = () => {
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(false)
    const AuthFetchCon = useContext(FetchContext)
    const comCon = useContext(communicaitonContext)

    useEffect(() => {
        async function execute(){
            setLoading(true)
            
            const {data} = await AuthFetchCon.authFetch.get('users/getFriends')
            if (data.status === 0){
                setFriends(data.result)
            }
            setLoading(false)
        }

        execute()
    }, [AuthFetchCon.authFetch])

    const handleClick = (room, img) => {
        comCon.joinRoom(room)
        comCon.setFriendImage(img)
    }

    return <div className='Friendlist_main'>
        {loading ? <div className='Friendlist_main-loading'><Loading/></div>:
        friends.length === 0?
        <h2>No friends yet!</h2>:
        friends.map((friend) => {
            return <div key={friend.friendships_id} className={`Friendlist_main-friend ${friend.friendships_id === comCon.room && 'friend-selected'}`}
                    onClick={() => handleClick(friend.friendships_id, friend.image)}>
                {friend.image !== '' ? <img className='Friendlist_main-friend_image' src={friend.image} alt='friend-pic'/> : <BsPersonFill className='Friendlist_main-friend_image'/>}
                <div className='Friendlist_main-friend_username'>
                    <h3>{friend.username}</h3>
                </div>
            </div>
        })}
    </div>;
};

export default Friendlist;
