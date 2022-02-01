import {createContext, useReducer, useState} from "react";

const RegisterContext = createContext()

const initialState = {username: '',
                      email: '',
                      password: '',
                      confirm_password: ''}

const RegisterProvider = ({children})=>{
    const [inputs, setInputs] = useState([0, 0, 0, 0]);

    function reducer(state, action){
        var new_inputs = inputs
        switch (action.type) {
        case 'set_username':
            new_inputs[0] = 0
            setInputs(new_inputs)
            return {...state, username: action.payload}
        case 'set_email':
            new_inputs[1] = 0
            setInputs(new_inputs)
            return {...state, email: action.payload}
        case 'set_password':
            new_inputs[2] = 0
            setInputs(new_inputs)
            return {...state, password: action.payload}
        case 'set_confirm_password':
            new_inputs[3] = 0
            setInputs(new_inputs)
            return {...state, confirm_password: action.payload}
        default:
        throw new Error('Bad action')
        }
    }

    const [crudentials, dispatch] = useReducer(reducer, initialState);
    
    const checkCrudentials = () => {
        var new_inputs = [0, 0, 0, 0]
        if (crudentials.username === ''){
        new_inputs[0] = 1;
        }
        if (crudentials.email === ''){
        new_inputs[1] = 1;
        }
        if (crudentials.password === ''){
        new_inputs[2] = 1;
        }
        if (crudentials.confirm_password === ''){
        new_inputs[3] = 1;
        }
        setInputs(new_inputs)
        if (new_inputs.includes(1)){
        return 0;
        }
        else{
        return 1;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (checkCrudentials()){
        console.log(crudentials)
        }
    } 
    return <RegisterContext.Provider value={{
        inputs,
        crudentials,
        dispatch,
        handleSubmit
    }}>
        {children}
    </RegisterContext.Provider>
}

export {RegisterProvider, RegisterContext}