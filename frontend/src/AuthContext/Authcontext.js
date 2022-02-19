import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        expiresAt: null,
        userInfo: {}
    })
    
    useEffect(() => {
        var userInfo = localStorage.getItem('userInfo')
        userInfo = userInfo? JSON.parse(userInfo) : {}
        const expiresAt = localStorage.getItem('expiresAt')

        setAuthState({expiresAt, userInfo})
    }, [])
    
    
    const setAuthInfo = ({userInfo, expiresAt, token}) => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        localStorage.setItem('expiresAt', expiresAt)
        setAuthState({
            userInfo,
            expiresAt,
        })
    }

    const isAuthenticated = () => {
        if (!authState || !authState.expiresAt) {
            return false;
        }
        return new Date().getTime() / 1000 < authState.expiresAt;
    }

    const logout = () => {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('expiresAt')
        setAuthState({
            expiresAt: null,
            userInfo: {}
        })
    }

    return <AuthContext.Provider value = {{
        authState,
        setAuthInfo,
        isAuthenticated,
        logout
    }}>
    {children}
    </AuthContext.Provider>
}

export {AuthContext, AuthProvider}