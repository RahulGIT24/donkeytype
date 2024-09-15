import MainNav from "../navbars/MainNav";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setMode,
  setMultiplayer,
  setRoomIdState,
} from "../../redux/reducers/multiplayerSlice";
import { ISetting } from "../../types/user";

const JoinRoom = () => {
  const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_API), []);
  const roomId = useSelector((state: any) => state.multiplayer.roomId);
  const dispatch = useDispatch();
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // socket.on("connect", () => {});
    socket.on("User Joined", (id: string, mode: ISetting) => {
      setIsJoining(false);
      dispatch(setMode(mode));
      dispatch(setMultiplayer(true));
      navigate(`/${id}`);
    });
    socket.on("error", handleError);

    return () => {
      // socket.disconnect();
    };
  }, [socket]);

  function handleError(message: string) {
    setIsJoining(false);
    toast.error(message);
  }

  const join_room = () => {
    if (!roomId) {
      toast.error("Room ID cannot be empty");
      return;
    }
    setIsJoining(true);
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
          onChange={(e) => dispatch(setRoomIdState(e.target.value))}
        />

        <button
          className="my-11 border border-yellow-500 p-4 rounded-full cursor-pointer hover:text-zinc-800 hover:bg-yellow-500 shadow-md shadow-black"
          onClick={join_room}
          disabled={isJoining}
        >
          {isJoining ? "Joining..." : "Join room"}
        </button>
      </main>
    </>
  );
};

export default JoinRoom;
