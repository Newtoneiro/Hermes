import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { FetchContext } from "../../../../Fetch/AuthFetchContext";
import { FriendlistContext } from "../Friendlist/FriendlistContext";

const FriendRequestContext = createContext()

const FriendRequestProvider = ({children}) => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false);
    const AuthFetchCon = useContext(FetchContext)
    const FriendlistCon = useContext(FriendlistContext)

    const loadData = useCallback(async () => {
        const {data} = await AuthFetchCon.authFetch.get('users/getRequests')
        if (data.status >= 0){
            setRequests(data.result)
        }
    }, [AuthFetchCon.authFetch])

    useEffect(() => {
        async function execute(){
            setLoading(true)
            await loadData()
            setLoading(false)
        }
        
        execute()
    }, [loadData])

    const handleDecline = async (req_id) => {
        setLoading(true)
        const {data} = await AuthFetchCon.authFetch.post('users/declineRequest',
        {
            req_id: req_id,
        })
        if (data.result === 0){
            await loadData()
        }
        setLoading(false)
    }

    const handleAccept = async (req_id) => {
        setLoading(true)
        const {data} = await AuthFetchCon.authFetch.post('users/acceptRequest', {
            req_id: req_id
        })
        if (data.result === 0){
            await loadData()
            FriendlistCon.loadFriends(false)
        }
        setLoading(false)
    }

    return <FriendRequestContext.Provider value={{
        requests,
        loading,
        loadData,
        handleDecline,
        handleAccept
    }}>
        {children}
    </FriendRequestContext.Provider>
}

export {FriendRequestContext, FriendRequestProvider}