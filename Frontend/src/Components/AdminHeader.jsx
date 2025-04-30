import React from "react";
import spinzWhite from "../assets/SpinzWhite.png";
import { signOut } from "firebase/auth";
import { auth } from "../config";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value) {
      navigate(value); // 👈 This triggers the route
    }
  };

  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 flex items-center justify-between text-white shadow">
      {/* Logo */}
      <div className="flex justify-center items-center">
        <img src={spinzWhite} alt="logo" className="w-[85px] h-[55px]" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
       
        <button
          onClick={handleLogout}
          className="p-2 rounded border border-white hover:bg-white hover:text-pink-500 transition"
        >
          Log Out
        </button>

        <div className="relative w-fit text-black cursor-pointer select-none group">
          <select
            onChange={handleChange}
            className="bg-transparent border px-5 py-3 rounded-md text-sm font-inter text-white min-w-[140px] focus:outline-none appearance-none pr-6"
          >
            <option value="/dash" className="bg-[#925AC6] bg-opacity-25">
              Dashboard
            </option>
            <option value="/admin" className="bg-[#925AC6] bg-opacity-25">
              Admin
            </option>
            <option value="/payout" className="bg-[#925AC6] bg-opacity-25">
              Payment
            </option>
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none fill-white"
            viewBox="0 0 512 512"
          >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
