import { useContext, useEffect, useRef, useState } from "react";
import logo from "../assets/SpinzPink.png";
import tick from "../assets/Vector.png";
import scanner from "../assets/scanner.png";
import { Link, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { CityContext, ImageContext, LattitudeContext, LongitudeContext, MobileContext, Refcontext, RegionContext, TextContext } from "../App";
import axios from 'axios';
import { Phone } from "lucide-react";
import Submission from "./Submission";

function Payment() {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(120);
    const [hide, setHide] = useState(false);
    const [verify, setVerify] = useState("Request OTP");
    const [buttonDisable, setButtonDisable] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [scannerVisible, setScannerVisible] = useState(false);
    const [scannerStarted, setScannerStarted] = useState(false);
    const [upiId, setUpiId] = useState("");
    const { image } = useContext(ImageContext);
    const qrRef = useRef(null);
    const qrCodeScannerRef = useRef(null);
    const [user, setUser] = useState("");
    const navigate = useNavigate();
    const { spin, setspin } = useContext(Refcontext);
    const [finalOtp, setFinalOtp] = useState("");
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const { city } = useContext(CityContext);
    const { region } = useContext(RegionContext);
    const { mobile, setmobile } = useContext(MobileContext);
    const { lattitude, setLattitude } = useContext(LattitudeContext);
    const { longitude,setLongitude } = useContext(LongitudeContext);
    // const [imageText, setImageText] = useState("");
    const [shop, setShop] = useState("");
    const [pincode, setPincode] = useState("");
    const {text}=useContext(TextContext)
    const [isRegistered,setIsregistered]=useState(false)
    // const [product,setProduct]=useState()
    //create an input field for product
    

    useEffect(() => {
        const spnz = Date.now();
        const final = Math.floor(20 + Math.random() * 500) + 1;
        setspin(`SPNZ-${spnz}-XYZ-${final}`);
    }, []);

    useEffect(() => {
        if (timer < 0) return;
        const timeInterval = setInterval(() => setTimer(prev => prev - 1), 900);
        return () => clearInterval(timeInterval);
    }, [timer]);

    useEffect(() => {
        if (scannerVisible && !scannerStarted && qrRef.current) {
            const html5QrCode = new Html5Qrcode("qr-reader");
            qrCodeScannerRef.current = html5QrCode;

            html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    const match = decodedText.match(/upi:\/\/pay\?pa=([^&]+)/);
                    if (match && match[1]) {
                        const extractedUpiId = decodeURIComponent(match[1]);
                        setUpiId(extractedUpiId);
                        html5QrCode.stop().then(() => {
                            setScannerVisible(false);
                            setScannerStarted(false);
                        });
                    }
                },
                (errorMessage) => {
                    console.log(`Scan error: ${errorMessage}`);
                }
            );
            setScannerStarted(true);
        }
    }, [scannerVisible, scannerStarted]);




// Haversine formula to get distance in meters
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the earth in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

useEffect(() => {
  if (mobile.length === 10) {
    axios
      .get(`http://localhost:5000/user_fill?mobilenumber=${mobile}`)
      .then((data) => {
       
        if (data.data && data.data.name) {
          const userLat = parseFloat(data.data.lattitude);
          const userLng = parseFloat(data.data.longitude);
          
          // Get current location from browser
          navigator.geolocation.getCurrentPosition((position) => {
            const currentLat = position.coords.latitude;
            const currentLng = position.coords.longitude;
           

            const distance = getDistanceFromLatLonInMeters(
              userLat,
              userLng,
              currentLat,
              currentLng
            );

            console.log("Distance in meters:", distance);

            if (distance <= 50) {
              setIsregistered(true);
              setUser(data.data.name);
              setmobile(data.data.mobile);
              setShop(data.data.shopname);
              setPincode(data.data.pincode);
              setUpiId(data.data.upiid);
              setLattitude(data.data.lattitude)
              setLongitude(data.data.longitude)
            } else {
              setIsregistered(false);
        //       console.log(data.data.lattitude)
        // console.log(data.data.longitude)
              alert("You are not within 50 meters of your shop location.");
              navigate("/")
            }
          }, (error) => {
            console.error("Location Error:", error);
            alert("Unable to get current location.");
            setIsregistered(false);
          });

        } else {
          setIsregistered(false);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setIsregistered(false);
      });
  }
}, [mobile]);


     
    const camera = () => {
        const cameraOutput = document.createElement("input");
        cameraOutput.type = "file";
        cameraOutput.accept = "image/*";
        cameraOutput.capture = "environment";
        cameraOutput.click();
    };

    const Scanner = () => {
        setScannerVisible(true);
    };

    const verifyOtp = () => {
        if (otp == finalOtp) {
            setHide(false);
            setVerify(
                <div className="flex items-center gap-2">
                    <p>Verified</p>
                    <img src={tick} alt="tick" />
                </div>
            );
            setButtonDisable(false);
            setButtonEnabled(true);
        } else if (!otp) {
            alert("OTP not entered");
        } else {
            alert("Invalid OTP");
        }
    }

    


    const uploadData = () => {
        axios.get(`http://localhost:5000/date?number=${mobile}`).then((res) => {
            const registeredAt = res.data.registered_at

            if (!registeredAt) {
              axios.post("http://localhost:5000/user", {user,mobile,upiId,image,spin,city,region,shop,pincode,lattitude,longitude})
                .then(() => {
                  console.log("Data Sent Successfully (New User)");
                })
                .catch(() => {
                  console.log("Error in sending Data");
                });
          
              setTimeout(() => {
                navigate("/ref");
              }, 2000);
          
              return
            }
          
        
            const lastDate = new Date(registeredAt)
            const currentDate = new Date()           
            console.log("Last Date:", lastDate)
            console.log("Current Date:", currentDate)
            
            
            const diff = currentDate - lastDate;
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            
            
            lastDate.setDate(lastDate.getDate() + 7);
            
            
            const futureDate = lastDate.toISOString().split('T')[0];
            
          
            if (diff > sevenDays) {
              axios.post("http://localhost:5000/user", {user,mobile,upiId,image,spin,city,region,shop,pincode,lattitude,longitude})
                .then(() => {
                  console.log("Data Sent Successfully (Old User)");
                })
                .catch(() => {
                  console.log("Error in sending Data");
                });
          
              setTimeout(() => {
                navigate("/ref");
              }, 2000);
            } else {
              alert(`You Already done for the Week 
                Please try again on ${futureDate}`);
              setTimeout(() => {
                navigate("/");
              }, 1000);
            }
          });
          
       
    };

    const requestOtp = () => {
        axios.post("http://localhost:5000/otp", { mobile }).then((data) => {
            const newOtp = data.data.otp;
            setFinalOtp(newOtp);
        });
        setTimeout(() => {
            setHide(true);
            setButtonDisable(true);
        }, 1000);
    };

    return (
        <div className="overflow-hidden">
            <div className="mt-28 px-5">
                <img src={logo} alt="logo" />
            </div>

            <div className="p-5">
                <img src={image} alt="Please Capture Again" className="w-80" />
                <input
                    type="text"
                    placeholder="Enter Your Code"
                    className="mt-5 border border-black p-2 rounded-md w-80"
                    value={text}
                    onChange={(e) => setImageText(e.target.value)}
                />
            </div>
           {
            isRegistered? <div>

            <div className="p-5">
                <div className="flex flex-col">
                    <label className="font-inter text-1xl font-medium">Name</label>
                    <input
                        type="text"
                        className="w-full h-[52px] p-5 border rounded-lg border-[#D1D1D1] mt-2 placeholder:font-inter outline-none"
                        placeholder="Enter your name"
                        value={user}
                        readOnly
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <div className="mt-3">
                        <label className="font-inter font-medium text-1xl">Shop Name</label>
                        <input type="text" readOnly value={shop} onChange={(e) => setShop(e.target.value)} placeholder="Enter shop name" className="w-full h-[52px] p-5 border rounded-lg border-[#D1D1D1] mt-2 placeholder:font-inter outline-none" />
                    </div>
                    <div>
                        <label>Pincode</label>
                        <input type="number" readOnly value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Enter Pincode" className="w-full h-[52px] p-5 border rounded-lg border-[#D1D1D1] mt-2 placeholder:font-inter outline-none" />
                    </div>

                    <div className="mt-8">
                        <label className="font-inter text-1xl font-medium">Registered Mobile Number</label>
                        <div className="mt-4 w-full flex gap-3">
                            <input
                                type="text"
                                value="+91"
                                readOnly
                                className="w-[52px] h-[52px] border rounded-lg p-3 text-xs font-normal font-inter"
                            />
                            <div className="flex gap-5 items-center border rounded-[10px]">
                                <input
                                    type="tel"
                                    maxLength="10"
                                    required
                                    className="outline-none font-inter font-normal text-base w-full h-[19px] pr-4 pl-4"
                                    value={mobile}
                                    readOnly
                                    onChange={(e) => setmobile(e.target.value)}
                                />
                                <button
                                    className={`pl-8 text-sm w-full text-[#ED174FCC] font-inter font-semibold ${buttonDisable ? "text-gray-600" : "text-[#ED174FCC]"}`}
                                    disabled={buttonDisable}
                                    onClick={requestOtp}
                                >
                                    {verify}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {hide && (
                    <div className="mt-5">
                        <p className="font-inter text-1xl font-medium">OTP</p>
                        <div className="flex w-full justify-center gap-4">
                            <input type="number" required maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Your OTP" className="w-full p-4 rounded-lg font-inter text-lg border mt-2 border-pink-500 outline-none" />
                        </div>

                        <div className="flex items-center justify-between w-full gap-24 mt-14">
                            <h1 className="font-satoshi font-medium text-base">
                                OTP will Expire in:
                                <span className="ml-1 font-satoshi font-bold text-[#EE5557]">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
                            </h1>
                            <button
                                className="w-[113px] h-[52px] rounded-full border bg-[#ED174FCC] text-white font-inter text-[14px] font-semibold"
                                onClick={verifyOtp}
                            >
                                Verify OTP
                            </button>
                        </div>
                        <h1 className="font-satoshi text-base text-center mt-7">Didn't Receive the OTP? <span className="text-[#007AFF] font-bold cursor-pointer" onClick={requestOtp}>Resend OTP</span></h1>
                    </div>
                )}

                <div className="flex flex-col mt-5">
                    <label className="font-inter text-1xl font-medium">UPI ID</label>
                    <div className="w-full h-[52px] px-4 outline-none border rounded-lg flex items-center justify-around mt-4">
                        <input
                            type="text"
                            placeholder="Enter UPI Id"
                            value={upiId}
                            readOnly
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full placeholder:font-inter outline-none"
                        />
                        <img
                            src={scanner}
                            alt="scan"
                            className="w-[20px] h-[20px] cursor-pointer"
                            onClick={Scanner}
                        />
                    </div>
                    <p className="w-full pr-6 text-[14px] font-normal text-[#878787] mt-5">
                        <span>ℹ</span> Enter your UPI ID <b>(e.g., yourname@bank)</b>. You can find it in your UPI app under Profile or Settings
                    </p>
                </div>

                {scannerVisible && (
                    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                        <button
                            className="absolute right-4 top-4 bg-red-600 font-bold p-2 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10"
                            onClick={() => {
                                setScannerVisible(false);
                                qrCodeScannerRef.current?.stop().catch((err) => console.log("Stop error:", err));
                            }}
                        >
                            ✕
                        </button>
                        <div id="qr-reader" ref={qrRef} className="w-full h-full" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                    </div>
                )}
            </div>

            {buttonEnabled ? (
                <div className="mt-2 flex gap-3 p-5">
                    <button className="w-full h-[52px] font-inter font-semibold text-[#ED174FCC] text-sm bg-[#F4F1F5] rounded-full border border-[#ED174FCC]">
                        <Link to={"/"}>Back</Link>
                    </button>
                    <button className="w-full h-[52px] font-inter font-semibold rounded-full bg-[#ED174FCC] text-white" onClick={uploadData}>
                        Submit
                    </button>
                </div>
            ) : (
                <div className="mt-2 p-5">
                    <button
                        className="w-full h-[52px] rounded-full bg-[#ED174FCC] text-white text-[14px] font-inter font-semibold"
                        onClick={camera}
                    >
                        Back to Upload
                    </button>
                </div>
            )}
            </div>: <div>

<div className="p-5">
    <div className="flex flex-col">
        <label className="font-inter text-1xl font-medium">Name</label>
        <input
            type="text"
            className="w-full h-[52px] p-5 border rounded-lg border-[#D1D1D1] mt-2 placeholder:font-inter outline-none"
            placeholder="Enter your name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
        />
        <div className="mt-3">
            <label className="font-inter font-medium text-1xl">Shop Name</label>
            <input type="text" value={shop} onChange={(e) => setShop(e.target.value)} placeholder="Enter shop name" className="w-full h-[52px] p-5 border rounded-lg border-[#D1D1D1] mt-2 placeholder:font-inter outline-none" />
        </div>
        <div>
            <label>Pincode</label>
            <input type="number" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Enter Pincode" className="w-full h-[52px] p-5 border rounded-lg border-[#D1D1D1] mt-2 placeholder:font-inter outline-none" />
        </div>

        <div className="mt-8">
            <label className="font-inter text-1xl font-medium">Registered Mobile Number</label>
            <div className="mt-4 w-full flex gap-3">
                <input
                    type="text"
                    value="+91"
                    readOnly
                    className="w-[52px] h-[52px] border rounded-lg p-3 text-xs font-normal font-inter"
                />
                <div className="flex gap-5 items-center border rounded-[10px]">
                    <input
                        type="tel"
                        maxLength="10"
                        required
                        className="outline-none font-inter font-normal text-base w-full h-[19px] pr-4 pl-4"
                        value={mobile}
                        onChange={(e) => setmobile(e.target.value)}
                    />
                    <button
                        className={`pl-8 text-sm w-full text-[#ED174FCC] font-inter font-semibold ${buttonDisable ? "text-gray-600" : "text-[#ED174FCC]"}`}
                        disabled={buttonDisable}
                        onClick={requestOtp}
                    >
                        {verify}
                    </button>
                </div>
            </div>
        </div>
    </div>

    {hide && (
        <div className="mt-5">
            <p className="font-inter text-1xl font-medium">OTP</p>
            <div className="flex w-full justify-center gap-4">
                <input type="number" required maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Your OTP" className="w-full p-4 rounded-lg font-inter text-lg border mt-2 border-pink-500 outline-none" />
            </div>

            <div className="flex items-center justify-between w-full gap-24 mt-14">
                <h1 className="font-satoshi font-medium text-base">
                    OTP will Expire in:
                    <span className="ml-1 font-satoshi font-bold text-[#EE5557]">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
                </h1>
                <button
                    className="w-[113px] h-[52px] rounded-full border bg-[#ED174FCC] text-white font-inter text-[14px] font-semibold"
                    onClick={verifyOtp}
                >
                    Verify OTP
                </button>
            </div>
            <h1 className="font-satoshi text-base text-center mt-7">Didn't Receive the OTP? <span className="text-[#007AFF] font-bold cursor-pointer" onClick={requestOtp}>Resend OTP</span></h1>
        </div>
    )}

    <div className="flex flex-col mt-5">
        <label className="font-inter text-1xl font-medium">UPI ID</label>
        <div className="w-full h-[52px] px-4 outline-none border rounded-lg flex items-center justify-around mt-4">
            <input
                type="text"
                placeholder="Enter UPI Id"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full placeholder:font-inter outline-none"
            />
            <img
                src={scanner}
                alt="scan"
                className="w-[20px] h-[20px] cursor-pointer"
                onClick={Scanner}
            />
        </div>
        <p className="w-full pr-6 text-[14px] font-normal text-[#878787] mt-5">
            <span>ℹ</span> Enter your UPI ID <b>(e.g., yourname@bank)</b>. You can find it in your UPI app under Profile or Settings
        </p>
    </div>

    {scannerVisible && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <button
                className="absolute right-4 top-4 bg-red-600 font-bold p-2 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10"
                onClick={() => {
                    setScannerVisible(false);
                    qrCodeScannerRef.current?.stop().catch((err) => console.log("Stop error:", err));
                }}
            >
                ✕
            </button>
            <div id="qr-reader" ref={qrRef} className="w-full h-full" style={{ maxWidth: "100%", maxHeight: "100%" }} />
        </div>
    )}
</div>

{buttonEnabled ? (
    <div className="mt-2 flex gap-3 p-5">
        <button className="w-full h-[52px] font-inter font-semibold text-[#ED174FCC] text-sm bg-[#F4F1F5] rounded-full border border-[#ED174FCC]">
            <Link to={"/"}>Back</Link>
        </button>
        <button className="w-full h-[52px] font-inter font-semibold rounded-full bg-[#ED174FCC] text-white" onClick={uploadData}>
            Submit
        </button>
    </div>
) : (
    <div className="mt-2 p-5">
        <button
            className="w-full h-[52px] rounded-full bg-[#ED174FCC] text-white text-[14px] font-inter font-semibold"
            onClick={camera}
        >
            Back to Upload
        </button>
    </div>
)}
</div>
           }
           
        </div>
    );
}

export default Payment;
