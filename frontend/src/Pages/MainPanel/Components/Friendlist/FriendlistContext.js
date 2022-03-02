import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { FetchContext } from "../../../../Fetch/AuthFetchContext";

const FriendlistContext = createContext()

const FriendlistProvider = ({children}) => {
    const [friends, setFriends] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(false)
    const [friendsgroups, setFriendsgroups] = useState(0)
    
    const AuthFetchCon = useContext(FetchContext)

    const loadFriends = async (load) => {
        if (load){
            setLoading(true)
        }
        await AuthFetchCon.authFetch.get('users/getFriends').then(({data}) => {
            if (data.status === 0){
                setFriends(data.result)
            }
        })
        if (load){
            setLoading(false)
        }
    }

    const loadGroups = async (load) => {
        if (load){
            setLoading(true)
        }
        await AuthFetchCon.authFetch.get('users/getGroups').then(({data}) => {
            if (data.status === 0){
                setGroups(data.result)
            }
        })
        if (load){
            setLoading(false)
        }
    }

    const loadData = async () => {
        setLoading(true)
            
        await loadFriends(false)
        await loadGroups(false)

        setLoading(false)
    }
    
    useEffect(() => {
        async function execute(){
            await loadData()
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
        loadData,
        loadFriends,
        loadGroups
    }}>
        {children}
    </FriendlistContext.Provider>
}

export {FriendlistContext, FriendlistProvider}