import React from "react";
import {Link} from "react-router-dom"
import "./NavBar.css"


const NavBar=()=>{
return (
    <div className="navbar">
        <ul className="nav-list">
        <li className="nav-item">
                <Link to="/home" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
                <Link to="/storage" className="nav-link">Storage</Link>
            </li>
            <li className="nav-item">
                <Link to="/mills" className="nav-link">Mills</Link>
            </li>
            <li className="nav-item">
                <Link to="/all-details"  className="nav-link">All Details</Link>
            </li>
           
            <li className="nav-item">
                <Link to="/profits" className="nav-link">Profits</Link>
            </li>
           
            
        </ul>   
    </div>
);
}

export default NavBar;