import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const InnerPending = () => {

  const [status, setStatus] = useState(null); // null | "Approved" | "Declined"
  const [isZoomed,setiszoomed]=useState(false)

  const [userData, setUserData] = useState([]);


  const handleclick=()=>
  {
    setiszoomed(true)
  }

  const closeZoom=()=>
  {
    setiszoomed(false)
  }
  

const navigate = useNavigate();
const { id } = useParams();
const vendor = userData.find((item) => item.id === Number(id));


useEffect(() => {
  axios.get("http://localhost:5000/fetchData")
    .then((response) => {
      setUserData(response.data);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}, [id]);

const handleApprove = async () => {
  try {
    const res =  axios.put("http://localhost:5000/approveRequest",{ id }).then(()=>{
      console.log(res.data)
      setStatus("Approved")
      
    });
  }
   
  catch (err) {
    console.error("Approval failed:", err.response?.data || err.message);
  }
};

const handledecline=async()=>{
  try{
    const declined = axios.put("http://localhost:5000/decline",{id}).then((res)=>{
      console.log(res)
      setStatus("Declined")
    })
  }
  catch(error)
  {
    console.log("There is an Error:",error)
  }
}

if (!vendor) return <div className="p-4 text-red-500">Vendor not found</div>;

  return (
    <div className="scroll inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAFAFA] relative rounded-xl my-auto shadow-lg max-w-5xl xl:max-w-4xl w-full grid md:grid-cols-2 gap-6 p-8">
        <div>
          <h2 className="text-2xl font-semibold bg-gradient-to-b from-[#F04471] to-[#925AC6] bg-clip-text text-transparent text-pink-600 mb-4">
            {vendor.name} - {vendor.referenceid}
          </h2>
          <div className="space-y-4 mt-10">
            <div>
              <label className="block text-md font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl"
                value={vendor.name}
                readOnly
              />
            </div>
            <div>
              <label className="block text-md font-medium mb-1">Reference ID</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl"
                value={vendor.referenceid}
                readOnly
              />
            </div>
            <div>
              <label className="block text-md font-medium mb-1">Mobile Number</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl"
                value={vendor.mobile}
                readOnly
              />
            </div>
            <div>
              <label>City</label>
              <input
              type="text"
              className="w-full p-3 border rounded-xl"
              value={vendor.city}
              />
            </div>
            <div>
              <label className="block text-md font-medium mb-1">UPI ID</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl"
                value={vendor.upiid}
                readOnly
              />
            </div>
            <div>
              <label className="block text-md font-medium mb-1">Remarks</label>
              <textarea
                rows="3"
                className="w-full p-3 border rounded-xl"
                defaultValue={vendor.remarks || "An individual is facing a critical hardware issue..."}
                readOnly
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-20 items-center">
          <h3 className="text-sm font-medium mb-2">Image Preview</h3>
          <img
            src={vendor.image}
            alt="Preview"
            className="rounded border object-cover w-auto cursor-pointer hover:scale-105 transition duration-300"
            onClick={handleclick}
          />
        </div>
        {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeZoom}
        >
          <img
            src={vendor.image}
            alt="Zoomed"
            className="max-w-full max-h-full rounded-lg shadow-xl border"
          />
        </div>
      )}

        <div className="col-span-2 flex justify-end gap-4 mt-4">
      {status === null ? (
        <>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-3xl text-xl w-52"
            onClick={handledecline}
          >
            Decline
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-3xl text-xl w-52"
            onClick={handleApprove}
          >
            Approve
          </button>
        </>
      ) : (
        <div
          className={`px-6 py-2 rounded-3xl text-xl font-semibold w-80 flex items-center justify-center ${
            status === "Approved"
              ? "bg-green-100 text-green-700 border border-green-500"
              : "bg-red-100 text-red-700 border border-red-500"
          }`}
        >
          {status === "Approved" ? "✅ Approved" : "❌ Declined"}
        </div>
      )}
    </div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-7 text-3xl font-bold text-gray-500 hover:text-black"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default InnerPending;