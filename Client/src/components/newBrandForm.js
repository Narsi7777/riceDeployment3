import React,{useState} from "react";
import "./newBrandForm.css"
const NewBrandForm=({onSubmit,onCancel})=>{
    const [brandDetails,setBrandDetails]=useState({
        brandName:"",
        quantity:"",
        cost:""
    })
    const handleInputChange=(e)=>{
        const {name,value}=e.target
        setBrandDetails({...brandDetails,[name]:value})


    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        const {brandName,quantity,cost}=brandDetails
        if(!brandName||!quantity||!cost||parseInt(quantity,10)<0||parseFloat(cost)<0){
            alert("please enter correct details")
            return
        }

        onSubmit({
            nameofthebrand:brandName,
            quantityinpackets:parseInt(quantity,10),
            costofeachpacket:parseFloat(cost),
        })
        setBrandDetails({
            brandName:"",
            quantity:"",
            cost:""
        })
    
    
    }

    return(
        <div className="newBrandFormContainer">
            <h2>ADD NEW BRAND</h2>
            <form onSubmit={handleSubmit}>
                <label>Brand Name</label>
                <br></br>
                <input 
                type="text"
                name="brandName"
                value={brandDetails.brandName}
                onChange={handleInputChange}
                required
                ></input>
                <br></br>
                <label>Quantity</label>
                <input
                type="number"
                name="quantity"
                value={brandDetails.quantity}
                onChange={handleInputChange}
                required
                ></input>
                <label>Rate</label>
                <input
                type="number"
                name="cost"
                value={brandDetails.cost}
                onChange={handleInputChange}
                required
                ></input>
                <div className="formButtons">
                <button className="cancelButton" type="button" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="okButton">OK</button>
                    
                </div>
            </form>

        </div>
    )
}
export default NewBrandForm