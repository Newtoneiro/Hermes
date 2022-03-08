import React, { useContext } from 'react';
import Loading from '../../../../Loading/Loading';
import './friendrequests.css'
import { FaTimes } from 'react-icons/fa';
import { BsCheckLg } from 'react-icons/bs'
import { FriendRequestContext } from './FriendRequestsContext';

const FriendRequests = () => {
    const FriendReqCon = useContext(FriendRequestContext)

    return <div className='FriendRequests_main'>
        {FriendReqCon.loading ?<div className='FriendRequest_main-loading'><Loading/></div>:
        FriendReqCon.requests.length === 0?
        <h2>No pending requests</h2>
        :<>
            <h2>New requests:</h2>
            <div className='FriendRequests_main-footer'></div>
            {FriendReqCon.requests.map((req) => {
                return <div key={req.friendships_requests_id} className='FriendRequest_main_instance'>
                        <h2>{req.username}</h2>
                        <div className='FriendRequest_main_instance-buttons'>
                            <FaTimes className='decline' onClick={() => FriendReqCon.handleDecline(req.friendships_requests_id)}/>
                            <BsCheckLg className='accept' onClick={() => FriendReqCon.handleAccept(req.friendships_requests_id)}/>
                        </div>
                    </div>
            })}
        </>}
        </div>
};

export default FriendRequests;
