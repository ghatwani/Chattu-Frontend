import { useInputValidation } from '6pp';
import { Button, Container, Paper, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import { adminLogin, getAdmin } from '../../redux/thunks/admin';


const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const secretKey = useInputValidation("")

  const SubmitHandler = (e) => {
    e.preventDefault()
    dispatch(adminLogin(secretKey.value))
    console.log("secret",secretKey.value)
  }
  useEffect(() => {
    dispatch(getAdmin())
    console.log(getAdmin())
  }, [dispatch])
  if (isAdmin) return <Navigate to='/admin/dashboard' />

  return (
    <div style={{ background: "linear-gradient(15deg, #13547a 0%, #80d0c7 100%)" }}>
      <Container component={"main"} maxWidth="xs" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper elavation={10} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>


          <Typography varient="h5" >Admin Login</Typography>
          <form 
           style={{
            width: "100%",
            marginTop: "1rem"
          }}
            onSubmit={SubmitHandler}>

            <TextField
              required
              fullWidth
              label='password'
              type='password'
              margin='normal'
              variant='outlined'
              value={secretKey.value}
              onChange={secretKey.changeHandler}
            />

            <Button
              sx={{ marginTop: "1rem", backgroundColor: "turquoise" }}
              variant="conatined" color="primary" type='submit' fullWidth>Login</Button>
          </form>

        </Paper>

      </Container>
    </div>
  )
}

export default AdminLogin