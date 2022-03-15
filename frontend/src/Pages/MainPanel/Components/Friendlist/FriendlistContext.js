import { createContext, useContext, useState, useEffect, useCallback} from "react";
import { FetchContext } from "../../../../Fetch/AuthFetchContext";

const FriendlistContext = createContext()

const FriendlistProvider = ({children}) => {
    const [friends, setFriends] = useState([])
    const [groups, setGroups] = useState([])
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    const [friendsgroups, setFriendsgroups] = useState(0)
    
    const AuthFetchCon = useContext(FetchContext)

    const loadFriends = useCallback(async (load) => {
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
    }, [AuthFetchCon.authFetch])

    const loadGroups = useCallback(async (load) => {
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
    }, [AuthFetchCon.authFetch])

    const loadNotifications = useCallback(async (load) => {
        if (load){
            setLoading(true)
        }
        await AuthFetchCon.authFetch.get('users/notifications').then(({data}) => {
            if (data.status === 0){
                setNotifications(data.result)
            }
        })
        if (load){
            setLoading(false)
        }
    }, [AuthFetchCon.authFetch])
    
    useEffect(() => {
        async function execute(){
            setLoading(true)
            
            await loadFriends(false)
            await loadGroups(false)
            await loadNotifications(false)

            setLoading(false)
        }

        execute()
    }, [loadFriends, loadGroups])

    return <FriendlistContext.Provider value={{
        friends,
        groups,
        notifications,
        setNotifications,
        setGroups,
        loading,
        friendsgroups,
        setFriendsgroups,
        loadFriends,
        loadGroups
    }}>
        {children}
    </FriendlistContext.Provider>
}

export {FriendlistContext, FriendlistProvider}