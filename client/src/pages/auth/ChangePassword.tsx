import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import MainNav from "../../components/navbars/MainNav";
export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (cpassword !== password || cpassword === "" || password === "") {
      toast.error(
        "Password do not match or the fields are empty\n Please fill them out properly"
      );
      return;
    }
    try {
      setDisabled(true);
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_API}/users/forgot-password`,
        {
          token,
          password,
        }
      );
      toast.success(res.data.data)
      navigate('/login')
    } catch (error: any) {
      toast.error(error.response.data.data);
    } finally {
      setDisabled(false);
    }
  };
  return (
    <>
      <MainNav/>
      <div className="flex justify-center items-center flex-col gap-2 fixed w-screen h-screen">
        <form className="mt-6 space-y-4 w-1/2" onSubmit={handleSubmit}>
          <h1 className="text-xl text-white">
            <b>Change Password</b>
          </h1>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 placeholder-gray-500 text-white rounded focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="cpassword" className="sr-only">
              Confirm Password
            </label>
            <input
              name="cpassword"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 placeholder-gray-500 text-white rounded focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Confrim Password"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-500 text-white font-medium rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 h-12 flex justify-center items-center"
              disabled={disabled}
            >
              {disabled ? (
                <ThreeDots
                  visible={true}
                  height="50"
                  width="50"
                  color="black"
                  radius="9"
                  ariaLabel="three-dots-loading"
                />
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
