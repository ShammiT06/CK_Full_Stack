import info from "../assets/info.png"
function Submission()
{
    const lastDate = new Date(registeredAt)
    const currentDate = new Date()           
    console.log("Last Date:", lastDate)
    console.log("Current Date:", currentDate)
    
    
    const diff = currentDate - lastDate;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    
    lastDate.setDate(lastDate.getDate() + 7);
    
    
    const futureDate = lastDate.toISOString().split('T')[0];








    return(<>
        <div className="w-[343px] mt-40 flex flex-col justify-center m-auto border rounded-lg shadow-lg p-2">
        <div className="flex justify-center items-center">
            <div className="flex items-center gap-3 text-[#FF2B31]">
                <img src={info} alt="" />
                <p className="font-inter font-semibold text-sm">Submission Error</p>
            </div>
        </div>
        <p className="p-5 text-center">`Your request already submitted on. You can raise your next request for week 3 in 5 days.</p>
        <button className="bg-[#F04471] text-white rounded-full w-[103px] h-[46px] ml-28 font-inter font-semibold">Close</button>
    </div>
    </>)

}
export default Submission