import "./App.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React,{useEffect,useState} from "react";
import {useSelector} from "react-redux"
import store from "./redux/store"
import Router from "./router/Router"
import {loadUser,loadAllUsers} from "./redux/user"
import {getConversations} from "./redux/conversation"
import {io} from "socket.io-client"
import {SocketId} from "./server.tsx"
import {useNavigate} from "react-router-dom"
import Login from "./components/auth/Login"
const socket = io(SocketId,{transports:["websocket"]})

const App = () => {
  const user = useSelector((state)=>state.user?.user?.user)
  const navigate=useNavigate()
  useEffect(() => {
    store.dispatch(loadUser())
  }, [store]);
  const [active,setActive] = useState(false)
  
  useEffect(() => {
    const id = user?._id
    socket.emit("join",user?._id)
    store.dispatch(getConversations(id))
    store.dispatch(loadAllUsers())
  }, [user]);
 {/* useEffect(() => {    
    setTimeout(() => {
      if(!user){
        navigate('/login')
      }
    }, 3000);
  }, [user]);*/}

useEffect(() => {
  user? (
    setTimeout(() => {
      setActive(true)
    }, 3000)
  ):(
      null
  )
  
}, [user]);
useEffect(() => {
  !user? (
    setTimeout(() => {
      navigate("/login")
      setActive(true)
    }, 6000)
  ):(null)
}, [user]);


  
  return( <>
    <ToastContainer />
    {
      active ?(
        <Router />
      ):(
        <div className="flex h-screen w-full items-center justify-center">
          <h1>
            Loading please wait...
          </h1>
        </div>
      )
    }
  </>);
};

export default App;
