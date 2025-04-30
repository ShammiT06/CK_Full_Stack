import { Link } from "react-router-dom";
import Reusablespinz from "../Components/Reusablespinz";
import "../Css/camera.css";

function Camera() {
   return (
        <>
            <Reusablespinz />
            <div className="bg-opacity-60 bg-gray-800 flex justify-center items-center" id="cam">
                <div className="w-[270px] h-[168px] bg-[#404040] rounded-2xl text-white">
                    <div id="container">
                    <h1 className="font-inter font-semibold text-[16px]">
                        “Spinz” Would Like to Access <span className="ml-14">to the Camera</span>
                    </h1>
                    <p className="font-inter text-[13px] p-1 font-medium">
                        To take pictures and detect the data
                    </p>
                    </div>
                    <div className="w-full mt-[10px] flex font-inter font-medium">
                        <button className="border border-[#787878] w-[260px] h-[44px] text-[#5A91F7] rounded-bl-2xl">
                            <Link to={"/"}>Don't Allow</Link>
                        </button>
                        <button
                            className="border border-[#787878] w-[260px] h-[44px] text-[#5A91F7] rounded-br-2xl"
                            // onClick={openCameraApp}

                            
                        ><Link to={'/loc'}>Ok</Link>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Camera;
