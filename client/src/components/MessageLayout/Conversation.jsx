import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineArrowRight,
  AiOutlinePhone,
  AiOutlineSend,
} from "react-icons/ai";
import { format } from "timeago.js";
import { ServerUrl, SocketId, Server } from "../../server.tsx";
import { io } from "socket.io-client";
import axios from "axios";
import {useSelector} from "react-redux"
import { getConversations } from "../../redux/conversation";
const socket = io(SocketId, { transports: ["websocket"] });
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
    const {user} = useSelector((state)=>state.user?.user)
    const [currentconversation, setCurrentConversation] = useState([])
    
  
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
      dispatch(getConversations(me))
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
    const [deletedId, setDeletedId] = useState(null);
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
    const handleDelete = async (id,index) => {
      try {
        const lastIndex = currentconversation?.length -1

        if(index === lastIndex){
            await axios.put(`${ServerUrl}/v2/conversation/delete-message/${conversation._id}`)
            socket.emit("delete-message", { id,conversationId:conversation?._id });
             await axios
              .put(`${ServerUrl}/v2/message/delete-for-all/${id}`)
              .then(() => {
                handleClickOutside("click");
              });
        }else{
            socket.emit("delete-message", { id,conversationId:conversation?._id });
             await axios
              .put(`${ServerUrl}/v2/message/delete-for-all/${id}`)
              .then(() => {
                handleClickOutside("click");
              });
        }
        
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      socket.on("message-deleted", (data) => {
        setDeletedId(data.id);
      });
    }, []);
  
    const handleProfile = (receiver) => {
      navigate(`/profile/${receiver?._id}`);
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
            setText("");
            // setCurrentConversation([...currentconversation, res.data.message]);
            updateLastMessage();
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
                  ? "h-screen sidebar 800px:ml-[25.1%] 800px:w-[75%] w-full 800px:fixed bg-neutral-100 justify-between  flex flex-col"
                  : "h-screen sidebar 800px:ml-[25.1%] ml-[25%] 800px:w-[75%] w-[75%] 800px:fixed  bg-neutral-100 justify-between  flex flex-col"
              }`}
            >
              <div className="w-full bg-blue-500 px-2 justify-between py-2 items-center flex">
                {receiver?.avatar ? (
                  <div
                    className="bg-neutral-400 w-[50px] h-[50px] border-gray-400 border-[1.7px] rounded-full relative justify-center cursor-pointer"
                    onClick={() => handleProfile(receiver)}
                  >
                    <img
                      src={`${receiver?.avatar}`}
                      alt=""
                      className="w-full h-full rounded-full"
                    />
                    <div
                      className={
                        online
                          ? "w-[12px] h-[12px] rounded-full bg-green-500 absolute bottom-1.5 right-0"
                          : null
                      }
                    ></div>
                  </div>
                ) : (
                  <>
                    {receiver?.avatar ? (
                      <div
                        className="bg-neutral-400 w-[50px] h-[50px] border-gray-400 border-[1.7px] rounded-full relative justify-center cursor-pointer"
                        onClick={() => handleProfile(receiver)}
                      >
                        <img
                          src={`${receiver?.avatar}`}
                          alt=""
                          className="w-full h-full rounded-full"
                        />
  
                        <div
                          className={
                            online
                              ? "w-[12px] h-[12px] rounded-full bg-green-500 absolute bottom-1.5 right-0"
                              : null
                          }
                        ></div>
                      </div>
                    ) : (
                      <div
                        className="bg-neutral-400 w-[50px] h-[50px] items-center flex rounded-full relative justify-center cursor-pointer"
                        onClick={() => handleProfile(receiver)}
                      >
                        <h2 className="text-xl text-center font-bold text-green-600">
                          {receiver?.name[0]}
                        </h2>
                        <div
                          className={
                            online
                              ? "w-[12px] h-[12px] rounded-full bg-green-500 absolute bottom-1.5 right-0"
                              : null
                          }
                        ></div>
                      </div>
                    )}
                  </>
                )}
  
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
                className=" box sidebar 800px:px-1 h-[100vh] mb-[110px] 800px:mb-0 overflow-y-scroll overflow-x-hidden"
                ref={containerRef}
              >
                <div className="my-1 justify-between">
                  {currentconversation &&
                    currentconversation.map((message, index) => {
                      const senderMessage = message?.sender === me;
                      const messageId = message?._id;
  
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
                              {message?.deletedForAll ||
                              message?._id === deletedId ? (
                                <>
                                  {senderMessage ? (
                                    <p className="bg-neutral-500 rounded-[12px] italic w-max px-2 py-0.5 h-min no-select">
                                      You deleted this message
                                      <span className="text-red-500 w-[15px] h-[15px] ml-1 rounded-full text-center">
                                        x
                                      </span>{" "}
                                    </p>
                                  ) : (
                                    <p className="bg-neutral-500 rounded-[12px] italic w-max px-2 py-0.5 h-min no-select">
                                      This message was deleted
                                      <span className="text-red-500 w-[15px] ml-1  h-[15px] rounded-full text-center">
                                        x
                                      </span>{" "}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <>
                                  {senderMessage ? (
                                    <div className="flex flex-col w-[75%] 800px:w-[65%] justify-end items-end">
                                      <p
                                        className="no-select bg-blue-500 px-3 800px:py-1.5 py-[3px]  text-white font-500 text-[14px] 800px:text-[17px] rounded-[14px] h-min inline-block "
                                        style={{ maxWidth: "fit-content" }}
                                      >
                                        {message?.text}
                                      </p>
                                      <p className="text-end no-select text-black">
                                        {format(
                                          message?.createdAt
                                            ? message?.createdAt
                                            : null
                                        )}
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col w-[75%] 800px:w-[65%]">
                                      <div
                                        className="no-select bg-[#66c428f5] py-[3px] px-3 font-500px text-[14px] 800px:text-[17px] text-white rounded-[14px] h-min inline-block"
                                        style={{ maxWidth: "fit-content" }}
                                      >
                                        {message.text}
                                      </div>
                                      <p className="text-start no-select text-black">
                                        {format(
                                          message?.createdAt
                                            ? message?.createdAt
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
                          {menu[messageId] && message?.deletedForAll ? (
                            <>
                              {menu[messageId] && (
                                <div
                                  className="w-full bottom-0 left-0 right-0 absolute 800px:w-[35%] m-auto py-3 z-30 bg-neutral-500 flex flex-col rounded-t-xl"
                                  ref={menuRef}
                                >
                                  <div className="px-2 pt-2 flex flex-col">
                                    <div
                                      className="no-select flex mt-[2px] text-white cursor-pointer"
                                      onClick={() => handleDelete(messageId,index)}
                                    >
                                      <p>Delete for me</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {menu[messageId] && message?.sender === me ? (
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
                                          onClick={() => handleDelete(messageId,index)}
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
              <div className="w-full 800px:flex items-center justify-center hidden 800px:left-[25%] right-0 py-2  bg-neutral-900">
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

export default Coversation;
