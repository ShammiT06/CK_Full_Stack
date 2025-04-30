import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const Pending = () => {

  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter based on search
  const filteredData = userData.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.reference.toLowerCase().includes(term) ||
      item.mobile.toLowerCase().includes(term) ||
      (item.upi && item.upi.toLowerCase().includes(term))
    );
  });

  const reversedData = filteredData.slice().reverse();
  const totalPages = Math.ceil(reversedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = reversedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const ShowData = currentData.length;

  useEffect(() => {
    axios.get("http://localhost:5000/fetchData")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);


  return (
    <>
      <div className="p-8 space-y-4">
        

        <div className="bg-white border rounded-lg shadow overflow-x-auto mt-4">
          <table className="table-auto w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-center text-xl font-bold">S.No</th>
                <th className="px-4 py-4 text-center text-xl font-bold">Reference ID</th>
                <th className="px-4 py-4 text-center text-xl font-bold">Full Name</th>
                <th className="px-4 py-4 text-center text-xl font-bold">Mobile Number</th>
                <th className="px-4 py-4 text-center text-xl font-bold">UPI Credientials</th>
                <th className="px-4 py-4 text-center text-xl font-bold">City</th>
                <th className="px-4 py-4 text-center text-xl font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((item) => (
                <tr key={item.id} 
                className="border-t cursor-pointer hover:bg-gray-100 text-center even:bg-[#d9d9d944]"
                // onClick={() => window.location.href = /vendor/${item.id}} // Change this path as needed
                onClick={() => navigate(`/pending/${item.id}`)}
                >
                 
                  <td className="px-8 py-2 border-r">{item.id}</td>
                  <td className="px-4 py-2 border-r">{item.referenceid}</td>
                  <td className="px-4 py-2 border-r">{item.name}</td>
                  <td className="px-4 py-2 border-r">{item.mobile}</td>
                  <td className="px-4 py-2 border-r">{item.upiid}</td>
                  <td className="px-4 py-2 border-r">{item.city}</td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button className="bg-green-500 hover:bg-green-600 p-2 rounded text-white">
                      ✅
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end gap-6 items-center mt-4">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${
                  page === currentPage ? "bg-pink-500 text-white" : ""
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
    </>
  );
};

export default Pending;