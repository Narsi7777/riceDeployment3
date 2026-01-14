import React, { useEffect, useState } from "react";
import "./MillsList.css";
import axios from "./api";

const MillsList = () => {
  const [mills, setMills] = useState([]);
  const [visibleInput, setVisibleInput] = useState(null);
  const [amountValue, setAmountValue] = useState("");
  const [buttonClick, setButtonClick] = useState(true);
  const [newMillButtonClicked, setNewMillButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMills = async () => {
      try {
        const response = await axios.get("/mill/all");
        setMills(response.data);
      } catch (err) {
        console.log("Error fetching mills:", err);
      }
    };
    fetchMills();
  }, []);

  const handleAddButtonClick = (millId) => {
    setButtonClick(false);
    setVisibleInput({ millId, action: "add" });
    setAmountValue("");
  };

  const handleRemoveButtonClick = (millId) => {
    setButtonClick(false);
    setVisibleInput({ millId, action: "remove" });
    setAmountValue("");
  };

  const handleOkButtonClick = async (event) => {
    event.preventDefault();
    if (!amountValue || amountValue <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    const { millId, action } = visibleInput;
    try {
      const url =
        action === "add"
          ? `/mill/addAmount/${millId}`
          : `/mill/removeAmount/${millId}`;
      const updateResponse = await axios.put(url, { amount: parseInt(amountValue) });
      console.log("Mill balance updated:", updateResponse);

      const millsResponse = await axios.get("/mill/all");
      setMills(millsResponse.data);
      setVisibleInput(null);
      setAmountValue("");
      try{
        if(action==='remove'){
          //update mill transactions
          const result2=await axios.put('/mill/removeMoney',{amount:parseInt(amountValue),millID:millId})
          console.log("millTransactions Updatedd (Removeee)")
        }
      }catch(err){
        console.log("errorrr",err)
      }
      
    } catch (err) {
      console.error("Error updating mill balance:", err);
      alert("Error updating mill balance");
    }

    setButtonClick(true);
  };

  const handleNewMillSubmit = async (newMill) => {
    try {
      const url = "/mill/createMill";
      await axios.post(url, newMill);
      const response = await axios.get("/mill/all");
      setMills(response.data);
      setNewMillButton(false);
    } catch (err) {
      console.log("Error adding new mill", err);
    }
  };

  const handleCancelNewMill = () => {
    setNewMillButton(false);
  };

  const handleNewMillButton = () => {
    setNewMillButton(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMills = mills.filter(
    (mill) =>
      mill.mill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mill.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMills = [...filteredMills].sort((a, b) => {
    const nameA = a.mill_name ? a.mill_name : "";
    const nameB = b.mill_name ? b.mill_name : "";

    return nameA.localeCompare(nameB);
  });
   const role = localStorage.getItem("role");
if (role !== "admin") {
  return (
    <div className="access-denied">
      <h2>Access Denied</h2>
      <p>You do not have permission to view this page. Please contact admin.</p>
    </div>
  );
}
  return (
    <div className="mills-container">
      <div className="new-mill">
        {newMillButtonClicked === false && (
          <button className="newMillButton" onClick={handleNewMillButton}>
            Add New Mill
          </button>
        )}
      </div>

      {newMillButtonClicked && (
        <div className="new-mill-form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNewMillSubmit({
                mill_name: e.target.name.value,
                location: e.target.address.value,
                amount_due: 0, // Default value for new mill
              });
            }}
          >
            <input type="text" name="name" placeholder="Mill Name" required />
            <input
              type="text"
              name="address"
              placeholder="Mill Address"
              required
            />
            <button type="submit">Add Mill</button>
            <button type="button" onClick={handleCancelNewMill}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {newMillButtonClicked === false && (
        <div className="details">
          <h1>Mill Details</h1>

          <input
            type="text"
            className="search-box"
            placeholder="Search by name or address"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {sortedMills.map((mill, index) => (
            <div className="mill-box" key={index}>
              <h2>{mill.mill_name}</h2>
              <p>Amount Due: {mill.amount_due}</p>
              <p>Address: {mill.location}</p>
              <p>Phone: {mill.phone_number}</p>
              <div className="button-container">
                {buttonClick && (
                  <div>
                    <button
                      className="add-button"
                      onClick={() => {
                        handleAddButtonClick(mill.mill_id);
                      }}
                    >
                      Add Payment
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => {
                        handleRemoveButtonClick(mill.mill_id);
                      }}
                    >
                      Remove Payment
                    </button>
                  </div>
                )}

                {visibleInput?.millId === mill.mill_id && (
                  <div>
                    <form onSubmit={handleOkButtonClick}>
                      <input
                        type="number"
                        placeholder="Enter Amount"
                        value={amountValue}
                        onChange={(e) => setAmountValue(e.target.value)}
                        required
                      />
                      <button type="submit">Submit</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MillsList;
