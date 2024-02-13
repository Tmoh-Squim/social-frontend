import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

import Layout from "../components/layout/Layout";
import MessageLayout from "../components/MessageLayout/MessageLayout";
import UserProfile from "../components/user/UserProfile";
import ChangePassword from "../components/user/ChangePassword";
import ProtectedRoute from "./ProtectedRoutes";
const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/conversations" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route
          path="/profile-change-password/:id"
          element={<ChangePassword />}
        />
        <Route path="/" element={<MessageLayout />} />
      </Routes>
    </>
  );
};

export default Router;
