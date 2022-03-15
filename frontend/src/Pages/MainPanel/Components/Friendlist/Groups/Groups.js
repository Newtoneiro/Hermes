import React, { useCallback, useContext } from 'react'
import {AiFillPlusCircle, AiFillDelete} from 'react-icons/ai'
import { IoReloadCircleSharp } from 'react-icons/io5'
import { BsPersonFill } from 'react-icons/bs'
import {ImCancelCircle, ImCheckmark} from 'react-icons/im'
import {FiMoreHorizontal} from 'react-icons/fi'
import {RiVipCrown2Fill} from 'react-icons/ri'
import {HiUserRemove, HiUserAdd} from 'react-icons/hi'

import Loading from '../../../../../Loading/Loading'
import { GroupsContext } from './GroupsContext'
import { AuthContext } from '../../../../../AuthContext/Authcontext'
import { FriendlistContext } from '../FriendlistContext'
import { communicaitonContext } from '../../CommunicationWindow/communicationContext'


const Groups = ({clickHandle}) => {
    const GroupsCon = useContext(GroupsContext)
    const AuthCon = useContext(AuthContext)
    const FriendlistCon = useContext(FriendlistContext)
    const comCon = useContext(communicaitonContext)

    const handleGroupChange = useCallback((e, group_id, member_icons) => {
        if (e.target.id === 'change_group'){
            GroupsCon.setDisplayGroupMenu(false)
            GroupsCon.setDisplayedGroup({})
            clickHandle(group_id, member_icons)
        }
    }, [GroupsCon, clickHandle])
    
    const GroupMenu = () => {
        return <div className='group-menu'>
            {GroupsCon.confirmLoading ? <Loading/> :
            <div className='group-menu_members'>
            {GroupsCon.displayedGroup.member_icons.map((icon) => {
                return <div className='group-menu_members-member' key={icon.user_id}>
                        {icon.image !== '' ? <img className='Friendlist_main-friend_image' src={icon.image} alt='friend-pic'/> : <BsPersonFill className='Friendlist_main-friend_image'/>}
                        <h2>{icon.username}{icon.user_id === GroupsCon.displayedGroup.ownerID && <RiVipCrown2Fill className='member-owner'/>}</h2>
                        <div className='group-menu_members-member_options'>
                        {(AuthCon.authState.userInfo.id === GroupsCon.displayedGroup.ownerID && AuthCon.authState.userInfo.id !== icon.user_id) &&
                        <>
                            <RiVipCrown2Fill className='options-promote' onClick={() => GroupsCon.updateGroupMember(icon.user_id, 1)}/>
                            <HiUserRemove className='options-remove' onClick={() => GroupsCon.updateGroupMember(icon.user_id, 2)}/>
                        </>
                        }
                        </div>
                    </div>
            })}
            {
            AuthCon.authState.userInfo.id === GroupsCon.displayedGroup.ownerID &&
            <div className='group-menu_buttons'>
                <div className='group-menu_add-member' onClick={() => GroupsCon.setPopupState(2)}>
                    <HiUserAdd/>
                </div>
                <div className='group-menu_delete-group' onClick={() => GroupsCon.setPopupState(3)}>
                    <AiFillDelete/>
                </div>
            </div>
            }
            </div>
            }
        </div>
    }

  return (<>
    <div className='Groups_create'>
        <h3>Create new group</h3>
        <AiFillPlusCircle className='Groups_create-add' onClick={() => GroupsCon.setPopupState(1)}/>
        {GroupsCon.popupState === 1 && <div id='Background' className='Groups_creator' onClick={(e) => GroupsCon.cancelAction(e)}>
            <div className='Groups_creator-friendlist'>
            {FriendlistCon.friends.map((friend) => {
                return <div key={friend.friendships_id} className={`Friendlist_main-friend ${GroupsCon.groupMembers.includes(friend.friend_id) && 'friend-selected'}`} onClick={() => GroupsCon.updateGroupMembers(friend.friend_id)}>
                    {friend.image !== '' ? <img className='Friendlist_main-friend_image' src={friend.image} alt='friend-pic'/> : <BsPersonFill className='Friendlist_main-friend_image'/>}
                    <div className='Friendlist_main-friend_username'>
                        <h3>{friend.username}</h3>
                    </div>
                </div>
            })}
            </div>
            <div className='Groups_creator-controls'>
                <input type='text' value={GroupsCon.groupName} onChange={(e) => GroupsCon.setGroupName(e.target.value)} placeholder={GroupsCon.placeholder} maxLength='20'/>
                <div className='Groups_creator-controls_buttons'>
                    <div className='Groups_creator-controls_buttons-cancel' onClick={() => GroupsCon.cancelGroupCreation()}>
                        <ImCancelCircle/>
                    </div>
                    <div className='Groups_creator-controls_buttons-accept' onClick={() => GroupsCon.acceptGroupCreation()}>
                        {GroupsCon.loading? <Loading/> : <ImCheckmark/>}
                    </div>
                </div>
            </div>
        </div>}
        {(GroupsCon.popupState === 2 && AuthCon.authState.userInfo.id === GroupsCon.displayedGroup.ownerID) && <div id='Background' className='Groups_creator' onClick={(e) => GroupsCon.cancelAction(e)}>
            <div className='Groups_creator-friendlist'>
            {FriendlistCon.friends.map((friend) => {
                if (!GroupsCon.displayedGroup.member_icons.map((icon) => {return icon.user_id}).includes(friend.friend_id)){
                    return <div key={friend.friendships_id} className={`Friendlist_main-friend ${GroupsCon.usersToAdd.includes(friend.friend_id) && 'friend-selected'}`} onClick={() => GroupsCon.updateUsersToAdd(friend.friend_id)}>
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
                    <div className='Groups_creator-controls_buttons-cancel' onClick={() => GroupsCon.cancelAddUsers()}>
                        <ImCancelCircle/>
                    </div>
                    <div className='Groups_creator-controls_buttons-accept' onClick={() => GroupsCon.acceptAddUsers()}>
                        {GroupsCon.loading? <Loading/> : <ImCheckmark/>}
                    </div>
                </div>
            </div>
        </div>}

        {GroupsCon.popupState === 3 && <div id='Background' className='Groups_creator' onClick={(e) => GroupsCon.cancelAction(e)}>
            <div className='group-delete'>
                <h2>Are you sure you want to delete this group?</h2>
                <div className='Groups_creator-controls_buttons'>
                    <div className='Groups_creator-controls_buttons-cancel' onClick={() => GroupsCon.setPopupState(0)}>
                        <ImCancelCircle/>
                    </div>
                    <div className='Groups_creator-controls_buttons-accept' onClick={() => GroupsCon.deleteDisplayedGroup()}>
                        {GroupsCon.loading? <Loading/> : <ImCheckmark/>}
                    </div>
                </div>
            </div>
        </div>}
    
        </div>
        <div className='friends_groups-reload' onClick={() => FriendlistCon.loadGroups(true)}>
            <IoReloadCircleSharp/>
        </div>
        {FriendlistCon.groups.map((group) => {
                return <React.Fragment key={group.group_id}><div id='change_group' className={`Friendlist_main-friend ${group.group_id === comCon.room && 'friend-selected'}`}
                    onClick={(e) => handleGroupChange(e, group.group_id, group.member_icons)}>
                    <div id='change_group' className='Friendlist_main-friend_username'>
                        <h3 id='change_group'>{group.name}</h3>
                        {FriendlistCon.notifications.includes(group.group_id) && <div className='Group-notification'></div>}
                        <div onClick={() => GroupsCon.updateGroupMenu(group, true)} className={`group-more ${(GroupsCon.displayGroupMenu && GroupsCon.displayedGroup === group) && 'group-more_clicked'}`}>
                            <FiMoreHorizontal id='group-more'/>
                        </div>
                    </div>
                </div>
                {(GroupsCon.displayGroupMenu && group.group_id === GroupsCon.displayedGroup.group_id) && <GroupMenu/>}
                </React.Fragment>
            })}
    </>)
}

export default Groups