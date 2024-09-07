import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { SampleUsers } from '../constants/sampleData'
import UserItem from "../shared/UserItem";
import { useState } from 'react'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setisAddMember } from '../../redux/reducers/misc';

const AddMemberDialog = ({ chatId }) => {
    const dispatch=useDispatch()

    const {isAddMember}=useSelector(state=> state.misc)
    const {isLoading, data, isError, error}=useAvailableFriendsQuery(chatId)

    const [addMembers, isLoadingAddMembers]= useAsyncMutation(useAddGroupMembersMutation)
    // const [members, setMembers] = useState(SampleUsers)
    const [selectedMembers, setselectedMembers] = useState([])
    
    
    const selectMemberHandler=(id) => {
        setselectedMembers((prev)=>
            prev.includes(id)? (prev.filter((currentElement)=> currentElement!==id)):([...prev, id]))
        // selectedMembers.map((i)=>console.log(i))
    }
    
    const addMemberSubmitHandler=() => {
        addMembers("Adding member to the group", {chatId, members:selectedMembers})
        closeHandler()
    }
    const closeHandler=() => {
        dispatch(setisAddMember(false))
    }
    
    useErrors([{isError, error}])
    return (
        <Dialog  padding={"3rem"} open={isAddMember} onClose={closeHandler}>
            <Stack spacing={"1rem"} width={"20rem"}>
                <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
            </Stack>
            <Stack>
                {isLoading?<Skeleton/> :data?.friends.length > 0 ? data?.friends.map((user) => (
                    <UserItem key={user._id} user={user} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)}/>
                )) : <Typography textAlign={"center"}>No Friends </Typography>}
            </Stack>
            <Stack direction={"row"} alignItems={"center"} justifyContent={'center'} margin={"1rem"}>
                <Button color='error' onClick={closeHandler}> Cancel</Button>
                <Button variant='container' onClick={addMemberSubmitHandler} disabled={isLoadingAddMembers}> Submit Changes</Button>
            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog