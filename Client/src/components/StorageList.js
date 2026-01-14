import React,{useEffect,useState} from "react"
import "./StorageList.css"
import axios from "./api"
import NewBrandForm from "./newBrandForm"
import AllDetails from "../AllDetails";


const StorageList=()=>{
    const [packetsData,setPacketsData]=useState({"millName":"","brandName":"","boughtQuantity":0,"costOfEachPacket":0,"millId":0})
    const [addPacketsClicked,setAddPacketsButton]=useState(false)
    const [millsList,setMillsList]=useState([])
    const [storage,setStorage]=useState([])
    const [visibleInput,setVisibleInput]=useState(null)
    const [packetValue,setPacketValue]=useState("")
    const [buttonClick,setButtonClick]=useState(true)
    const [newBrandButtonClicked,setNewBrandButton]=useState(false)
    const [allButtonClicked,setAllButton]=useState(false)
    useEffect(()=>{
        console.log("use effect calledd")
        const fetchData=async()=>{
            try{
                const responce=await axios.get("/storage")
                console.log(responce)
                setStorage(responce.data)
    
            }catch(err){
                console.log("huhu errreeooe",err.stack)
            }
        }
        fetchData(); 
    },[])
    //console.log("narsi",storage)
    const handleAddButtonClick = (brandName) => {
        setButtonClick(false)
        setVisibleInput({ brandName, action: "add" });
        setPacketValue(""); 
    };

    // Handle Remove button click
    const handleRemoveButtonClick = (brandName) => {
        setButtonClick(false)
        setVisibleInput({ brandName, action: "remove" });
        setPacketValue(""); 
    };
    const handleAddpacketsFromMillButton=async(brandName)=>{
        setAddPacketsButton(true)
        setPacketsData((prevData)=>(
            {
            ...prevData,["brandName"]:brandName,
            }))
        try{
            const result=await axios.get('/mill/all');
            console.log(result.data)
            setMillsList(result.data)
        }catch(error){
            console.log("error in Adding packets from millls",error)
        }
    }
    // handling form ok button

    const handleFormOkButton=async()=>{
        setAddPacketsButton(false)
        console.log(packetsData)
        try{
            const result=await axios.put("/mill/addNewPackets",{packetsData:packetsData})
        }catch(error){
            console.log("error in updating to mill transactiions",error)
        }
    }
    // Handle OK button click
    const handleOkButtonClick = async () => {
        if (!packetValue || packetValue < 0) {
            alert("Please enter a valid number of packets!");
            return;
        }

        const { brandName, action } = visibleInput;

        try {
            const url = `/updateStorage/${brandName}/${action}`;
            await axios.put(url, { addPackets: parseInt(packetValue) });
            const response = await axios.get("/storage");
            setStorage(response.data);

            setVisibleInput(null); 
            setPacketValue(""); 
        } catch (err) {
            console.error("Error updating packets:", err);
        }
        setButtonClick(true)
    };
    const handleNewBrandSubmit=async(newBrand)=>{
        try{
            const url="/storage/addBrand"
            await axios.post(url,newBrand)
            const responce=await axios.get("/storage")
            setStorage(responce.data)
            setNewBrandButton(false)
        }catch(err){
            console.log("Error in Adding New Brand",err)
        }

    }

    const handleCancelNewBrand=()=>{
        setNewBrandButton(false)

    }
    const handleNewBrandButton=()=>{
        setNewBrandButton(true)

    }

    const handleAllButton=()=>{
      setAllButton(true)
    }

    const sortedStorage=storage.sort((a,b)=>{
        return a.nameofthebrand.localeCompare(b.nameofthebrand)
    })
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        if (name === "millId") {
            const selectedMill = millsList.find((mill) => mill.mill_id === parseInt(value, 10));
            if (!selectedMill) {
                console.error("Selected mill not found. Check if millsList contains the correct mill_id values.");
                return;
            }
            setPacketsData((prevData) => ({
                ...prevData,
                millId: selectedMill.mill_id,
                millName: selectedMill.mill_name,
            }));
        } else {
            
            setPacketsData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
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
            <div className="storage-container">
                <div className="new-brand">
                    {
                        newBrandButtonClicked===false&&<button className="newBrandButton" onClick={handleNewBrandButton}>Add New Brand</button>
                    }
                    {
                        allButtonClicked===false&&<button className="add-button" onClick={handleAllButton}>Alll</button>
                    }
                    
                </div>
                {
                    allButtonClicked&&
                    <AllDetails></AllDetails>
                }
                {
                    newBrandButtonClicked&&
                    <NewBrandForm onSubmit={handleNewBrandSubmit} onCancel={handleCancelNewBrand}></NewBrandForm>
                }
                {newBrandButtonClicked===false&&allButtonClicked===false&&<div>
                <h1>Storage Details</h1>
                {sortedStorage.map((item,index)=>(
                    <div className="storage-box" key={index}>
                        <h2>{item.nameofthebrand}</h2>
                        <p>Packets:{item.quantityinpackets}</p>
                        <p>Cost:{item.costofeachpacket}/-</p>
                        <div className="button-container">
                            {buttonClick&&<div>
                            <button className="add-button" onClick={()=>{handleAddButtonClick(item.nameofthebrand)}}>Add Packets</button>
                            <button className="remove-button" onClick={()=>{handleRemoveButtonClick(item.nameofthebrand)}}>Remove Packets</button>
                            <button className="add-button" onClick={()=>{handleAddpacketsFromMillButton(item.nameofthebrand)}}>Add Packets From Mill</button>
                            </div>}
                            {addPacketsClicked&&
                            <div>
                                <form onSubmit={handleFormOkButton}>
                                    <label htmlFor="options">Select Mill</label>
                                    <select
                                    id="options"
                                    name="millId"
                                    required
                                    value={packetsData.millId||""}
                                    onChange={handleChange}
                                    >
                                    <option value="" disabled>Select An Option</option>
                                    {
                                     millsList.map((item,index)=>(
                                    <option key={index} value={item.mill_id}>{item.mill_name}</option>
                                        ))
                                     }
                                   </select>
                                   <label htmlFor="quantity">Enter Quantity</label>
                                   <input
                                   type="number"
                                   id="quantity"
                                   name="boughtQuantity"
                                   value={packetsData.boughtQuantity}
                                   onChange={handleChange}
                                   required
                                   >
                                   </input>
                                   <input
                                   type="number"
                                   id="cost"
                                   name="costOfEachPacket"
                                   value={packetsData.costOfEachPacket}
                                   onChange={handleChange}
                                   ></input>
                                   <button type="submit">Submit</button>
                                </form>
                            </div>
                            }
                            {visibleInput?.brandName === item.nameofthebrand && (
                            <div>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Enter number of packets"
                                    value={packetValue}
                                    onChange={(e) => setPacketValue(e.target.value)}
                                />
                                <button className="ok-button" onClick={handleOkButtonClick}>OK</button>
                            </div>
                        )}
                        </div>
                    </div>
                ))}
                </div>
                }
            </div>
          
     
    );

}
export default StorageList

