import { createContext, useState, useEffect, useContext } from "react";

import { FetchContext } from "../../../../../Fetch/AuthFetchContext";
import { communicaitonContext } from "../../CommunicationWindow/communicationContext";
import { AuthContext } from "../../../../../AuthContext/Authcontext";
import { FriendlistContext } from "../FriendlistContext";

const GroupsContext = createContext()

const GroupsProvider = ({children}) => {
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
    const FriendlistCon = useContext(FriendlistContext)

    useEffect(() => {
        setDisplayedGroup((prev) => { return FriendlistCon.groups.find((group) => group.group_id === prev.group_id) || {} })
    }, [FriendlistCon.groups])

    const cancelAction = (e) => {
        if (e.target.id === 'Background'){
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
            setGroupName('')
            setPlaceholder('Group must have a name')
        }
        else if (groupMembers.length < 2){
            setGroupName('')
            setPlaceholder('Group has too few members')
        }
        else {
            const {data} = await authFetchCon.authFetch.post('users/createGroup', {
                members: groupMembers,
                name: groupName
            })
            if (data.status === 0){
                var result = await authFetchCon.authFetch.get('users/getGroups')
                if (result.data.status === 0){
                    FriendlistCon.setGroups(result.data.result)

                    comCon.socket.emit('add-user-to-group', groupMembers)
                }
            }
            cancelGroupCreation()
        }
        setLoading(false)
    }

    const acceptAddUsers = async () => {
        setLoading(true)
        const group_id = displayedGroup.group_id
        if (usersToAdd.length > 0){
            usersToAdd.forEach((new_member) => {
                var message = {
                    alert: true,
                    text: `User ${FriendlistCon.friends.find((friend) => friend.friend_id === new_member).username} has been added to the group.`,
                    sender_id: AuthCon.authState.userInfo.id,
                }
                comCon.sendMessage(message, displayedGroup.group_id)
            })

            const {data} = await authFetchCon.authFetch.post('users/addUsersToGroup', {
                members: usersToAdd,
                group_id: group_id
            })
            if (data.status === 0){
                var result = await authFetchCon.authFetch.get('users/getGroups')
                if (result.data.status === 0){
                    FriendlistCon.setGroups(result.data.result)
                    comCon.socket.emit('add-user-to-group', usersToAdd)

                    const updatedGroup = result.data.result.filter((group) => group.group_id === displayedGroup.group_id)
                    setDisplayedGroup(updatedGroup[0])
                }
            }
        }
        cancelAddUsers()
        setLoading(false)
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
            const message = {
                alert: true,
                text: `User ${displayedGroup.member_icons.find((member) => member.user_id === user_id).username} has been promoted as the leader of group.`,
                sender_id: AuthCon.authState.userInfo.id,
            }
            comCon.sendMessage(message, displayedGroup.group_id)
            
            const {data} = await authFetchCon.authFetch.post('users/promoteGroup', {user_id: user_id, group_id: displayedGroup.group_id})
            if (data.status === 0){
                result = await authFetchCon.authFetch.get('users/getGroups')
                if (result.data.status === 0){
                    comCon.socket.emit('promote-user', user_id, displayedGroup.group_id)
                    FriendlistCon.setGroups(result.data.result)

                    const updatedGroup = result.data.result.filter((group) => group.group_id === displayedGroup.group_id)
                    setDisplayedGroup(updatedGroup[0])
                }
            }
        }
        else if (action === 2) {
            const message = {
                alert: true,
                text: `User ${displayedGroup.member_icons.find((member) => member.user_id === user_id).username} has been kicked from the group.`,
                sender_id: AuthCon.authState.userInfo.id,
            }
            comCon.sendMessage(message, displayedGroup.group_id)

            const {data} = await authFetchCon.authFetch.post('users/removeFromGroup', {user_id: user_id, group_id: displayedGroup.group_id})
            if (data.status === 0){
                result = await authFetchCon.authFetch.get('users/getGroups')
                if (result.data.status === 0){
                    comCon.socket.emit('kick-user', user_id, displayedGroup.group_id)
                    FriendlistCon.setGroups(result.data.result)
                    
                    const updatedGroup = result.data.result.filter((group) => group.group_id === displayedGroup.group_id)
                    setDisplayedGroup(updatedGroup[0])
                }
            }
        }
        setConfirmLoading(false)
    }

    const deleteDisplayedGroup = async () => {
        setLoading(true)
        const group_id = displayedGroup.group_id
        
        const message = {
                    alert: true,
                    text: 'This group has been deleted',
                    sender_id: AuthCon.authState.userInfo.id,
                }
        comCon.sendMessage(message, group_id)

        const {data} = await authFetchCon.authFetch.post('users/deleteGroup', {group_id: group_id})
        if (data.status === 0){
            const result = await authFetchCon.authFetch.get('users/getGroups')
            if (result.data.status === 0){
                comCon.socket.emit('group-delete', displayedGroup.member_icons.map((member) => member.user_id), group_id)
                FriendlistCon.setGroups(result.data.result)
                
                setPopupState(0)
                setDisplayGroupMenu(false)
                setDisplayedGroup({})
            }
        }
        setLoading(false)
    }

    return <GroupsContext.Provider value = {{
        confirmLoading,
        groupMembers,
        setGroupName,
        displayGroupMenu,
        displayedGroup,
        setDisplayGroupMenu,
        setDisplayedGroup,
        popupState,
        setPopupState,
        loading,
        placeholder,
        usersToAdd,
        cancelAction,
        updateGroupMember,
        updateGroupMembers,
        updateUsersToAdd,
        acceptGroupCreation,
        cancelGroupCreation,
        acceptAddUsers,
        cancelAddUsers,
        updateGroupMenu,
        deleteDisplayedGroup
    }}>
        {children}
    </GroupsContext.Provider>
}

export {GroupsContext, GroupsProvider}