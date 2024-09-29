import { useEffect } from "react";
import MainNav from "../components/navbars/MainNav";
import TypeLayout from "./TypeLayout";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setMultiplayer,setAllUsersPresent } from "../redux/reducers/multiplayerSlice";

export default function Home() {
  const dispatch = useDispatch();
  const socket = useSelector((state: any) => state.multiplayer.socketInstance);

  const navigate = useNavigate();
  const { roomId } = useParams();
  useEffect(() => {
    if (roomId) {
      socket.on("connect", () => {
        socket.emit("verify-room", roomId);
        console.log('connected')
      });
      socket.on("Verified", () => {
        toast.success("Room verified!");
      });
      socket.on("Not Verified", () => {
        toast.error("Room may be full or not existed");
        navigate("/");
      });
      
    } else {
      navigate("/");
    }

    return () => {
      // dispatch(invalidateState());
      // socket.disconnect();
      dispatch(setAllUsersPresent(true))
      dispatch(setMultiplayer(false))
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