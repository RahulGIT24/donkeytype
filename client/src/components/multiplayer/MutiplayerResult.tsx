import React, { useState } from "react";
import MainNav from "../navbars/MainNav";
import { useSelector } from "react-redux";
import { UserCard } from "../../pages/UserDetails";

export default function MultiplayerResult() {
  const [recievedResult, setRecievedResult] = useState(null);
  const multiplayerinfo = useSelector((state: any) => state.multiplayer);//later combining it in a user result object wiht the result
  const user = useSelector((state: any) => state.user.user);
  console.log(user);
  return (
    <>
      <MainNav />
      <div className=" flex justify-center items-center w-full h-full absolute text-white overflow-hidden">
        <div className="flex flex-1 justify-center items-center h-full gap-10">
          {/*
            
           */}
          <ResultCard multiplayerinfo={user} />
          <hr className="w-screen fixed  rotate-90 border-none bg-yellow-500 h-[2px]" />
         {! recievedResult? <ResultCard multiplayerinfo={multiplayerinfo} />: <p>Opponent still</p>}
        </div>
      </div>
    </>
  );
}



const ResultCard = ({ multiplayerinfo }: any) => {
  

  return (
    <>
      <div className="flex flex-col gap-5 bg-red-500 m-5 p-4">
        <UserCard user={multiplayerinfo} />
        <div className="flex m-2 flex-wrap gap-2">
        {multiplayerinfo.stats?multiplayerinfo.stats.map((stat:any)=>{
         return  <Stat stat={stat}/>
        }):null}
        
         </div>
      </div>
    </>
  );
};

const Stat= ({ stat }:any) => {
  return (
    <>
      <div className="flex bg-zinc-800 flex-col rounded-md p-10 justify-center items-center gap-4">
        <h1 className="text-3xl text-yellow-400">ytdfjhgkjhl</h1>

        <p className="text-xl">45678</p>
      </div>
    </>
  );
};
