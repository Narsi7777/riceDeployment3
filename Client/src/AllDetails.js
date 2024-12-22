import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const AllDetails = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [storageData, setStorageData] = useState({});
  const [millsTotal, setMillsTotal] = useState(0);
  const [customerData, setCustomerData] = useState([]);
  const [todayAddedDetails,setTodayAddedDetails]=useState([])
  const [todayRemovedDetails,setTodayRemovedDetails]=useState([])

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const storageResponse = await axios.get("/storage/allDetails");
        setStorageData(storageResponse.data);

        const millsResponse = await axios.get("/mill/allAmount");
        setMillsTotal(millsResponse.data[0].sum);

        const customerResponse = await axios.get("/customers/allDetails");
        setCustomerData(customerResponse.data);


      } catch (err) {
        console.log("Error Fetching All Data", err);
      }
    };
    handleDateChange(new Date())
    fetchAllData();
  }, []);
  const handleDateChange=async(date)=>{
    setSelectedDate(date)
    const formattedDate = date.toISOString().split("T")[0];
    try{
      const response=await axios.post("/addedDetails",{"formattedDate":formattedDate})
      setTodayAddedDetails(response.data)
      console.log(response.data)
    }catch(errr){
      console.log("errorr in retriving todays AddedDetails",errr)
     }

     try{
      const response=await axios.post("/removedDetails",{"formattedDate":formattedDate})
      setTodayRemovedDetails(response.data)
      console.log(todayRemovedDetails)
    }catch(errr){
      console.log("errror in fetching todays removed details",errr)
    }
    }

    
    let totalQuantity=0;
    for(let i=0;i<todayAddedDetails.length;i++){  
      totalQuantity+=parseInt(todayAddedDetails[i].sellingquantity)
    }

    let totalMoney=0

    for(let i=0;i<todayRemovedDetails.length;i++){
      totalMoney+=parseFloat(todayRemovedDetails[i].amount)
    }
  return (
    <div>
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Total Mills</h2>
        <h3 style={styles.amount}>
          {Number(millsTotal).toLocaleString("en-IN")} /-
        </h3>
      </div>

      <div style={styles.box}>
        <h2 style={styles.title}>All Storage Data</h2>
        <p style={styles.amount}>
          Total Packets: {Number(storageData.totalPackets).toLocaleString("en-IN")}
        </p>
        <h3 style={styles.amount}>
          {Number(storageData.totalCost).toLocaleString("en-IN")} /-
        </h3>
      </div>

      <div style={styles.box}>
        <h2 style={styles.title}>All Customers Total</h2>
        <h3 style={styles.amount}>
          {Number(customerData.totalAmount).toLocaleString("en-IN")} /-
        </h3>
      </div>
    </div>
<br></br>
<br></br>
<hr></hr>
    <div style={{style:styles.tableContainer,"width":"50%"}}>
  <center><h1>Todays Transaction Details</h1></center>
  <center>
  <DatePicker
    selected={selectedDate}
    onChange={handleDateChange}
    dateFormat="yyyy-MM-dd"
  />
  </center>
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.tableHeader}>Name</th>
        <th style={styles.tableHeader}>Selling Brand</th>
        <th style={styles.tableHeader}>Selling Quantity</th>
        <th style={styles.tableHeader}>Selling Price</th>
        <th style={styles.tableHeader}>Total</th>
      </tr>
    </thead>
    <tbody>
      {todayAddedDetails.map((item, index) => (
        <tr key={index} style={styles.tableRow}>
          <td style={styles.tableCell}>{item.customer_name}</td>
          <td style={styles.tableCell}>{item.sellingbrand}</td>
          <td style={styles.tableCell}>{item.sellingquantity}</td>
          <td style={styles.tableCell}>{item.sellingprize}</td>
          <td style={styles.tableCell}>
            {item.sellingquantity * item.sellingprize}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <p style={styles.totalText}>Total Packets Sold Today</p>
  <h1 style={styles.totalValue}>{totalQuantity}</h1>
</div>
<br></br>
<br></br>
<hr></hr>
<div style={{style:styles.tableContainer,"width":"50%"}}>
  <center><h1>Todays Money Transaction Details</h1></center>
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.tableHeader}>Name</th>
        <th style={styles.tableHeader}>Amount</th>
      </tr>
    </thead>
    <tbody>
      {todayRemovedDetails.map((item, index) => (
        <tr key={index} style={styles.tableRow}>
          <td style={styles.tableCell}>{item.customer_name}</td>
          <td style={styles.tableCell}>{item.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
  <p style={styles.totalText}>Total Money Collected Today</p>
  <h1 style={styles.totalValue}>{totalMoney}</h1>
  </div>

    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    margin: "0 auto",
  },
  box: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    fontSize:"1.5rem",
    color:"#FF5722"
  },
  tableContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "200%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableHeader: {
    backgroundColor: "#FF5722",
    color: "#ffffff",
    textAlign: "left",
    padding: "12px",
    border: "1px solid #dddddd",
  },
  tableRow: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #dddddd",
    transition: "background-color 0.3s ease",
  },
  tableRowHover: {
    backgroundColor: "#f1f1f1",
  },
  tableCell: {
    padding: "12px",
    border: "1px solid #dddddd",
    textAlign: "left",
  },
  totalText: {
    fontSize: "1.2em",
    color: "#333",
    marginTop: "10px",
    textAlign: "center",
  },
  totalValue: {
    fontSize: "2em",
    color: "#FF5722",
    fontWeight: "bold",
    textAlign: "center",
  },

  "@media (max-width: 768px)": {
    tableContainer: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width: "50%",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
    },
    tableHeader: {
      fontSize: "0.8em", 
    },
    tableCell: {
      fontSize: "0.9em", 
    },
    totalText: {
      fontSize: "1em", 
    },
    totalValue: {
      fontSize: "1.5em", 
    },
  },
};


export default AllDetails;
