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

  const Message = ({mess, number}) => {
    const sender_info = (comCon.receiversInfo.find((friend) => friend.user_id === mess.sender_id) || {username: '', image: ''})
    const sender_icon = (mess.sender_id === AuthCon.authState.userInfo.id ? AuthCon.authState.userInfo.image : sender_info.image)

    if (!mess.alert){
      return <>
          {(number === 0 || comCon.messages[number - 1].alert || comCon.messages[number - 1].sender_id !== mess.sender_id) &&
          <h2 className={`message_username ${mess.sender_id === AuthCon.authState.userInfo.id && 'message_sender'}`}>{sender_info.username}</h2>}
          <div className={`message-box ${mess.sender_id === AuthCon.authState.userInfo.id && 'sender'}`}>
            <div className='message'>
              <h2>{mess.text}</h2>
            </div>
            {(number === comCon.messages.length - 1 || comCon.messages[number + 1].alert || comCon.messages[number + 1].sender_id !== mess.sender_id) ?
            (sender_icon !== '' ? <img className='message-picture' src={sender_icon} alt='pic'/> 
            : <BsPersonFill className='message-picture_dummy'></BsPersonFill>) :
            <div className='message-picture_dummy'></div>}
          </div>
        </>
    }
    else{
      return <div className='message-box'>
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
            comCon.messages.map((mess, nr) => {
              return <div key={mess.message_id} id={mess.message_id === comCon.messages[0].message_id ? 'message-last' : (mess.message_id === comCon.messages[comCon.messages.length - 1].message_id ? 'message-first' : 'message')}>
                <Message mess={mess} number={nr}/>
              </div>
            })}
          <div ref={comCon.dummy}></div>
        </div>
        <form className='communication-main_send' onSubmit={(e) => handleSubmit(e)}>
          {comCon.displayScrollToBottom && <div className='messages-scroll_to_bottom' onClick={() => comCon.dummy.current.scrollIntoView({behavior: "smooth", block: "start", inline: "end"})}><AiOutlineDownCircle/></div>}
          <input type='text' className='communication-main-input' value={text} onChange={(e) => setText(e.target.value)} maxLength={200}></input>
          <button type='submit' className='communication-main-button' onClick={(e) => handleSubmit(e)}>Send</button>
        </form>
        </>
        }
        </div>
  )
}

export default CommunicationWindowMain