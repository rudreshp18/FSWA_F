import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import GoogleAuth from './GoogleAuth';

const Login = () => {
  const [regData, setRegData] = useState({
    "email": "",
    "password": ""
  });
  const [error, setErrorState] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    console.log("a")
    setRegData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    try {
      const response = await toast.promise(axios.post(`${import.meta.env.VITE_SERVER}/auth/login`, regData), {
        pending: 'Logging In!',
      })

      if (response) {
        toast.success('Logged In!')
        sessionStorage.setItem('acTk', response.data.token.access)
        navigate('/dashboard')
      }
    } catch (error) {
      console.log("Error", error)
      toast.error('Invalid Credentials')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={regData.email}
            name="email"
            onChange={(e) => handleChange(e)}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={regData.password}
            name="password"
            onChange={(e) => handleChange(e)}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            onClick={() => handleLogin()}
            className="bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-all"
          >
            Login
          </button>
        </div>
        <div className='mt-4'>
          <GoogleAuth />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
