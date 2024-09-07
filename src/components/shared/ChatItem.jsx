import React from 'react'
import { memo } from 'react';
import { Link } from '../styles/StyledComponents'
import { Box, Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard';
import { motion } from "framer-motion";
const ChatItem = ({
    avatar=[],
    name,
    _id,
    groupChat=false,
    sameSender,
    isOnline, 
    newMessagesAlert,
    index=0,
    handleDeleteChat
}) => {
  return (
   <Link 
   sx={{padding:"0"}} 
   to={`/chat/${_id}`}
    onContextMenu={(e)=>handleDeleteChat(e, _id, groupChat)}>
    <motion.div 
    initial={{opacity:0, y:"-100%"}}
    whileInView={{opacity:1, y:0}}
    transition={{delay: index*0.1}}
    style={{
        display:"flex",
        gap:"1rem",
        alignItems:"center",
        padding:"1rem",
        backgroundColor: sameSender? "black":"unset",
        color: sameSender?"white":"unset",
        position:"relative"
    }}
    >
        
<AvatarCard avatar={avatar}/>
    <Stack>
        <Typography>{name}</Typography>
        {newMessagesAlert && (
            <Typography>{newMessagesAlert.count} New Messages</Typography>
        )}
    </Stack>
    {
        isOnline && <Box sx={{
            width:"10px",
            height:"10px",
            borderRadius:"50%",
            backgroundColor:"green",
            position:"absolute",
            top:"50%",
            right:"1rem",
            transform :"translate (-50%)"
        }}/>
    }
    </motion.div>

   </Link>
  )
}

export default memo(ChatItem);


//since the chatitem is mapped with chatlist and to prevent ChatItem from unnecessary rerendering we use memo in chatitemk unless that particular charitem is not rerendered it will not re render
