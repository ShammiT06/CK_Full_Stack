import React, { use, useEffect, useState } from 'react';
import logo from "../assets/SpinzWhite.png"
import axios from 'axios';
import Header from '../Components/AdminHeader';
import { Link } from 'react-router-dom';

const Dashboard = () => {


    const [dashboard, setdashboard] = useState([])
    const [count,setcount]=useState([])
    const [pending,setpending]=useState([])
    const [approved,setapproved]=useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/bord").then((data) => {
            setdashboard(data.data)
        }).catch(() => {
            console.log("Error")
        })
    }, [])

    useEffect(()=>{
        axios.get("http://localhost:5000/total").then((response)=>{
          setcount(response.data)
        }).catch((err)=>{
          console.log("error:",err)
        })
    
      },[])

      useEffect(()=>{
        axios.get("http://localhost:5000/approved").then((data)=>{
            setapproved(data.data)
        }).catch((err)=>{
            console.log("Error:",err)
        })
      },[])

      useEffect(()=>{
        axios.get("http://localhost:5000/pending").then((data)=>{
            setpending(data.data)
            console.log(data.data)
        }).catch(()=>{
            console.log("Error")
        })
      })


    return (<>
    <div className='relative'> 
        <div className='p-4 bg-pink-500 flex items-center justify-between'>
        <div>
        <img src={logo} alt="" />
        </div>
        <div className='flex gap-[40px]'>
            <button className='p-3 border rounded'><Link to="/admin">Admin</Link></button>
        </div>
        </div>
    </div>
    
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className='mb-5'>
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white shadow p-4 rounded-xl">
                    <h2 className="text-lg font-semibold">Total Vendors</h2>
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                </div>
                <div className="bg-white shadow p-4 rounded-xl">
                    <Link to={"/pend"}>
                    <h2 className="text-lg font-semibold">Pending Requests</h2>
                    <p className="text-2xl font-bold text-yellow-500">{pending}</p>
                    </Link>
                
                </div>
                <div className="bg-white shadow p-4 rounded-xl">
                    <h2 className="text-lg font-semibold">Cashback Paid</h2>
                    <p className="text-2xl font-bold text-green-600">₹1,20,000</p>
                </div>
                <div className="bg-white shadow p-4 rounded-xl">
                    <h2 className="text-lg font-semibold">Approved Request</h2>
                    <p className="text-2xl font-bold text-purple-600">{approved}</p>
                </div>
            </div>

            {/* Table */}
            {/*  */}

            {/* Chart Placeholder */}
            {/* <div className="bg-white shadow p-4 rounded-xl">
                <h2 className="text-xl font-semibold mb-3">Submission Trends</h2>
                <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    [ Chart Goes Here ]
                </div>
            </div> */}
        </div>
        </>
    );
};

export default Dashboard;








// import { useNavigate } from "react-router-dom";
// import logo from "../assets/SpinzPink.png";
// import { useState } from "react";

// const topics = [
//   { name: 'Dashboard', path: '/' },
//   { name: 'Admin', path: '/admin' },
//   { name: 'Payment', path: '/payout' },
//   { name: 'Profile', path: '/profile' },
//   { name: 'Logout', path: '/logout' }
// ];

// export default function App() {
//   const navigate = useNavigate();
//   const [activeTopic, setActiveTopic] = useState('Dashboard');

//   const handleTopicClick = (topic) => {
//     setActiveTopic(topic.name);
//     navigate(topic.path); // 👈 Proper navigation handled here
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/5 bg-gray-800 text-white fixed h-full p-4">
//         <img src={logo} className="mb-6" alt="Logo" />
//         <ul>
//           {topics.map((topic) => (
//             <li
//               key={topic.name}
//               className={`p-2 cursor-pointer rounded hover:bg-gray-700 ${
//                 activeTopic === topic.name ? 'bg-gray-700' : ''
//               }`}
//               onClick={() => handleTopicClick(topic)}
//             >
//               {topic.name}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Content Area */}
//       <div className="ml-[20%] w-[80%] p-6">
//         <h1 className="text-2xl font-bold mb-4">{activeTopic}</h1>
//         {/* Your routed content will render via <Routes> in a parent or separate layout */}
//       </div>
//     </div>
//   );
// }

