import React from "react";
import {AiOutlineUser,AiOutlineMessage,AiOutlineBars,AiOutlineSearch} from "react-icons/ai"
import { useNavigate } from "react-router-dom";
const Header = () => {
    const navigate = useNavigate()
  return <>
  <div className="bg-blue-400 w-full justify-center items-center flex h-[80px] px-2">
    <div className="w-[60%] relative flex">
        <AiOutlineBars size={30} color="black" className="cursor-pointer mt-2 w-[10%]" />
        <input type="search" name="search" placeholder="Search..." className="rounded-lg h-[45px] outline-none mx-2 w-[90%] px-3" />
        <AiOutlineSearch size={30} color="black" className="mx-2 absolute right-2 top-2" />
    </div>
    <div className="flex justify-end w-[40%]">
    <AiOutlineMessage size={30} className="cursor-pointer mx-2" color="black" onClick={()=>navigate("/conversations")} />
    <AiOutlineSearch size={30} color="black" className="mx-2 cursor-pointer" />
    <AiOutlineUser size={30} color="black" className="cursor-pointer mx-2" />
    </div>
  </div>
  </>
};

export default Header;
