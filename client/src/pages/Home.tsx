import MainNav from "../components/navbars/MainNav";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export default function Home() {
  const navigate = useNavigate();

  const success = useAuth()
  
  useEffect(() => {
    console.log('render ')
    if (!success) {
      toast("Token Expired");
      return navigate("/login");
    } else {
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
