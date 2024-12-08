import React,{useEffect,useState} from "react"
import "./StorageList.css"
import axios from "axios"
import NewBrandForm from "./newBrandForm"
import AllDetails from "../AllDetails";



const StorageList=()=>{
    
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
            //alert(`Successfully ${action === "add" ? "added" : "removed"} ${packetValue} packets to/from ${brandName}`);
            
            
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
                            </div>}
                            
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

