import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'
import axios from "axios";
import { server } from "./components/constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from './redux/reducers/auth';
import { LayoutLoaders } from "./components/layout/Loaders";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from './socket';



//this is called dynamic loading where the pages will not be loaded in advance but only when the particular route is called. Use lazy from react.
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Group = lazy(() => import('./pages/Group'))
const NotFound = lazy(() => import('./pages/NotFound'))


const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const ChatManagement = lazy(() => import('./pages/admin/ChatManagement'))
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement'))


// let user = true; //assumed

const App = () => {

  const { user, loader } = useSelector((state) => state.auth)

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("server", server)
    //get my profile
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()))
  }, [dispatch])
  return loader ? (<LayoutLoaders />) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoaders />}>
        <Routes>
          {/* all three are protected routes */}
          <Route element={<SocketProvider>
            <ProtectRoute user={user} />
          </SocketProvider>}>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Group />} />
          </Route>
          <Route path="/login" element={
            <ProtectRoute user={!user} redirect="/">
              <Login />
            </ProtectRoute>
          } />


          <Route path="/admin" element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/users' element={<UserManagement />} />
          <Route path='/admin/messages' element={<MessageManagement />} />
          <Route path='/admin/chats' element={<ChatManagement />} />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  )
}

export default App