
import { useContext, useEffect, useRef, useState } from "react";
import logo from "../assets/SpinzPink.png";
import tick from "../assets/Vector.png";
import scanner from "../assets/scanner.png";
import { Link, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { CityContext, ImageContext, MobileContext, Refcontext, RegionContext, TextContext } from "../App";
import axios from 'axios'

function Payment() {
    const [otp, setOtp] = useState([]);
    const [timer, settimer] = useState(120)
    const [hide, sethide] = useState(false);
    const [verify, unverify] = useState("Request OTP");
    const [buttondisable, setdisable] = useState(false);
    const [button, setbutton] = useState(false);
    const [scannerVisible, setScannerVisible] = useState(false);
    const [scannerStarted, setScannerStarted] = useState(false);
    const [upiId, setUpiId] = useState("");
    const { image } = useContext(ImageContext);
    const qrRef = useRef(null);
    const qrCodeScannerRef = useRef(null);
    const [user, setuser] = useState("")
    const navigate = useNavigate()
    const { spin, setspin } = useContext(Refcontext)
    const [finalotp, setfinalotp] = useState("")
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const {city}=useContext(CityContext)
    const {region}=useContext(RegionContext)
    const {mobile, setmobile}= useContext(MobileContext)
    const {recognized}=useContext(TextContext)

    const [imageText,setImagetext]=useState("")




    useEffect(() => {
        const spnz = Date.now()
        const final = Math.floor(20 + Math.random() * 500) + 1
        setspin(`SPNZ-${spnz}-XYZ-${final}`)
        console.log(spin)
    }, [])

    useEffect(() => {
        if (timer < 0) {
            return 
        }
        const time = setInterval(() => {
            settimer(prev => prev - 1)
        }, 900)
        return () => clearInterval(time)

    }, [timer])



    useEffect(() => {
        if (scannerVisible && !scannerStarted && qrRef.current) {
            const html5QrCode = new Html5Qrcode("qr-reader");
            qrCodeScannerRef.current = html5QrCode;

            html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: 250,
                },
                (decodedText) => {
                    // console.log("Scanned:", decodedText);
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


    


    function camera() {
        const cameraoutput = document.createElement("input");
        cameraoutput.type = "file";
        cameraoutput.accept = "image/*";
        cameraoutput.capture = "environment";
        cameraoutput.click();
    }


    function Scanner() {
        setScannerVisible(true);
    }

    function verified() {
        // console.log(finalotp)

        if (otp == finalotp) {
            sethide(false);
            unverify(
                <div className="flex items-center gap-2">
                    <p>Verified</p>
                    <img src={tick} alt="tick" />
                </div>
            );
            setdisable(false);
            setbutton(true);

        }
        else if (!otp) {
            alert("otp not entered")
        }
        else {
            alert("Invalid OTP")
        }



    }

    const dataupload = () => {
        axios.post("http://localhost:5000/user", { user, mobile, upiId, image, spin,city,region}).then(() => {
            console.log("Data Sent Successfully")

        }).catch(() => {
            console.log("Error in sending Data")
        })

        setTimeout(() => {
            navigate("/ref")
        }, 2000)

    }

    const core = () => {
        axios.post("https://localhost:5000/otp", { mobile: mobile })
            .then((data) => {
                // console.log("Success:",data.data.otp)
                let newotp = data.data.otp
                setfinalotp(newotp)

            })
        setTimeout(() => {
            sethide(true)
            setdisable(true)
        }, 1000)
    }
    // console.log(finalotp)

    return (
        <div className="overflow-hidden">
            <div className="mt-28 px-5">
                <img src={logo} alt="logo" />
              
            </div>
       
            <div className="p-5">
                <img src={image} alt="Please Capture Again" className="w-80" />
                <input type="text" placeholder="Enter Your Code" className="mt-5 border border-black p-2 rounded-md w-80" />

            </div>

            <div className="p-5">
                <div className="flex flex-col">
                    <label className="font-inter text-1xl font-medium">Name</label>
                    <input
                        type="text"
                        className="w-full h-[52px] p-5 border rounded-lg border-[#D1D1D1] mt-2 placeholder:font-inter outline-none"
                        placeholder="Enter your name"
                        value={user}
                        onChange={(e) => { setuser(e.target.value) }}
                    />

                    <div className="mt-8">
                        <label className="font-inter text-1xl font-medium">
                            Registered Mobile Number
                        </label>
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
                                    onChange={(e) => { setmobile(e.target.value) }}
                                />
                                <button
                                    className={`pl-8 text-sm w-full text-[#ED174FCC] font-inter font-semibold ${buttondisable ? "text-gray-600" : "text-[#ED174FCC]"
                                        }`}
                                    disabled={buttondisable}
                                    onClick={core}
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
                            <input type="number" required maxLength="6" value={otp} onChange={(e) => { setOtp(e.target.value) }} placeholder="your OTP" className="w-full p-4 rounded-lg font-inter text-lg border mt-2 border-pink-500 outline-none" />
                        </div>

                        <div className="flex items-center justify-between w-full gap-24 mt-14">
                            <h1 className="font-satoshi font-medium text-base">
                                OTP will Expire in:
                                <span className="ml-1 font-satoshi font-bold text-[#EE5557]">{`${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`}</span>
                            </h1>
                            <button
                                className="w-[113px] h-[52px] rounded-full border bg-[#ED174FCC] text-white font-inter text-[14px] font-semibold"
                                onClick={verified}
                            >
                                Verify OTP
                            </button>
                        </div>
                        <h1 className="font-satoshi text-base  text-center mt-7">Didn't Recive the OTP ? <span className="text-[#007AFF] font-bold cursor-pointer" onClick={core}>Resend OTP</span></h1>
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
                        <span>ℹ</span> Enter your UPI ID <b>(e.g., yourname@bank)</b>. You can
                        find it in your UPI app under Profile or Settings
                    </p>
                </div>

                {scannerVisible && (
                    <div className="relative w-[350px] h-[450px] mx-auto mt-5 border rounded-xl">
                        <button
                            className="absolute right-4 top-2 bg-red-600 font-bold p-2~  text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md z-10"
                            onClick={() => {
                                setScannerVisible(false);
                                if (qrRef.current) {
                                    const html5QrCode = new Html5Qrcode("qr-reader");
                                    html5QrCode.stop().catch((err) => console.log("Stop error:", err));
                                }
                            }}
                        >
                            ✕
                        </button>
                        <div id="qr-reader" ref={qrRef} className="w-full h-full" />
                    </div>
                )}
            </div>

            {button ? (
                <div className="mt-2 flex gap-3 p-5">
                    <button className="w-full h-[52px] font-inter font-semibold text-[#ED174FCC] text-sm bg-[#F4F1F5] rounded-full border border-[#ED174FCC]">
                        <Link to={"/"}>Back</Link>
                    </button>
                    <button className="w-full h-[52px] font-inter font-semibold rounded-full bg-[#ED174FCC] text-white" onClick={dataupload}>
                        {/* <Link to={"/ref"}>Submit</Link> */} Submit
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
    );
}

export default Payment;
