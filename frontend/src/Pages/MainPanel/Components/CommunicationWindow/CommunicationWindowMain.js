import React, { useContext, useState } from 'react'
import { BsPersonFill } from 'react-icons/bs'
import { AuthContext } from '../../../../AuthContext/Authcontext'
import Loading from '../../../../Loading/Loading'
import { communicaitonContext } from './communicationContext'
import {AiOutlineDownCircle} from 'react-icons/ai'
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
    }
  }

  const Message = ({mess}) => {
    const sender_image = (comCon.friendImage.find((friend) => friend.user_id === mess.sender_id) || {image: ''})
    if (!mess.alert){
      return <div id={mess.message_id === comCon.messages[0].message_id ? 'message-last' : (mess.message_id === comCon.messages[comCon.messages.length - 1].message_id ? 'message-first' : 'message')} className={`message-box ${mess.sender_id === AuthCon.authState.userInfo.id && 'sender'}`}>
          <div className='message'>
            <h2>{mess.text}</h2>
          </div>
          {mess.sender_id === AuthCon.authState.userInfo.id ?
          (AuthCon.authState.userInfo.image !== '' ? <img className='message-picture' src={AuthCon.authState.userInfo.image} alt='pic'/> 
          : <BsPersonFill className='message-picture_dummy'></BsPersonFill>)
          :(sender_image.image !== '' ? <img className='message-picture' src={sender_image.image} alt='pic'/> 
          : <BsPersonFill className='message-picture_dummy'></BsPersonFill>)}
        </div>
    }
    else{
      return <div id={mess.message_id === comCon.messages[0].message_id ? 'message-last' : (mess.message_id === comCon.messages[comCon.messages.length - 1].message_id ? 'message-first' : 'message')} className='message-box'>
        <div className='message-alert'>
            <h2>{mess.text}</h2>
          </div>
      </div>
    }
  }

  return (<div className='communication-main'>
        {comCon.room === '' ?  <h2>Select room</h2> :<>
          <div className='communicaiton-main_messages' onScroll={(e) => comCon.handleScroll(e)} id='communication-main_messages'>
            <div ref={comCon.loadMore} className='communication-main_messages-loadMoreCatcher'>
              {comCon.loadingMoreMessages && <Loading/>}
            </div>
            {comCon.loading? <div className='communication-main_loading'><Loading className='loading'/></div> :
            comCon.messages.map((mess) => {
              return <Message mess={mess} key={mess.message_id}/>
            })}
          <div ref={comCon.dummy}></div>
        </div>
        <form className='communication-main_send' onSubmit={(e) => handleSubmit(e)}>
          {comCon.displayScrollToBottom && <div className='messages-scroll_to_bottom' onClick={() => {comCon.dummy.current.scrollIntoView({behavior: "smooth", block: "start", inline: "end"})}}><AiOutlineDownCircle/></div>}
          <input type='text' className='communication-main-input' value={text} onChange={(e) => setText(e.target.value)} maxLength={200}></input>
          <button type='submit' className='communication-main-button' onClick={(e) => handleSubmit(e)}>Send</button>
        </form>
        </>
        }
        </div>
  )
}

export default CommunicationWindowMain