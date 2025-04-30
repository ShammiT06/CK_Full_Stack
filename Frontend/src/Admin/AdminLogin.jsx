import logo from "../assets/adminlogo.png"
import spinzPink from "../assets/SpinzPink.png"
import { Link } from "react-router-dom"
import React, { useState, useEffect } from "react";
import { auth } from "../config";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {

  const[username, setUsername] = useState("");
  const[password, setPassword] = useState("");
//  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user);
        console.log(user.email)
        // setDisplayName(user.email);
        navigate("/admin");
      } else {
        console.log("No user is logged in");
      }
    }
    );
  },[])

  const login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, username, password)
      .then(() => {
        console.log("Login successful");
        navigate("/admin");
      })
      .catch((error) => {
        console.error("Login failed", error);
        alert("Invalid username or password");
      })
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Image & Logo */}
      <div className="hidden md:flex md:w-1/2 text-white justify-center items-center rounded-3xl">
        <div className="text-center">
          <img
            src={logo}
            alt="Spinz Products"
            className="rounded-xl max-w-full h-auto"
          />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div>
            <div className="flex justify-center items-center">                
                <img src={spinzPink} alt="no image" className="w-[85px] h-[55px]" />
            </div>
            <h1 className="font-marienda text-2xl font-normal mt-5 text-center">Welcome Back Ajay</h1>
            <p className="font-inter text-2xl font-medium text-black text-opacity-50  mt-2">Login</p>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Enter User ID"
                className="w-full border border-pink-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••••"
                className="w-full border border-pink-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <button
            onClick={login}
              type="submit"
              className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;