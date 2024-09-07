import React, { useState } from 'react'
import { Container, Paper, Typography, Button, Avatar, IconButton, Stack } from '@mui/material'
import TextField from '@mui/material/TextField';
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { CameraAlt } from '@mui/icons-material'
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp"
import { usernameValidator } from '../utils/validator';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import toast from "react-hot-toast";
import { server } from "../components/constants/config";
import { bgGradient } from "../components/constants/color";


const Login = () => {
  const [IsLoggin, setIsLoggin] = useState(true);
  const [IsLoading, setIsLoading] = useState(false);


  const name = useInputValidation("");
  const bio = useInputValidation("");
  const password = useStrongPassword();
  const username = useInputValidation("", usernameValidator);

  const avatar = useFileHandler("single")//2 defines the size of the photo

  const dispatch = useDispatch();

  const handleSignin = async (e) => {
    e.preventDefault();
    const toastId= toast.loading("Logging In...")

    
    setIsLoading(true)

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`, {
        username: username.value,
        password: password.value
      }, config)
      dispatch(userExists(data.user))
      toast.success(data.message, {
        id:toastId
      })

    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally{
      setIsLoading(false)
    }

  }
  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId= toast.loading("Signing up...")

setIsLoading(true)
    const formData = new FormData()
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
         config
        )
      dispatch(userExists(data.user))
      toast.success(data.message, {
        id:toastId
      })

    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally{
      setIsLoading(false)
    }

  }
  return (
   <div style={{
    backgroundImage: bgGradient ,
   }}>
     <Container component={"main"}
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Paper elavation={10} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {IsLoggin ? (
          <>
            <Typography varient="h5" >Login</Typography>
            <form style={{
              width: "100%",
              marginTop: "1rem"
            }}
              onSubmit={handleSignin}
            >
              <TextField
                required
                fullWidth
                label='username'
                margin='normal'
                variant='outlined'
                value={username.value}
                onChange={username.changeHandler}
              />
              <TextField
                required
                fullWidth
                label='password'
                type='password'
                margin='normal'
                variant='outlined'
                value={password.value}
                onChange={password.changeHandler}
              />

              <Button
                sx={{ marginTop: "1rem" , backgroundColor:"#FFB6C1"}}
                variant="conatined" type='submit' fullWidth disabled={IsLoading}>Login</Button>

              <Typography textAlign={"center"} m={"1rem"}>Or</Typography>


              <Button
              sx={{
                border:"2px solid #FFB6C1"
              }}
                variant="conatined" fullWidth type='submit' onClick={() => { setIsLoggin(false) }} disabled={IsLoading} >Sign Up instead</Button>
            </form>
          </>
        ) : (
          <>
            <Typography varient="h5" >Sign Up</Typography>
            <form style={{
              width: "100%",
              marginTop: "1rem"
            }}
              onSubmit={handleSignUp}>
              <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                <Avatar sx={{
                  width: "10rem",
                  height: "10rem",
                  objectFit: "contain"
                }}
                  src={avatar.preview}
                />
                
                <IconButton sx={{
                  position: "absolute", right: "0", bottom: "0", color: "black", bgcolor: "rgb(0,0,0,0)",
                  ":hover": {
                    bgcolor: "rgba(0,0,0,0,0.7)",
                  },
                }}
                  component="label">
                  <>
                    <CameraAlt />
                    <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                  </>
                </IconButton>
              </Stack>
              {
                  avatar.error && (
                    <Typography color="error" variant="caption">
                      {avatar.error}
                    </Typography>
                  )
                }
              <TextField
                required
                fullWidth
                label='name'
                margin='normal'
                variant='outlined'
                value={name.value}
                onChange={name.changeHandler}
              />
              <TextField
                required
                fullWidth
                label='bio'
                margin='normal'
                variant='outlined'
                value={bio.value}
                onChange={bio.changeHandler}
              />
              <TextField
                required
                fullWidth
                label='Username'
                margin='normal'
                variant='outlined'
                value={username.value}
                onChange={username.changeHandler}
              />
              {
                username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )
              }
              <TextField
                required
                fullWidth
                label='Password'
                type='password'
                margin='normal'
                variant='outlined'
                value={password.value}
                onChange={password.changeHandler}
              />
              {
                password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )
              }

              <Button
                sx={{ marginTop: "1rem", backgroundColor:"#FFB6C1" }}
                variant="conatined" color="primary" type='submit' fullWidth
                disabled={IsLoading}>Sign Up</Button>

              <Typography textAlign={"center"} m={"1rem"}>Or</Typography>


              <Button
              sx={{
                border: "2px solid #FFB6C1"
              }}
                variant="conatined" fullWidth type='submit' onClick={() => { setIsLoggin(true) }} disabled={IsLoading} >Login instead</Button>
            </form>
          </>
        )}

      </Paper>

    </Container>
   </div>
  )
}

export default Login