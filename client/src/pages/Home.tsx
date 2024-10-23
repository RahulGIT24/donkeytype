import { useEffect } from "react";
import MainNav from "../components/navbars/MainNav";
import TypeLayout from "./TypeLayout";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  setOppRes,
  setUserLeft,
} from "../redux/reducers/multiplayerSlice";

export default function Home() {
  const dispatch = useDispatch();
  const socket = useSelector((state: any) => state.multiplayer.socketInstance);
  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate();
  const { roomId } = useParams();
const isMultiplayer = useSelector((state: any) => state.multiplayer.multiplayer);
  const mySocketId = useSelector((state: any) => state.multiplayer.socketId);
  useEffect(() => {
    if (roomId&&socket) {
      console.log('yes')
      socket.on("connect", () => {
        socket.emit("verify-room", roomId);
      });
      socket.on("Verified", () => {
        toast.success("Room verified!");
      });
      socket.on("Not Verified", () => {
        toast.error("Room may be full or not existed");
        navigate("/");
      });
      socket.on("User Left", (socketId: string) => {
        if (socketId !== mySocketId) {
          toast.warning("User Left");
        }
        dispatch(setUserLeft(true));
      });
      socket.on("Results", (users: any) => {
        const arr = users.filter((u: any) => u.userId !== user._id);
        const opp = arr[0];
        dispatch(
          setOppRes({
            username: opp.username,
            results: opp.results,
            userId: opp.userId,
          })
        );
      });
    }else if((!isMultiplayer&&!roomId&&socket)){
      socket.disconnect();
    } else {
      navigate("/");
    }



   

    return () => {
      // socket.disconnect()
    };
  }, [socket]);

  return (
    <>
      <MainNav />
      <div className="flex flex-col justify-around h-screen overflow-hidden">
        <TypeLayout />
        <footer className="fixed bottom-0 flex justify-center w-full mb-4">
          Content here
        </footer>
      </div>
    </>
  );
}
