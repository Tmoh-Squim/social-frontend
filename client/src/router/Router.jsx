import React from "react";
import {Routes,Route} from "react-router-dom"
import Login from "../components/auth/Login"
import Layout from "../components/layout/Layout"
import MessageLayout from "../components/MessageLayout/MessageLayout"
const Router = () => {
  return <>
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/conversations" element={<MessageLayout />} />
    </Routes>
  </>;
};

export default Router;
