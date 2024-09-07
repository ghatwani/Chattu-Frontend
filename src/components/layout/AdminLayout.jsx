import { Close as CloseIcon, ExitToApp, Groups, ManageAccounts, Menu as MenuIcon, Message } from '@mui/icons-material'
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from '@mui/material'
import React, { useState } from 'react'
import { Link as LinkComponent, Navigate, useLocation } from 'react-router-dom'
import { Dashboard } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '../../redux/thunks/admin';



const Link = styled(LinkComponent)`
text-decoration: none;
border-radius: 2rem;
padding: 1rem 2rem;
color:black;
&:hover{
    color: rgba(0, 0, 0, 0.54);
    }
    `;
    
    const adminTabs = [{
        name: "Dashboard",
        path: '/admin/dashboard',
        icon: <Dashboard />
    },
    {
        name: "Users",
        path: '/admin/users',
        icon: <ManageAccounts />
    },
    {
        name: "Chats",
        path: '/admin/chats',
        icon: <Groups />
    },
    {
        name: "Messages",
        path: '/admin/messages',
        icon: <Message />
    },
]
const Sidebar = ({ w = "100%" }) => {
    const location = useLocation();
    const dispatch= useDispatch()
    const LogoutHandler = () => {
    dispatch(adminLogout())
    }
    return (

        <Stack width={w} padding={"2rem"} spacing={"1rem"} direction={"column"}>
            <Typography
                variant='h5' textTransform={"uppercase"}
            > Chattu </Typography>
            <Stack spacing={"1rem"}>
                {
                    adminTabs.map((tab) => (
                        <Link key={tab.path} to={tab.path}
                            sx={location.pathname === tab.path && {
                                bgcolor: "black",
                                color: "white",
                                ":hover": { color: 'gray' }

                            }}>
                            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                                {tab.icon}
                                <Typography>{tab.name}</Typography>
                            </Stack>
                        </Link>
                    ))
                }

                <Link onClick={LogoutHandler}>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        <ExitToApp />
                        <Typography>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    )
}


const AdminLayout = ({ children }) => {
    const {isAdmin}=useSelector((state)=> state.auth)
    const [isMobile, setisMobile] = useState(false)
    const handleMobile = () => {
        setisMobile(!isMobile)
    }
    const handleClose = (params) => {
        setisMobile(false)
    }
if(!isAdmin) return <Navigate to="/admin/"/>
    return (
        <Grid container minHeight={"100vh"}>
            <Box sx={{
                display: { xs: "block", md: "none" },
                position: "fixed",
                right: "1rem",
                top: "1rem"
            }}>
                <IconButton onClick={handleMobile}>
                    {
                        isMobile ? <CloseIcon /> : <MenuIcon />
                    }
                </IconButton>
            </Box>
            <Grid
                item
                md={4}
                lg={3}
                sx={{ display: { xs: "none", md: "block" } }}
            >
                <Sidebar />
            </Grid>
            <Grid
                item
                xs={12}
                md={8}
                lg={9}
                sx={{
                    bgcolor: "#f5f5f5"
                }}
            >{children}
            </Grid>
            <Drawer open={isMobile} onClose={handleClose} >
                <Sidebar w="50vw" />
            </Drawer>
        </Grid>
    )
}

export default AdminLayout