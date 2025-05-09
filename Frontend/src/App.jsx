import { BrowserRouter, Route, Routes } from "react-router-dom";
import Terms from "./Pages/Terms";
import Camera from "./Pages/Camera";
import Location from "./Pages/Location";
import User from "./Components/User";
import Payment from "./Pages/Payment";
import Reference from "./Pages/Referance";

import AdminLoginPage from "/src/Admin/AdminLogin.jsx"
import Tabs from "./Admin/Tabs.jsx"
import InnerPending from "./Admin/Pending/InnerPending.jsx"
import AdminPayment from "./Admin/AdminPayment.jsx"

import { createContext, useState } from "react";
import Tracking from "./SMS/Tracking.jsx";
import SMSForm from "../src/SMS/SMSForm.jsx";
import SupportRef from "../src/SMS/SupportRef.jsx";
import Dashboard from "./Admin/Dashboard.jsx";
import Pending from "./Admin/Pending/MainPending.jsx";
import InnerHistory from "./Admin/History/InnerHistory.jsx";
import Submission from "./Pages/Submission.jsx";
import OCR from "./Components/OCR.jsx";



const ImageContext = createContext();
const Refcontext = createContext()
const CityContext = createContext()
const RegionContext = createContext()
const MobileContext = createContext()
const LattitudeContext = createContext()
const LongitudeContext=createContext()
const TextContext= createContext()

function App() {
  const [image, setimage] = useState("");
  const [spin, setspin] = useState("")
  const [city, setcity] = useState("")
  const [region, setregion] = useState("")
  const [mobile, setmobile] = useState("")
  const [lattitude, setLattitude] = useState()
  const [longitude,setLongitude]=useState()
  const [text,setText]=useState("")

  return (
    <>
      <ImageContext.Provider value={{ image, setimage }}>
        <Refcontext.Provider value={{ spin, setspin }}>
          <CityContext.Provider value={{ city, setcity }}>
            <RegionContext.Provider value={{ region, setregion }}>
              <MobileContext.Provider value={{ mobile, setmobile }}>
                <LattitudeContext.Provider value={{ lattitude, setLattitude }}>
                  <LongitudeContext.Provider value={{longitude,setLongitude}}>
                    <TextContext.Provider value={{text,setText}}>

                  <BrowserRouter>
                    <Routes>
                      {/* Vendor Page Routes */}
                      <Route path="/" element={<Terms />} />
                      <Route path="/cam" element={<Camera />} />
                      <Route path="/loc" element={<Location />} />
                      <Route path="/pay" element={<Payment />} />
                      <Route path="/ref" element={<Reference />} />
                      <Route path="/info" element={<Submission/>}></Route>
                      {/* Admin Page Routes */}
                      <Route path="/login" element={<AdminLoginPage />} />
                      <Route path="/admin" element={<Tabs />} />
                      <Route path="/pending/:id" element={<InnerPending />} />
                      <Route path="/payout" element={<AdminPayment />} />
                      <Route path="/dash" element={<Dashboard />}></Route>
                      <Route path="/ocr" element={<OCR/>}></Route>
                      <Route path="/pend" element={<Pending />}>~</Route>
                      <Route path="/history/:id" element={<InnerHistory/>}></Route>
                      {/* SMS Routes */}
                      <Route path="/tracking" element={<Tracking />} />
                      <Route path="/smsform" element={<SMSForm />} />
                      <Route path="/supportRef" element={<SupportRef />} />
                    </Routes>
                  </BrowserRouter>
                  </TextContext.Provider>
                  </LongitudeContext.Provider>
                </LattitudeContext.Provider>
              </MobileContext.Provider>
            </RegionContext.Provider>
          </CityContext.Provider>
        </Refcontext.Provider>
      </ImageContext.Provider>
    </>
  );
}

export default App;
export { ImageContext };
export { Refcontext }
export { CityContext }
export { RegionContext }
export { MobileContext }
export {LattitudeContext}
export {LongitudeContext}
export {TextContext}