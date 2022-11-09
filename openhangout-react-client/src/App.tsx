
import { Navigate, redirect, Route, Router, RouterProvider, Routes, useNavigate } from 'react-router';
import './App.css';
import SendIcon from './assets/Send.png'
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import useAuth from './hooks/auth';
import LoginPage from './LoginPage';
import {user, room} from './types';
import { Link } from 'react-router-dom';
import { HOST, WS_URL } from './config';


/**
 * Log every useeffect to know if the response come or not
 */




let Room = ({room,onClick, currRoom}: {room: room, onClick: ()=>void, currRoom: room})=>{
  return (
          <div onClick={onClick} className={"bg-gray-200 p-4 bg-opacity-20 hover:border-l-4 border-blue-400 text-white text-start hover:bg-opacity-40 cursor-pointer"+" "+((currRoom?.id===room?.id)?"bg-opacity-40":"")}>
            <div className='text-lg font-bold'>{room?.name??""}</div>
            <small className='text-xs'>this is a message</small>
          </div>
  )
}

let Message = ({children,timestamp,author,end, id}: {children: ReactNode, timestamp: string, author: string, end?: boolean, id: number})=>{
  return (
    <>
    { 
    (author === "SERVER") ? <div className='bg-gray-200 bg-opacity-20 p-1'>{children}</div>
    :

          <div  id={"msg_"+id} className={'flex  items-center m-4  '+" "+(end&&"justify-end")}>
            {!end && <div className='rounded-full bg-white bg-opacity-20 w-14 h-14 grid content-center text-2xl text-white m-4'>{author.charAt(0).toUpperCase()}</div>}

            <div className='px-4 p-2 text-white text-start'>
              <div className='bg-white bg-opacity-20 w-fit px-2 rounded-r-md rounded-tl-md'>{author}</div>
              <div className='msg_content w-60 break-words bg-white bg-opacity-20 p-2 mt-1'>
              {children}
              </div>
            <small className='text-xs  bg-opacity-40 rounded px-1 '>{timestamp}</small>

          </div>
          {
          end && <div className='rounded-full bg-white bg-opacity-20 w-14 h-14 grid content-center text-2xl text-white m-4'>
{author.charAt(0).toUpperCase()}
            </div>
            }
    </div>
    }
    </>
  )
}

type message = {author: string, content: string, timestamp?: string}

let ChatApp = ({user,logout,PK, axiosAuth}:{user: user,logout: ()=>void,PK: string, axiosAuth: any})=>{

  let [rooms, setRooms]: [room[],Dispatch<SetStateAction<room[]>>] = useState([] as room[]);
  let [typedMessage, setTypedMessage]: [string, Dispatch<SetStateAction<string>>] = useState("");
  let [ws,setWebSocket]: [WebSocket|null,Dispatch<SetStateAction<WebSocket|null>>] = useState(null as WebSocket|null);
  let [messages,setMessages]: [message[], Dispatch<SetStateAction<message[]>>] = useState([] as message[]);
  let [currRoom,setCurrRoom]: [room, Dispatch<SetStateAction<room>>] = useState(null as room);


  // whenever a user is set (ie authenticated)
  // we have to connect to the websocket server again
  useEffect(()=>{

  },[user]);



  useEffect(()=>{
    if(currRoom === null) return ;
    if(ws?.OPEN)
    {
      console.log("CLOSING CURRENT CONNECTION");
      ws.close();
    }
    console.log("WS:: OPENNING A NEW CONNECTION");
    
    navigate(currRoom?.id.toString()??"chat");
    

    let newWebSocket = new WebSocket(WS_URL+currRoom?.id);
    newWebSocket.onopen = ()=>{
      console.log("OPENED");
      console.log("SENDING PK",PK);
      newWebSocket.send(PK);
    }

    newWebSocket.onclose = ()=>console.log("WS::CLOSED");
    
 
    newWebSocket.onmessage = (msg)=>{

      let newMsg: message = {} as message;
      // console.log("MSG",msg);
      console.log("MSG Json",JSON.parse(msg.data));
      newMsg = JSON.parse(msg.data);
      
      console.log("SETTING NEW MESSAGES");

      
      setMessages(messages=>{
        console.log("current messages", messages);
        return [...messages,newMsg];
       });
    }

      setWebSocket(newWebSocket);

 },[currRoom])

 // setting the view to the last message
 useEffect(()=>{
      setViewToMessage(messages.length-1);
 },[messages])

 function setViewToMessage(msgNum: number){
      let lastMessage: HTMLElement | null = document.getElementById("msg_"+(msgNum))
      // console.log("setViewToLastMessage number",msgNum);
      // console.log("last message ",lastMessage);
      
      lastMessage?.scrollIntoView();
 }

  let dumpRooms = [
    {
      id: 1,
      name: "football room",
    } as room,
    {
      id: 2,
      name: "Dev Room",
    } as room,
    {
      id: 3,
      name: "General room",
    } as room
  ]

  useEffect(()=>{
    axiosAuth.get(HOST+"/rooms")
    .then((res:any)=>{
      console.log("ROOMS RESPONSE",res);
      let rooms:room[] = res.data;
      console.log("ROOMS FETCHED",rooms);
      
        setRooms(rooms);
    })
  },[])
  useEffect(()=>{
    console.log("first room",rooms[0]);
    if(rooms[0])
    setCurrRoom(rooms[0]);
  },[rooms])

  let navigate = useNavigate();
  useEffect(()=>{
    !user && navigate('/');
  })

  function handlleUserTyping(ev: any): void{
    setTypedMessage(ev.target.value);
  }

  function sendMessage(msg: string): void {
    console.log("sending msg with socket",ws);
    
    if(ws?.OPEN && (msg !== "")){
      ws.send(msg);
      setTypedMessage("");
    }
    else console.log("WEBSOCKET NOT OPEN");
    
  }


  return (

    <main className='flex h-[95%] overflow-hidden justify-center items-center'>
      {
        (rooms.length === 0) ? <div className=''>Fetching rooms ...</div> 
 
        :
      <>

      <section className=' flex flex-col justify-between w-[20%] h-full bg-gray-400 bg-opacity-20'>
        <div className=''>
        <input placeholder='filter' className='input mb-2 w-full ' />
        <div className=' text-start text-sm p-1'>Rooms</div>
        {
          rooms.map(room=><Room currRoom={currRoom} onClick={()=>setCurrRoom(room)} key={room?.id} room={room} />)
        }
        </div>
        <div className='text-4xl text-center bg-gray-200 p-2 bg-opacity-20 text-white hover:bg-opacity-40 cursor-pointer'>+</div>
      </section>
      <div className='w-full h-full flex flex-col justify-between'>
        <header className='w-full flex items-center justify-end p-2 border-b-2 border-blue-400'>
          <div className=' ml-0 mr-auto p-3' >Welcome <strong className='font-bold'>{user?.username} </strong> </div>
          <div className='btn mr-0 ml-auto' onClick={logout}>Logout</div>
        </header>
        <section className='overflow-y-scroll  scroller '>

            { 
            messages.map((msg,i)=>{
                console.log("MESSAGES TO BE RENDERED",messages);
                console.log("RENDERING ",msg);
                return <Message 
                key={i} 
                id={i} 
                end={(msg.author!==user?.username)} 
                timestamp={msg.timestamp??""} author={(msg.author===user?.username)?"you":msg.author}>
                  {msg.content}
                  </Message>
            }
              )
            }

        </section>
        <form className='flex w-[60%] px-2' onSubmit={(ev)=>{ev.preventDefault();sendMessage(typedMessage)}}>
          <input value={typedMessage} onChange={handlleUserTyping} className='input w-full' type="text" placeholder='type message' />
          <button type={"submit"}  className='btn h-full ml-2'><img className='' src={SendIcon} alt="" /></button>
        </form>
      </div>
      </>
      }
    </main>
  )
}







function App() {

  let {user,err,login, signup,logout,register,PK, axiosAuth, axiosUnAuth} = useAuth();

 


  let navigate = useNavigate();

    return (
    <div className="App">
      <div className='content h-screen min-h-[400px]'>
        <Routes>
          <Route element={<ChatApp PK={PK} logout={logout} user={user} axiosAuth = {axiosAuth} />} path='/chat/*' />
          <Route element={<LoginPage login={login} signup={signup} user={user} err={err} />} path='/' />
        </Routes>
      </div>
    </div>
  );
}

export default App;
