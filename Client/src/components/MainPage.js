import React, { useState } from "react";
import CustomersList from "./CustomerList";
import StorageList from "./StorageList";
import "./MainPage.css"; 

const MainPage = () => {
  const [showCustomers, setShowCustomers] = useState(true);
  const [showStorage, setShowStorage] = useState(false);

  const handleCustomersClick = () => {
    console.log("customer button clicked")
    setShowCustomers(true);
    setShowStorage(false);
  };

  const handleStorageClick = () => {
    setShowCustomers(false);
    setShowStorage(true);
  };

  return (
    <div className="main-page">
      <div className="buttons">
        <button onClick={handleCustomersClick}>Customers</button>
        <button onClick={handleStorageClick}>Storage</button>
      </div>

      <div className="content">
        {showCustomers && <CustomersList />}
        {showStorage && <StorageList />}
      </div>
    </div>
  );
};

export default MainPage;
