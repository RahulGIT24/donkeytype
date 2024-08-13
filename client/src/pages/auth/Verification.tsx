import axios from "axios";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Verification() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  console.log(token)

  const handleClick = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_API}/users/verify`, { token });
      if(res.status<400){
        const {data} =res
        console.log('request successfull', data)
        navigate("/");
      }
      
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };
  return (
    <>
      <Link to={"/"}>
        <h1 className="m-4 text-4xl hover:text-yellow-400 duration-200">
          donkeytype
        </h1>
      </Link>
      <div className="fixed w-screen h-screen flex justify-center items-center">
        <div className="flex bg-neutral-900 w-96 justify-around  items-center h-64 p-4 rounded-md flex-col">
          <h1 className="text-3xl">
            <b>Verify</b>
          </h1>
          <button onClick={handleClick}>
            <p className=" p-4 border border-amber-300 hover:bg-yellow-500 hover:text-zinc-800 duration-200 rounded-sm hover:scale-105">
              click here to verify
            </p>
          </button>

          <Link to={"/"} className="hover:text-blue-600 duration-200">
            or go back
          </Link>
        </div>
      </div>
    </>
  );
}

