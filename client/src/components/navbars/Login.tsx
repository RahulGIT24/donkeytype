import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import apiCall from "../../utils/apiCall";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
    } else {
      setDisabled(true);
      const { data, status } = await apiCall({
        url: `/users/login`,
        method: "POST",
        reqData: {
          identifier: formData.email,
          password: formData.password,
        },
      });
      if (status >= 400) {
        toast.error(data);
      } else {
        navigate("/");
      }
      setDisabled(false);
    }
  };

  return (
    <>
      <div className="flex justify-center flex-col gap-2">
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-xl text-white">
            <b>Login</b>
          </h1>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              name="email"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 placeholder-gray-500 text-white rounded focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
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
              value={formData.password}
              onChange={handleChange}
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
                " Sign In"
              )}
            </button>
          </div>
        </form>
        <Link to={"/forgotPassword"}>
          <p>forgot password?</p>
        </Link>
      </div>
    </>
  );
}
