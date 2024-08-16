import SignUp from "../../components/navbars/SignUp";
import Login from "../../components/navbars/Login";
import MainNav from "../../components/navbars/MainNav";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/reducers/userSlice";

export default function RegisterationPage() {

  const dispatch = useDispatch()
  dispatch(setUser(true))
  return (
    <>
      <div className="flex text-zinc-400 justify-around ">
        <MainNav/>
        <SignUp />
        <Login/>
      </div>
    </>
  );
}
