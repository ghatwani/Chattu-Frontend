import React, { Suspense, useState, lazy } from 'react'
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { orange } from '../constants/color'
import { Menu as MenuIcon, Search as SearchIcon, Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationsIcon } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";
import { server } from '../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import { setisMobile, setisNewGroup, setisNotification, setisSearch } from '../../redux/reducers/misc'
import { resetNotificationCount } from '../../redux/reducers/chat'
//  import SearchDialog from '../specific/Search'
const SearchDialog = lazy(() => import("../specific/Search"))
const NotificationDialog = lazy(() => import("../specific/Notification"))
const NewGroupDialog = lazy(() => import("../specific/NewGroup"))


const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const { isSearch, isNotification , isNewGroup} = useSelector(state => state.misc)
    const { notificationCount } = useSelector(state => state.chat)


    const HandleMobile = () => {
        dispatch(setisMobile(true))
    }
    const openSearchDialog = () => {
        dispatch(setisSearch(true))
    }
    const openNewGroup = () => {
        dispatch(setisNewGroup(true))
    }
    const openNotification = () => {
        dispatch(setisNotification(true))
        dispatch(resetNotificationCount())
    }
    const HandleLogout = async () => {
        try {
            const { data } = await axios.get(`${server}/api/v1/user/logout`, {
                withCredentials: true
            })
            dispatch(userNotExists())
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }
    const navigateToGroup = () => navigate("/groups") // to redirect to a specific page when the button is clicked
    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"}>
                <AppBar
                    position="static"
                    sx={{
                        bgcolor: orange
                    }}>
                    <Toolbar>
                        <Typography variant='h5' sx={{
                            display: { xs: "none", sm: "block" },
                        }}>
                            Chattu
                        </Typography>
                        <Box sx={{
                            display: { xs: "block", sm: "none" }
                        }}>
                            <IconButton color='inherit' onClick={HandleMobile}>
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{
                            flexGrow: 1
                        }} />
                        <Box>
                            <IconBtn
                                title={"Search"}
                                icon={<SearchIcon />}
                                onClick={openSearchDialog} />

                            <IconBtn
                                title={"New group"}
                                icon={<AddIcon />}
                                onClick={openNewGroup} />

                            <IconBtn
                                title={"Manage Groups"}
                                icon={<GroupIcon />}
                                onClick={navigateToGroup} />
                            <IconBtn
                                title={"Notifications"}
                                icon={<NotificationsIcon />}
                                onClick={openNotification}
                                value={notificationCount} />


                            <IconBtn
                                title={"Logout"}
                                icon={<LogoutIcon />}
                                onClick={HandleLogout} />

                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            {isSearch && <Suspense fallback={<Backdrop open />}><SearchDialog /></Suspense>}
            {isNotification && <Suspense fallback={<Backdrop open />}><NotificationDialog /></Suspense>}
            {isNewGroup && <Suspense fallback={<Backdrop open />}><NewGroupDialog /></Suspense>}
        </>
    )
}


const IconBtn = ({ title, icon, onClick, value }) => {
    return (

        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
                {/* {console.log('value', value)} */}
                {
                    value
                        ?
                        (<Badge badgeContent={value} color='error'>{icon}</Badge>)
                        :
                        (icon)
                }
            </IconButton>
        </Tooltip>
    )
}
export default Header;



// Backdrop is used to create an effect of blur when loading
//suspense has been used in the case of lazy loading 