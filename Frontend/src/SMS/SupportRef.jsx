
import { useContext, useEffect, useState } from "react";
import logo from "../assets/SpinzPink.png";
import { Refcontext } from "../App";

function SupportRef() {
  const [isDone, setIsDone] = useState(false);

  const {spin,setspin}=useContext(Refcontext)

  useEffect(()=>{
    const Random= Math.floor(202500000+Math.random()*30000)
  const last= Math.floor(10+Math.random()*300)+1
  setspin(`SPNZ-${Random}-XYZ${last}`)


  },[])

  




  return (
    <div className="p-5 mt-48">
      <img src={logo} alt="Spinz Logo" />

      {!isDone ? (
        <>
          <div className="border w-full h-auto mt-10 border-[#A246BB] rounded-lg p-3">
            <p className="text-1xl">
            Your query has been successfully submitted. Our team is reviewing the issue, and we will get back to you shortly with an update.
            </p>
            <h1 className="mt-3 font-bold">
              Support Reference Number :{" "}
              <span className="text-[#0041E4] text-1xl font-bold font-inter">
                {spin}
              </span>
            </h1>
            <p className="text-1xl">
            If you need to provide any additional details, feel free to reply to this message.
            </p>
          </div>
          <button
            className="bg-[#EF4370] rounded-full p-3 w-full mt-10 h-auto text-white font-semibold font-inter"
            onClick={() => setIsDone(true)}
          >
            Done
          </button>
        </>
      ) : (
        <div className="border w-full h-auto mt-10 border-pink-500 rounded-lg p-5 text-center">
          <h2 className="text-2xl font-semibold text-pink-500">
            🎉 Thank you! Your submission has been received.
          </h2>
        </div>
      )}
    </div>
  );
}

export default SupportRef;
