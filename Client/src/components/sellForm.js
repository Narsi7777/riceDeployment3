import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellForm = () => {
    const navigate=useNavigate()
  const [riceBrands, setRiceBrands] = useState([]); 
  const [sellingData, setSellingData] = useState({
    sellBrand: "",
    sellQuantity: 0,
    sellPrice: 0,
  }); 
  useEffect(() => {
    const fetchRiceBrands = async () => {
      try {
        const brands = await axios.get("/storage");
        setRiceBrands(brands.data);
      } catch (err) {
        console.log("Error fetching customers:", err);
      }
    };
    fetchRiceBrands();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSellingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleOkButtonClick = async (event) => {
    event.preventDefault();

    // Validate input data
    if (sellingData.sellQuantity < 0 || sellingData.sellPrice < 0) {
      alert("Please enter a valid amount or quantity!");
      return;
    }
    let currentDate=0;
    try{
      const resultX=await axios.get("/todaysDate")
      currentDate=resultX.data['current_date']
      console.log("todays date is ",currentDate)

    }catch(err){
      console.log("error in getting current date or name",err)
    }
   
    try {
      const response = await axios.put(
        `/updateStorage/${sellingData.sellBrand}/remove`,
        {
          addPackets: parseInt(sellingData.sellQuantity),
        }
      );
      console.log("Storage updated:", response);
    } catch (err) {
      console.log("Error updating storage:", err);
      alert("Error updating storage");
      return;
    }

    // Calculate profit
    const boughtBrand = riceBrands.find(
      (item) => item.nameofthebrand === sellingData.sellBrand
    );
    const boughtBrandCost = boughtBrand.costofeachpacket;
    const profit =
      parseFloat(sellingData.sellPrice) - parseFloat(boughtBrandCost);
    const totalProfit = profit * parseFloat(sellingData.sellQuantity);

    // Update profit
    try {
      const profitResult = await axios.put(`/profits/addProfit`, {
        profit: totalProfit,
      });
      console.log(profitResult);
    } catch (err) {
      console.log("error in updating profit", err);
    }


    
    try{
      const transResult=await axios.put('/addTransaction',{
        customer_id: 84,
        transaction_date: currentDate,
        amount: parseInt(sellingData.sellPrice) * parseInt(sellingData.sellQuantity),
        transaction_type: "add",
        customer_name: "outsider",
        address: "null",
        sellingbrand: sellingData.sellBrand,
        sellingquantity: parseInt(sellingData.sellQuantity),
        boughtprize: parseFloat(boughtBrandCost),
        sellingprize: parseFloat(sellingData.sellPrice),
      })
      console.log("transaction result",transResult.data)
    }catch(err){
      console.log("error in updating transactions table",err)
      return;
    }


    navigate("/")
  };

  // Render form
  return (
    <div>
        <form onSubmit={handleOkButtonClick}>
      <label htmlFor="options">Choose Rice Brand</label>
      <select
        id="options"
        name="sellBrand"
        required
        value={sellingData.sellBrand}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select An Option
        </option>
        {riceBrands.map((item, index) => (
          <option
            key={index}
            value={item.nameofthebrand}
          >{`${item.nameofthebrand} (${item.quantityinpackets}) (${item.costofeachpacket})`}</option>
        ))}
      </select>

      <label htmlFor="quantity">Enter Quantity</label>
      <input
        type="number"
        id="quantity"
        name="sellQuantity"
        value={sellingData.sellQuantity}
        onChange={handleChange}
        required
      ></input>

      <label htmlFor="price">Enter Selling Price</label>
      <input
        type="number"
        id="price"
        name="sellPrice"
        value={sellingData.sellPrice}
        onChange={handleChange}
        required
      ></input>

      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default SellForm;
