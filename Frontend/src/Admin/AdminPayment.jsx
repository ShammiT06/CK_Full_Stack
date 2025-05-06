import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Components/AdminHeader.jsx";
import razor from "../assets/third_logo-107.png";
import { auth } from "../config.js";
import { useNavigate } from "react-router-dom";


export default function AdminPayment() {
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()


  
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user)
      {
        console.log("")
      }
      else
      {
       navigate("/login")
      }
  

    })

  },[])


  // Fetch users from backend
  useEffect(() => {
    axios.get("http://localhost:5000/pay")
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, []);

  // Handle checkbox toggle
  const handleCheckboxChange = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    );
  };

  // Handle payout for selected users
  const handlePayouts = async () => {
    const selectedUserDetails = userData.filter((user) =>
      selectedUsers.includes(user.id)
    );

    if (selectedUserDetails.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    setLoading(true);

    for (const user of selectedUserDetails) {
      try {
        // Step 1: Validate VPA
        const validateRes = await axios.post("http://localhost:5000/validate-vpa", {
          vpa: user.upiid,
        });

        if (!validateRes.data.success) {
          alert(`Invalid UPI ID for user: ${user.name}`);
          continue;
        }

        // Step 2: Create Contact
        const contactRes = await axios.post("http://localhost:5000/add-customer", {
          name: user.name,
          email: `${user.name.toLowerCase().replace(" ", "")}@example.com`,
          contact: "9999999999",
        });

        const contact_id = contactRes.data.contact_id;

        // Step 3: Create Fund Account
        const fundRes = await axios.post("http://localhost:5000/add-fund-account", {
          contact_id,
          vpa: user.upiid,
        });

        const fund_account_id = fundRes.data.fund_account_id;

        // Step 4: Make Payout
        const payoutRes = await axios.post("http://localhost:5000/payout", {
          fund_account_id,
          amount: 1,
          purpose: "cashback",
        });

        alert(`✅ Payout successful for ${user.name} (ID: ${payoutRes.data.payout_id})`);

      } catch (err) {
        console.error("Error during payout:", err);
        alert(`❌ Payout failed for ${user.name}`);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="p-6 md:p-10 flex flex-col md:flex-row gap-6">
        {/* User Table */}
        <div className="w-full md:w-2/3 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">Review & Confirmation</h2>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Select</th>
                <th className="text-left px-4 py-2">S.no</th>
                <th className="text-left px-4 py-2">Username</th>
                <th className="text-left px-4 py-2">Ref ID</th>
                <th className="text-left px-4 py-2">UPI ID</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="pl-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </td>
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2 text-blue-600">{user.referenceid}</td>
                  <td className="px-4 py-2">{user.upiid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary & Action */}
        <div className="w-full md:w-1/3 border rounded-xl p-6 flex flex-col gap-6 bg-white shadow-xl">
          <div>
            <h3 className="text-lg font-semibold mb-2">Payout details</h3>
            <div className="flex justify-between mb-1 mt-4">
              <span>Confirmation Cashback</span>
              <span>₹ 50</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Approved Quantity</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={selectedUsers.length}
                  readOnly
                  className="w-16 border px-2 py-1 rounded-md text-center"
                />
                <span>₹ {selectedUsers.length * 1}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Pay using</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-10">
                <img src={razor} alt="Razorpay" className="w-[136px] h-[35px]" />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={handlePayouts}
              disabled={loading}
              className={`flex-1 py-2 rounded-full font-semibold font-inter ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Processing..." : "Send RazorpayX Payout"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
