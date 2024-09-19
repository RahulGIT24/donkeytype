import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainNav from "../navbars/MainNav";
import TypingNav from "../navbars/TypingNav";
import {
  faCircleCheck,
  faCopy,
  faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
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

const CreateRoom = () => {
  const roomId = useSelector((state: any) => state.multiplayer.roomId);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socketI = useSelector((state: any) => state.multiplayer.socketInstance);
  const [multiplayerMode, setMultiplayerMode] = useState<ISetting | null>(null);

  const type = useSelector((state: any) => state.setting.type);
  const wordNumber = useSelector((state: any) => state.setting.wordNumber);
  const time = useSelector((state: any) => state.setting.time);
  const currentMode = useSelector((state: any) => state.setting.currentMode);
  const typeOfText = useSelector((state: any) => state.setting.typeOfText);

  useEffect(() => {
    setMultiplayerMode({
      type,
      wordNumber,
      time,
      currentMode,
      typeOfText,
    });
  }, [type, wordNumber, time, currentMode, typeOfText]);

  useEffect(() => {
    dispatch(setRoomIdState(null));
  }, []);

  // error
  useEffect(() => {
    if (socketI) {
      socketI.on("Room Created", (id: string) => {
        dispatch(setRoomIdState(id));
        toast.success("Room Created");
      });
      socketI.on("User Joined", (id: string, mode: ISetting) => {
        dispatch(setMultiplayer(true));
        dispatch(setMode(mode));
        navigate(`/${id}`);
      });
    }
  }, [socketI]);

  useEffect(() => {
    if (!socketI) {
      socket.connect();
      dispatch(setSocketId(socket.id));
      dispatch(setSocketInstance(socket));
    }
  },[socketI]);

  const handleCopy = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 500);
    toast.success("Copied to Clipboard");
  };
  const generateRoomId = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let roomId = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomId += characters[randomIndex];
    }
    return roomId;
  };
  const createRoom = () => {
    const roomid = generateRoomId(10);
    dispatch(setRoomIdState(roomid));
    socket.emit("create-room", roomid, multiplayerMode);
  };
  return (
    <>
      <MainNav />
      <main className="w-full flex justify-center items-center">
        <div className="mt-44 flex text-yellow-500 justify-center items-center">
          <p className="font-semibold text-2xl mx-4">Select Mode</p>
          <FontAwesomeIcon className="w-5 h-5" icon={faUpLong} />
        </div>
        <TypingNav />
      </main>
      <main className="flex justify-center items-center mt-20 text-yellow-500 flex-col">
        <div className="border border-yellow-500 p-4 rounded-xl flex felx-col justify-between items-center w-[30%]">
          {roomId ?? "Room ID Will Appear Here"}
          {copied ? (
            <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5" />
          ) : (
            <FontAwesomeIcon
              icon={faCopy}
              className="hover:cursor-pointer w-5 h-5"
              onClick={handleCopy}
            />
          )}
        </div>
        <button
          className="my-11 border border-yellow-500 p-4 rounded-full cursor-pointer hover:text-zinc-800 hover:bg-yellow-500 shadow-md shadow-black"
          onClick={createRoom}
        >
          Create Room
        </button>
      </main>
    </>
  );
};

export default CreateRoom;
