import React, { useEffect, useState } from "react";
import "./CustomersList.css";
import axios from "axios";
import AllDetails from "../AllDetails";

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [visibleInput, setVisibleInput] = useState(null);
  const [amountValue, setAmountValue] = useState("");
  const [buttonClick, setButtonClick] = useState(true);
  const [newCustomerButtonClicked, setNewCustomerButton] = useState(false);
  const [allButtonClicked, setAllButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  // Fetch customers from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/customers");
        setCustomers(response.data);
      } catch (err) {
        console.log("Error fetching customers:", err);
      }
    };
    fetchData();
  }, []);

  // Handle Add Payment button click
  const handleAddButtonClick = (customerId) => {
    setButtonClick(false);
    setVisibleInput({ customerId, action: "add" });
    setAmountValue("");
  };

  // Handle Remove Payment button click
  const handleRemoveButtonClick = (customerId) => {
    setButtonClick(false);
    setVisibleInput({ customerId, action: "remove" });
    setAmountValue("");
  };

  // Handle OK button click to submit payment
  const handleOkButtonClick = async () => {
    if (!amountValue || amountValue < 0) {
      alert("Please enter a valid amount!");
      return;
    }

    const { customerId, action } = visibleInput;

    try {
      const url =
        action === "add"
          ? `/addBalance/${customerId}`
          : `/removeBalance/${customerId}`;
      await axios.put(url, { amount: parseInt(amountValue) });

      const response = await axios.get(" /customers");
      setCustomers(response.data);

      setVisibleInput(null);
      setAmountValue("");
    } catch (err) {
      console.error("Error updating customer balance:", err);
    }
    setButtonClick(true);
  };

  // Handle adding new customer
  const handleNewCustomerSubmit = async (newCustomer) => {
    try {
      const url = "/customers/addCustomer";
      await axios.post(url, newCustomer);
      const response = await axios.get("/customers");
      setCustomers(response.data);
      setNewCustomerButton(false); // Hide new customer form after submission
    } catch (err) {
      console.log("Error in Adding New Customer", err);
    }
  };

  const handleCancelNewCustomer = () => {
    setNewCustomerButton(false); // Hide the form if canceled
  };

  const handleNewCustomerButton = () => {
    setNewCustomerButton(true); // Show new customer form when button clicked
  };

  const handleAllButton = () => {
    setAllButton(true); // Show AllDetails when "All" button clicked
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); 
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ensure that customers is always an array before sorting
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const nameA = a.name ? a.name : ''; // Fallback to empty string if undefined
    const nameB = b.name ? b.name : ''; // Fallback to empty string if undefined

    return nameA.localeCompare(nameB);
  });

  return (
    <div className="customers-container">
      <div className="new-customer">
        {newCustomerButtonClicked === false && (
          <button className="newCustomerButton" onClick={handleNewCustomerButton}>
            Add New Customer
          </button>
        )}
        {allButtonClicked === false && (
          <button className="add-button" onClick={handleAllButton}>
            All
          </button>
        )}
      </div>
      {allButtonClicked && <AllDetails />}
        
      {newCustomerButtonClicked && (
        <div className="new-customer-form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNewCustomerSubmit({
                name: e.target.name.value,
                address: e.target.address.value,
              });
            }}
          >
            <input type="text" name="name" placeholder="Customer Name" required />
            <input
              type="text"
              name="address"
              placeholder="Customer Address"
              required
            />
            <button type="submit">Add Customer</button>
            <button type="button" onClick={handleCancelNewCustomer}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {newCustomerButtonClicked === false && allButtonClicked === false && (
        <div className="details">
          <h1>Customer Details</h1>

        
          <input
            type="text"
            className="search-box"
            placeholder="Search by name or address"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {sortedCustomers.map((item, index) => (
            <div className="customer-box" key={index}>
              <h2>{item.name}</h2>
              <p>Amount: {item.outstanding_balance}</p>
              <p>Address: {item.address}</p>
              <p>Phone: {item.phone_number}</p>
              <div className="button-container">
                {buttonClick && (
                  <div>
                    <button
                      className="add-button"
                      onClick={() => {
                        handleAddButtonClick(item.customer_id);
                      }}
                    >
                      Add Payment
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => {
                        handleRemoveButtonClick(item.customer_id);
                      }}
                    >
                      Remove Payment
                    </button>
                  </div>
                )}

                {visibleInput?.customerId === item.customer_id && (
                  <div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={amountValue}
                      onChange={(e) => setAmountValue(e.target.value)}
                    />
                    <button className="ok-button" onClick={handleOkButtonClick}>
                      OK
                    </button>
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

export default CustomersList;
