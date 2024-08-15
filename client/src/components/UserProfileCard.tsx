import React from "react";
import { useSelector } from "react-redux";

export default function UserProfileCard() {
const user = useSelector((state:any)=> state.user.user)
  return (

    <>
      <div className=" fixed w-80 h-96 bg-zinc-900 right-0 top-10 rounded-md p-2 text-slate-400">
        <div className="flex flex-col items-center border-2 border-yellow-400 h-full rounded-md p-1">
          <img
            src={user.profilePic}
            alt="loading "
            className="w-40 h-40 bg-white rounded-full"
          />
    <hr className="w-11/12 border-yellow-400 mt-3"/>
    <p className="">{user.userName}</p>
        </div>
      </div>
    </>
  );
}
