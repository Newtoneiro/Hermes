import React, { useContext } from 'react'
import { BsPersonFill } from 'react-icons/bs';
import { IoReloadCircleSharp } from 'react-icons/io5'
import { communicaitonContext } from '../../CommunicationWindow/communicationContext';
import { FriendlistContext } from '../FriendlistContext';

const Friends = ({clickHandle}) => {
    const comCon = useContext(communicaitonContext)
    const FriendlistCon = useContext(FriendlistContext)

  return (  <>
            <div className='friends_groups-reload' onClick={() => FriendlistCon.loadFriends(true)}>
                <IoReloadCircleSharp/>
            </div>
            {FriendlistCon.friends.length === 0 ?
            <h2>No friends yet!</h2>:
            <>
            {FriendlistCon.friends.map((friend) => {
                return <div key={friend.friendships_id} className={`Friendlist_main-friend ${friend.friendships_id === comCon.room && 'friend-selected'}`}
                        onClick={() => clickHandle(friend.friendships_id, [{user_id: friend.friend_id, image: friend.image}])}>
                    {friend.image !== '' ? <img className='Friendlist_main-friend_image' src={friend.image} alt='friend-pic'/> : <BsPersonFill className='Friendlist_main-friend_image'/>}
                    <div className='Friendlist_main-friend_username'>
                        <h3>{friend.username}</h3>
                        {FriendlistCon.notifications.includes(friend.friendships_id) && <div className='Friendlistmain-notification'></div>}
                    </div>
                </div>
            })}
            </>}
        </>
  )
}

export default Friends