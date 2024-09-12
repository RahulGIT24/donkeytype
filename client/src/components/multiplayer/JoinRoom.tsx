// import MainNav from "../navbars/MainNav"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainNav from "../navbars/MainNav";
import { faDownLong } from "@fortawesome/free-solid-svg-icons";
import { useState,useEffect } from "react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io(import.meta.env.VITE_SERVER_API);
//import { useSocket } from "../../hooks/useSocket";
const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const navigate = useNavigate()
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on('User joined',handleJoinRoom)
    socket.on('error',handleError)
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off('User joined',handleJoinRoom);
      socket.on('error',handleError);
    };
  }, []);

  function handleError(message:string){
    toast.error(message)
    
  }
  function handleJoinRoom (message:string){ 
    toast.success(message)
    //navigate()
    //join room logic
  }
//console.log(import.meta.env.VITE_SERVER_API.slice(0,-13))
  const join_room = () => {
    socket.emit("join-room", roomId);
  };
  return (
    <>
      <MainNav />
      <main className="w-full flex justify-center items-center">
        <div className="mt-44 flex text-yellow-500 justify-center items-center">
          <p className="font-semibold text-4xl mx-4">Join room</p>
          
        </div>
      </main>
      <main className="flex justify-center items-center mt-20 text-yellow-500 flex-col">
        <input
          className="border border-yellow-500 p-4 rounded-xl flex felx-col justify-between items-center w-[30%] bg-transparent placeholder:text-yellow-400 outline-yellow-400"
          placeholder="Enter room id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button
          className="my-11 border border-yellow-500 p-4 rounded-full cursor-pointer hover:text-zinc-800 hover:bg-yellow-500 shadow-md shadow-black"
          onClick={join_room}
        >
          Join room
        </button>
      </main>
    </>
  );
};

export default JoinRoom;
