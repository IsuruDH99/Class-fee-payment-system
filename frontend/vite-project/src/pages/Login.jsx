import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginImage from "../Images/login.jpg"; // Ensure correct path & casing

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://192.168.8.111:3001/auth/login", {
        email,
        password,
      });
      localStorage.setItem("accessToken", response.data.token);
      if (response.status === 200) {
        setMessage("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error || "Login failed");
      } else {
        setMessage("Server error");
      }
    }
  };

  const handleSignUp = () => {
    navigate("/userReg");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Background Image */}
      <div className="w-1/2 hidden lg:block">
        <img
          src={loginImage}
          alt="Login Visual"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-lg pt-32 pb-20 px-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            User Login
          </h2>

          {message && (
            <p className="text-center text-sm text-red-600 mb-4">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Sign Up Link */}
          <button
            onClick={handleSignUp}
            className="mt-4 text-blue-600 text-sm hover:underline w-full text-center"
          >
            Don’t have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
