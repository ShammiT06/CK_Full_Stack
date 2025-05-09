import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const History = () => {

  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  // Filter based on search
  const filteredData = userData.filter((item) => {
    return (
      item.name.toLowerCase() ||
      item.reference.toLowerCase() ||
      item.mobile.toLowerCase() ||
      (item.upi && item.upi.toLowerCase()) ||
      (item.status && item.status.toLowerCase()) ||
      (item.payment && item.payment.toLowerCase())
    );
  });

  const reversedData = filteredData.slice().reverse();
  const totalPages = Math.ceil(reversedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = reversedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const ShowData = currentData.length;

  useEffect(() => {
    axios.get("http://localhost:5000/fetchapprove")
      .then((response) => {
        console.log(response.data)
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <div className="overflow-x-auto mt-4 p-8  rounded-lg bg-white">
      <table className="table-auto w-full text-sm">
        <thead className="bg-gray-100 shadow">
          <tr>
            <th className="px-4 py-4 text-center text-xl font-bold">S.No</th>            <th className="px-4 py-4 text-center text-xl font-bold">
              Reference ID
            </th>
            <th className="px-4 py-4 text-center text-xl font-bold">
              Full Name
            </th>
            <th className="px-4 py-4 text-center text-xl font-bold">
              Mobile Number
            </th>
            <th className="px-4 py-4 text-center text-xl font-bold">
              UPI Credentials
            </th>
            <th className="px-4 py-4 text-center text-xl font-bold">
              Shop Name
            </th>
            <th className="px-4 py-4 text-center text-xl font-bold">Status</th>
            <th className="px-4 py-4 text-center text-xl font-bold">
              City
            </th>
            <th className="px-4 py-4 text-center text-xl font-bold">
              State
            </th>
            <th className="px-4 py-4 text-center text-xl font-bold">
              Pincode
            </th>
            <th className="px-4 py-4 text-center text-xl font-bold">
              Lattitude
            </th>
            <th className="px-4 py-4 text-center text-xl font-bold">
              Longitude
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr
              key={index}
              className="border-t cursor-pointer hover:bg-gray-100 text-center even:bg-[#d9d9d944]"
              onClick={() => navigate(`/history/${item.id}`)}

            >
              <td className="px-8 py-2 border-r">{index}</td>
              <td className="px-4 py-2 border-r">{item.referenceid}</td>
              <td className="px-4 py-2 border-r">{item.name}</td>
              <td className="px-4 py-2 border-r">{item.mobile}</td>
              <td className="px-4 py-2 border-r">{item.upiid}</td>
              <td className="px-4 py-2 border-r">{item.shopname}</td>
              <td className="px-4 py-2 border-r">
                <span className="flex items-center justify-start ml-5 gap-1">
                  <span
                    className={`h-3 w-3 rounded-full ${item.status === "Approved" ? "bg-green-500" : "bg-red-500"}`}
                  ></span>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-2 border-r">
                {item.city}
              </td>
              <td className="px-4 py-2 border-r">
                <div className="flex items-center justify-center gap-2">
                  {item.region}
                </div>
              </td>
              <td className="px-4 py-2 border-r">{item.pincode}</td>
              <td className="px-4 py-2 border-r">{item.lattitude}</td>
              <td className="px-4 py-2 border-r">{item.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-6 items-center mt-4">
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${page === currentPage ? "bg-pink-500 text-white" : ""
                }`}
            >
              {page}
            </button>
          ))}
        </div>
        <div>
          <span className="mr-2">{ShowData}</span>
          <span>/ PAGE</span>
        </div>
      </div>
    </div>
  );
};

export default History;