import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../../../AuthContext/Authcontext'
import { communicaitonContext } from './communicationContext'
import './communicationwindowmain.css'


const CommunicationWindowMain = () => {
  const [text, setText] = useState('')
  const AuthCon = useContext(AuthContext)
  const comCon = useContext(communicaitonContext)

  const dummy = useRef()
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = {
      text: text,
      sender: AuthCon.authState.userInfo.id,
    }
    comCon.sendMessage(message)
    dummy.current.scrollIntoView({behaviour: 'smooth'});
  }

  return (<div className='communication-main'>
        {comCon.socket.id === 0 ?  <h2>Select room</h2> :<>
          <div className='communicaiton-main_messages'>
            {comCon.messages.map((mess) => {
              return <div className={`message-box ${mess.sender === AuthCon.authState.userInfo.id && 'sender'}`}>
                  <div className='message'>
                    <h2>{mess.text}</h2>
                  </div>
                </div>
            })}
            <div ref={dummy}></div>
          </div>
        <textarea className='communication-main-textarea' value={text} onChange={(e) => setText(e.target.value)}></textarea>
        <button type='submit' className='communication-main-button' onClick={(e) => handleSubmit(e)}>Send</button></>}
        </div>
  )
}

export default CommunicationWindowMain