import React, { useContext, useState } from 'react'
import { BsPersonFill } from 'react-icons/bs'
import { FaEdit } from 'react-icons/fa'
import { AuthContext } from '../../../../AuthContext/Authcontext'
import './profile.css'
import { FetchContext } from '../../../../Fetch/AuthFetchContext'
import Loading from '../../../../Loading/Loading'

const Profile = () => {
    const authCon = useContext(AuthContext)
    const autchFetchCon = useContext(FetchContext)
    const [imgLoading, setImgLoading] = useState(false)
    const [chooseImage, setChooseImage] = useState(false)

    const uploadImage = async (e) => {
        setImgLoading(true)
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        
        if (base64.length < 2000000){
            const {data} = await autchFetchCon.authFetch.post('users/uploadImage', {image: base64})
            if (data.status === 0){
                authCon.setAuthInfo({...authCon.authState, userInfo: {...authCon.authState.userInfo, image: base64}})
            }
        }
 
        setImgLoading(false)
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
        });
    };

    return (
        <div className='Profile-main'>
            <div className='Profile-header'>
                {imgLoading ? <Loading/> :
                <div className='Profile-pic-container' onMouseEnter={() => {setChooseImage(true)}} onMouseLeave={() => {setChooseImage(false)}}>
                {(authCon.authState.userInfo.image !== '' ?<img className='Profile-pic' src={authCon.authState.userInfo.image} alt='profile-pic' /> : <BsPersonFill className='Profile-pic'/>)}
                {chooseImage && <div className='Profile-image_select'>
                    <FaEdit className='Profile-image-edit_image'/>
                    <input
                        className='custom-file-input'
                        type="file"
                        onChange={(e) => {uploadImage(e)}}
                        accept="image/*"
                    />
                </div>}
                </div>
                }
                <div className='Profile-username'>
                    <h1>{authCon.authState.userInfo.username}</h1>
                    <FaEdit/>
                </div>
            </div>
        </div>
    )
}

export default Profile