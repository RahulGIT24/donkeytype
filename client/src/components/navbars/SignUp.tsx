import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    verifyPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (formData.password !== formData.verifyPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/donkeyapi/v1/users/register`, 
        {
          name: formData.name,
          email: formData.email,
          password: formData.password, 
          username: formData.username,
        }
      );
      const {data} = res
      console.log(data)


      toast.success('Form submitted successfully!');
    } catch (error:any) {
      const data = error.response.data
      console.log(data);
      toast.error(data.data);
      console.log('Registration error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form className="mt-6 space-y-4 max-w-sm w-full" onSubmit={handleSubmit}>
        <h1 className='text-xl text-white'><b>Register</b></h1>
        
        <div>
          <label htmlFor="username" className="sr-only">Username</label>
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
          <label htmlFor="name" className="sr-only">Name</label>
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
          <label htmlFor="email" className="sr-only">Email</label>
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
          <label htmlFor="password" className="sr-only">Password</label>
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
          <label htmlFor="verifyPassword" className="sr-only">Verify Password</label>
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
            className="w-full py-2 px-4 bg-yellow-500 text-white font-medium rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
