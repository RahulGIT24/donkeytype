import MainNav from "../components/navbars/MainNav";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/userSlice";

export default function Home() {
  const navigate = useNavigate();
  //const dispatch = useDispatch()
  const success = useAuth()
  
  useEffect(() => {
    
    if (!success) {
      toast("Token Expired");
      return navigate("/login");
    } else {
      //dispatch ( setUser(true))
      return navigate("/");
    }
  }, []);

  return (
    <>
      <div className="flex flex-col justify-around h-screen overflow-hidden">
        <MainNav />
        <Outlet />
        <footer className="fixed bottom-0 flex justify-center w-full mb-4">
          Content here
        </footer>
      </div>
    </>
  );
}
