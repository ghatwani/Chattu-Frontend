import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/feature";
import { NEW_MESSAGE_ALERT } from "../../components/constants/events";

const initialState = {
    notificationCount: 0,
    newMessagesAlert:getOrSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        get: true,
      }) || [
        {
          chatId: "",
          count: 0,
        },
      ],
  };

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        incrementNotification:(state)=>{
            state.notificationCount+=1
        },
        resetNotificationCount:(state)=>{
            state.notificationCount=0
        },
        setNewMessagesAlert:(state, action)=>{
            const index= state.newMessagesAlert.findIndex((item)=> item.chatId === action.payload.chatId)
            // console.log(index)
            if(index !== -1){
                state.newMessagesAlert[index].count+=1
            }
            else{
                state.newMessagesAlert.push({
                    chatId:action.payload.chatId,
                    count:1
                })
            }
        },
        removeNewMessagesAlert:(state, action)=>{
            console.log(action.payload)
            state.newMessagesAlert=state.newMessagesAlert.filter((item)=>{
                item.chatId !== action.payload
                console.log(item)
            })
        }
    },
})

export default chatSlice;
export const {incrementNotification, resetNotificationCount , setNewMessagesAlert ,removeNewMessagesAlert} = chatSlice.actions