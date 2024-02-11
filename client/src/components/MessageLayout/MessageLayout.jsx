import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SocketId } from "../../server.tsx";
import { io } from "socket.io-client";
import { getConversations } from "../../redux/conversation";
import { useNavigate } from "react-router-dom";
const socket = io(SocketId, { transports: ["websocket"] });
import Coversation from "./Conversation"
import SideBar from "./SideBar"
const MessageLayout = () => {
  const { conversations } = useSelector(
    (state) => state.conversations?.conversations
  );
  const [onlineUsers, setOnlineUsers] = useState();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user?.user);
  const { users } = useSelector((state) => state.users?.users);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [conversation, setConversation] = useState([]);
  const dispatch = useDispatch();
  const me = user?._id;
  
  useEffect(() => {
    socket.emit("join", user?._id);
    socket.on("getUsers", (data) => {
      setOnlineUsers(data);
    });
  }, []);

  return (
    <>
      <div className="sidebar w-full h-screen overflow-y-scroll bg-neutral-200 flex">
        <SideBar
          conversations={conversations}
          setOpen={setOpen}
          open={open}
          me={me}
          navigate={navigate}
          users={users}
          setConversation={setConversation}
          setActive={setActive}
          active={active}
          dispatch={dispatch}
          onlineUsers={onlineUsers}
        />
        <Coversation
          open={open}
          setOpen={setOpen}
          users={users}
          user={user}
          conversation={conversation}
          me={me}
          onlineUsers={onlineUsers}
          navigate={navigate}
          dispatch={dispatch}
        />
      </div>
      ;
    </>
  );
};

export default MessageLayout;
