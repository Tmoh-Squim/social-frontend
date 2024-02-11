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
 {/* useEffect(() => {
    setTimeout(() => {
      if(!user){
        navigate('/login')
      }
    }, 8000);
  }, []);*/}
  
  return <>
  <Header />
  <HomePage />
  </>
};

export default Layout;
