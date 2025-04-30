// // import { Link } from "react-router-dom";
// // // import { CheckCircle, Clock } from 'lucide-react';

// // function Tracking() {
// //   return (
// //     <>
// //       <div className=" p-5 flex flex-col justify-center items-center h-screen bg-gray-100">
// //         <div className="w-full text-left text-2xl font-semibold">
// //           Request Tracking
// //         </div>

// //         <div className=" mt-20 mb-64 w-full h-auto">
// //           <div className="max-w-sm w-full mx-auto p-10 rounded-xl border shadow-sm bg-white">
// //             <div className="flex flex-col gap-6 relative">
// //               {/* Vertical Line */}
// //               <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-gray-200 z-0" />

// //               {/* Step 1 - Requested */}
// //               <div className="flex items-start gap-4 z-10">
// //                 {/* <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0 bg-white" /> */}
// //                 <div className="flex flex-col">
// //                   <h3 className="text-gray-800 font-semibold ml-">Requested</h3>
// //                   <div className="flex gap-2">
// //                   <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0" />
// //                   <p className="text-sm text-gray-500">
// //                     Request submitted successfully
// //                   </p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Step 2 - Approved */}
// //               <div className="flex items-start gap-4 z-10">
// //                 {/* <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0 bg-white" /> */}
// //                 <div>
// //                   <h3 className="text-gray-800 font-semibold">Approved</h3>
// //                   <div className="flex items-center text-sm text-gray-500 gap-1">
// //                     {/* <Clock className="w-4 h-4" /> */}
// //                     <span>Waiting for Payment</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Step 3 - Cashback */}
// //               <div className="flex items-start gap-4 z-10 opacity-50">
// //                 <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0" />
// //                 <div>
// //                   <h3 className="text-gray-800 font-semibold">
// //                     Cashback Received
// //                   </h3>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="w-full flex justify-end">
// //           <button
// //             type="submit"
// //             className="w-40 bg-pink-500 text-white py-2 rounded-3xl hover:bg-pink-600 transition"
// //           >
// //             <Link to={"/smsform"}>Contact us</Link>
// //           </button>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // export default Tracking;


// import React from 'react';

// const StatusTracker = () => {
//   return (
//     <div className="w-80 bg-gray-100 p-6 rounded-lg">
//       <div className="flex items-start relative pb-10">
//         <div className="flex flex-col items-center">
//           <div className="w-5 h-5 rounded-full bg-green-500 z-10"></div>
//           <div className="w-px bg-gray-300 flex-1 mt-1"></div>
//         </div>
//         <div className="ml-4">
//           <div className="font-bold text-gray-800">Requested</div>
//           <div className="text-sm text-gray-500">Request submitted successfully</div>
//         </div>
//       </div>

//       <div className="flex items-start relative pb-10">
//         <div className="flex flex-col items-center">
//           <div className="w-5 h-5 rounded-full bg-blue-500 z-10"></div>
//           <div className="w-px bg-gray-300 flex-1 mt-1"></div>
//         </div>
//         <div className="ml-4">
//           <div className="font-bold text-gray-800">Approved</div>
//           <div className="text-sm text-gray-500">Waiting for Payment</div>
//         </div>
//       </div>

//       <div className="flex items-start relative">
//         <div className="flex flex-col items-center">
//           <div className="w-5 h-5 rounded-full bg-gray-300 z-10"></div>
//         </div>
//         <div className="ml-4">
//           <div className="font-bold text-gray-400">Cashback Received</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatusTracker;


import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useEffect } from "react";
import axios from "axios"
function Tracking() {

  // useEffect(()=>{
  //   axios.get("http://localhost:5000/tracking").then((done)=>{
  //     console.log(done)

  //   }).catch((err)=>{
  //     console.log("Errror:",err)
  //   })

  // },[])

  useEffect(()=>{
    axios.get("http://localhost:5000/tracking").then((done)=>[
      console.log(done)
    ])

  },[])



  const currentStatus = "Approved"; // This can be dynamic

  const steps = [
    { title: "Requested", description: "Request submitted successfully" },
    { title: "Approved", description: "Waiting for Payment" },
    { title: "Cashback Received", description: "" },
  ];

  const getStepStatus = (index) => {
    const currentIndex = steps.findIndex((step) => step.title === currentStatus);
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="p-5 flex flex-col justify-start items-center min-h-screen bg-gray-100">
      
      <div className="w-full max-w-md text-left text-2xl font-semibold mb-10">
        Request Tracking
      </div>

      <div className="w-full max-w-md mx-auto p-8 rounded-xl border shadow-sm bg-white relative">
        
        <div className="flex flex-col relative">
          
          {/* Vertical Line */}
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
                {/* Circle */}
                <div className="relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                      status === "completed"
                        ? "bg-green-500"
                        : status === "active"
                        ? "bg-slate-600"
                        : "bg-slate-600"
                    }`}
                  >
                    {status === "completed" && <Check size={16} />}
                  </div>
                </div>

                {/* Step Details */}
                <div>
                  <h3 className="text-gray-800 font-semibold">{step.title}</h3>
                  {step.description && (
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Us Button */}
      <div className="w-full max-w-md flex justify-end mt-10">
        <Link to="/smsform">
          <button
            type="submit"
            className="w-40 bg-pink-500 text-white py-2 rounded-3xl hover:bg-pink-600 transition"
          >
            Contact us
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Tracking;

