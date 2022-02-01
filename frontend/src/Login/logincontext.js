import {createContext, useReducer, useState} from "react";

const LoginContext = createContext()

const LoginProvider = ({children})=>{
    const initialState = {username: '',
                          password: ''}
    const [inputs, setInputs] = useState([0, 0]);

    function reducer(state, action){
        var new_inputs = inputs;
        switch (action.type) {
            case 'set_username':
                new_inputs[0] = 0
                setInputs(new_inputs)
                return {...state, username: action.payload}
            case 'set_password':
                new_inputs[1] = 0
                setInputs(new_inputs)
                return {...state, password: action.payload}
            default:
                throw new Error('Bad action')
        }
    }

    const [crudentials, dispatch] = useReducer(reducer, initialState);

        const checkCrudentials = () => {
        var new_inputs = [0, 0]
        if (crudentials.username === ''){
            new_inputs[0] = 1;
        }
        if (crudentials.password === ''){
            new_inputs[1] = 1;
        }
        setInputs(new_inputs)
        if (new_inputs.includes(1)){
            return 0;
        }
        else{
            return 1;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (checkCrudentials()){
            console.log(crudentials)
        }
        // axios.post('/addUser', {
        //     username: username,
        //     password: password,
        // }).then((response) => {
        //     console.log(response);
        // })
    }

    return <LoginContext.Provider value={{
        inputs,
        crudentials,
        dispatch,
        handleSubmit
    }}>
        {children}
    </LoginContext.Provider>
}

export {LoginProvider, LoginContext}