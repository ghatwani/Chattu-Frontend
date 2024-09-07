import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { orange } from '../components/constants/color';
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '../components/styles/StyledComponents';
import AvatarCard from '../components/shared/AvatarCard';
import { SampleChats, SampleUsers } from '../components/constants/sampleData';
import AddMemberDialog from '../components/dialogs/AddMemberDialog';
import UserItem from '../components/shared/UserItem';
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyChatsQuery, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { LayoutLoaders } from '../components/layout/Loaders';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setisAddMember } from '../redux/reducers/misc';

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog"))


const Group = () => {
  const chatId = useSearchParams()[0].get("group")
  const navigate = useNavigate();
  const dispatch= useDispatch()
  const myGroups = useMyGroupsQuery("")

  const {isAddMember}=useSelector(state=> state.misc)

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  )

  const [updateGroup, isLoadingGroupName]= useAsyncMutation(useRenameGroupMutation)
  const [removeMember, isLoadingRemoveMember]= useAsyncMutation(useRemoveGroupMemberMutation)
  const [deleteGroup, isLoadingDeleteGroup]= useAsyncMutation(useDeleteChatMutation)
  // console.log("group deets",groupDetails.data)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [groupName, setgroupName] = useState("")
  const [groupNameUpdatedValue, setgroupNameUpdatedValue] = useState("")
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
  const [members, setmembers] = useState([])
  // const isAddMember = false;

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error
    },
  ]
  useErrors(errors)
  // console.log(groupDetails?.data)
  useEffect(() => {
    const groupData = groupDetails.data
    if (groupData) {
      setgroupName(groupData.chat.name)
      setgroupNameUpdatedValue(groupData.chat.name)
      setmembers(groupData.chat.members)
    }

    return ()=>{
      setgroupName("");
      setgroupNameUpdatedValue("")
      setmembers([])
      setIsEdit(false)
    }
  }, [groupDetails.data])


  const navigateBack = () => {
    navigate("/")
  }
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  }
  const ishandleMobileClose = () => {
    setIsMobileMenuOpen(false)
  }
  const updateGroupName = () => {
    setIsEdit(false)
    updateGroup("updating Group Name...", {chatId, name:groupNameUpdatedValue})
    // console.log("kuch bhi mat likho samjhe")
  }
  const openconfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true)
    // console.log("delete group")
  }
  const closeconfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false)
  }

  const openAddMemberHandler = () => {
    dispatch(setisAddMember(true))
   }
  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId)
    // setConfirmDeleteDialog(false)
    closeconfirmDeleteHandler()
    navigate('/groups')
  }
  const removeMemberHandler = (userId) => {
    removeMember("Removing Member", {chatId, userId});
  }

  useEffect(() => {
    if (chatId) {
      setgroupName(`Group Name ${chatId}`);
      setgroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    // move to the initial state when another componenet is mounted for rendering
    return () => {
      setgroupName("")
      setgroupNameUpdatedValue("")
      setIsEdit(false)
    }
  }, [chatId]);

  const IconBtns = (
    <>
      <Box sx={{
        display: {
          xs: "block",
          sm: "none",
          position: "fixed",
          right: "1rem",
          top: "1rem"
        },
      }}>
        <Tooltip title="menu">
          <IconButton onClick={handleMobile}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Tooltip title="back">
        <IconButton sx={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          bgcolor: "rgba(0,0,0,0.8)",
          color: "rgba(244, 244, 245 ,0.5)",
          ":hover": {
            bgcolor: "rgba(0,0,0,0.7)"
          }
        }}
          onClick={navigateBack}>
          <KeyboardBackspace />
        </IconButton>
      </Tooltip>
    </>
  )

  const GroupName = <Stack direction={"row"}
    justifyContent={"center"}
    alignItems={"center"}
    padding={"1rem"}
    spacing={"1rem"}>{
      isEdit ?
        <>
          <TextField value={groupNameUpdatedValue} onChange={(e) => setgroupNameUpdatedValue(e.target.value)} />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}><DoneIcon /> </IconButton>
        </>
        :
        <>
          <Typography variant='h4'>{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}><EditIcon /></IconButton>
        </>
    }
  </Stack>

  const ButtonGroup = (
    <Stack
      direction={
        {
          sm: "row",
          xs: "column-reverse"
        }
      }
      spacing={"1rem"}
      p={{
        sm: "1rem",
        xs: "0",
        md: "1rem 4rem"
      }}
    >
      <Button size='large' color='error' startIcon={<DeleteIcon />} onClick={openconfirmDeleteHandler}>Delete Group</Button>
      <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>
    </Stack>
  )
  return myGroups.isLoading ? (<LayoutLoaders />) : (
    <Grid container height={"100vh"}>
      <Grid item
        sx={{
          display: {
            xs: "none",
            sm: "block"
          },
        }}
        sm={4}
        bgcolor={orange}>
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>
      <Grid item xs={12} sm={8} sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: "1rem 3rem",
        alignItems: "center"

      }}>
        {IconBtns}
        {groupName &&
          <>
            {GroupName}
            <Typography margin={"2rem"} alignSelf={"flex-start"} variant='body1'>Members</Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem"
              }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
            >
              {
                isLoadingRemoveMember?
                (<CircularProgress/>)
                :
              ( groupDetails?.data?.chat?.members?.map((i) => (
                  <UserItem user={i} key={i._id} isAdded styling={{
                    boxShadow: "0 0 0.9rem rgba(0,0,0,0.7)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem"
                  }}
                    handler={removeMemberHandler} />
                ))
              )
              }
            </Stack>
            {ButtonGroup}
          </>
        }
      </Grid>
      {
        isAddMember && <Suspense fallback={<Backdrop open />}> <AddMemberDialog chatId={chatId}/></Suspense>
      }

      {
        confirmDeleteDialog &&
        <Suspense fallback={<Backdrop open />}><ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeconfirmDeleteHandler} deleteHandler={deleteHandler} /></Suspense>
      }



      <Drawer sx={{
        display: {
          xs: "block",
          sm: "none",
        },
      }} open={isMobileMenuOpen} onClose={ishandleMobileClose}>
        <GroupsList w={'50%'} myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>

    </Grid>
  )
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  // console.log(myGroups.length)
  return (
    <Stack width={w}>
      {
        myGroups.length > 0 ? (myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))
        ) : (<Typography textAlign={"center"} padding={"1rem"}>No Groups</Typography>)
      }
    </Stack>)
}




const GroupListItem = ({ group, chatId }) => {
  const { name, avatar, _id } = group

  return (<Link to={`?group=${_id}`} onClick={(e) => {
    if (chatId === _id) e.preventDefault()
  }}>
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </Link>)
}


export default Group