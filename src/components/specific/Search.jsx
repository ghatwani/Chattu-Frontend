import { Dialog, InputAdornment, Stack, DialogTitle, TextField, List, ListItem, ListItemText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Search as SearchIcon } from "@mui/icons-material";
import { useInputValidation } from "6pp";
import UserItem from '../shared/UserItem';
import { SampleUsers } from "../constants/sampleData";
import { useDispatch, useSelector } from 'react-redux';
import { setisSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import toast from "react-hot-toast";
import { useAsyncMutation } from '../../hooks/hook';

const users = [1, 2, 3]

const Search = () => {
  const dispatch = useDispatch()

  const [searchUser] = useLazySearchUserQuery()
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation)
  const { isSearch } = useSelector(state => state.misc)

  const search = useInputValidation("")
  const [users, setUsers] = useState([])

  const addFriendHandler = async(id) => {
    await sendFriendRequest("Sending friend request...",{userId: id} )
  }
  const searchCloseHandler = () => dispatch(setisSearch(false))

  useEffect(() => {

    const timeoutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e))
    }, 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [search.value])


  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} >
      <Stack p={"2rem"} direction={"column"} width={"25rem"} sx={{overflowY:"auto"}}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {users.map((user) => (
            <UserItem user={user}
              key={user._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />

          ))}
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search