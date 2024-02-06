import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMessages } from "../../redux/messages";
import {
  AiOutlineArrowRight,
  AiOutlinePhone,
  AiOutlineSend,
} from "react-icons/ai";
import { format } from "timeago.js";
import { ServerUrl, SocketId } from "../../server.tsx";
import { io } from "socket.io-client";
import axios from "axios";
import { getConversations } from "../../redux/conversation";
import { useNavigate } from "react-router-dom";

const socket = io(SocketId, { transports: ["websocket"] });
const MessageLayout = () => {
  const { conversations } = useSelector(
    (state) => state.conversations?.conversations
  );
  const [onlineUsers, setOnlineUsers] = useState();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user?.user);
  const { users } = useSelector((state) => state.users?.users);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [conversation, setConversation] = useState(null);
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
          conversation={conversation}
          me={me}
          navigate={navigate}
          dispatch={dispatch}
        />
      </div>
      ;
    </>
  );
};

const SideBar = ({
  conversations,
  setOpen,
  me,
  users,
  open,
  setConversation,
  active,
  navigate,
  dispatch,
  setActive,
  onlineUsers,
}) => {
  return (
    <>
      <div
        className={`${
          open === true
            ? "hidden 800px:w-[25%] 800px:block sidebar h-screen px-2 fixed overflow-y-scroll bg-neutral-500"
            : "sidebar h-screen 800px:w-[25%] w-full bg-neutral-500 px-2 fixed overflow-y-scroll  800px:block"
        }`}
      >
        <div className="w-full items-end justify-end flex 800px:hidden cursor-pointer" onClick={()=>navigate("/")}>
          <AiOutlineArrowRight size={28} color="black" />
        </div>

        {conversations?.map((conversation, index) => {
          const otherMember = conversation?.members?.find(
            (member) => member != me
          );
          const [lastMessage, setLastMessage] = useState(
            conversation?.lastMessage
          );
          const [lastMessageId, setLastMessageId] = useState(
            conversation?.lastMessageId
          );
          useEffect(() => {
            socket.on("getLastMessage", (data) => {
              data?.conversationId === conversation._id
                ? setLastMessage(data?.lastMessage) ||
                  setLastMessageId(data?.lastMessageId)
                : null;
            });
          }, []);

          const receiver = users?.find((user) => user?._id === otherMember);
          const online = onlineUsers?.find(
            (user) => user.userId === otherMember
          );

          return (
            <div
              key={index}
              onClick={() => {
                setOpen(true);
                setConversation(conversation);
                setActive(index);
              }}
              className="my-1"
            >
              {active === index ? (
                <div className="flex items-center cursor-pointer bg-[#0000002d] rounded-lg">
                  <div className="w-[35px] h-[35px] flex rounded-full relative bg-gray-500 justify-center items-center">
                    <h3 className="text-xl text-black text-center">
                      {receiver?.name[0]}
                    </h3>
                    <div
                      className={
                        online
                          ? "w-[12px] h-[12px] rounded-full bg-green-400 absolute bottom-1 left-[25px]"
                          : null
                      }
                    ></div>
                  </div>
                  {lastMessageId === me ? (
                    <>
                      <p className="mx-1">You:</p>
                      <p className="text-center text-gray-700">
                        {lastMessage?.length > 13
                          ? lastMessage.slice(0, 13) + "..."
                          : lastMessage}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mx-1">{receiver.name[0]}:</p>
                      <p className="text-center text-gray-700 ">
                        {lastMessage?.length > 13
                          ? lastMessage.slice(0, 13) + "..."
                          : lastMessage}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center cursor-pointer">
                  <div className="w-[35px] h-[35px] flex rounded-full relative bg-gray-500 justify-center items-center">
                    <h3 className="text-xl text-black text-center">
                      {receiver?.name[0]}
                    </h3>
                    <div
                      className={
                        online
                          ? "w-[12px] h-[12px] rounded-full bg-green-400 absolute bottom-1 left-[25px]"
                          : null
                      }
                    ></div>
                  </div>
                  {lastMessageId === me ? (
                    <>
                      <p className="mx-1">You:</p>
                      <p className="text-center text-gray-700">
                        {lastMessage?.length > 13
                          ? lastMessage.slice(0, 13) + "..."
                          : lastMessage}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mx-1">{receiver.name[0]}:</p>
                      <p className="text-center text-gray-700">
                        {lastMessage?.length > 13
                          ? lastMessage.slice(0, 13) + "..."
                          : lastMessage}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
const Coversation = ({
  open,
  conversation,
  me,
  users,
  dispatch,
  setOpen,
  navigate,
}) => {
  const id = conversation?._id;
  const [icoming, setIncoming] = useState(null);
  useEffect(() => {
    socket.on("getMessage", (data) => {
      console.log('first',data);
      setIncoming(data)
      return data=null
      
    });

  }, []);
  useEffect(() => {
    if (icoming && icoming.conversationId === id) {
      setCurrentConversation(prevConversation => [
        ...prevConversation,
        {
          text: icoming.text,
          sender: icoming.senderId,
          createdAt: Date.now(),
        },
      ]);
    }else{
      return
    }
  }, [icoming, id]);

  const { messages } = useSelector((state) => state.messages?.messages);
  const [currentconversation, setCurrentConversation] = useState([
    ...(messages ? messages : []),
  ]);
  const [text, setText] = useState("");
  useEffect(() => {
    dispatch(getMessages(id));
  }, [id]);
  useEffect(() => {
    setCurrentConversation([...(messages ? messages : [])]);
  }, [messages, id]);

  useEffect(() => {
    // Check if containerRef.current is not null before setting scrollTop
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, currentconversation]);
  const containerRef = useRef(null);

  const otherMember = conversation?.members?.find((member) => member != me);
  const receiver = users?.find((user) => user._id === otherMember);
  const updateLastMessage = async () => {
    socket.emit("updateLastMessage", {
      lastMessage: text,
      lastMessageId: me,
      conversationId: id,
    });

    await axios
      .put(
        `${ServerUrl}/v2/conversation/update-conversation/${id}`,
        { lastMessage: text, lastMessageId: me },
        {
          headers: {
            Authorization: `${localStorage.getItem("user-auth")}`,
          },
        }
      )
      .then((res) => {
        setText("");
        console.log(res.data);
      });
  };
  const handleChat = async (e) => {
    e.preventDefault();
    if (text === "") {
      return;
    } else {
      socket.emit("createMessage", {
        senderId: me,
        receiverId: otherMember,
        text: text,
        conversationId: id,
      });
      await axios
        .post(
          `${ServerUrl}/v2/message/create-new-message`,
          { text: text, sender: me, conversationId: id },
          {
            headers: {
              Authorization: `${localStorage.getItem("user-auth")}`,
            },
          }
        )
        .then((res) => {
        //  setCurrentConversation([...currentconversation, res.data.message]);
          updateLastMessage();
          setText("")
        });
    }
  };
  return (
    <>
      {open === true ? (<>
        <div
          className={`${
            open === true
              ? "h-screen sidebar 800px:ml-[25%] 800px:w-[75%] w-full 800px:fixed overflow-y-scroll  bg-neutral-100 justify-between  flex flex-col"
              : "h-screen sidebar 800px:ml-[25%] ml-[25%] 800px:w-[75%] w-[75%] 800px:fixed overflow-y-scroll  bg-neutral-100 justify-between  flex flex-col"
          }`}
        >
          <div className="w-full bg-blue-500 px-2 justify-between py-2 items-center flex">
            <div className="bg-neutral-400 w-[50px] h-[50px] rounded-full justify-center">
              <h2 className="text-xl text-center font-bold text-green-600">
                {receiver.name[0]}
              </h2>
        </div>
            <div className="flex">
              <AiOutlinePhone
                size={28}
                color="black"
                className="mx-2 cursor-pointer"
              />
              <AiOutlineArrowRight
                size={28}
                color="black"
                className="mx-2 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
          <div
            className=" box 800px:px-1 h-[100vh] mb-[114px] 800px:mb-0 overflow-y-scroll overflow-x-hidden"
            ref={containerRef}
          >
            {currentconversation?.map((message, index) => {
              return (
                <div key={index} className="my-1 justify-between">
                  {currentconversation &&
                    currentconversation.map((message, index) => {
                      const senderMessage = message.sender === me;
                      return (
                        <div key={index} className={`px-2 w-full`}>
                          <div
                            className={`${
                              senderMessage ? "justify-end" : "justify-start"
                            } flex w-full my-1.5 `}
                          >
                            {senderMessage ? (
                              <div className="flex flex-col w-[75%] 800px:w-[65%] justify-end items-end">
                                <p
                                  className=" bg-blue-500 px-2 py-1.5 whitespace-normal break-words  text-white font-500 text-[14px] rounded-[14px] h-min inline-block "
                                  style={{ maxWidth: "fit-content" }}
                                >
                                  {message.text}
                                </p>
                                <p className="text-end text-black">
                                  {format(
                                    message?.createdAt
                                      ? message.createdAt
                                      : null
                                  )}
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col w-[75%] 800px:w-[65%]">
                                <div
                                  className=" bg-[#66c428f5] py-1 px-2 font-500px whitespace-normal break-words text-[14px] text-white rounded-[14px] h-min inline-block"
                                  style={{ maxWidth: "fit-content" }}
                                >
                                  {message.text}
                                </div>
                                <p className="text-start text-black">
                                  {format(
                                    message?.createdAt
                                      ? message.createdAt
                                      : null
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
          <div className="w-full 800px:flex items-center justify-center hidden 800px:left-[25%] right-0 py-2  bg-neutral-500">
            <form className="w-[95%] 800px:w-[70%] relative">
              <input
                type="text"
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter new message"
                className=" w-full px-2 rounded-lg h-[42px] text-white font-600 bg-transparent outline-none focus:border-transparent border-none"
              />
              <AiOutlineSend
                size={28}
                color="white"
                className={`${
                  text !== ""
                    ? "absolute right-2 top-2 cursor-pointer"
                    : "hidden"
                }`}
                onClick={handleChat}
              />
            </form>
          </div>
        </div>
        <div className="w-full flex items-center justify-center 800px:hidden absolute bottom-0 z-30 left-0 800px:left-[25%] right-0 py-2  bg-neutral-500">
            <form className="w-[95%] 800px:w-[70%] relative">
              <input
                type="text"
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter new message"
                className=" w-full px-2 rounded-lg h-[42px] text-white font-600 bg-transparent outline-none focus:border-transparent border-none"
              />
              <AiOutlineSend
                size={28}
                color="white"
                className={`${
                  text !== ""
                    ? "absolute right-2 top-2 cursor-pointer"
                    : "hidden"
                }`}
                onClick={handleChat}
              />
            </form>
          </div>
    </>  ) : (
        <div className="h-screen ml-[26%] w-[75%] bg-neutral-100">
          <div className="w-full h-[70px] items-center justify-between flex bg-blue-500">
            <AiOutlineArrowRight
              size={28}
              color="black"
              className="mx-2 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <AiOutlineArrowRight
              size={28}
              color="black"
              className="mx-2 cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
          <div className=" px-2 mt-1">
            <h2>Chat Area</h2>
          </div>
        </div>
      )}
    </>
  );
};
export default MessageLayout;
