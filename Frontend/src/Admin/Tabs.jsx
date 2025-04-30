import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pending from "/src/Admin/Pending/MainPending.jsx";
import History from "/src/Admin/History/MainHistory.jsx";
import Header from "/src/Components/AdminHeader.jsx";
import head from "../assets/Frame.png"
import { auth } from "../config";
import { signOut } from "firebase/auth";
import axios from "axios"

function handlebutton(){
  axios.post("http://localhost:5000/download", {
    selectedIds: [1, 2, 3], // your selected user IDs
  }, { responseType: "blob" })
  .then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Selected_Users.xlsx");
    document.body.appendChild(link);
    link.click();
  })
  .catch((error) => {
    console.error("Download failed:", error);
  });
  
}


const Tabs = () => {

  const [activeTab, setActiveTab] = useState("pending");





  const navigate = useNavigate();

  // const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");


  


 


  return (
    <>
      <Header />
      <div className="flex  items-center justify-between p-8 space-y-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-inter font-medium">Vendor Requests</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-xl border-[2px] border-pink-500 text-pink-500 ${
                activeTab === "pending" ? "bg-pink-500 text-white" : "bg-white"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-xl border-[2px] border-pink-500 text-pink-500 ${
                activeTab === "history" ? "bg-pink-500 text-white" : "bg-white"
              }`}
            >
              History
            </button>

          </div>
        </div>

        <div className="flex flex-col items-end w-96 flex-wrap gap-4">
          <div className="flex gap-3">
          <button 
            onClick={() => navigate("/payout")}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-3xl">
            Proceed to Payout
          </button>
          <div className="flex items-center gap-3 justify-center bg-[#FEF3F6] border border-[#ED174FCC] text-[#ED174FCC] font-inter font-semibold text-sm rounded-full" style={{padding:"12px 19px"}}>
          <button onClick={handlebutton}>Export</button>
          <img src={head}  alt="" />
          </div>
          </div>
          <input
            type="text"
            placeholder="Search by Name, Ref ID, Mobile, UPI Id..."
            className="border p-2 rounded w-full xl:w-full md:w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // setCurrentPage(1); // Reset to page 1 on search
            }}
          />
        </div>
      </div>

      {/* Conditional Rendering */}
      {activeTab === "pending" ? <Pending /> : <History />}
    </>
  );
};

export default Tabs;