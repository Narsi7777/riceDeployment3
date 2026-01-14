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
import Login from "./Login"
import SignUp from "./SignUp"
import Dashboard from "./Dashboard"
import ProtectedRoute from "./ProtectedRoute"
const App=()=>{
    return (
        <div>
       
        <Router>
        <NavBar/>
            <Routes>
                <Route path="/home" element={<MainPage/>}></Route>
                <Route path="/storage" element={<StorageList/>}></Route>
                <Route path="/mills" element={<MillsList/>}></Route>
                <Route path="/all-details" element={<div><AllDetails/></div>}></Route>
                <Route path="/profits" element={<Profits/>}></Route>
                <Route path="/sell" element={<SellForm/>}></Route>
                <Route path="/chatbot" element={<ChatBot/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/signup" element={<SignUp/>}></Route>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
        </div>
        
    )
}


export default App;