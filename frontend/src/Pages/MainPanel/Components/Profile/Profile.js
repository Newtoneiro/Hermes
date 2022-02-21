import React, { useContext, useState } from 'react'
import { BsPersonFill } from 'react-icons/bs'
import { AuthContext } from '../../../../AuthContext/Authcontext'
import FileBase64 from 'react-file-base64'
import './profile.css'
import { FetchContext } from '../../../../Fetch/AuthFetchContext'
import Loading from '../../../../Loading/Loading'

const Profile = () => {
    const authCon = useContext(AuthContext)
    const autchFetchCon = useContext(FetchContext)
    const [imgLoading, setImgLoading] = useState(false)

    const submitImage = async (img) => {
        setImgLoading(true)
        
        console.log('asdasd')
        const {data} = await autchFetchCon.authFetch.post('users/uploadImage', {image: img})
        if (data.status === 0){
            authCon.setAuthInfo({...authCon.authState, userInfo: {...authCon.authState.userInfo, image: img}})
        }
 
        setImgLoading(false)
    }

    return (
        <div className='Profile-main'>
            <div className='Profile-header'>
                {imgLoading ? <Loading/> :
                (authCon.authState.userInfo.image !== '' ?<img className='Profile-pic' src={authCon.authState.userInfo.image} alt='profile-pic'/> : <BsPersonFill className='Profile-pic'/>)}
                <h1>{authCon.authState.userInfo.username}</h1>
                <div className='Profile-footer'/>
            </div>
            <div className='Profile-customization'>
                <div className='Profile-customization_cluster'>
                    <h2>Select image:</h2>
                    <FileBase64 multiple = {false} onDone={({base64}) => submitImage(base64)} accept="image/png, image/jpeg"/>
                </div>
            </div>
        </div>
    )
}

export default Profile