import { Link } from "react-router-dom"
import Spinz from "../Components/Spinz"
import { useEffect } from "react"


function Terms() {


    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:"smooth"
        })

    },[])



    return (<>
        <div className="mt-[60px] ">
            <Spinz />
            <h1 className="text-[22px] font-open p-5" style={{ fontWeight: "700" }}>Terms of Service</h1>
            <div className="text-[13px] font-inter p-5 indent-12 text-justify">
                <p className="mb-3">By requesting a Cavinkart Spinz product sample, you agree to the following terms and conditions. This offer is valid only for individuals residing in India who are 18 years or older. Each participant is eligible for only one sample, subject to availability and while stocks last.</p>
                <p className="mb-3">Cavinkart reserves the right to modify, extend, or cancel the offer at any time without prior notice. The sample is intended for personal use only and must not be sold or distributed for commercial purposes. Delivery timelines may vary, and Cavinkart is not responsible for any delays, incorrect addresses, or failed deliveries due to unforeseen circumstances.</p>
                <p className="mb-3">By participating, you consent to Cavinkart collecting and using your personal information for processing your request and future promotional communication, as per our Privacy Policy. You may opt out of such communications at any time. Cavinkart makes no warranties regarding the suitability of the product, and users are advised to check ingredients for potential allergens before use. Cavinkart shall not be held liable for any reactions, damages, or losses arising from the use of the sample. In case of disputes, Cavinkart’s decision shall be final and binding.</p>
                <p className="mb-1">You may opt out of such communications at any time. Cavinkart makes no warranties regarding the suitability of the product, and users are advised to check ingredients for potential allergens before use. Cavinkart shall not be held liable for any reactions, damages, or losses arising from the use of the sample. In case of disputes, Cavinkart’s</p>
            </div>
            <div className="flex justify-center items-center mb-10 gap-10">
                <button className="bg-baby p-[10px] text-[#ED174FCC] rounded-full w-[160px] h-[52px] border border-[#ED174FCC] text-[14px] font-semibold">Disagree</button>
                <button className="bg-dark p-[10px] w-[160px] h-[52px] rounded-full text-white text-[14px] font-semibold"><Link to={"/cam"}>Agree & Continue</Link></button>
            </div>
        </div>
    </>)
}
export default Terms