import React, { useContext, useState } from 'react';
import {AiOutlineSearch, AiOutlinePlus} from 'react-icons/ai'
import {BsPersonFill} from 'react-icons/bs'
import './addfriend.css'
import { FetchContext } from '../../../../Fetch/AuthFetchContext';
import { communicaitonContext } from '../CommunicationWindow/communicationContext';

const AddFriend = () => {
    const [text, setText] = useState('')
    const [found, setFound] = useState([])
    const [message, setMessage] = useState('')
    
    const AuthFetchCon = useContext(FetchContext)
    const comCon = useContext(communicaitonContext)

    const getUsers = async () => {
      if (text !== ''){
        const {data} = await AuthFetchCon.authFetch.post('users/find', 
        {   
            text: text, 
        })
        setFound(data)
      }
    }

    const handleClick = async (user_id) => {
      const {data} = await AuthFetchCon.authFetch.post('users/sendFriendRequest',
      {
        user_id: user_id,
      })
      if (data.result === 0)
      {
        setMessage('Request send!')
        comCon.socket.emit('new-request', user_id)
      }
      if (data.result === -1){
        setMessage('Pending request or already befriended')
      }
    }

  return <div className='addfriend_main'>
        <h1 className='addfriend_input-box-header'>Search for friends:</h1>
      <div className='addfriend_input-box'>
        <input className='addfriend_input-box-input' type='text' value={text} onChange={(e) => setText(e.target.value)} placeholder='Search'></input>
        <button className='addfriend_input-box-button' onClick={() => getUsers()}><AiOutlineSearch/></button>
      </div>
      <div className='addfriend_message'>
        <h3>{message}</h3>
      </div>
      <div className='addfriend_userlist'>
        {found.map((user) => {
            return <div className='addfriend_userlist-user' key={user.user_id}>
                {user.image !== '' ? <img className='Friendlist_main-friend_image' src={user.image} alt='friend-pic'/> : <BsPersonFill className='Friendlist_main-friend_image'/>}
                <h2>{user.username}</h2>
                <AiOutlinePlus onClick={() => handleClick(user.user_id)} className='addfriend_userlist-user-add'/>
            </div>
          })
        }
      </div>
  </div>;
};

export default AddFriend;
