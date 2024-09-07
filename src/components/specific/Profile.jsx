
import { Avatar, Stack, Typography, containerClasses } from '@mui/material'
import React from 'react'
import { Face as FaceIcon , AlternateEmail as UserNameIcon , CalendarMonth as CalenderIcon } from "@mui/icons-material";
import  moment  from "moment";
import { transformImage } from '../../lib/feature';

const Profile = ({user}) => {
    return (
        <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
            <Avatar
            src={transformImage(user?.avatar?.url)}
                sx={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    marginBottom: "1rem",
                    border: "5px solid white"
                }}
            />
            <ProfileCard heading={"Bio"} text={user?.bio}/>
            <ProfileCard heading={"username"} text={user?.username} icon={<UserNameIcon/>} />
            <ProfileCard heading={"name"} text={user?.name} icon={<FaceIcon/>} />
            <ProfileCard heading={"joined"} text={moment(user?.createdAt).fromNow()} icon={<CalenderIcon/>} />
        </Stack>
    )
}

const ProfileCard = ({ text, icon, heading }) => {
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            color={"white"}
            textAlign={"center"}>
                {icon && icon}
            <Stack>
                <Typography variant='body1'>{text}</Typography>
                <Typography variant='caption' color={"grey"}>{heading}</Typography>
            </Stack>
        </Stack>
    )
}


export default Profile



//moment js library is used to keep the track of the date from when you have joined 