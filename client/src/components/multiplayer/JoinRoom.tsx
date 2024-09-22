import MainNav from "../navbars/MainNav";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setMode,
  setMultiplayer,
  setRoomIdState,
  setSocketId,
  setSocketInstance,
} from "../../redux/reducers/multiplayerSlice";
import { ISetting } from "../../types/user";
import { socket } from "../../socket/socket";

const JoinRoom = () => {
  const roomId = useSelector((state: any) => state.multiplayer.roomId);
  const dispatch = useDispatch();
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const socketI = useSelector((state: any) => state.multiplayer.socketInstance);

  useEffect(() => {
    if (socketI) {
      socketI.on("User Joined", (id: string, mode: ISetting) => {
        dispatch(setMultiplayer(true));
        dispatch(setMode(mode));
        navigate(`/${id}`);
      });
      socketI.on("error", handleError);
    }
    // socket.on("connect", () => {});
  }, [socketI]);

  useEffect(() => {
    if (!socketI) {
      socket.connect();
      dispatch(setSocketId(socket.id));
      dispatch(setSocketInstance(socket));
    }
  },[socketI]);

  useEffect(()=>{
    dispatch(setRoomIdState(""))
  },[])

  function handleError(message: string) {
    setIsJoining(false);
    toast.error(message);
  }

  const join_room = () => {
    if (!roomId) {
      toast.error("Room ID cannot be empty");
      return;
    }
    dispatch(setRoomIdState(roomId))
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
          onChange={(e)=>dispatch(setRoomIdState(e.target.value))}
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
