import React from "react"
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import AllDetails from "../AllDetails"
import StorageList from "./StorageList"
import MainPage from "./MainPage"
import NavBar from "./NavBar"
import Profits from "./Profits"
import MillsList from "./MillList"
import SellForm from "./sellForm"
import ChatBot from "./ChatBot"
const App=()=>{
    return (
        <div>
       
        <Router>
        <NavBar/>
            <Routes>
                <Route path="/" element={<MainPage/>}></Route>
                <Route path="/storage" element={<StorageList/>}></Route>
                <Route path="/mills" element={<MillsList/>}></Route>
                <Route path="/all-details" element={<div><AllDetails/></div>}></Route>
                <Route path="/profits" element={<Profits/>}></Route>
                <Route path="/sell" element={<SellForm/>}></Route>
                <Route path="/chatbot" element={<ChatBot/>}></Route>
            </Routes>
        </Router>
        </div>
        
    )
}


export default App;