import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { FetchContext } from "../../../../Fetch/AuthFetchContext";

const FriendlistContext = createContext()

const FriendlistProvider = ({ children }) => {
    const [friends, setFriends] = useState([])
    const [groups, setGroups] = useState([])
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    const [friendsgroups, setFriendsgroups] = useState(0)

    const AuthFetchCon = useContext(FetchContext)

    const loadFriends = useCallback(async (load) => {
        if (load) {
            setLoading(true)
        }
        await AuthFetchCon.authFetch.get('users/getFriends').then(({ data }) => {
            if (data.status === 0) {
                setFriends(data.result.sort((a, b) => {
                    if (notifications.includes(a.friendships_id)){
                        return -1;
                    }
                    if (notifications.includes(b.friendships_id)){
                        return 1;
                    }
                    return 0;
                }))
            }
        })
        if (load) {
            setLoading(false)
        }
    }, [AuthFetchCon.authFetch, notifications])

    const loadGroups = useCallback(async (load) => {
        if (load) {
            setLoading(true)
        }
        await AuthFetchCon.authFetch.get('users/getGroups').then(({ data }) => {
            if (data.status === 0) {
                setGroups(data.result.sort((a, b) => {
                    if (notifications.includes(a.group_id)){
                        return -1;
                    }
                    if (notifications.includes(b.group_id)){
                        return 1;
                    }
                    return 0;
                }))
            }
        })
        if (load) {
            setLoading(false)
        }
    }, [AuthFetchCon.authFetch, notifications])

    const loadNotifications = useCallback(async (load) => {
        if (load) {
            setLoading(true)
        }
        await AuthFetchCon.authFetch.get('users/notifications').then(({ data }) => {
            if (data.status === 0) {
                setNotifications(data.result)
            }
        })
        if (load) {
            setLoading(false)
        }
    }, [AuthFetchCon.authFetch])

    useEffect(() => {
        async function execute() {
            setLoading(true)

            await loadNotifications(false)
            await loadFriends(false)
            await loadGroups(false)

            setLoading(false)
        }

        execute()
    }, [])

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

export { FriendlistContext, FriendlistProvider }