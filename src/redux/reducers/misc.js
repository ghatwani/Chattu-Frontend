import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroup: false,
    isAddMember:false,
    isNotification:false,
    isMobile: false,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu: false,
    uploadingLoader: false,
    selectedDeleteChat:{
        chatId: "",
        groupChat: false
    }
}

const miscSlice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        setisNewGroup:(state, action)=>{
            state.isNewGroup=action.payload
        },
        setisAddMember:(state, action)=>{
            state.isAddMember=action.payload
        },
        setisNotification:(state, action)=>{
            state.isNotification=action.payload
        },
        setisMobile:(state, action)=>{
            state.isMobile=action.payload
        },
        setisSearch:(state, action)=>{
            state.isSearch=action.payload
        },
        setisFileMenu:(state, action)=>{
            state.isFileMenu=action.payload
        },
        setisDeleteMenu:(state, action)=>{
            state.isDeleteMenu=action.payload
        },
        setuploadingLoader:(state, action)=>{
            state.uploadingLoader=action.payload
        },
        setselectedDeleteChat:(state, action)=>{
            state.selectedDeleteChat=action.payload
        },
    },
})

export default miscSlice;
export const { setisAddMember,setisDeleteMenu,setisFileMenu,setisMobile,setisNewGroup,setisNotification, setisSearch,setselectedDeleteChat, setuploadingLoader } = miscSlice.actions