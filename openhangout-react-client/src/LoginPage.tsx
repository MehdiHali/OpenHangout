import { useEffect, useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router";
import { user } from "./types";

let LoginPage = ({user, err, login, signup}:{
  user:user,
  err: string[],
  login: (username: string, password: string)=>void,
  signup: (username: string, password: string)=>void})=>{

  let [credentials,setCredentials] = useState({username: "", password: ""})

  let navigate = useNavigate();
  useEffect(()=>{
    user && navigate('/chat');
  })

  function handleLogin(){
    login(credentials.username,credentials.password);
  }
  function handleSignup(){
    signup(credentials.username, credentials.password);
  }

  function handlePasswordChange(ev: any){
    setCredentials((credentials)=>({...credentials,password: ev.target.value}))
  }
  function handleUsernameChange(ev: any){
    setCredentials((credentials)=>({...credentials,username: ev.target.value}))
  }
  

    return ( <main className='p-10 justify-around grid content-center h-screen'>
      <header className='text-4xl text-left p-8 uppercase text-gray-200 font-black'>Open Hangout</header>
        <div
        id="auth_form"
        className='flex flex-col space-y-2 items-start w-full mx-auto max-w-sm border-blue-400 p-8'>
          {
            err.map(error=><div className="bg-red-500 bg-opacity-40 w-full p-1">{error}</div>)
          }
          <input onChange={handleUsernameChange} className='input w-full' type="text"  placeholder='username' />
          <input onChange={handlePasswordChange} className='input w-full' type="password" placeholder='password' />
          <small className="bg-orange-400 bg-opacity-20">If you are new please click on signup and your account will be created immediately.</small>
          <div className='felx space-x-2'> 
            <button className='btn' onClick={handleLogin}>Login </button>
            <span className='text-white'></span>
            <button className='btn' onClick={handleSignup}>SignUp</button>
          </div>
        </div>
        </main>
        );
}

export default LoginPage;