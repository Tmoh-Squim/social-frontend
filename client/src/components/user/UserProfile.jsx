import React from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineCamera, AiOutlineArrowLeft } from "react-icons/ai";

const UserProfile = () => {
  const { users } = useSelector((state) => state.users?.users);
  const { user } = useSelector((state) => state.user?.user);
  const { id } = useParams();
  const member = users?.find((user) => user._id === id);
  const navigate = useNavigate();
  const me = user?._id;

  return (
    <div className="bg-neutral-500 h-screen w-full">
      <div className="w-full bg-neutral-500 py-2 shadow-sm justify-center  items-center 800px:block">
        <div className="flex justify-between items-center border-b border-gray-400 px-2 py-1">
          <div className="flex">
            <AiOutlineArrowLeft
              size={26}
              color="white"
              className="cursor-pointer"
              onClick={() => navigate("/")}
            />
            <h2 className="text-white font-semibold ml-4 text-[18px]">
              {member?.name}
            </h2>
          </div>
          {id === me && (
            <div>
              <h1 className="text-blue-600 text-[18px]">Add Profile</h1>
            </div>
          )}
        </div>
        <div className="px-2">
          <div className="w-[120px] h-[120px] rounded-full relative mt-1 justify-center items-center flex bg-neutral-400">
            <h1 className="text-2xl text-black">{member?.name[0]}</h1>
            {id === me && (
              <div className="absolute bottom-2 800px:right-1 right-0 cursor-pointer 800px:w-[30px] 800px:h-[30px] w-[40px] h-[40px] rounded-full flex justify-center items-center p-1 bg-black">
                <AiOutlineCamera size={30} color="white" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-2">
        <h1 className="text-white text-2xl mt-2 font-semibold">
          {member?.name} ({member?.username})
        </h1>
      </div>
    </div>
  );
};

export default UserProfile;
