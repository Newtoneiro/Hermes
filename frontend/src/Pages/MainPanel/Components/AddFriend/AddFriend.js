import React, { useContext, useState } from 'react';
import { publicFetch } from '../../../../Fetch/fetch';
import {AiOutlineSearch, AiOutlinePlus} from 'react-icons/ai'
import {FaUserAlt} from 'react-icons/fa'
import './addfriend.css'
import { AuthContext } from '../../../../AuthContext/Authcontext';
import { FetchContext } from '../../../../Fetch/AuthFetchContext';

const AddFriend = () => {
    const [text, setText] = useState('')
    const [found, setFound] = useState([])
    const AuthCon = useContext(AuthContext)
    const AuthFetchCon = useContext(FetchContext)

    const getUsers = async () => {
       const {data} = await AuthFetchCon.authFetch.post('users/find', 
        {   
            text: text, 
        })
        setFound(data)
    }

  return <div className='addfriend_main'>
      <div className='addfriend_input-box'>
        <input className='addfriend_input-box-input' type='text' value={text} onChange={(e) => setText(e.target.value)} placeholder='Search'></input>
        <button className='addfriend_input-box-button' onClick={() => getUsers()}><AiOutlineSearch/></button>
      </div>
      <div className='addfriend_userlist'>
        {found.map((user) => {
            return <div className='addfriend_userlist-user' key={user.user_id}>
                <FaUserAlt/>
                <h2>{user.username}</h2>
                <AiOutlinePlus className='addfriend_userlist-user-add'/>
            </div>
        })}
      </div>
  </div>;
};

export default AddFriend;
