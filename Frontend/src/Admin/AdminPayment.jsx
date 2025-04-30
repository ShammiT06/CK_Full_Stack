import { useEffect, useState } from "react";
import Header from "../Components/AdminHeader.jsx";
import axios from "axios";
import razor from "../assets/third_logo-107.png";


export default function AdminPayment() {
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhsot:5000/payment")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleCheckboxChange = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handlePayment = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to pay.");
      return;
    }

    try {
      const amount = selectedUsers.length * 1; 
      const { data } = await axios.post("http:localhost:5000/create_order", {
        amount: amount, 
      });

    
      const options = {
        key: "CLaH569cQ4Pb9PxHU6jHhPPA", 
        amount: amount * 100, 
        currency: "INR",
        name: "Thirdvizion",
        description: "Payout for Cashback",
        order_id: data.id, 
        handler: async function (response) {
          
          console.log("Payment Success", response);

          
          try {
            await axios.post("http:localhost:5000/verify-payment", {
              paymentData: response,
            });
            alert("Payment Successful and Verified!");
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            alert("Payment succeeded but verification failed!");
          }
        },
        prefill: {
          name: "Admin",
          email: "admin@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in payment process:", error);
      alert("Something went wrong during payment initiation.");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 md:p-10 flex flex-col md:flex-row gap-6">
      
        <div className="w-full md:w-2/3 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">Review & Confirmation</h2>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">
                  <input type="checkbox" disabled />
                </th>
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
                  <td className="px-4 py-2 text-blue-600 cursor-pointer">
                    {user.referenceid}
                  </td>
                  <td className="px-4 py-2">{user.upiid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

     
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
                <input type="radio" name="payment" defaultChecked className="w-5 h-5" />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <button className="flex-1 border border-gray-400 bg-opacity-25 font-inter bg-[#898989] text-[#7D7D7D] py-2 rounded-full">
              Back
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 bg-blue-600 text-white py-2 rounded-full font-semibold font-inter hover:bg-blue-700"
            >
              Pay on Razorpay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
