import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineCamera, AiOutlineArrowLeft } from "react-icons/ai";
import { toast } from "react-toastify";
import {ServerUrl,Server} from "../../server.tsx"
import axios from "axios"
const UserProfile = () => {
  const { users } = useSelector((state) => state.users?.users);
  const { user } = useSelector((state) => state.user?.user);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const member = users?.find((user) => user._id === id);
  const [avatar,setAvatar] = useState(member?.avatar)
  const navigate = useNavigate();
  const me = user?._id;

  const handleLogout = () => {
    try {
      localStorage.removeItem("user-auth");
      toast.success("Logged out successfully");
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleProfilePicture =async (e) =>{
    try {
        const file = e.target.files[0];
        setAvatar(file);
    
        const formData = new FormData();
    
        formData.append("avatar", e.target.files[0]);
        
        if(e.target.value !==""){
            const res = await axios.put(`${ServerUrl}/v1/auth/profile/${me}`,formData,{
                headers:{
                    "Content-Type":"multipart/form-data",
                    "Authorization":`${localStorage.getItem("user-auth")}`
                }
            })
            if(res.data.success){                
                setAvatar(res.data.prof.avatar)
                toast.success(res.data.message)
            }else{
                toast.error(res.data.message)
            }
            
        }else{
            return
        }
    } catch (error) {
        toast.error("Something went wrong")
    }
    
  }

  return (
    <>
      <div className="bg-neutral-900 h-screen w-full">
        <div className="w-full bg-neutral-800 py-2 shadow-sm justify-center  items-center 800px:block">
          <div className="flex justify-between items-center border-b shadow-md border-gray-400 px-2 py-1">
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
            {
                avatar ? (
                    <div className="w-[120px] h-[120px] border-green-500 border-[2px] rounded-full relative mt-1 justify-center items-center flex bg-contain bg-neutral-400">
                    <img src={`${Server}/${member?.avatar}`} alt="" className="w-full h-full rounded-full" />
                    {id === me && (<>            
                      <div className="absolute bottom-2 800px:right-1 right-0 cursor-pointer 800px:w-[30px] 800px:h-[30px] w-[40px] h-[40px] rounded-full flex justify-center items-center p-1 bg-black">
                       <label htmlFor="avatar"> <AiOutlineCamera size={25} color="white" className="cursor-pointer" /> </label>
                       
                      </div>
                       <input type="file" name="avatar" className="hidden" id="avatar" onChange={(e)=>handleProfilePicture(e)} />
                   </> )}
                  </div>
                ):(
                    <div className="w-[120px] h-[120px] border-green-500 border-[2px] rounded-full relative mt-1 justify-center items-center flex bg-neutral-400">
                    <h1 className="text-2xl text-black">{member?.name[0]}</h1>
                    {id === me && (<>            
                      <div className="absolute bottom-2 800px:right-1 right-0 cursor-pointer 800px:w-[30px] 800px:h-[30px] w-[40px] h-[40px] rounded-full flex justify-center items-center p-1 bg-black">
                       <label htmlFor="avatar"> <AiOutlineCamera size={25} color="white" className="cursor-pointer" /> </label>
                       
                      </div>
                       <input type="file" name="avatar" className="hidden" id="avatar" onChange={(e)=>handleProfilePicture(e)} />
                   </> )}
                  </div>
                )
            }
           
          </div>
          <div className="px-2">
            <h1 className="text-white text-2xl mt-2 font-semibold">
              {member?.name} ({member?.username})
            </h1>
          </div>
        </div>
        {member?._id === me && (
          <>
            <div className=" my-2 w-full 800px:px-2">
              <div className="bg-blue-500 rounded-md flex mx-auto cursor-pointer 800px:mx-0 justify-center py-1.5 px-6 w-[95%] 800px:w-[40%] items-center">
                <h2 className="text-white font-semibold">+ Add a post</h2>
              </div>

              <div
                className="mt-2 bg-neutral-500 py-1.5 w-[95%] cursor-pointer mx-auto 800px:mx-0 800px:w-[40%] px-6 rounded-md justify-center items-center flex "
                onClick={() => setOpen(true)}
              >
                <h2 className="text-white font-semibold">Edit profile</h2>
              </div>
            </div>
            <div className="px-3">
              <h1
                className="cursor-pointer text-white text-xl"
                onClick={handleLogout}
              >
                Logout
              </h1>
            </div>
          </>
        )}
      </div>
      {open === true ? <Profile member={member} setOpen={setOpen} /> : null}
    </>
  );
};

const Profile = ({ member, setOpen }) => {
  return (
    <div className="px-2 bg-neutral-900 py-2 absolute h-screen top-0 left-0 right-0 w-full z-30 ">
      <div className="flex items-center border-b py-2 border-gray-400">
        <AiOutlineArrowLeft
          size={25}
          color="white"
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
        <h1 className="ml-6 text-white font-semibold">Edit profile</h1>
      </div>
      <div className="flex flex-col justify-center 800px:justify-start 800px:items-start items-center mt-4">
        <div className="flex justify-between w-full items-center">
          <h1 className="ml-6 text-white font-semibold">Profile picture</h1>
          <h1 className="ml-6 text-blue-500 font-semibold cursor-pointer">
            Edit{" "}
          </h1>
        </div>

        <div className="w-[140px] h-[140px] bg-neutral-500 justify-center items-center flex rounded-full mt-4">
          <h2 className="text-black text-3xl font-semibold">
            {member.name[0]}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
