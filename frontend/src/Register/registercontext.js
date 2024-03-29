import {createContext, useReducer, useState, useContext} from "react";
import { FetchContext } from "../Fetch/AuthFetchContext";

const RegisterContext = createContext()

const initialState = {username: '',
                      email: '',
                      password: '',
                      confirm_password: ''}

const RegisterProvider = ({children})=>{
    const [message, setMessage] = useState({username: '', email: '', password: '', confirm_password: ''})
    const [inputs, setInputs] = useState([0, 0, 0, 0]);
    const [redirectOnRegister, setRedirectOnRegister] = useState(false)

    const [loading, setLoading] = useState(false)
    const authFetchCon = useContext(FetchContext)

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };

    function reducer(state, action){
        var new_inputs = inputs
        switch (action.type) {
            case 'set_username':
                new_inputs[0] = 0
                setInputs(new_inputs)
                setMessage({...message, username: ''})
                return {...state, username: action.payload}
            case 'set_email':
                new_inputs[1] = 0
                setInputs(new_inputs)
                setMessage({...message, email: ''})
                return {...state, email: action.payload}
            case 'set_password':
                new_inputs[2] = 0
                setInputs(new_inputs)
                setMessage({...message, password: ''})
                return {...state, password: action.payload}
            case 'set_confirm_password':
                new_inputs[3] = 0
                setInputs(new_inputs)
                setMessage({...message, confirm_password: ''})
                return {...state, confirm_password: action.payload}
            default:
                throw new Error('Bad action')
        }
    }

    const [crudentials, dispatch] = useReducer(reducer, initialState);
    
    const checkCrudentials = () => {
        var new_inputs = [0, 0, 0, 0]
        var new_message = {username: '', email: '', password: '', confirm_password: ''}
        if (crudentials.username === ''){
            new_inputs[0] = 1;
            new_message.username = 'Enter username';
        }
        else if (crudentials.username.length > 8){
            new_inputs[0] = 1;
            new_message.username = 'Username too long';
        }
        else if (!crudentials.username.match("^[A-Za-z0-9]+$")){
            new_inputs[0] = 1;
            new_message.username = 'Only letters and nubmers allowed';
        }
        if (crudentials.email === ''){
            new_inputs[1] = 1;
            new_message.email = 'Enter email';
        }
        else if (!validateEmail(crudentials.email)){
            new_inputs[1] = 1;
            new_message.email = 'Invalid email';
        }
        if (crudentials.password === ''){
            new_inputs[2] = 1;
            new_message.password = 'Enter password';
        }
        if (crudentials.confirm_password === ''){
            new_inputs[3] = 1;
            new_message.confirm_password = 'Enter password';
        }
        if (crudentials.password !== crudentials.confirm_password){
            new_inputs[2] = 1;
            new_inputs[3] = 1;
            new_message.password = 'Passwords don\'t match';
        }
        setMessage(new_message)
        setInputs(new_inputs)
        if (new_inputs.includes(1)){
            return 0;
        }
        else{
            return 1;
        }
    }

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        if (checkCrudentials()){
            const { data } = await authFetchCon.authFetch.post('users/register', crudentials);
            if (data.result >= 0) {
                setLoading(false)
                return data
            }
            else {
                var new_inputs = inputs
                switch (data.result){
                    case -1:
                        new_inputs[0] = 1;
                        setMessage({...message, username: 'Username taken'})
                        break;
                    case -2:
                        setMessage({...message, email: 'Email already registered'})
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
    return <RegisterContext.Provider value={{
        inputs,
        crudentials,
        dispatch,
        handleSubmit,
        message,
        redirectOnRegister,
        setRedirectOnRegister,
        loading
    }}>
        {children}
    </RegisterContext.Provider>
}

export {RegisterProvider, RegisterContext}