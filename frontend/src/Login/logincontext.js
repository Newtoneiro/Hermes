import {createContext, useReducer, useState } from "react";
import { publicFetch } from "../Fetch/fetch";

const LoginContext = createContext()

const LoginProvider = ({children})=>{    
    const initialState = {username: '',
                          password: ''}
    
    const [message, setMessage] = useState({username: '', password: ''})
    const [inputs, setInputs] = useState([0, 0]);
    const [loading, setLoading] = useState(false)
    const [redirectOnLogin, setRedirectOnLogin] = useState(false)

    function reducer(state, action){
        switch (action.type) {
            case 'set_username':
                setInputs((state) => {state[0] = 0; return state;})
                setMessage({...message, username: ''})
                return {...state, username: action.payload}
            case 'set_password':
                setInputs((state) => {state[1] = 0; return state;})
                setMessage({...message, password: ''})
                return {...state, password: action.payload}
            default:
                throw new Error('Bad action')
        }
    }

    const [crudentials, dispatch] = useReducer(reducer, initialState);
        const checkCrudentials = () => {
            var new_inputs = [0, 0]
            var new_message = {username: '', password: ''}
            if (crudentials.username === ''){
                new_inputs[0] = 1;
                new_message.username = 'Enter username'
            }
            if (crudentials.password === ''){
                new_inputs[1] = 1;
                new_message.password = 'Enter password'
            }
            setInputs(new_inputs);
            setMessage(new_message);
            if (new_inputs.includes(1)){
                return 0;
            }
            else{
                return 1;
            }
        }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (checkCrudentials()){
            const { data } = await publicFetch.post('users/verify', crudentials);
            if (data.result >= 0){
                setLoading(false)
                return data;
            }
            else{
                var new_inputs = inputs
                switch (data.result){
                    case -1:
                        new_inputs[0] = 1;
                        setMessage({...message, username: 'Username doesn\'t exist'})
                        break;
                    case -2:
                        setMessage({...message, password: 'Incorrect password'})
                        new_inputs[1] = 1;
                        break;
                    default:
                        break;
                    }
                setInputs(new_inputs)
            }
        }
        setLoading(false)
    }

    return <LoginContext.Provider value={{
        inputs,
        crudentials,
        dispatch,
        handleSubmit,
        message,
        loading,
        redirectOnLogin,
        setRedirectOnLogin
    }}>
        {children}
    </LoginContext.Provider>
}

export {LoginProvider, LoginContext}