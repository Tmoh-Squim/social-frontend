import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineCamera, AiOutlineArrowLeft } from "react-icons/ai";
import { toast } from "react-toastify";
import { ServerUrl, Server } from "../../server.tsx";
import axios from "axios";
const UserProfile = () => {
  const { users } = useSelector((state) => state.users?.users);
  const { user } = useSelector((state) => state.user?.user);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const member = users?.find((user) => user._id === id);
  const [avatar, setAvatar] = useState(member?.avatar);
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

  const handleProfilePicture = async (e) => {
    try {
      const file = e.target.files[0];
      setAvatar(file);

      const formData = new FormData();

      formData.append("avatar", e.target.files[0]);

      if (e.target.value !== "") {
        const res = await axios.put(
          `${ServerUrl}/v1/auth/profile/${me}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${localStorage.getItem("user-auth")}`,
            },
          }
        );
        if (res.data.success) {
          setAvatar(res.data.prof.avatar);
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } else {
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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
            {avatar ? (
              <div className="w-[120px] h-[120px] border-green-500 border-[2px] rounded-full relative mt-1 justify-center items-center flex bg-contain bg-neutral-400">
                <img
                  src={`${member?.avatar}`}
                  alt=""
                  className="w-full h-full rounded-full"
                />
                {id === me && (
                  <>
                    <div className="absolute bottom-2 800px:right-1 right-0 cursor-pointer 800px:w-[30px] 800px:h-[30px] w-[40px] h-[40px] rounded-full flex justify-center items-center p-1 bg-black">
                      <label htmlFor="avatar">
                        {" "}
                        <AiOutlineCamera
                          size={25}
                          color="white"
                          className="cursor-pointer"
                        />{" "}
                      </label>
                    </div>
                    <input
                      type="file"
                      name="avatar"
                      className="hidden"
                      id="avatar"
                      onChange={(e) => handleProfilePicture(e)}
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="w-[120px] h-[120px] border-green-500 border-[2px] rounded-full relative mt-1 justify-center items-center flex bg-neutral-400">
                <h1 className="text-2xl text-black">{member?.name[0]}</h1>
                {id === me && (
                  <>
                    <div className="absolute bottom-2 800px:right-1 right-0 cursor-pointer 800px:w-[30px] 800px:h-[30px] w-[40px] h-[40px] rounded-full flex justify-center items-center p-1 bg-black">
                      <label htmlFor="avatar">
                        {" "}
                        <AiOutlineCamera
                          size={25}
                          color="white"
                          className="cursor-pointer"
                        />{" "}
                      </label>
                    </div>
                    <input
                      type="file"
                      name="avatar"
                      className="hidden"
                      id="avatar"
                      onChange={(e) => handleProfilePicture(e)}
                    />
                  </>
                )}
              </div>
            )}
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

              <div
                className="mt-2 bg-neutral-500 py-1.5 w-[95%] cursor-pointer mx-auto 800px:mx-0 800px:w-[40%] px-6 rounded-md justify-center items-center flex "
                onClick={() => navigate(`/profile-change-password/${member._id}`)}
              >
                <h2 className="text-white font-semibold">Change Password</h2>
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
  const [phone, setPhone] = useState(member?.phone);
  const [email, setEmail] = useState(member?.email);
  const [name, setName] = useState(member?.name);
  const [username, setUsername] = useState(member?.username);

  return (
    <div className="px-2 bg-neutral-900 py-2 absolute h-screen overflow-y-scroll top-0 left-0 right-0 w-full z-30 block 800px:flex 800px:px-6 800px:items-center ">
      <div className="800px:w-[50% mb-[3rem] 800px:bm-0">
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

          {member?.avatar ? (
            <div className="w-[140px] h-[140px] relative border-[2px] border-green-500 bg-neutral-500 justify-center items-center flex rounded-full mt-4">
              <img
                src={`${member?.avatar}`}
                alt=""
                className="w-full h-full rounded-full"
              />
              <div className="absolute bottom-2 800px:right-1 border-[1px] border-slate-200 right-0 cursor-pointer 800px:w-[30px] 800px:h-[30px] w-[40px] h-[40px] rounded-full flex justify-center items-center p-1 bg-black">
                      <label htmlFor="avatar">
                        {" "}
                        <AiOutlineCamera
                          size={25}
                          color="white"
                          className="cursor-pointer"
                        />{" "}
                      </label>
                    </div>
            </div>
          ) : (
            <div className="w-[140px] border-[2px] border-green-500 relative h-[140px] bg-neutral-500 justify-center items-center flex rounded-full mt-4">
              <h2 className="text-black text-3xl font-semibold">
                {member.name[0]}
              </h2>
              <div className="absolute bottom-2 800px:right-1 border-[1px] border-slate-200 right-0 cursor-pointer 800px:w-[30px] 800px:h-[30px] w-[40px] h-[40px] rounded-full flex justify-center items-center p-1 bg-black">
                      <label htmlFor="avatar">
                        {" "}
                        <AiOutlineCamera
                          size={25}
                          color="white"
                          className="cursor-pointer"
                        />{" "}
                      </label>
                    </div>
            </div>
          )}
        </div>
        <h2 className="text-white text-2xl text-center mt-6 800px:text-start">
          Personal Details
        </h2>
        <form className="mt-2">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-white">
              Full name :
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[40px] w-full pl-4 font-semibold text-black outline-none 800px:w-[80%] rounded-lg"
            />
          </div>
          <div className="my-2 flex flex-col">
            <label htmlFor="email" className="text-white">
              Email address :
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="h-[40px] w-full pl-4 font-semibold text-black outline-none 800px:w-[80%] rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="text-white">
              Username :
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-[40px] w-full pl-4 font-semibold text-black outline-none 800px:w-[80%] rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-white">
              Phone number :
            </label>
            <input
              type="number"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-[40px] w-full pl-4 font-semibold text-black outline-none 800px:w-[80%] rounded-lg"
            />
          </div>

          <div className="bg-[tomato] px-4 py-2 rounded-lg my-3 w-max cursor-pointer">
            <h1 className="text-white text-xl font-semibold">Update</h1>
          </div>
        </form>
      </div>
     
    </div>
  );
};

export default UserProfile;
