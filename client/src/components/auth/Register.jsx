import React,{useState} from "react";
import { AiOutlineEye,AiOutlineEyeInvisible } from "react-icons/ai";
import {useNavigate,Link} from 'react-router-dom'
import axios from "axios"
import {toast} from "react-toastify"
import {ServerUrl} from "../../server.tsx"
function Register() {
    const [visible,setVisible] = useState(false)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [username,setUserName] = useState('')
    const [password,setPassword] = useState('')
    const [confirmpass,setConfirmPass] = useState('')
    const navigate = useNavigate()

    const handleSubmit =async () =>{
      try {
        if(password !==confirmpass || password.length < 4 ){
          toast.error('password must match and must be at least 4 char')
          return
      }else{
      const res = await axios.post(`${ServerUrl}/v1/auth/register`,{
        name:name,email:email,username:username,password:password
      })
      toast.success(res.data.message)
      navigate('/login')
    }
      } catch (error) {
        console.log(error)
      }
      
    }
  return (
    <>
      <div className="flex justify-center items-center px-2 800px:px-5 h-screen w-full bg-slate-100">
        <div
          className="w-full 800px:w-[35%] px-2 flex flex-col bg-white py-4"
        >
          <div className="mt-2">
            <h2 className="text-2xl text-black text-center">
              Create New Account
            </h2>
          </div>
          <div className="flex flex-col">
            <label htmlFor="name">Enter Full Name</label>
            <input
              type="text"
              name="name"
              id=""
              placeholder="Enter full names"
              required
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="border w-full px-3 my-3 border-black h-[45px] rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username">Enter Your Username</label>
            <input
              type="text"
              name="username"
              id=""
              value={username}
              onChange={(e)=>setUserName(e.target.value)}
              placeholder="Enter user name"
              required
              className="border w-full px-3 my-3 border-black h-[45px] rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Enter Your Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              id=""
              placeholder="Enter your email"
              required
              className="border w-full px-3 my-3 border-black h-[45px] rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <div>
            <label htmlFor="password">Enter Password</label>
            </div>
            <div className="relative">
            <input
              type={`${visible === true ? 'text' : 'password'}`}
              placeholder="Enter password"
              name="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              id=""
              required
              className="border w-full px-3 my-3 border-black h-[45px] rounded-lg"
            />
            <div className="absolute right-2 top-5 cursor-pointer">
                {
                    visible === true ? (
                        <AiOutlineEyeInvisible size={30} color="black" onClick={()=>setVisible(false)} />
                    ):(
                        <AiOutlineEye size={30} color="black" onClick={()=>setVisible(true)} />
                    )
                }
              
            </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div>
            <label htmlFor="password">Confirm Password</label>
            </div>
            <div className="relative">
            <input
              type={`${visible === true ? 'text' : 'password'}`}
              placeholder="Confirm your password"
              value={confirmpass}
              onChange={(e)=>setConfirmPass(e.target.value)}
              name="confirm-password"
              id=""
              required
              className="border w-full px-3 my-3 border-black h-[45px] rounded-lg"
            />
            <div className="absolute right-2 top-5 cursor-pointer">
                {
                    visible === true ? (
                        <AiOutlineEyeInvisible size={30} color="black" onClick={()=>setVisible(false)} />
                    ):(
                        <AiOutlineEye size={30} color="black" onClick={()=>setVisible(true)} />
                    )
                }
              
            </div>
            </div>
          </div>
          <button type="submit" onClick={handleSubmit} className="p-2 bg-red-500 rounded-lg w-[30%] my-2 mx-2">
            <h2 className="text-xl text-white font-semibold text-center">Submit</h2>
          </button>
          <p>already have an account? <Link to="/login" className="text-blue-500">Login</Link></p> 
        </div>
      </div>
    </>
  );
}

export default Register;
