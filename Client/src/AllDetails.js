import React, { useEffect, useState } from "react";
import axios from "axios";

const AllDetails = () => {
  const [storageData, setStorageData] = useState({});
  const [millsTotal, setMillsTotal] = useState(0);
  const [customerData, setCustomerData] = useState([]);

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

    fetchAllData();
  }, []);

  return (
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
  },
  title: {
    fontSize: "1.5em",
    color: "#333",
    marginBottom: "15px",
    fontWeight: "600",
  },
  amount: {
    fontSize: "2em",
    color: "#FF5722",
    margin: "10px 0",
  },
};

export default AllDetails;
