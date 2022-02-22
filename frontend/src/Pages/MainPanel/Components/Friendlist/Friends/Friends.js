import React, { useContext } from 'react'
import { BsPersonFill } from 'react-icons/bs';
import { communicaitonContext } from '../../CommunicationWindow/communicationContext';

const Friends = ({friends, handleClick}) => {
    const comCon = useContext(communicaitonContext)

  return (friends.length === 0?
            <h2>No friends yet!</h2>:
            friends.map((friend) => {
                return <div key={friend.friendships_id} className={`Friendlist_main-friend ${friend.friendships_id === comCon.room && 'friend-selected'}`}
                        onClick={() => handleClick(friend.friendships_id, [{user_id: friend.friend_id, image: friend.image}])}>
                    {friend.image !== '' ? <img className='Friendlist_main-friend_image' src={friend.image} alt='friend-pic'/> : <BsPersonFill className='Friendlist_main-friend_image'/>}
                    <div className='Friendlist_main-friend_username'>
                        <h3>{friend.username}</h3>
                    </div>
                </div>
            })
  )
}

export default Friends