import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        token: null,
        expiresAt: null,
        userInfo: {}
    })
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        var userInfo = localStorage.getItem('userInfo')
        userInfo = userInfo? JSON.parse(userInfo) : {}
        const expiresAt = localStorage.getItem('expiresAt')

        setAuthState({token, expiresAt, userInfo})
    }, [])
    
    
    const setAuthInfo = ({ token, userInfo, expiresAt}) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        localStorage.setItem('expiresAt', expiresAt)
        setAuthState({
            token,
            userInfo,
            expiresAt,
        })
    }

    const isAuthenticated = () => {
        if (!authState.token || !authState.expiresAt) {
            return false;
        }
        return new Date().getTime() / 1000 < authState.expiresAt;
    }

    return <AuthContext.Provider value = {{
        authState,
        setAuthInfo,
        isAuthenticated
    }}>
    {children}
    </AuthContext.Provider>
}

export {AuthContext, AuthProvider}