import { useEffect, useState } from "react";
import logo from "../assets/SpinzPink.png";
import axios from "axios";
import { useContext } from "react";
import { MobileContext, Refcontext } from "../App";
import { useNavigate } from "react-router-dom";

function Reference() {
  const [isDone, setIsDone] = useState(false);
  const { spin } = useContext(Refcontext)
  const { mobile } = useContext(MobileContext)



  function confirmation() {
    axios.post("https://localhost:5000/con", { spin, mobile }).then(() => {
      console.log("Successfull")
      setTimeout(() => {
        setIsDone(true)
      }, 1000)


    })
  }

  return (
    <div className="p-5 mt-48">
      <img src={logo} alt="Spinz Logo" />

      {!isDone ? (
        <>
          <div className="border w-full h-auto mt-10 border-[#A246BB] rounded-lg p-3">
            <p className="text-1xl">
              You submitted the required details along with the pack box image
              as requested. The submission includes all necessary information as
              per the given instructions. Please find the reference ID for this
              submission below.
            </p>
            <h1 className="mt-3 font-bold">
              Reference ID:{" "}
              <span className="text-[#0041E4] text-1xl font-bold font-inter">
                {spin}
              </span>
            </h1>
          </div>
          <button
            className="bg-[#EF4370] rounded-full p-3 w-full mt-10 h-auto text-white font-semibold font-inter"
            onClick={confirmation}
          >
            Done
          </button>
        </>
      ) : (
        <div className="border w-full h-auto mt-10 border-pink-500 rounded-lg p-5 text-center">
          <h2 className="text-2xl font-inter font-semibold text-pink-500">
            🎉 Thank you! Your submission has been received.
          </h2>
        </div>
      )}
    </div>
  );
}

export default Reference;