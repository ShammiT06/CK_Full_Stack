import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";

function Tracking() {
  const [refId, setRefId] = useState("");
  const [currentStatus, setCurrentStatus] = useState(""); 
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);


  const steps = [
    { key: "Pending", title: "Requested", description: "Request submitted successfully" },
    { key: "Approved", title: "Approved", description: "Waiting for Payment" },
    { key: "Completed", title: "Cashback Received", description: "Amount credited to your wallet" },
  ];

  
  const getStepStatus = (index) => {
    const statusOrder = ["Pending", "Approved", "Completed", "Declined"]; 

    const currentIndex = statusOrder.indexOf(currentStatus);
    console.log("Current Status: ", currentStatus); 

  
    if (currentStatus === "Declined") {
      if (index === 0) return "completed";
      if (index === 1) return "declined"; 
      return "pending"; 
    }

    if (index < currentIndex) return "completed"; 
    if (index === currentIndex) return "active"; 
    return "pending"
  };


  const handleCheckStatus = async () => {
    setError("");
    setCurrentStatus("");
    setSubmitted(true);

    try {
      const res = await axios.get(`http://localhost:5000/tracking/?referenceid=${refId}`);
      const status = res.data?.status;

      const allowedStatuses = ["Pending", "Approved", "Declined", "Completed"]
      if (allowedStatuses.includes(status)) {
        setCurrentStatus(status)
      } else {
        setError("Unknown status received.");
      }
    } catch (err) {
      setError("No record found for this Reference ID.");
    }
  };

  return (
    <div className="p-5 flex flex-col justify-start items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md text-left text-2xl font-semibold mb-6">
        Request Tracking
      </div>

      <div className="w-full max-w-md mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter Reference ID"
          value={refId}
          onChange={(e) => setRefId(e.target.value)}
          className="flex-1 p-2 border rounded-md"
        />
        <button
          onClick={handleCheckStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Check
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {currentStatus && (
        <div className="w-full max-w-md mx-auto p-8 rounded-xl border shadow-sm bg-white relative">
          <div className="flex flex-col relative">
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-300" />

            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 relative z-10 ${
                    index !== steps.length - 1 ? "pb-10" : ""
                  } ${status === "pending" ? "opacity-50" : ""}`}
                >
                  <div className="relative z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                        status === "completed" || status === "active" 
                          ? "bg-green-500"
                          : status === "declined" 
                          ? "bg-red-500"
                          : "bg-slate-600" 
                      }`}
                    >
                      {status === "completed" && <Check size={16} />}
                      {status === "declined" && <X size={16} />}
                      {status === "active" && <Check size={16} />} 
                    </div>
                  </div>

                  <div>
                    <h3 className="text-gray-800 font-semibold">
                      {status === "declined" ? "Declined" : step.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {submitted && (
        <div className="w-full max-w-md flex justify-end mt-10">
          <Link to="/smsform">
            <button className="w-40 bg-pink-500 text-white py-2 rounded-3xl hover:bg-pink-600 transition">
              Contact us
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Tracking;
