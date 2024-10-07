import { pfpArray } from "../utils/pfp";
import apiCall from "../utils/apiCall";
import MainNav from "../components/navbars/MainNav";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setpfp } from "../redux/reducers/userSlice";
export default function ProfilePic() {
  // const [profilePic, setProfilePic] = useState<String>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSetProfile = async (pfp: String) => {
    const { status } = await apiCall({
      url: "/users/profilePic",
      method: "POST",
      reqData: { pfp },
    });
    if (status === 200) {
      dispatch(setpfp(pfp));
      toast("Profile Picture Updated");
      return navigate("/account");
    }
  };

  return (
    <>
      <MainNav />
      <h1 className=" fixed text-4xl top-32 text-center w-screen text-yellow-400">
        {" "}
        Select a profile pic
      </h1>
      <div className="flex flex-col overflow-hidden">
        <div className="flex gap-7 flex-wrap overflow-hidden justify-center  items-center  absolute top-[25%] m-7 h-[50%]">
          {pfpArray.map((pfp: any, index: number) => {
            return (
              <button
                onClick={() => {
                  handleSetProfile(pfp);
                }}
              >
                {" "}
                <img
                  src={pfp}
                  alt=""
                  className="h-40 w-40 rounded-full hover:scale-110 duration-100 ease-in-out "
                  key={index}
                />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
