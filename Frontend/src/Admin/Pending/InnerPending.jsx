import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../config";
import Header from "/src/Components/AdminHeader.jsx"

const InnerPending = () => {

  const [status, setStatus] = useState(null); // null | "Approved" | "Declined"
  const [isZoomed, setiszoomed] = useState(false);
  const [userData, setUserData] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [admin, setAdmin] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const vendor = userData.find((item) => item.id === Number(id));

  const handleclick = () => {
    setiszoomed(true);
  };

  const closeZoom = () => {
    setiszoomed(false);
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user && user.uid === "0bnEhkgmOEQmO5zrZhNXFZsk19C3") {
        setAdmin(true);
      } else {
        console.log("He is not a super admin");
      }
    });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/fetchData")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [id]);

  const handleApprove = async () => {
    try {
      const res = await axios.put("http://localhost:5000/approveRequest", { id });
      console.log(res.data);
      setStatus("Approved");
    } catch (err) {
      console.error("Approval failed:", err.response?.data || err.message);
    }
  };

  const handledecline = () => {
    try {
      const res = axios.put("http://localhost:5000/decline", { id });
      console.log(res.data);
      setStatus("Declined");
    } catch (error) {
      console.error("Decline failed:", error.response?.data || error.message);
    }
  };

  if (!vendor) return <div className="p-4 text-red-500">Vendor not found</div>;

  return (
    <>
      <Header />
      <div className="flex justify-center w-full bg-gray-50 p-6 font-sans">
        <div className="w-1/2">
          <h2 className="text-xl font-bold mb-4 text-pink-600">
            Previous Transactions ( {vendor.name} )
          </h2>
          <div className="grid gap-4">
            {/* {vendor.map((t, index) => ( */}
            <div
              key={vendor.id}
              className={`p-4 rounded-xl shadow-md bg-white ${vendor.id === userData.length - 1 ? "border border-red-400" : ""
                }`}
            >
              <h3 className="font-semibold mb-2">
                Week 1
              </h3>
              <p>
                <strong>Reference ID:</strong> {vendor.referenceid}
              </p>
              {/* <p><strong>Date:</strong> {vendor.date}</p> */}
              <p><strong>City:</strong> {vendor.city} </p>
              <p><strong>State:</strong> {vendor.region}</p>
              <p><strong>Mobile number:</strong> {vendor.mobile}</p>
              <p><strong>UPI ID:</strong> {vendor.upiid}</p>
            </div>
            {/* ))} */}
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-center p-4">
            <div className=" relative rounded-xl my-auto shadow-lg max-w-6xl w-full grid md:grid-cols-2 gap-6 p-8">
              <div>
                <h2 className="text-2xl font-semibold bg-gradient-to-b from-[#F04471] to-[#925AC6] bg-clip-text text-transparent text-pink-600 mb-4 w-full">
                  {vendor.name} - {vendor.referenceid}
                </h2>
                <div className="space-y-4 mt-10">
                  <div>
                    <label className="block text-md font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-xl"
                      value={vendor.name}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-md font-medium mb-1">
                      Reference ID
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-xl"
                      value={vendor.referenceid}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-md font-medium mb-1">
                      Mobile Number
                    </label>
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
                    <label className="block text-md font-medium mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-xl"
                      value={vendor.region}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-md font-medium mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-xl"
                      value={vendor.upiid}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-md font-medium mb-1">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-xl"
                      value={vendor.shopname}
                      readOnly
                    />
                  </div>

                </div>
              </div>

              <div className="flex flex-col mt-20 w-full space-y-4 items-center">
                <div className="w-full">
                  <label className="block text-md font-medium mb-1">
                    Lattitude
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-xl"
                    value={vendor.lattitude}
                    readOnly
                  />
                </div>
                <div className="w-full">
                  <label className="block text-md font-medium mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-xl"
                    value={vendor.longitude}
                    readOnly
                  />
                </div>
                <div className="w-full">
                  <label className="block text-md font-medium mb-1">
                    Remarks
                  </label>
                  <textarea
                    rows="3"
                    value={vendor.remarks}
                    className="w-full p-3 border rounded-xl"
                    readOnly
                  ></textarea>
                </div>
                <div className="w-full">
                  <h3 className="text-sm font-medium mb-2">Image Preview</h3>
                  <img
                    src={vendor.image}
                    alt="Preview"
                    className="rounded border object-cover size-60 cursor-pointer hover:scale-105 transition duration-300"
                    onClick={handleclick}
                  />
                </div>
                {isZoomed && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-70 my-20 flex items-center justify-center z-50"
                    onClick={closeZoom}
                  >
                    <img
                      src={vendor.image}
                      alt="Zoomed"
                      className="max-w-full max-h-full rounded-lg shadow-xl border"
                    />
                  </div>
                )}

                {admin && (
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
                        className={`px-6 py-2 rounded-3xl text-xl font-semibold w-80 flex items-center justify-center ${status === "Approved"
                            ? "bg-green-100 text-green-700 border border-green-500"
                            : "bg-red-100 text-red-700 border border-red-500"
                          }`}
                      >
                        {status === "Approved" ? "✅ Approved" : "❌ Declined"}
                      </div>
                    )}
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
        </div>
      </div>


    </>
  );
};

export default InnerPending;