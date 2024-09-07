import Title from '../shared/Title';
import { Drawer, Grid, Skeleton } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header';
import ChatList from '../specific/ChatList';
import { SampleChats } from '../constants/sampleData';
import { useNavigate, useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setisDeleteMenu, setisMobile, setselectedDeleteChat } from '../../redux/reducers/misc';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { getSocket } from '../../socket';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from "../constants/events";
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat';
import { getOrSaveFromStorage } from '../../lib/feature';
import DeleteChatMenu from '../dialogs/DeleteChatMenu';

const AppLayout = () => (WrappedComponent) => {
    return (props) => {

        const params = useParams();
        const dispatch= useDispatch()
        const navigate= useNavigate()
        // console.log(chatId)
        
        const socket= getSocket();
        //  console.log(socket)
        const chatId = params.chatId;
        const deleteMenuAnchor=useRef(null)
        const [onlineUsers, setonlineUsers] = useState([])


        const {isMobile}=useSelector((state)=> state.misc)
        const {user}=useSelector((state)=> state.auth)
        const {newMessagesAlert}=useSelector((state)=> state.chat)

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("")
       useErrors([{isError, error}])

       useEffect(() => {
         getOrSaveFromStorage({key:NEW_MESSAGE_ALERT, value:newMessagesAlert})
       }, [newMessagesAlert])
       

        const handleDeleteChat = (e, chatId, groupChat) => {
            dispatch(setisDeleteMenu(true))
            dispatch(setselectedDeleteChat({chatId, groupChat}))
            // e.preventDefault();
            deleteMenuAnchor.current=e.currentTarget
            // console.log(e.currentTarget)
        }
        const handleMobileClose=() => {
            dispatch(setisMobile(false))
        }

        const newMessageAlertHandler=useCallback((data)=>{
            if(data.chatId ===chatId) return;
            dispatch(setNewMessagesAlert(data))
        }, [chatId])
        const newRequestHandler=useCallback(()=>{
            dispatch(incrementNotification())
        }, [dispatch])
        const refetchListener=useCallback(()=>{
            refetch()
            navigate('/')
        }, [refetch, navigate])
        const onlineUsersListener=useCallback((data)=>{
            // dispatch(incrementNotification())
            setonlineUsers(data)
        }, [])

        const eventHandlers={
            [NEW_MESSAGE_ALERT]:newMessageAlertHandler,
            [NEW_REQUEST]:newRequestHandler,
            [REFETCH_CHATS]:refetchListener,
            [ONLINE_USERS]:onlineUsersListener
        };
        useSocketEvents(socket, eventHandlers)
        // console.log(chatId)
        return (
            <div>
                <Title />
                <Header />
                <DeleteChatMenu 
                dispatch={dispatch} 
                deleteMenuAnchor={deleteMenuAnchor}/>
                {
                    isLoading
                    ?
                    (<Skeleton/>) 
                    :(
                        <Drawer open={isMobile} onClose={handleMobileClose}>
                            <ChatList
                                w="70vw"
                                chats={data?.chats}
                                chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
                                newMessagesAlert={newMessagesAlert}
                                onlineUsers={onlineUsers}
                            />
                        </Drawer>
                    )
                }

                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid item
                        sm={4}
                        md={3}
                        sx={{ display: { xs: "none", sm: "block" } }}
                        height={"100%"}>
                        {isLoading ? (
                            <Skeleton />
                        ) : (
                            <ChatList
                                chats={data?.chats}
                                chatId={chatId}
                                onlineUsers={onlineUsers}
                                handleDeleteChat={handleDeleteChat}
                                newMessagesAlert={newMessagesAlert}
                            />)}
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                        <WrappedComponent {...props} chatId={chatId} user={user}/>
                    </Grid>
                    <Grid item md={4} lg={3} height={"100%"}
                        sx={{
                            display: { xs: "none", md: "block" },
                            padding: "2rem",
                            bgcolor: "rgba(0,0,0,0.86)"
                        }} >

                        <Profile user={user} />
                    </Grid>
                </Grid>
            </div>

        )
    }


}

export default AppLayout;


//basically,since the layout of app remains same in the home page and the other pages so this function takes in the component that has to be changed with its props and header and footer will remain the same


//xs , sm , md are the screen sizes like we apply media queries there are 12 columns if any of them in one of the component is not defined it takes the last of that component