import React,{useEffect} from "react";
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import store from "../../redux/store"
import HomePage from "./HomePage"
import Header from "./Header";
import {getConversations} from "../../redux/conversation"
const Layout = () => {
  const user = useSelector((state)=>state.user?.user?.user)
  const navigate = useNavigate()
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
      }, 3000)
    ):(null)
  }, [user]);
  
  return <>
  <Header />
  <HomePage />
  </>
};

export default Layout;
