import React from "react";
import {
  AiOutlineUser,
  AiOutlineMessage,
  AiOutlineBars,
  AiOutlineSearch,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user?.user);
  return (
    <>
      <div className="bg-blue-400 w-full justify-center items-center flex py-3 px-2">
        <div className="w-[60%] relative flex">
          <AiOutlineBars
            size={30}
            color="black"
            className="cursor-pointer mt-2 w-[10%]"
          />
          <input
            type="search"
            name="search"
            placeholder="Search..."
            className="rounded-lg h-[45px] outline-none mx-2 w-[90%] px-3"
          />
          <AiOutlineSearch
            size={30}
            color="black"
            className="mx-2 absolute right-2 top-2"
          />
        </div>
        <div className="flex justify-end w-[40%]">
          <AiOutlineMessage
            size={30}
            className="cursor-pointer mx-2"
            color="black"
            onClick={() => navigate("/conversations")}
          />
          <AiOutlineSearch
            size={30}
            color="black"
            className="mx-2 cursor-pointer"
          />
          {user ? (
            <div
              className="800px:w-[40px] relative 800px:h-[40px] cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center bg-neutral-500"
              onClick={() => navigate(`/profile/${user?._id}`)}
            >
              <h1 className="text-white">{user?.name[0]}</h1>
              <div className="w-[12px] h-[12px] bg-green-500 absolute bottom-1 right-0 rounded-full"></div>
            </div>
          ) : (
            <AiOutlineUser
              size={30}
              color="black"
              className="cursor-pointer mx-2"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
