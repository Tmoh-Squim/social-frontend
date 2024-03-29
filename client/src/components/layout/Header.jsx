import React from "react";
import {
  AiOutlineUser,
  AiOutlineMessage,
  AiOutlineBars,
  AiOutlineSearch,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {Server} from "../../server.tsx"
const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user?.user);
  return (
    <>
      <div className="bg-blue-400 w-full justify-center items-center flex py-3 px-2">
        <div className="w-[30%] 800px:w-[60%] relative flex items-center">
          <AiOutlineBars
            size={30}
            color="black"
            className="cursor-pointer mt-2 w-[10%]"
          />
          <input
            type="search"
            name="search"
            placeholder="Search..."
            className="rounded-lg h-[45px] hidden 800px:block outline-none mx-2 w-[90%] px-3"
          />
          <AiOutlineSearch
            size={30}
            color="black"
            className="mx-2 absolute hidden 800px:block right-2 top-2"
          />
        </div>
        <div className="flex justify-end items-center w-[70%] 800px:w-[40%]">
          <AiOutlineMessage
            size={30}
            className="cursor-pointer mx-2"
            color="black"
            onClick={() => navigate("/conversations")}
          />
          <AiOutlineSearch
            size={30}
            color="black"
            className="mx-2 cursor-pointer 800px:hidden"
          />
          {user ? (<>
          {
            user?.avatar ? (
              <div
              className="800px:w-[40px] relative 800px:h-[40px] cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center bg-neutral-500"
              onClick={() => navigate(`/profile/${user?._id}`)}
            >
              <img src={`${user?.avatar}`} alt="" className="w-full h-full rounded-full" />
              <div className="w-[12px] h-[12px] bg-green-500 border-[1.8px] border-black absolute bottom-1 right-0 rounded-full"></div>
            </div>
            ):(
              <div
              className="800px:w-[40px] relative 800px:h-[40px] cursor-pointer w-[45px] h-[45px] rounded-full flex justify-center items-center bg-neutral-500"
              onClick={() => navigate(`/profile/${user?._id}`)}
            >
              <h1 className="text-white">{user?.name[0]}</h1>
              <div className="w-[12px] h-[12px] bg-green-500 border-[1.8px] border-black absolute bottom-1 right-0 rounded-full"></div>
            </div>
            )
          }
            
         </> ) : (
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
