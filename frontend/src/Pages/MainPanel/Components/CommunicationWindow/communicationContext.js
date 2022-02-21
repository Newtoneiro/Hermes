import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FetchContext } from "../../../../Fetch/AuthFetchContext";

const communicaitonContext = createContext()

const CommunicationProvider = ({children}) => {
    const [room, setRoom] = useState('')
    const [socket, setSocket] = useState({id: 0})
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [friendImage, setFriendImage] = useState('')
    const dummy = useRef()

    const authFetchCon = useContext(FetchContext)

    useEffect(() => {
        async function createSocket(){
            const new_socket = io("/")
            new_socket.on('receive-message', message => {
                    setMessages((old) => {
                        return [...old, message]
                    })
                })
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
                        setMessages(data.result)
                        setLoading(false)
                        if (dummy.current){
                            setTimeout(() => {
                            dummy.current.scrollIntoView({behavior: "smooth", block: "start", inline: "end"})
                            }, 10);
                        }
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
        }
    }

    const sendMessage = async (message) => {
        await socket.emit('send-message', message, room)
        setTimeout(() => {
            dummy.current.scrollIntoView({behavior: "smooth", block: "start", inline: "end"})
        }, 100);
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
        setFriendImage
    }}>
        {children}
    </communicaitonContext.Provider>
}

export {CommunicationProvider, communicaitonContext}