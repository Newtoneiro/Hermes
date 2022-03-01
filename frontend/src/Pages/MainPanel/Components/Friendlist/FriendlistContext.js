import { createContext, useContext, useState, useEffect } from "react";
import { FetchContext } from "../../../../Fetch/AuthFetchContext";

const FriendlistContext = createContext()

const FriendlistProvider = ({children}) => {
    const [friends, setFriends] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(false)
    const [friendsgroups, setFriendsgroups] = useState(0)
    
    const AuthFetchCon = useContext(FetchContext)
    
    useEffect(() => {
        async function execute(){
            setLoading(true)
            
            await AuthFetchCon.authFetch.get('users/getFriends').then(({data}) => {
                if (data.status === 0){
                    setFriends(data.result)
                }
            })

            await AuthFetchCon.authFetch.get('users/getGroups').then(({data}) => {
                if (data.status === 0){
                    setGroups(data.result)
                }
            })

            setLoading(false)
        }

        execute()
    }, [AuthFetchCon.authFetch])

    return <FriendlistContext.Provider value={{
        friends,
        groups,
        setGroups,
        loading,
        friendsgroups,
        setFriendsgroups,
    }}>
        {children}
    </FriendlistContext.Provider>
}

export {FriendlistContext, FriendlistProvider}