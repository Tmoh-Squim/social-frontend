import "./App.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React,{useEffect} from "react";
import {useSelector} from "react-redux"
import store from "./redux/store"
import Router from "./router/Router"
import {loadUser,loadAllUsers} from "./redux/user"
import {getConversations} from "./redux/conversation"
import {io} from "socket.io-client"
import {SocketId} from "./server.tsx"

const socket = io(SocketId,{transports:["websocket"]})

const App = () => {
  const user = useSelector((state)=>state.user?.user?.user)
  useEffect(() => {
    store.dispatch(loadUser())
  }, [store]);
  
  useEffect(() => {
    const id = user?._id
    socket.emit("join",user?._id)
    store.dispatch(getConversations(id))
    store.dispatch(loadAllUsers())
  }, [user]);
  
  
  return( <>
    <ToastContainer />
    <Router />
  </>);
};

export default App;
