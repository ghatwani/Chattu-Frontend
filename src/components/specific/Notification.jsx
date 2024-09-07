import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../constants/sampleData'
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from 'react-redux';
import toast from "react-hot-toast";
import { setisNotification } from '../../redux/reducers/misc';

const Notification = () => {
  const{isNotification}= useSelector((state)=> state.misc)
  const dispatch =useDispatch()
  const { isLoading, data, error, isError } = useGetNotificationQuery()
  const [acceptRequest]=useAsyncMutation(useAcceptFriendRequestMutation)
  const friendrequesthandler = async({ _id, accept }) => { 

    dispatch(setisNotification(false))
    await acceptRequest("Accepting...", {requestId: _id, accept})
  };
  const closeHandler=()=>{
    dispatch(setisNotification(false))
  }
  useErrors([{ error, isError }])
  // console.log(data)

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {
          isLoading ? (<Skeleton />) : (
            <>
              {data?.allrequest.length > 0 ? (

                data?.allrequest.map(({ sender, _id }) =>
                  <NotificationItem sender={sender} _id={_id} handler={friendrequesthandler} key={_id} />
                ))
                :
                <Typography>
                  No Notifications
                </Typography>}</>
          )
        }
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}>

        <Avatar />

        <Typography
          variant='body1' sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%"
          }}
        >{`${name} sent you a friend request`}
        </Typography>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>Reject</Button>
        </Stack>

      </Stack>
    </ListItem>
  )
})

export default Notification