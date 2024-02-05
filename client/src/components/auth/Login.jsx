import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import {toast} from "react-toastify"
import {useSelector} from "react-redux"
const Login = () => {
  const {user} = useSelector((state)=>state.user)
  console.log('ldd',user);
  
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [visible, SetVisible] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (user?.user){
      navigate('/')
    }
  }, [user]);
  const handleLogin = async () => {
    if (password === "" || email === "") {
      return alert("please fill in all details");
    }
    try {
      const res = await axios.post("http://localhost:8081/api/v1/auth/login", {
        email,
        password
      });
      if(!res.data.success){
        return toast.error(res.data.message)
      }else{  
        const {token} = res.data;
      localStorage.setItem('user-auth',token)
      toast.success(res.data.message);
      navigate("/");
      }
      
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
    
  };
  return (
    <div className="h-screen py-4 w-full bg-neutral-200 px-2 ">
      <div className=" w-full h-screen flex justify-center items-center ">
        <form className="w-full 800px:w-[40%] mt-5 bg-white py-5 px-1">
          <h2 className="text-2xl text-black font-bold text-center">
            Welcome Back!
          </h2>
          <div className="mt-2 flex flex-col">
            <label htmlFor="email" className="text-[18px]">
              Input Email :
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-2 rounded-lg my-1 border-black h-[45px] placeholder-black"
              placeholder="Enter your email"
            />
          </div>
          <div className="my-2 flex flex-col relative">
            <label htmlFor="email" className="text-[18px]">
              Input Password :
            </label>
            <input
              type={`${visible ? "text" : "password"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              className="border px-2 rounded-lg my-1 placeholder-black border-black h-[45px]"
              placeholder="Enter your password"
            />
            {visible === true ? (
              <div
                className="absolute right-2 top-10"
                onClick={() => SetVisible(false)}
              >
                <AiOutlineEyeInvisible size={25} className="cursor-pointer" />
              </div>
            ) : (
              <div
                className="absolute right-2 top-10"
                onClick={() => SetVisible(true)}
              >
                <AiOutlineEye size={25} className="cursor-pointer" />
              </div>
            )}
          </div>
          <div
            className="my-2 p-2 bg-red-500 w-[90px] rounded-lg cursor-pointer"
            onClick={handleLogin}
          >
            <p className="text-white font-bold text-xl">Submit</p>
          </div>

          <div className="flex flex-col">
            <p className="my-2 cursor-pointer">forgot password?</p>
            <p>
              don't have account?{" "}
              <Link to="/" className="text-blue-600 font-semibold">
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
