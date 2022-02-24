import React, { useContext, useState } from 'react'
import {AiFillPlusCircle} from 'react-icons/ai'
import { BsPersonFill } from 'react-icons/bs'
import {ImCancelCircle, ImCheckmark} from 'react-icons/im'
import {FiMoreHorizontal} from 'react-icons/fi'
import {RiVipCrown2Fill} from 'react-icons/ri'
import {HiUserRemove, HiUserAdd} from 'react-icons/hi'
import { FetchContext } from '../../../../../Fetch/AuthFetchContext'
import Loading from '../../../../../Loading/Loading'
import { communicaitonContext } from '../../CommunicationWindow/communicationContext'
import { AuthContext } from '../../../../../AuthContext/Authcontext'

const Groups = ({friends, groups, setGroups, handleClick}) => {
    const [popupState, setPopupState] = useState(0)
    const [groupMembers, setGroupMembers] = useState([])
    const [groupName, setGroupName] = useState('')
    const [placeholder, setPlaceholder] = useState('Enter Group Name')
    const [loading, setLoading] = useState(false)

    const [displayGroupMenu, setDisplayGroupMenu] = useState(false)
    const [displayedGroup, setDisplayedGroup] = useState({})

    const [confirmLoading, setConfirmLoading] = useState(false)

    const [usersToAdd, setUsersToAdd] = useState([])

    const authFetchCon = useContext(FetchContext)
    const comCon = useContext(communicaitonContext)
    const AuthCon = useContext(AuthContext)

    const updateAddGroup = (e) => {
        if (e.target.id === 'Groups_creator'){
            setPopupState(0)
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

    const updateUsersToAdd = (user_id) => {
        setUsersToAdd((prev) => {
            if (prev.includes(user_id)){
                return prev.filter((item) => item !== user_id)
            }
            else{
                return [...prev, user_id]
            }
        })
    }

    const cancelGroupCreation = () => {
        setPopupState(0)
        setGroupMembers([])
        setGroupName('')
    }

    const cancelAddUsers = () => {
        setPopupState(0)
        setUsersToAdd([])
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
                var result = await authFetchCon.authFetch.get('users/getGroups')
                if (result.data.status === 0){
                    setGroups(result.data.result)
                }
            }
        }
        cancelGroupCreation()
        setLoading(false)
    }

    const acceptAddUsers = async () => {
        setLoading(true)
        if (usersToAdd.length > 0){
            const {data} = await authFetchCon.authFetch.post('users/addUsersToGroup', {
                members: usersToAdd,
                group_id: displayedGroup.group_id
            })
            if (data.status === 0){
                var result = await authFetchCon.authFetch.get('users/getGroups')
                if (result.data.status === 0){
                    setGroups(result.data.result)
                }
            }
        }
        cancelAddUsers()
        setLoading(false)
    }

    const handleGroupChange = (e, group_id, member_icons) => {
        if (e.target.id === 'change_group'){
            setDisplayGroupMenu(false)
            setDisplayedGroup({})
            handleClick(group_id, member_icons)
        }
    }

    const updateGroupMenu = (group, val) => {
        if (group === displayedGroup){
            setDisplayGroupMenu(false)
            setDisplayedGroup({})
        }
        else{
            setDisplayGroupMenu(true)
            setDisplayedGroup(group)
        }
    }

    const updateGroupMember = async (user_id, action) => {
        setConfirmLoading(true)
        var result;
        if (action === 1) {
            const {data} = await authFetchCon.authFetch.post('users/promoteGroup', {user_id: user_id, group_id: displayedGroup.group_id})
            if (data.status === 0){
                result = await authFetchCon.authFetch.get('users/getGroups')
                if (result.data.status === 0){
                    setGroups(result.data.result)
                }
            }
        }
        else if (action === 2) {
            const {data} = await authFetchCon.authFetch.post('users/removeFromGroup', {user_id: user_id, group_id: displayedGroup.group_id})
            if (data.status === 0){
                result = await authFetchCon.authFetch.get('users/getGroups')
                if (result.data.status === 0){
                    setGroups(result.data.result)
                }
            }
        }
        setConfirmLoading(false)
    }

    const GroupMenu = () => {
        return <div className='group-menu'>
            {confirmLoading ? <Loading/> :
            <div className='group-menu_members'>
            {displayedGroup.member_icons.map((icon) => {
                return <div className='group-menu_members-member' key={icon.user_id}>
                        {icon.image !== '' ? <img className='Friendlist_main-friend_image' src={icon.image} alt='friend-pic'/> : <BsPersonFill className='Friendlist_main-friend_image'/>}
                        <h2>{icon.username}{icon.user_id === displayedGroup.ownerID && <RiVipCrown2Fill className='member-owner'/>}</h2>
                        <div className='group-menu_members-member_options'>
                        {(AuthCon.authState.userInfo.id === displayedGroup.ownerID && AuthCon.authState.userInfo.id !== icon.user_id) &&
                        <>
                            <RiVipCrown2Fill className='options-promote' onClick={() => updateGroupMember(icon.user_id, 1)}/>
                            <HiUserRemove className='options-remove' onClick={() => updateGroupMember(icon.user_id, 2)}/>
                        </>
                        }
                        </div>
                    </div>
            })}
            <div className='group-menu_add-member' onClick={() => setPopupState(2)}>
                <HiUserAdd/>
            </div>
            </div>
            }
        </div>
    }

  return (<>
    <div className='Groups_create'>
        <h3>Create new group</h3>
        <AiFillPlusCircle className='Groups_create-add' onClick={() => setPopupState(1)}/>
        {popupState === 1 && <div id='Groups_creator' className='Groups_creator' onClick={(e) => updateAddGroup(e)}>
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
        
        {(popupState === 2 && AuthCon.authState.userInfo.id === displayedGroup.ownerID) && <div id='Groups_creator' className='Groups_creator' onClick={(e) => updateAddGroup(e)}>
            <div className='Groups_creator-friendlist'>
            {friends.map((friend) => {
                if (!displayedGroup.member_icons.map((icon) => {return icon.user_id}).includes(friend.friend_id)){
                    return <div key={friend.friendships_id} className={`Friendlist_main-friend ${usersToAdd.includes(friend.friend_id) && 'friend-selected'}`} onClick={() => updateUsersToAdd(friend.friend_id)}>
                        {friend.image !== '' ? <img className='Friendlist_main-friend_image' src={friend.image} alt='friend-pic'/> : <BsPersonFill className='Friendlist_main-friend_image'/>}
                        <div className='Friendlist_main-friend_username'>
                            <h3>{friend.username}</h3>
                        </div>
                    </div>
                }
                else{
                    return null
                }
            })}
            </div>
            <div className='Groups_creator-controls'>
                <div className='Groups_creator-controls_buttons'>
                    <div className='Groups_creator-controls_buttons-cancel' onClick={() => cancelAddUsers()}>
                        <ImCancelCircle/>
                    </div>
                    <div className='Groups_creator-controls_buttons-accept' onClick={() => acceptAddUsers()}>
                        {loading? <Loading/> : <ImCheckmark/>}
                    </div>
                </div>
            </div>
        </div>}
        
        </div>
        {groups.map((group) => {
                return <React.Fragment key={group.group_id}><div id='change_group' className={`Friendlist_main-friend ${group.group_id === comCon.room && 'friend-selected'}`}
                    onClick={(e) => handleGroupChange(e, group.group_id, group.member_icons)}>
                    <div id='change_group' className='Friendlist_main-friend_username'>
                        <h3 id='change_group'>{group.name}</h3>
                        <div onClick={() => updateGroupMenu(group, true)} className={`group-more ${(displayGroupMenu && displayedGroup === group) && 'group-more_clicked'}`}>
                            <FiMoreHorizontal id='group-more'/>
                        </div>
                    </div>
                </div>
                {(displayGroupMenu && group === displayedGroup)&& <GroupMenu/>}
                </React.Fragment>
            })}
    </>)
}

export default Groups