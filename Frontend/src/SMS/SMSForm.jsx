import { Link } from "react-router-dom";
import { useContext, useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Refcontext } from "../App";

function SMSForm() {
  const [username, setusername] = useState("");
  const [mobile, setmobile] = useState("");
  const [email, setemail] = useState("");
  const [description, setdescription] = useState("");
  const [media, setmedia] = useState(null);
  const [loading, setLoading] = useState(false); // Add a loading state to manage loading status
  const navigate=useNavigate()
  const {setspin}=useContext(Refcontext)


  
  useEffect(()=>{
    const Random= Math.floor(202500000+Math.random()*30000)
  const last= Math.floor(10+Math.random()*300)+1
  setspin(`SPNZ-${Random}-XYZ${last}`)
  },[])

  // Make the function async to handle await properly
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setmedia(false);
      return;
    }

    setLoading(true); // Set loading state to true before uploading

    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "user_documents");
    formdata.append("cloud_name", "dl0qctpk2");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dl0qctpk2/image/upload", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      setmedia(data.url); // Update media with the URL from Cloudinary
      setLoading(false); // Set loading state to false after successful upload

      console.log("Image uploaded successfully:", data.url); // For debugging
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  const handlemail = () => {
    if (!username || !mobile || !email || !description || !media) {
      alert("Please fill in all the fields and upload a file.");
      return;
    } else {
      axios
        .post("http://localhost:5000/mail", { username, mobile, email, description, media })
        .then((response) => {
          console.log("Datasent Successfully")

        })
        .catch((error) => {
          console.error("Error in sending email:", error);
        });
    }
    setTimeout(()=>{
      navigate("/supportRef")

    },1000)
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-pink-500 mb-4">Fill the form with issue</h2>

      {/* Username */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          placeholder="Ajay"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Mobile Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
        <input
          type="number"
          value={mobile}
          placeholder="+91 9565XXXXX"
          onChange={(e) => setmobile(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email id</label>
        <input
          type="email"
          placeholder="abc@gmail.com"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Describe</label>
        <textarea
          rows="3"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        ></textarea>
      </div>
      
      {/* Media Upload */}
      <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center bg-pink-50">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-pink-500 text-4xl">📁</div>
          <p className="text-sm text-gray-600">Drag your file(s) to start uploading</p>
          <span className="text-xs text-gray-400">OR</span>

          <label className="cursor-pointer bg-pink-100 text-pink-600 border border-pink-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-200 transition">
            Browse files
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Image Preview */}
        {media && media.startsWith("http") && (
          <div className="mt-4">
            <img
              src={media}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-2 flex gap-3 p-5">
        <button className="w-full h-[52px] font-inter font-semibold text-[#ED174FCC] text-sm bg-[#F4F1F5] rounded-full border border-[#ED174FCC]">
          <Link to={"/tracking"}>Cancel</Link>
        </button>
        <button
          onClick={handlemail}
          className="w-full h-[52px] font-inter font-semibold rounded-full bg-[#ED174FCC] text-white"
        >
          {loading ? "Uploading..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default SMSForm;
