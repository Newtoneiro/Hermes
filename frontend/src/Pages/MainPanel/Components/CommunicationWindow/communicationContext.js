import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../../../AuthContext/Authcontext";
import { FetchContext } from "../../../../Fetch/AuthFetchContext";
import { FriendlistContext } from "../Friendlist/FriendlistContext";
import { FriendRequestContext } from "../FriendRequests/FriendRequestsContext";

const communicaitonContext = createContext()

const CommunicationProvider = ({children}) => {
    const [room, setRoom] = useState('')
    const [socket, setSocket] = useState('')

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [receiversInfo, setReceiversInfo] = useState([])

    const [allLoaded, setAllLoaded] = useState(false)
    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)
    const [displayScrollToBottom, setDisplayScrollToBottom] = useState(false)

    const dummy = useRef()
    const loadMore = useRef()

    const authFetchCon = useContext(FetchContext)
    const AuthCon = useContext(AuthContext)
    const FriendlistCon = useContext(FriendlistContext)
    const FriendReqCon = useContext(FriendRequestContext)

    useEffect(() => {
        var new_socket = io("/")
        new_socket.emit('join-room', AuthCon.authState.userInfo.id)

        new_socket.on('receive-message', message => {
            setMessages((old) => {
                return [...old, message]
            })
            setTimeout(() => {
                if (dummy){
                    dummy.current.scrollIntoView({behavior: "smooth", block: "start", inline: "end"})
                }
            }, 300);
        })
        
        new_socket.on('group-delete-alert', (group_id) => {
            FriendlistCon.setGroups(prev => {
                return prev.filter((group) => group.group_id !== group_id)
            })
            FriendlistCon.setNotifications(prev => {
                return prev.filter((notif) => notif !== group_id)
            })
            socket.emit('leave-room', group_id)
        })

        new_socket.on('user-refresh-groups', () => {
            FriendlistCon.loadGroups(false)
        })

        new_socket.on('receive-new-request', () => {
            FriendReqCon.loadData()
        })
        
        new_socket.on('add_notification', (notification) => {
            var room_id;
            setRoom((room) => {
                room_id = room
                return room
            })
            // If users connected to the same room, dont send notification
            if (room_id !== notification){
                FriendlistCon.setNotifications((notifications) => {return [...notifications, notification]})
            }
            else{
                new_socket.emit('clear-notifications', room_id, AuthCon.authState.userInfo.id)
            }
        })

        setSocket(new_socket)
    }, [])

    useEffect(() => {
        if (room){
            async function createSocket(){    
                socket.on('get-kicked', (group_id) => {
                    FriendlistCon.setGroups(prev => {
                        return prev.filter((group) => group.group_id !== group_id)
                    })
                    socket.emit('leave-room', group_id)
                    if (group_id === room){
                        setRoom('')
                    }
                })
            }
            
            createSocket()
        }
    }, [room, socket, FriendlistCon])
        
    useEffect(() => {
        setLoading(true)
        if (room){
            async function fetchMessages(){
                await authFetchCon.authFetch.post('messages/get', {
                    room: room,
                }).then(({data}) => {
                    if (data.status === 0){
                        setMessages(data.result.reverse())
                        if (data.allLoaded){
                            setAllLoaded(true)
                        }
                        if (dummy.current){
                            setLoading(false)
                            dummy.current.scrollIntoView({behavior: "auto", block: "start", inline: "end"})
                        }
                        setAllLoaded(false)
                    }
                    else{
                        console.log('There was an error loading messages')
                        setLoading(false)
                    }
                })
            }
        
            fetchMessages()
        }
    
    }, [room, authFetchCon.authFetch])

    const joinRoom = (new_room) => {
        if (room !== new_room){
            socket.emit('leave-room', room)
            socket.emit('join-room', new_room)
            
            socket.emit('clear-notifications', new_room, AuthCon.authState.userInfo.id)
            FriendlistCon.setNotifications((notifications) => {return notifications.filter((not) => not !== new_room)})
            
            setMessages([])
            setRoom(new_room)
            setAllLoaded(false)
            setDisplayScrollToBottom(false)
        }
    }

    const sendMessage = async (message, room_id) => {
        var actual_room_id = (room_id || room)
        await socket.emit('send-message', AuthCon.authState.userInfo.id, message, actual_room_id)
    }

    const handleScroll = async (e) => {
        if (!allLoaded && !loadingMoreMessages)
        {
            if (loadMore.current.getBoundingClientRect().top >= e.target.getBoundingClientRect().top - 2)
            {
                setLoadingMoreMessages(true)
                if (messages.length > 0){
                    await authFetchCon.authFetch.post('messages/get', {
                            room: room,
                            timestamp: messages[0].timestamp,
                    }).then(({data}) => {
                        const last_message = document.getElementById('message-last')
                        
                        var messages_reverse = data.result.reverse()
                        messages_reverse = messages_reverse.concat(messages)
                        setMessages(messages_reverse)

                        if (last_message){
                            last_message.scrollIntoView({block: "start", inline: "end"})
                        }
                        if (data.allLoaded){
                            setAllLoaded(true)
                        }
                    })
                }
                setLoadingMoreMessages(false)
            }
        }
        if (document.getElementById('message-first') && document.getElementById('communication-main_messages'))
        {
            if (document.getElementById('message-first').getBoundingClientRect().y > document.getElementById('communication-main_messages').getBoundingClientRect().bottom + 100)
            {
                setDisplayScrollToBottom(true)
            }
            else {
                setDisplayScrollToBottom(false)
            }
        }
    }

    return <communicaitonContext.Provider value={{
        room,
        setRoom,
        joinRoom,
        socket,
        sendMessage,
        messages,
        loading,
        dummy,
        receiversInfo,
        setReceiversInfo,
        loadMore,
        handleScroll,
        loadingMoreMessages,
        displayScrollToBottom
    }}>
        {children}
    </communicaitonContext.Provider>
}

export {CommunicationProvider, communicaitonContext}