import { useInputValidation } from '6pp';
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { SampleUsers } from '../constants/sampleData';
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setisNewGroup } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';
import { useAsyncError } from 'react-router-dom';


const NewGroup = () => {

  const { isNewGroup } = useSelector(state => state.misc)
  const dispatch = useDispatch()

  const { isError, isLoading, data, error } = useAvailableFriendsQuery()
  const [newGroup, isLoadingNewGroup]=useAsyncMutation(useNewGroupMutation)

  // const [members, setmembers] = useState(SampleUsers)
  const [selectedmembers, setselectedmembers] = useState([])

  const groupName = useInputValidation("")
  const errors = [{
    isError,
    error
  }]
  useErrors(errors)

  const selectMemberHandler = (id) => {
    setselectedmembers((prev) =>
      prev.includes(id)
        ? prev.filter((curr) => curr !== id) :
        [...prev, id])
  }
  const SubmitMemberHandler = () => {
    if (!groupName.value) return toast.error("Group name is required")

    if (selectedmembers.length < 2) return toast.error("Please select atleast 3 members")
    console.log(groupName.value, selectedmembers)

    newGroup("Creating new Group...", {name:groupName.value, members:selectedmembers})
    closeHandler()
  }
  const closeHandler = () => {
    dispatch(setisNewGroup(false))
  }

  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"35rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>
        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />
        <Typography variant='body1'>Members</Typography>
        <Stack>
          {isLoading ? <Skeleton /> : data?.friends?.map((user) => (
            <UserItem user={user}
              key={user._id}
              handler={selectMemberHandler}
              isAdded={selectedmembers.includes(user._id)}
            />

          ))}
          <Stack direction={"row"} justifyContent={'space-evenly'} marginTop={"1rem"}>
            <Button variant="contained" color="error"onClick={closeHandler} >Cancel</Button>
            <Button variant="contained" onClick={SubmitMemberHandler} disabled={isLoadingNewGroup}>Create</Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup