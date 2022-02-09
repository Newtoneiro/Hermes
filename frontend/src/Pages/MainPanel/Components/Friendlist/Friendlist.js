import React, { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../../../Fetch/AuthFetchContext';
import Loading from '../../../../Loading/Loading';
import './friendlist.css'

const Friendlist = () => {
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(false)
    const AuthFetchCon = useContext(FetchContext)

    const loadData = async () => {
        const {data} = await AuthFetchCon.authFetch.get('users/getFriends')
        if (data.status == 0){
            setFriends(data.result)
        }
    }

    useEffect(async () => {
        setLoading(true)
        await loadData()
        setLoading(false)
    }, [])

    return <div className='Friendlist_main'>
        {loading && <Loading/>}
        {friends.length == 0?
        <h2>No friends yet!</h2>:
        friends.map((friend) => {
            return <div key={friend.friendships_id} className='Friendlist_main-friend'>
                <h3>{friend.username}</h3>
            </div>
        })}
    </div>;
};

export default Friendlist;
