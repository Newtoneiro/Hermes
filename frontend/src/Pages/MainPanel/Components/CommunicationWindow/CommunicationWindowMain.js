import React, { useContext, useState } from 'react'
import { BsPersonFill } from 'react-icons/bs'
import { AuthContext } from '../../../../AuthContext/Authcontext'
import Loading from '../../../../Loading/Loading'
import { communicaitonContext } from './communicationContext'
import './communicationwindowmain.css'


const CommunicationWindowMain = () => {
  const [text, setText] = useState('')
  const AuthCon = useContext(AuthContext)
  const comCon = useContext(communicaitonContext)
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text){
      const message = {
        text: text,
        sender_id: AuthCon.authState.userInfo.id,
      }
      comCon.sendMessage(message)
      setText('')
      setTimeout(() => {
        comCon.dummy.current.scrollIntoView({behavior: "smooth", block: "start", inline: "end"})
      }, 20)
    }
  }

  return (<div className='communication-main'>
        {comCon.room === '' ?  <h2>Select room</h2> :<>
          <div className='communicaiton-main_messages'>
            {comCon.loading? <div className='communication-main_loading'><Loading className='loading'/></div> :
            comCon.messages.map((mess) => {
              const sender_image = comCon.friendImage.find((friend) => friend.user_id === mess.sender_id)
              return <div key={mess.message_id} className={`message-box ${mess.sender_id === AuthCon.authState.userInfo.id && 'sender'}`}>
                  <div className='message'>
                    <h2>{mess.text}</h2>
                  </div>
                  {mess.sender_id === AuthCon.authState.userInfo.id ?
                  (AuthCon.authState.userInfo.image !== '' ? <img className='message-picture' src={AuthCon.authState.userInfo.image} alt='pic'/> 
                  : <BsPersonFill className='message-picture_dummy'></BsPersonFill>)
                  :(sender_image.image !== '' ? <img className='message-picture' src={sender_image.image} alt='pic'/> 
                  : <BsPersonFill className='message-picture_dummy'></BsPersonFill>)}
                </div>
            })}  
          <div ref={comCon.dummy}></div>
        </div>
        <form className='communication-main_send' onSubmit={(e) => handleSubmit(e)}>
          <input type='text' className='communication-main-input' value={text} onChange={(e) => setText(e.target.value)} maxLength={200}></input>
          <button type='submit' className='communication-main-button' onClick={(e) => handleSubmit(e)}>Send</button>
        </form>
        </>
        }
        </div>
  )
}

export default CommunicationWindowMain