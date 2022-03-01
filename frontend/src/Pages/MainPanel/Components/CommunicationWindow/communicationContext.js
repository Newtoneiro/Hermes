import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../../../AuthContext/Authcontext";
import { FetchContext } from "../../../../Fetch/AuthFetchContext";
import { FriendlistContext } from "../Friendlist/FriendlistContext";

const communicaitonContext = createContext()

const CommunicationProvider = ({children}) => {
    const [room, setRoom] = useState('')
    const [socket, setSocket] = useState({id: 0})
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [friendImage, setFriendImage] = useState([])

    const [allLoaded, setAllLoaded] = useState(false)
    const [loadingLoading, setLoadingLoading] = useState(false)
    const [displayScrollToBottom, setDisplayScrollToBottom] = useState(false)

    const dummy = useRef()
    const loadMore = useRef()

    const authFetchCon = useContext(FetchContext)
    const AuthCon = useContext(AuthContext)
    const FriendlistCon = useContext(FriendlistContext)

    useEffect(() => {
        async function createSocket(){
            const new_socket = io("/")
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
            
            new_socket.on('get-kicked', (group_id) => {
                setMessages([...messages, {message_id: 'abc', text: 'You\'ve been kicked from this conversation'}])
                FriendlistCon.setGroups(prev => {
                    return prev.filter((group) => group.group_id !== group_id)
                })
                new_socket.emit('leave-room', group_id)
            })

            new_socket.emit('join-room', AuthCon.authState.userInfo.id)
            setSocket(new_socket)
        }
        createSocket()
    }, [])

    useEffect(() => {
        setLoading(true)
        if (room){
            async function fetchMessages(){
                await authFetchCon.authFetch.post('messages/get', {
                    room: room,
                }).then(({data}) => {
                    if (data.status === 0){
                        setMessages(data.result.reverse())
                        setLoading(false)
                        if (data.allLoaded){
                            setAllLoaded(true)
                        }
                        if (dummy.current){
                            dummy.current.scrollIntoView({behavior: "auto", block: "start", inline: "end"})
                        }
                        setAllLoaded(false)
                    }
                    else{
                        setLoading(false)
                        console.log('There was an error loading messages')
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
            
            setMessages([])
            setRoom(new_room)
            setAllLoaded(false)
            setDisplayScrollToBottom(false)
        }
    }

    const sendMessage = async (message) => {
        await socket.emit('send-message', AuthCon.authState.userInfo.id, message, room)
    }

    const handleScroll = async (e) => {
        if (!allLoaded && !loadingLoading)
        {
            if (loadMore.current.getBoundingClientRect().top >= e.target.getBoundingClientRect().top - 2)
            {
                setLoadingLoading(true)
                if (messages.length > 0){
                    await authFetchCon.authFetch.post('messages/get', {
                            room: room,
                            timestamp: messages[0].timestamp,
                    }).then(({data}) => {
                        var last_message = document.getElementById('message-last')
                        
                        var messages_reverse = data.result.reverse()
                        messages_reverse = messages_reverse.concat(messages)
                        setMessages(messages_reverse)
                        
                        last_message.scrollIntoView({block: "start", inline: "end"})
                        if (data.allLoaded){
                            setAllLoaded(true)
                        }
                    })
                }
                setLoadingLoading(false)
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
        friendImage,
        setFriendImage,
        loadMore,
        handleScroll,
        loadingLoading,
        displayScrollToBottom
    }}>
        {children}
    </communicaitonContext.Provider>
}

export {CommunicationProvider, communicaitonContext}