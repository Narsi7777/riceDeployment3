import React,{useEffect,useState} from "react";
import axios from "axios"

const AllDetails=()=>{
const [allData,setAllData]=useState([])

useEffect(()=>{
    const fetchAllData=async()=>{
        try{
            const responce=await axios.get("http://localhost:3000/storage/allDetails")
            setAllData(responce.data)

        }
        catch(err){
            console.log("Error Fetching All Data",err)

        }

    }
    fetchAllData()

},[])

return(
    
        <div style={styles.container}>
          <h1 style={styles.title}>All Data</h1>
          <div style={styles.detailsContainer}>
            <h2 style={styles.totalPackets}>Total Packets: {Number(allData.totalPackets).toLocaleString('en-IN')}</h2>
            <h3 style={styles.totalCost}>
  Total Cost: {Number(allData.totalCost).toLocaleString('en-IN') } /-
</h3>
          </div>
        </div>
    
)

}


const styles = {
    container: {
      padding: "20px",
      textAlign: "center",
      backgroundColor: "#f7f7f7",
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      margin: "50px auto",
    },
    title: {
      fontSize: "2em",
      color: "#333",
      marginBottom: "20px",
      fontWeight: "600",
    },
    detailsContainer: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    totalPackets: {
      fontSize: "1.5em",
      color: "#4CAF50",
      marginBottom: "15px",
    },
    totalCost: {
      fontSize: "1.5em",
      color: "#FF5722",
    },
  };
  
  export default AllDetails;