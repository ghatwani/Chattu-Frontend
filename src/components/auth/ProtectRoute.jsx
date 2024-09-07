import React from 'react'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

const ProtectRoute = ({children, user , redirect="/login"}) => {
  if(!user) return <Navigate to={redirect}/>

  return children? children:<Outlet/>; //since we're applying ProtectedRoute for multiple pages (see App.jsx) we will create a wrapper div of ProtectRoute with all the paths in it. Outlet works as placeholder it matches the routes inside the wrapper div of ProtectRoutes and renders. 
}

export default ProtectRoute


/*
<ProtectRoute> 

all the component inside it will be recieved as children
 <ProtectRoute/>

 */