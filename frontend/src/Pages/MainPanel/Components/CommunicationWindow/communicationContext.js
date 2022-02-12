import { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../../../AuthContext/Authcontext";

const communicaitonContext = createContext()

const CommunicationProvider = ({children}) => {
    const [room, setRoom] = useState('')
    const [socket, setSocket] = useState({id: 0})
    const [messages, setMessages] = useState([])

    const joinRoom = (new_room) => {
        if (room !== new_room){
            const new_socket = io("http://localhost:3001")
            new_socket.emit('join-room', new_room)
            
            new_socket.on('receive-message', message => {
                setMessages((old) => {
                    return [...old, message]
                })
            })
            setMessages([])
            setSocket(new_socket)
            setRoom(new_room)
        }
    }

    const sendMessage = (message) => {
        socket.emit('send-message', message, room)
        setMessages((old) => {
                return [...old, message]
            })
    }

    return <communicaitonContext.Provider value={{
        room,
        setRoom,
        joinRoom,
        socket,
        sendMessage,
        messages
    }}>
        {children}
    </communicaitonContext.Provider>
}

export {CommunicationProvider, communicaitonContext}