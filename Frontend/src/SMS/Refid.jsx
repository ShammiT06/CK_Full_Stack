import { Link } from "react-router-dom"
import logo from "../assets/SpinzPink.png"
import { useState } from "react"
import axios from "axios"

const Referenceid = () => {
    const [refid,setrefid]=useState("")


    function checkstatus() {
        axios.get("http://localhost:5000/tracking", {
            params: { refid: refid }   // note carefully
        }).then(() => {
            console.log("Successful");
        });
    }
    




    return (<div>
        <div className="flex justify-center mt-10">
            <img src={logo} />
        </div>
        <p className="text-center text-gray-500 font-inter text-base">Enter Your Reference id to Know Tracking Status</p>

        <div className="flex  justify-center mt-5">
            <input typeof="text" placeholder="Your Reference id" className="p-3 rounded focus:outline-none border border-[#ED174FCC] w-[70%]" value={refid} onChange={(e)=>{setrefid(e.target.value)}} />

        </div>
        <div className="flex justify-center mt-5">
            <button className="bg-[#ed174fcc] p-2 text-white rounded-md" onClick={checkstatus}><Link to={"/tracking"}>Check Status</Link></button>
        </div>

    </div>)

}
export default Referenceid
