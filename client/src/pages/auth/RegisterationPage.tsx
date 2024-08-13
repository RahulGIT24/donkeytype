import React from "react";
import SignUp from "../../components/navbars/SignUp";
import Login from "../../components/navbars/Login";

export default function RegisterationPage() {
  return (
    <>
      <div className="flex text-zinc-400 justify-around ">
        <SignUp />
        <Login/>
      </div>
    </>
  );
}
