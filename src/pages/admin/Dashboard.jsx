import React from 'react'
import AdminLayout from "../../components/layout/AdminLayout";
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { AdminPanelSettings, Group, Margin, Message, Notifications, Person, Widgets } from '@mui/icons-material';
import moment from 'moment';
import { SearchField, CurveButton } from '../../components/styles/StyledComponents';
import { DoughnutChart, LineChart } from '../../components/specific/Chart';
import { useFetchData } from "6pp";
import { server } from '../../components/constants/config';
import { LayoutLoaders } from '../../components/layout/Loaders';
import { useErrors } from "../../hooks/hook";

const Dashboard = () => {
    const {loading, data, error}= useFetchData(`${server}/api/v1/admin/stats`, "dashboard-stats")

    const {stats}= data || {}

    useErrors([{
        isError:error,
        error:error,
    }])
    const Appbar = (
        <Paper
            elevation={3}
            sx={{
                padding: "3rem",
                margin: "2rem 0",
                borderRadius: "1rem"
            }}>
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <AdminPanelSettings sx={{ fontSize: "3rem" }} />
                <SearchField placeholder="Search" />
                <CurveButton>Search</CurveButton>
                <Box flexGrow={1} />
                <Typography
                    display={{
                        xs: "none",
                        lg: "block"
                    }}>
                    {moment().format("MMMM Do YYYY, h:mm:ss a")}
                </Typography>
                <Notifications />
            </Stack>

        </Paper>
    )
    const Widgets = (<Stack direction={{
        xs: "column",
        sm: "row"
    }}
        spacing={"2rem"}
        justifyContent={"space-between"}
        alignItems={"center"}
        margin={"2rem 0"}>
        <Widget title={"Chats"} value={stats?.usersCount} icon={<Person />} />
        <Widget title={"Users"} value={stats?.groupsCount} icon={<Group />} />
        <Widget title={"Messages"} value={stats?.messageCount} icon={<Message />} />

    </Stack>)

// console.log("data", data)
    return ( 
        <AdminLayout>
           { loading? <LayoutLoaders/> :
            <Container component={"main"}>
                {Appbar}
                <Stack direction={{
                    xs:"column",
                    lg:"row"
                }} 
                flexWrap={"wrap"} 
                sx={{gap:"2rem"}}
                justifyContent={"center"}
                alignItems={{
                    xs:"center",
                    lg:"strtch"
                }}>

                    <Paper
                        elevation={3}
                        sx={{
                            padding: "2rem 3.5rem",
                            borderRadius: "1rem",
                            width: "100%",
                            maxWidth: "45rem",
                        }}>
                        <Typography variant='h4' margin={"2rem 0"}>Last Messages</Typography>
                        <LineChart value={stats?.messagesChart || []} />
                    </Paper>
                    <Paper elevation={3}
                        sx={{
                            padding: "1rem ",
                            borderRadius: "1rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: { xs: "100%", sm: "50%" },
                            position: "relative",
                            maxWidth: "25rem",
                            zIndex:"10"
                        }}>
                        <DoughnutChart labels={["Single Chats", "Group Chats"]} value={[stats?.totalChatCount - stats?.groupsCount || 0,stats?.groupsCount || 0]} />
                        <Stack position={"absolute"}
                            direction={"row"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            spacing={"0.5rem"}
                            width={"100%"}
                            height={"100%"}
                            zIndex={-1}>
                            <Group /> <Typography>Vs</Typography>
                            <Person />
                        </Stack>
                    </Paper>
                </Stack>
                {Widgets}
            </Container>}
        </AdminLayout>
    )
}
const Widget = ({ title, value, icon }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                padding: "2rem",
                margin: "2rem 0",
                borderRadius: "1rem",
                width: "20rem"
            }}>
            <Stack alignItems={"center"} spacing={"1rem"}>
                <Typography
                    sx={{
                        color: "rgba(0,0,0,0.7)",
                        borderRadius: "50%",
                        border: '5px solid rgba(0,0,0,0.9)',
                        width: "5rem",
                        height: "5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >{value}</Typography>
                <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                    {icon}
                    <Typography>{title}</Typography>
                </Stack>
            </Stack>
        </Paper>
    )
}
export default Dashboard