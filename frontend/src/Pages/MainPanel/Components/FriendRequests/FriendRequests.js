import React, { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../../../Fetch/AuthFetchContext';
import Loading from '../../../../Loading/Loading';
import './friendrequests.css'
import { FaTimes } from 'react-icons/fa';
import { BsCheckLg } from 'react-icons/bs'

const FriendRequests = () => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false);
    const AuthFetchCon = useContext(FetchContext)

    const loadData = async () => {
        const {data} = await AuthFetchCon.authFetch.get('users/getRequests')
        if (data.status >= 0){
            setRequests(data.result)
        }
    }

    useEffect(async () => {
        setLoading(true)
        await loadData()
        setLoading(false)
    }, [])

    const handleDecline = async (req_id) => {
        setLoading(true)
        const {data} = await AuthFetchCon.authFetch.post('users/declineRequest',
        {
            req_id: req_id,
        })
        if (data.result == 0){
            await loadData()
        }
        setLoading(false)
    }

    const handleAccept = async (req_id) => {
        setLoading(true)
        const {data} = await AuthFetchCon.authFetch.post('users/acceptRequest', {
            req_id: req_id
        })
        if (data.result == 0){
            await loadData()
        }
        setLoading(false)
    }

    return <div className='FriendRequests_main'>
        {loading ?<Loading/>:
        requests.length === 0?
        <h2>No pending requests</h2>
        :requests.map((req) => {
            return <div key={req.friendships_requests_id} className='FriendRequest_main_instance'>
                    {req.username}
                    <div className='FriendRequest_main_instance-buttons'>
                        <FaTimes className='decline' onClick={() => handleDecline(req.friendships_requests_id)}/>
                        <BsCheckLg className='accept' onClick={() => handleAccept(req.friendships_requests_id)}/>
                    </div>
                </div>
        })}
    </div>
};

export default FriendRequests;