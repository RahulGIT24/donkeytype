import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "sonner";
import MainNav from "../../components/navbars/MainNav";
import apiCall from "../../utils/apiCall";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setDisabled(true);
    const { data, status } = await apiCall({
      url: "/users/forgot-password",
      reqData: {
        email,
      },
      method: "POST",
      withCredentials:false
    });
    if (status >= 400) {
      toast.error(data);
    } else {
      toast.success(data);
    }
    setDisabled(false);
  };
  return (
    <>
      <MainNav />
      <div className="flex justify-center items-center flex-col gap-2 h-screen ">
        <form className="mt-6 space-y-4 w-1/2" onSubmit={handleSubmit}>
          <h1 className="text-xl text-white">
            <b>Forgot Password</b>
          </h1>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 placeholder-gray-500 text-white rounded focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                "Send Email"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
