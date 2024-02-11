import React, { useState, useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { ServerUrl, SocketId, Server } from "../../server.tsx";
import { io } from "socket.io-client";
import axios from "axios";
const socket = io(SocketId, { transports: ["websocket"] });
const SideBar = ({
  conversations,
  setOpen,
  me,
  users,
  open,
  setConversation,
  active,
  navigate,
  setActive,
  onlineUsers,
}) => {
  const otherUsers = users?.filter((members) => members?._id !== me);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [deletedId, setDeletedId] = useState(null);

  useEffect(() => {
    if (query !== "") {
      const res = users?.filter((user) =>
        user?.name.toLowerCase().includes(query.toLowerCase())
      );
      setResult(res);
    } else {
      setResult(null);
    }
  }, [query]);
  const res = result?.filter((users) => users._id !== me);

  useEffect(() => {
    socket.on("message-deleted", (data) => {
      setDeletedId(data.conversationId);
    });
  }, []);

  return (
    <>
      {result && (
        <div className="absolute top-[28%] py-2 px-2 z-30 h-[50vh] w-[25%] bg-neutral-900">
          {res?.map((user, index) => {
            const online = onlineUsers.find(
              (member) => member.userId === user._id
            );
            const createConversation = async (receiver) => {
              try {
                const groupTitle = me + receiver._id;
                const senderId = me;
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
                      Authorization: `${localStorage.getItem("user-auth")}`,
                    },
                  }
                );
                const { conversation } = response.data;
                setOpen(true);
                setConversation(conversation);
                setActive(null);
              } catch (error) {
                alert("something went wrong");
                console.log(error);
              }
            };
            return (
              <div
                key={index}
                className="cursor-pointer flex items-center my-1.5"
                onClick={() => createConversation(user)}
              >
                {user?.avatar ? (
                  <div className="justify-center relative flex items-center border-gray-400 border-[1.7px] w-[45px] h-[45px] rounded-full mx-2 bg-neutral-500">
                    <img
                      src={`${user?.avatar}`}
                      alt=""
                      className="w-full h-full rounded-full"
                    />
                    <div
                      className={
                        online
                          ? "w-[12px] h-[12px] rounded-full absolute bottom-1.5 right-0 bg-green-500"
                          : null
                      }
                    ></div>
                  </div>
                ) : (
                  <div className="justify-center relative flex border-gray-400 border-[1.7px] items-center w-[45px] h-[45px] rounded-full mx-2 bg-neutral-500">
                    {user.name[0]}
                    <div
                      className={
                        online
                          ? "w-[12px] h-[12px] rounded-full absolute bottom-1.5 right-0 bg-green-500"
                          : null
                      }
                    ></div>
                  </div>
                )}

                <h2 className="text-white">{user.name}</h2>
              </div>
            );
          })}
        </div>
      )}

      <div
        className={`${
          open === true
            ? "hidden 800px:w-[25%] 800px:block sidebar h-screen px-2 fixed bg-neutral-900"
            : "sidebar h-screen 800px:w-[25%] w-full bg-neutral-900 px-2 fixed   800px:block"
        }`}
      >
        <div className="flex justify-between items-center w-full">
          <h2 className="text-white text-2xl">Chats</h2>
          <AiOutlineArrowRight
            size={28}
            color="white"
            className=" 800px:hidden cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex flex-row  overflow-x-scroll sidebar my-4 border-b border-gray-300">
          {otherUsers?.map((user, index) => {
            const online = onlineUsers?.find(
              (member) => member.userId === user._id
            );
            const createConversation = async (receiver) => {
              try {
                const groupTitle = me + receiver._id;
                const senderId = me;
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
                      Authorization: `${localStorage.getItem("user-auth")}`,
                    },
                  }
                );
                const { conversation } = response.data;
                setOpen(true);
                setConversation(conversation);
                setActive(null);
              } catch (error) {
                alert("something went wrong");
                console.log(error);
              }
            };

            return (
              <div
                key={index}
                className="mx-1.5 flex flex-col text-start"
                onClick={() => createConversation(user)}
              >
                {user?.avatar ? (
                  <div className="w-[50px] h-[50px] flex justify-center border-[1.8px] border-gray-400 items-center relative bg-neutral-400 rounded-full cursor-pointer">
                    <img
                      src={`${user?.avatar}`}
                      alt=""
                      className="w-full h-full rounded-full"
                    />

                    <div
                      className={
                        online
                          ? "w-[11px] h-[11px] absolute bottom-1.5 right-0 rounded-full bg-green-500"
                          : null
                      }
                    ></div>
                  </div>
                ) : (
                  <div className="w-[50px] h-[50px] flex justify-center items-center  border-[1.8px] border-gray-400 relative bg-neutral-400 rounded-full cursor-pointer">
                    <h2 className="text-black text-xl">{user.name[0]}</h2>

                    <div
                      className={
                        online
                          ? "w-[11px] h-[11px] absolute bottom-1.5 right-0 rounded-full bg-green-500"
                          : null
                      }
                    ></div>
                  </div>
                )}

                <div className="ml-1">
                  <p className="text-white text-[12px]">{user?.username}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-2 my-2 hidden 800px:block">
          <div>
            <input
              type="search"
              name="search"
              id=""
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search or start conversation"
              className="outline-none border-b w-full h-[40px] bg-transparent"
              style={{ color: "white" }}
            />
          </div>
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
          const [incoming, setIncoming] = useState(false);
          useEffect(() => {
            socket.on("getLastMessage", (data) => {
              data?.conversationId === conversation._id
                ? setLastMessage(data?.lastMessage) ||
                  setLastMessageId(data?.lastMessageId) ||
                  setIncoming(true)
                : null;
            });
          }, []);
          const con = conversation._id === deletedId;

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
                  {receiver?.avatar ? (
                    <div className="w-[50px] h-[50px] flex rounded-full border-gray-400 border-[1.7px] rela tive bg-gray-500 justify-center items-center">
                      <img
                        src={`${receiver?.avatar}`}
                        alt=""
                        className="w-full h-full rounded-full"
                      />

                      <div
                        className={
                          online
                            ? "w-[12px] h-[12px] rounded-full bg-green-600 absolute bottom-2 left-[38px]"
                            : null
                        }
                      ></div>
                    </div>
                  ) : (
                    <div className="w-[50px] h-[50px] flex rounded-full border-gray-400 border-[1.7px] relative bg-gray-500 justify-center items-center">
                      <h3 className="text-xl text-black text-center">
                        {receiver?.name[0]}
                      </h3>
                      <div
                        className={
                          online
                            ? "w-[12px] h-[12px] rounded-full bg-green-600 absolute bottom-2 left-[38px]"
                            : null
                        }
                      ></div>
                    </div>
                  )}

                  {lastMessageId === me ? (
                    <div className="block ml-1">
                      <p className="text-white text-[14px]">{receiver.name}</p>
                      <div className="flex">
                        {(conversation?.deleted !== true && !con) ||
                        incoming === true ? (
                          <p className="text-center text-neutral-400 text-[14px]">
                            You:{" "}
                            {lastMessage?.length > 13
                              ? lastMessage.slice(0, 13) + "..."
                              : lastMessage}
                          </p>
                        ) : (
                          <p className="text-center italic text-neutral-400 text-[12px]">
                            You deleted this message
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="block ml-1 text-start">
                      <p className="text-white text-[14px]">{receiver.name}</p>
                      {(conversation?.deleted !== true && !con) ||
                      incoming === true ? (
                        <p className=" text-neutral-400 text-[14px] ">
                          {lastMessage?.length > 13
                            ? lastMessage.slice(0, 13) + "..."
                            : lastMessage}
                        </p>
                      ) : (
                        <p className=" text-neutral-400 italic text-[12px] ">
                          This message was deleted
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-start cursor-pointer">
                  {receiver?.avatar ? (
                    <div className="w-[50px] h-[50px] flex border-gray-400 border-[1.7px] rounded-full relative bg-slate-300 justify-center items-center">
                      <img
                        src={`${receiver?.avatar}`}
                        alt=""
                        className="w-full h-full rounded-full"
                      />

                      <div
                        className={
                          online
                            ? "w-[12px] h-[12px] rounded-full bg-green-600 absolute bottom-2 left-[38px]"
                            : null
                        }
                      ></div>
                    </div>
                  ) : (
                    <div className="w-[50px] h-[50px] flex rounded-full border-gray-400 border-[1.7px] relative bg-slate-300 justify-center items-center">
                      <h3 className="text-xl text-black text-center">
                        {receiver?.name[0]}
                      </h3>
                      <div
                        className={
                          online
                            ? "w-[12px] h-[12px] rounded-full bg-green-600 absolute bottom-2 left-[38px]"
                            : null
                        }
                      ></div>
                    </div>
                  )}

                  {lastMessageId === me ? (
                    <div className="block ml-1">
                      <p className="text-white text-[14px]">{receiver?.name}</p>
                      <div className="flex">
                        {(conversation?.deleted !== true && !con) ||
                        incoming === true ? (
                          <p className="text-center text-neutral-400 text-[14px]">
                            You:{" "}
                            {lastMessage?.length > 13
                              ? lastMessage.slice(0, 13) + "..."
                              : lastMessage}
                          </p>
                        ) : (
                          <p className="text-center italic text-neutral-400 text-[12px]">
                            You deleted this message
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="block ml-1 text-start">
                      <p className="text-white text-[14px]">{receiver?.name}</p>
                      {(conversation?.deleted !== true && !con) ||
                      incoming === true ? (
                        <p className=" text-neutral-400 text-[14px] ">
                          {lastMessage?.length > 13
                            ? lastMessage.slice(0, 13) + "..."
                            : lastMessage}
                        </p>
                      ) : (
                        <p className=" text-neutral-400 italic text-[12px] ">
                          This message was deleted
                        </p>
                      )}
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

export default SideBar;
