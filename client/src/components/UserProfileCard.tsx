import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { revertInitial } from "../redux/reducers/userSlice";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserProfileCard({ setShowProfile }: any) {
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  async function handleLogout() {
    try {
        setDisabled(true)
      const res = await axios(
        import.meta.env.VITE_SERVER_API + "/users/logout-user"
      );
      const { success } = res.data;
      if (success) {
        dispatch(revertInitial());
        setShowProfile(false);
        navigate('/login')
        setDisabled(false)
      }
    } catch (error:any) {setDisabled(false)
        setDisabled(false)
      console.log(error.response.data.data);
    }
  }

  return (
    <>
      <div className="fixed w-80 h-96 bg-zinc-900 right-5 top-10 rounded-lg shadow-lg p-4 text-slate-200 hover:bg-zinc-950 duration-300 ">
        <div className="flex flex-col items-center border border-yellow-300 h-full rounded-lg p-4  " >
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-32 h-32 bg-gray-100 rounded-full shadow-md"
          />
          <hr className="w-11/12 border-yellow-300 my-4" />
          <p className="text-2xl font-semibold">{user.username}</p>
          <div className="flex text-sm m-3">
            <p>Test completed:{user.testCompleted}</p>
          </div>
          <button
            className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-zinc-900 py-2 px-4 rounded-lg shadow transition-colors duration-200 w-24 h-13"
            onClick={handleLogout}
          >
           {disabled ? (
                <ThreeDots
                  visible={true}
                  height="25"
                  width="55"
                  color="black"
                  radius="9"
                  ariaLabel="three-dots-loading"
                />
              ) : (
                " Logout"
              )}
          </button>
        </div>
      </div>
    </>
  );
}
