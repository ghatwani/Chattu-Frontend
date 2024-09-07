import React, { Fragment, useCallback, useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { useRef } from 'react'
import { greyColor, orange } from "../components/constants/color";
import { AttachFile, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import { sampleMessage } from '../components/constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { ALERT, CHAT_JOINED, CHAT_LEFT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../components/constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from 'react-redux';
import { setisFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null)
  const bottomRef = useRef(null)
  // const filemenuRef = useRef(null)

  const socket = getSocket()
  const dispatch = useDispatch()
  const navigate= useNavigate()

  const [message, setmessage] = useState("")
  const [messages, setmessages] = useState([])
  const [page, setpage] = useState(1)
  const [fileMenuAnchor, setfileMenuAnchor] = useState(null)
  const [IamTyping, setIamTyping] = useState(false)
  const [userTyping, setuserTyping] = useState(false)
  const typingTimeout = useRef(null)
  // console.log(userTyping)

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId })
  const oldMessageChunk = useGetMessagesQuery({ chatId, page })
  //this would skip if the chatid is not present in db

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessageChunk.data?.totalPages,
    page,
    setpage,
    oldMessageChunk.data?.messages
  )
  //every time the page number will increase the oldMessageChunk will refetch 20 more messages and append it to the data

  const errors = [{ isError: chatDetails.isError, error: chatDetails.error },
  { isError: oldMessageChunk.isError, error: oldMessageChunk.error },
  ]
  const members = chatDetails?.data?.chat?.members
  // console.log(oldMessageChunk.data?.totalPages)

  const messageOnChange = (e) => {
    setmessage(e.target.value)

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId })
      setIamTyping(true)
    }
    if(typingTimeout.current) clearTimeout(typingTimeout.current)
   typingTimeout.current= setTimeout(() => {
      socket.emit(STOP_TYPING,{members, chatId} )
      setIamTyping(false)
    }, [2000]);

  }

  const handleFileOpen = (e) => {
    dispatch(setisFileMenu(true))
    setfileMenuAnchor(e.currentTarget)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message })
    setmessage("")
    // console.log(message)
  }

  useEffect(() => {
    socket.emit(CHAT_JOINED, {userId:user._id, members})
    dispatch(removeNewMessagesAlert(chatId))
    
    //cleaner function will not run intially it will only run when the chatID will change. Hence we're writing it inside cleaner function
    return () => {
      setOldMessages([])
      setmessages([])
      setmessage("")
      setpage(1)
      socket.emit(CHAT_LEFT,{userId:user._id, members})
    }
  }, [chatId])

  useEffect(() => {
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({behavior:"smooth"})
    }
  }, [messages])
  useEffect(() => {
    if(chatDetails.isError)
      {
        console.log()
        return navigate('/')

      }
  }, [chatDetails.isError])
  

  const MessageDataHandler = useCallback((data) => {
    if (data.chatId !== chatId) return;
    // console.log(data)
    setmessages((prev) => [...prev, data.message])

  }, [chatId])
  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    // console.log(data)
    // console.log("typing", data)
    setuserTyping(true)

  }, [chatId])
  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    // console.log(data)
    // console.log("typing", data)
    setuserTyping(false)
  }, [chatId])
  const alertListener = useCallback((data) => {
    if(data.chatId !== chatId) return;
    const messageForAlert = {
      content: data.message,
      sender: {
          _id: user._id,
          name: user.name
      },
      chat: chatId,
      createdAt: new Date().toISOString()

  }
  setmessages((prev)=>[...prev, messageForAlert])
  }, [chatId])


  const eventHandlerArray = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: MessageDataHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  }

  // console.log("oldmessages", oldMessages)

  useSocketEvents(socket, eventHandlerArray)

  useErrors(errors)
  // console.log(message)

  const allMessages = [...oldMessages, ...messages]
  return chatDetails.isLoading ? (<Skeleton />) : (
    <Fragment>
      <Stack ref={containerRef}
        box-sizing={"border-box"}
        height={"90%"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={greyColor}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",

        }}>

        {
          allMessages.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))
        }
        {userTyping && <TypingLoader/>}
        <div  ref={bottomRef}/>
      </Stack>

      <form style={{
        height: "10%"
      }}
        onSubmit={submitHandler}>

        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={'relative'}>
          <IconButton sx={{
            position: "absolute",
            left: "1.5rem",
            rotate: "30deg"
          }}
            onClick={handleFileOpen}
          >
            <AttachFile />
          </IconButton>
          <InputBox placeholder='Send message...' sx={{
            height: "100%"
          }} value={message} onChange={messageOnChange} />
          <IconButton type='submit'
            sx={{
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                rotate: "-30deg",
                bgcolor: "error.dark"
              }

            }}>
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  )
}

export default AppLayout()(Chat)