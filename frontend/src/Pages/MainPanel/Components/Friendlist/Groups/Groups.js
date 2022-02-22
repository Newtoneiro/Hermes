import React, { useContext, useState } from 'react'
import {AiFillPlusCircle} from 'react-icons/ai'
import { BsPersonFill } from 'react-icons/bs'
import {ImCancelCircle, ImCheckmark} from 'react-icons/im'
import { FetchContext } from '../../../../../Fetch/AuthFetchContext'
import Loading from '../../../../../Loading/Loading'
import { communicaitonContext } from '../../CommunicationWindow/communicationContext'

const Groups = ({friends, groups, setGroups, handleClick}) => {
    const [addGroup, setAddGroup] = useState(0)
    const [groupMembers, setGroupMembers] = useState([])
    const [groupName, setGroupName] = useState('')
    const [placeholder, setPlaceholder] = useState('Enter Group Name')
    const [loading, setLoading] = useState(false)

    const authFetchCon = useContext(FetchContext)
    const comCon = useContext(communicaitonContext)

    const updateAddGroup = (e) => {
        if (e.target.id === 'Groups_creator'){
            setAddGroup(0)
        }
    }

    const updateGroupMembers = (user_id) => {
        setGroupMembers((prev) => {
            if (prev.includes(user_id)){
                return prev.filter((item) => item !== user_id)
            }
            else{
                return [...prev, user_id]
            }
        })
    }

    const cancelGroupCreation = () => {
        setAddGroup(0)
        setGroupMembers([])
        setGroupName('')
    }

    const acceptGroupCreation = async () => {
        setLoading(true)
        if (!groupName.replace(/\s/g, '').length){
            setPlaceholder('Group must have a name')
            setGroupName('')
        }
        else if (groupMembers.length < 2){
            setPlaceholder('Group has too few members')
            setGroupName('')
        }
        else {
            const {data} = await authFetchCon.authFetch.post('users/createGroup', {
                members: groupMembers,
                name: groupName
            })
            if (data.status === 0){
                cancelGroupCreation()
                var result = await authFetchCon.authFetch.get('users/getGroups')
                if (result.data.status === 0){
                    setGroups(result.data.result)
                }
            }
        }
        setLoading(false)
    }

  return (<>
    <div className='Groups_create'>
        <h3>Create new group</h3>
        <AiFillPlusCircle className='Groups_create-add' onClick={() => setAddGroup(1)}/>
        {addGroup === 1 && <div id='Groups_creator' className='Groups_creator' onClick={(e) => updateAddGroup(e)}>
            <div className='Groups_creator-friendlist'>
            {friends.map((friend) => {
                return <div key={friend.friendships_id} className={`Friendlist_main-friend ${groupMembers.includes(friend.friend_id) && 'friend-selected'}`} onClick={() => updateGroupMembers(friend.friend_id)}>
                    {friend.image !== '' ? <img className='Friendlist_main-friend_image' src={friend.image} alt='friend-pic'/> : <BsPersonFill className='Friendlist_main-friend_image'/>}
                    <div className='Friendlist_main-friend_username'>
                        <h3>{friend.username}</h3>
                    </div>
                </div>
            })}
            </div>
            <div className='Groups_creator-controls'>
                <input type='text' value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder={placeholder} maxLength='20'/>
                <div className='Groups_creator-controls_buttons'>
                    <div className='Groups_creator-controls_buttons-cancel' onClick={() => cancelGroupCreation()}>
                        <ImCancelCircle/>
                    </div>
                    <div className='Groups_creator-controls_buttons-accept' onClick={() => acceptGroupCreation()}>
                        {loading? <Loading/> : <ImCheckmark/>}
                    </div>
                </div>
            </div>
        </div>}
        </div>
        {groups.map((group) => {
                return <div key={group.group_id} className={`Friendlist_main-friend ${group.group_id === comCon.room && 'friend-selected'}`}
                    onClick={() => handleClick(group.group_id, group.member_icons)}>
                    <div className='Friendlist_main-friend_username'>
                        <h3>{group.name}</h3>
                    </div>
                </div>
            })}
    </>)
}

export default Groups