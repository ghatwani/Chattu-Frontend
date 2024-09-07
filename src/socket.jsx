import io from "socket.io-client";
import { createContext, useMemo, useContext } from "react";
import { server } from "./components/constants/config";

const SocketContext = createContext() //so we do not need to pass this as react data flow works in unidirectional way so we have created it such that it can called an accessed in any of the component (like redux store)

const getSocket = () => useContext(SocketContext) //hooks should be in components so this function will return the socket whenever called


const SocketProvider = ({ children }) => {
    const socket = useMemo(
        () => io(server, { withCredentials: true }), []//dependency array since we don want create a new socket with each request it will memoised by usememo hook
    );

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export{getSocket, SocketProvider }