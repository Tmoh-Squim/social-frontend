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
  console.log('con',conversation);

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
          onlineUsers={onlineUsers}
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
  const otherUsers = users?.filter((members)=>members?._id !== me)
  
  return (
    <>
      <div
        className={`${
          open === true
            ? "hidden 800px:w-[25%] 800px:block sidebar h-screen px-2 fixed bg-neutral-500"
            : "sidebar h-screen 800px:w-[25%] w-full bg-neutral-500 px-2 fixed   800px:block"
        }`}
      >
        <div
          className="w-full items-end justify-end flex 800px:hidden cursor-pointer"
          onClick={() => navigate("/")}
        >
          <AiOutlineArrowRight size={28} color="black" />
        </div>
        <div className="flex flex-row px-1 overflow-x-scroll sidebar my-2">

{
  otherUsers?.map((user,index)=>{
    const online = onlineUsers?.find(
      (member) => member.userId === user._id
    );
     const createConversation = async (receiver) => {
    try {
      const groupTitle = user._id + receiver._id;
      const senderId = user?._id;
      const receiverId = receiver?._id;
      const response = await axios.post(
        `${ServerUrl}/v2/conversation/create-new-conversation`,
        {
          groupTitle: groupTitle,
          senderId: senderId,
          receiverId: receiverId,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem('user-auth')}`,
          },
        }
      );
      const {conversation}= response.data
              setOpen(true);
              setConversation(conversation);
              setActive(null);

    } catch (error) {
      alert("something went wrong");
      console.log(error);
    }
  };
  

    return(
      <div key={index} className="mx-1 flex flex-col text-start" onClick={()=>createConversation(user)}>
      <div className="w-[50px] h-[50px] flex justify-center items-center relative bg-neutral-400 rounded-full cursor-pointer">
      <h2 className="text-black text-xl">{user.name[0]}</h2>

      <div className={online ? 'w-[11px] h-[11px] absolute bottom-1.5 right-0 rounded-full bg-green-500' :null}></div>
      </div>
      <div>
        <p className="text-white text-[12px]">{user?.username}</p>
      </div>
      </div>
    )
  })
}
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
                  <div className="w-[50px] h-[50px] flex rounded-full relative bg-gray-500 justify-center items-center">
                    <h3 className="text-xl text-black text-center">
                      {receiver?.name[0]}
                    </h3>
                    <div
                      className={
                        online
                          ? "w-[12px] h-[12px] rounded-full bg-green-400 absolute bottom-2 left-[38px]"
                          : null
                      }
                    ></div>
                  </div>
                  {lastMessageId === me ? (
                    <div className="block ml-0.5">
                      <p className="text-white text-[14px]">{receiver.name}</p>
                      <div className="flex">
                        <p className="mx-1">You:</p>
                        <p className="text-center text-gray-700">
                          {lastMessage?.length > 13
                            ? lastMessage.slice(0, 13) + "..."
                            : lastMessage}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="block ml-0.5 text-start">
                      <p className="text-white text-[14px]">{receiver.name}</p>
                      <p className=" text-gray-700 ">
                        {lastMessage?.length > 13
                          ? lastMessage.slice(0, 13) + "..."
                          : lastMessage}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-start cursor-pointer">
                  <div className="w-[50px] h-[50px] flex rounded-full relative bg-gray-500 justify-center items-center">
                    <h3 className="text-xl text-black text-center">
                      {receiver?.name[0]}
                    </h3>
                    <div
                      className={
                        online
                          ? "w-[12px] h-[12px] rounded-full bg-green-400 absolute bottom-2 left-[38px]"
                          : null
                      }
                    ></div>
                  </div>
                  {lastMessageId === me ? (
                    <div className="block ml-0.5">
                      <p className="text-white text-[14px]">{receiver?.name}</p>
                      <div className="flex">
                        <p className="mx-1">You:</p>
                        <p className="text-center text-gray-700">
                          {lastMessage?.length > 13
                            ? lastMessage.slice(0, 13) + "..."
                            : lastMessage}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="block ml-0.5 text-start">
                      <p className="text-white text-[14px]">{receiver?.name}</p>
                      <p className=" text-gray-700 ">
                        {lastMessage?.length > 13
                          ? lastMessage.slice(0, 13) + "..."
                          : lastMessage}
                      </p>
                    </div>
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
  onlineUsers,
  navigate,
}) => {
  const id = conversation?._id;
  const [incoming, setIncoming] = useState(null);
  const [text, setText] = useState("");
  const [currentconversation, setCurrentConversation] = useState([]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setIncoming({
        sender: data.senderId,
        text: data.text,
        conversationId: data.conversationId,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    if (incoming?.conversationId === id) {
      setCurrentConversation((prev) => [...prev, incoming]);
    }

    //incoming &&
    //  conversation?.members.includes(incoming.sender) &&
    // setCurrentConversation((prev) => [...prev, incoming]);
  }, [incoming, conversation]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${ServerUrl}/v2/message/get-messages/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("user-auth")}`,
            },
          }
        );
        setCurrentConversation(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [conversation, id]);

  useEffect(() => {
    // Check if containerRef.current is not null before setting scrollTop
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentconversation]);
  const containerRef = useRef(null);

  const otherMember = conversation?.members?.find((member) => member != me);
  const online = onlineUsers?.find((user) => user.userId === otherMember);
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
      });
  };
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null); // Ref to the menu element
  const [deletedId,setDeletedId] = useState(null)
  // Function to handle click events outside of the menu
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      // Clicked outside the menu, so close it
      setMenu({});
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Remove event listener when the component unmounts
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  //handle menu i.e delete for everyone for me,react,reply
  const handleMenu = (id) => {
    setMenu((prevMenu) => ({
      ...prevMenu,
      [id]: !prevMenu[id], // Toggle the menu state for the clicked message
    }));
  };
  const handleDelete = async (id) => {
    try {
      socket.emit("delete-message",{id})
      const res = await axios
        .put(`${ServerUrl}/v2/message/delete-for-all/${id}`)
        .then(() => {
          handleClickOutside("click");
        });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    socket.on("message-deleted",(data)=>{
      setDeletedId(data)
      
    })
  }, []);
  
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
          // setCurrentConversation([...currentconversation, res.data.message]);
          updateLastMessage();
          setText("");
        });
    }
  };
  return (
    <>
      {open === true ? (
        <>
          <div
            className={`${
              open === true
                ? "h-screen sidebar 800px:ml-[25%] 800px:w-[75%] w-full 800px:fixed bg-neutral-100 justify-between  flex flex-col"
                : "h-screen sidebar 800px:ml-[25%] ml-[25%] 800px:w-[75%] w-[75%] 800px:fixed  bg-neutral-100 justify-between  flex flex-col"
            }`}
          >
            <div className="w-full bg-blue-500 px-2 justify-between py-2 items-center flex">
              <div className="bg-neutral-400 w-[50px] h-[50px] rounded-full relative justify-center">
                <h2 className="text-xl text-center font-bold text-green-600">
                  {receiver.name[0]}
                </h2>
                <div
                  className={
                    online
                      ? "w-[12px] h-[12px] rounded-full bg-green-500 absolute bottom-1.5 right-0"
                      : null
                  }
                ></div>
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
              className=" box 800px:px-1 h-[100vh] mb-[110px] 800px:mb-0 overflow-y-scroll overflow-x-hidden"
              ref={containerRef}
            >
              <div className="my-1 justify-between">
                {currentconversation &&
                  currentconversation.map((message, index) => {
                    const senderMessage = message.sender === me;
                    const messageId = message._id;

                    return (
                      <>
                        <div
                          key={index}
                          className={`px-2 w-full`}
                          onContextMenu={() => handleMenu(messageId)}
                        >
                          <div
                            className={`${
                              senderMessage ? "justify-end" : "justify-start"
                            } flex w-full my-1.5 `}
                          >
                            {message?.deletedForAll || message?._id === deletedId ? (
                              <>
                                {senderMessage ? (
                                  <p className="bg-neutral-500 rounded-[14px] italic w-max px-2 py-0.5 h-min no-select">
                                    <span className="text-red-500 w-[15px] h-[15px] rounded-full text-center">
                                      x
                                    </span>{" "}
                                    You deleted this message
                                  </p>
                                ) : (
                                  <p className="bg-neutral-500 rounded-[14px] italic w-max px-2 py-0.5 h-min no-select">
                                    <span className="text-red-500 w-[15px]  h-[15px] rounded-full text-center">
                                      x
                                    </span>{" "}
                                    This message was deleted
                                  </p>
                                )}
                              </>
                            ) : (
                              <>
                                {senderMessage ? (
                                  <div className="flex flex-col w-[75%] 800px:w-[65%] justify-end items-end">
                                    <p
                                      className="no-select bg-blue-500 px-2 800px:py-1.5 py-1  text-white font-500 text-[14px] 800px:text-[17px] rounded-[14px] h-min inline-block "
                                      style={{ maxWidth: "fit-content" }}
                                    >
                                      {message.text}
                                    </p>
                                    <p className="text-end no-select text-black">
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
                                      className="no-select bg-[#66c428f5] py-1 px-2 font-500px text-[14px] 800px:text-[17px] text-white rounded-[14px] h-min inline-block"
                                      style={{ maxWidth: "fit-content" }}
                                    >
                                      {message.text}
                                    </div>
                                    <p className="text-start no-select text-black">
                                      {format(
                                        message?.createdAt
                                          ? message.createdAt
                                          : null
                                      )}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/**menu popup */}
                        {menu[messageId] && message.deletedForAll ? (
                          <>
                            {menu[messageId] && (
                              <div
                                className="w-full bottom-0 left-0 right-0 absolute 800px:w-[35%] m-auto py-3 z-30 bg-neutral-500 flex flex-col rounded-t-xl"
                                ref={menuRef}
                              >
                                <div className="px-2 pt-2 flex flex-col">
                                  <div
                                    className="no-select flex mt-[2px] text-white cursor-pointer"
                                    onClick={() => handleDelete(messageId)}
                                  >
                                    <p>Delete for me</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {menu[messageId] && message.sender === me ? (
                              <>
                                {menu[messageId] && (
                                  <div
                                    className="w-full bottom-0 left-0 right-0 absolute 800px:w-[35%] m-auto py-4 z-30 bg-neutral-500 flex flex-col rounded-t-xl"
                                    ref={menuRef}
                                  >
                                    <div className="p-2 border-b border-gray-300 "></div>
                                    <div className="px-2 pt-2 flex flex-col">
                                      <div className="p-2 no-select flex text-white cursor-pointer">
                                        <p>Copy</p>
                                      </div>
                                      <div className="p-2 no-select flex mt-[2px] text-white cursor-pointer">
                                        <p>Forward</p>
                                      </div>
                                      <div className="p-2 no-select flex mt-[2px] text-white cursor-pointer">
                                        <p>Reply</p>
                                      </div>
                                      <div className="p-2 no-select flex mt-[2px] text-white cursor-pointer">
                                        <p>Report</p>
                                      </div>
                                      <div
                                        className="p-2 no-select flex mt-[2px] text-white cursor-pointer"
                                        onClick={() => handleDelete(messageId)}
                                      >
                                        <p>Delete for everyone</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                {menu[messageId] && (
                                  <div
                                    className="w-full bottom-0 left-0 right-0 absolute 800px:w-[35%] m-auto py-4 z-30 bg-neutral-500 flex flex-col rounded-t-xl"
                                    ref={menuRef}
                                  >
                                    <div className="p-2 border-b border-gray-300 "></div>
                                    <div className="px-2 pt-2 flex flex-col">
                                      <div className="p-2 flex text-white cursor-pointer">
                                        <p>Copy</p>
                                      </div>
                                      <div className="p-2 flex mt-[2px] text-white cursor-pointer">
                                        <p>Forward</p>
                                      </div>
                                      <div className="p-2 flex mt-[2px] text-white cursor-pointer">
                                        <p>Reply</p>
                                      </div>
                                      <div className="p-2 flex mt-[2px] text-white cursor-pointer">
                                        <p>Report</p>
                                      </div>
                                      <div
                                        className="p-2 flex mt-[2px] text-white cursor-pointer"
                                        onClick={() => handleDelete(messageId)}
                                      >
                                        <p>Delete for me</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    );
                  })}
              </div>
            </div>
            <div className="w-full 800px:flex items-center justify-center hidden 800px:left-[25%] right-0 py-2  bg-black">
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
          <div className="w-full flex items-center justify-center 800px:hidden absolute bottom-0 z-10 left-0 800px:left-[25%] right-0 py-1.5  bg-neutral-500">
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
        </>
      ) : (
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
