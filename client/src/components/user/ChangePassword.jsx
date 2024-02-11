import React,{useState} from "react";
import axios from "axios"
import {toast} from "react-toastify"
import {ServerUrl} from "../../server.tsx"
import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
const ChangePassword = () => {
    const [pass, setPass] = useState("");
    const [password, setPassword] = useState("");
    const [oldPass, setOldPass] = useState("");
    const id = useParams()
    const handleSubmit = async()=>{
      try {
        if(pass !== password){
          return toast.error("New password doesn't match")
        }
        const response = await axios.put(`${ServerUrl}/v1/auth/update-password/${id}`,{
          password:oldPass,
          newPassword:password
        })
        if(response.data.success){
          toast.success(response.data.message)
        }else{
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error("Something went wrong")
      }
    }

  return      <div className="px-2 bg-neutral-900 py-2 h-screen overflow-y-scroll sidebar w-full  flex justify-center items-center ">
  <div className="800px:px-3 my-2 800px:w-[50%] w-full">
  <h1 className="text-white text-2xl font-semibold text-center">Change Password</h1>

  <form className="mt-2 bg-black rounded-md px-2 py-8 w-full">
    <div className="my-2 flex flex-col">
      <label htmlFor="password" className="text-white">
        Enter new password :
      </label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-[40px] w-full pl-4 font-semibold text-black outline-none 800px:w-[80%] rounded-lg"
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="pass" className="text-white">
        Confirm new password :
      </label>
      <input
        type="password"
        name="pass"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className="h-[40px] w-full pl-4 font-semibold text-black outline-none 800px:w-[80%] rounded-lg"
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="old-pass" className="text-white">
        Enter old password :
      </label>
      <input
        type="password"
        name="old-pass"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
        className="h-[40px] w-full pl-4 font-semibold text-black outline-none 800px:w-[80%] rounded-lg"
      />
    </div>

    <div className="bg-[tomato] px-4 py-2 rounded-lg mt-3 w-max cursor-pointer" onClick={handleSubmit}>
      <h1 className="text-white text-xl font-semibold">Update</h1>
    </div>
  </form>
</div>
</div>
};

export default ChangePassword;
