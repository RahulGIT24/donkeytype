import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "sonner";
import apiCall from "../../utils/apiCall";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    verifyPassword: "",
  });

  const [disabled, setDisabled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast.error("Passwords length should me more than 8 characters");
      return;
    }

    if (formData.password !== formData.verifyPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setDisabled(true);
    const { data, status } = await apiCall({
      url: `/users/register`,
      reqData: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.username,
      },
      method: "POST",
      withCredentials: false,
    });
    if (status >= 400) {
      toast.error(data);
    } else {
      toast.success(data);
    }
    setDisabled(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form className="mt-6 space-y-4 max-w-sm w-full" onSubmit={handleSubmit}>
        <h1 className="text-xl text-white">
          <b>Register</b>
        </h1>

        <div>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-700 bg-gray-700 placeholder-gray-500 text-white rounded focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-700 bg-gray-700 placeholder-gray-500 text-white rounded focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
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
            id="password"
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
          <label htmlFor="verifyPassword" className="sr-only">
            Verify Password
          </label>
          <input
            id="verifyPassword"
            name="verifyPassword"
            type="password"
            required
            className="w-full px-3 py-2 border border-gray-700 bg-gray-700 placeholder-gray-500 text-white rounded focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Verify Password"
            value={formData.verifyPassword}
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
              "Register"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
