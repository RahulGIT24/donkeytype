import SignUp from "../../components/navbars/SignUp";
import Login from "../../components/navbars/Login";
import MainNav from "../../components/navbars/MainNav";

export default function RegisterationPage() {
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
