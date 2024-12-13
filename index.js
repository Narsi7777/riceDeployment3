const express=require('express')
const pool=require('./config/db')
const cors=require("cors")
const app=express()
const path=require("path")
const port=process.env.PORT||3000



app.use(cors())
app.use(express.json())
//app.use(express.static("./Client/build"))
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"Client/build")))
}
//all storage operations

app.get('/storage',async(req,res)=>{
try{
    const result=await pool.query('select * from Storage')
    res.status(200).json(result.rows)
}
catch(err){
    console.log('error in fetching data from storage',err.stack)
    res.status(500).send('An Error Occurrrreddd')
}
})


app.put('/updateStorage/:name',async(req,res)=>{
    const name=req.params.name
    const {column,value}=req.body
    console.log("Column is ",column)
    if (value===undefined){
        return res.status(400).send("Missing Price Value")
    }
    try{
        const result=await pool.query(`update Storage set ${column}=$1 where nameofthebrand=$2`,[value,name])
        if(result.rowCount===0){
            return res.status(404).send("No record found to update..")
        }
        console.log("Updated Record",result.rows[0])
        res.status(200).json(result.rows[0])    
    }
    catch(err){
        console.log("error in fetching data",err.stack)
        res.status(400).send("not found")
    }
})
//adding newPackets
app.put('/updateStorage/:name/add',async(req,res)=>{
    const name=req.params.name
    const {addPackets}=req.body
    console.log("Packets To add is",addPackets)
    if (addPackets===undefined){
        return res.status(400).send("Missing No of Packets To Addd")
    }
    try{
        const result=await pool.query(`select nameofthebrand,quantityinpackets from storage where nameofthebrand=$1`,[name])
        if(result.rowCount===0){
            return res.status(404).send("No record found to Addd")
        }
            console.log("Name is",result.rows[0]["nameofthebrand"])
            console.log("Old Quantity is",result.rows[0]["quantityinpackets"])
            oldPackets=result.rows[0]["quantityinpackets"]
            newPackets=oldPackets+addPackets
            const result2=await pool.query(`update Storage set quantityinpackets=$1 where nameofthebrand=$2`,[newPackets,name])
            if(result2.rowCount===0){
                return res.status(404).send("Record Not Found To update")
            }
        
        console.log("Record Updated")
        res.status(200).json(result2.rows[0])    
    }
    catch(err){
        console.log("error in fetching data",err.stack)
        res.status(400).send("not found")
    }
})

//removing packets

app.put('/updateStorage/:name/remove',async(req,res)=>{
    const name=req.params.name
    const {addPackets}=req.body
    console.log("Packets To Remove is",addPackets)
    if (addPackets===undefined){
        return res.status(400).send("Missing No of Packets To Addd")
    }
    try{
        const result=await pool.query(`select nameofthebrand,quantityinpackets from storage where nameofthebrand=$1`,[name])
        if(result.rowCount===0){
            return res.status(404).send("No record found to Addd")
        }
            console.log("Name is",result.rows[0]["nameofthebrand"])
            console.log("Old Quantity is",result.rows[0]["quantityinpackets"])
            oldPackets=result.rows[0]["quantityinpackets"]
            newPackets=oldPackets-addPackets
            const result2=await pool.query(`update Storage set quantityinpackets=$1 where nameofthebrand=$2`,[newPackets,name])
            if(result2.rowCount===0){
                return res.status(404).send("Record Not Found To update")
            }
        
        console.log("Record Updated")
        res.status(200).json(result2.rows[0])    
    }
    catch(err){
        console.log("error in fetching data",err.stack)
        res.status(400).send("not found")
    }
})


//add new brand

app.post("/storage/addBrand",async(req,res)=>{
    const {nameofthebrand,quantityinpackets,costofeachpacket,location}=req.body    
    console.log("hehe",nameofthebrand,quantityinpackets,costofeachpacket,location)
    if(nameofthebrand===undefined||quantityinpackets===undefined||costofeachpacket===undefined){
        return res.status(400).send("SomeThing Is Missing....")
    }
    try{
        const result=await pool.query(`insert into Storage values($1,$2,$3,$4)`,[nameofthebrand,quantityinpackets,costofeachpacket,location])
        console.log(result)
        return res.status(200).send("Insertion successfullll")
    }catch(err){
        if(err.code==="23505"){
            return res.status(400).send(err.stack)
        }
        return res.status(400).send(err.stack)
    }
      
})

app.get("/storage/allDetails",async(req,res)=>{
    try{
        const result=await pool.query("select sum(quantityinpackets) as totalPackets from storage")
        const result2=await pool.query("select sum(quantityinpackets*costofeachpacket) as totalCost from Storage")
        //console.log(result)
        //console.log(result2)
        

        const temp={
            "totalPackets":result.rows[0]["totalpackets"],
            "totalCost":result2.rows[0]["totalcost"]
        }
        console.log("cost is",temp["totalCost"])
        return res.status(200).send(temp)

    }catch(err){
        return res.status(400).send("Cannot get Detailssssss")
    }
})
// all customer operations

app.get('/customers/allDetails',async(req,res)=>{
    try{
        const result=await pool.query("select sum(outstanding_balance) from customers")
        const total=result.rows[0]["sum"]
        console.log(total)
        return res.status(200).send({"totalAmount":total})

    }
    catch(err){
        return res.status(400).send("cannot get details...")
    }

})

app.get("/customers",async(req,res)=>{
    try{
        const response=await pool.query("select * from customers")
        console.log(response.rows)
        res.status(200).send(response.rows)
    }catch(err){
        console.log("error in retriving custoimer data ",err)
    }
})

app.put('/addBalance/:customerId', async (req, res) => {
    const { customerId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send('Invalid amount');
    }

    try {
        // Update customer's outstanding balance
        const updateQuery = `
            UPDATE customers
            SET outstanding_balance = outstanding_balance + $1
            WHERE customer_id = $2
            RETURNING outstanding_balance;
        `;
        const result = await pool.query(updateQuery, [amount, customerId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Customer not found');
        }

        res.send({
            message: 'Balance added successfully',
            newBalance: result.rows[0].outstanding_balance,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to remove balance
app.put('/removeBalance/:customerId', async (req, res) => {
    const { customerId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send('Invalid amount');
    }

    try {
        // Check current balance before subtracting
        const balanceQuery = `
            SELECT outstanding_balance FROM customers WHERE customer_id = $1;
        `;
        const balanceResult = await pool.query(balanceQuery, [customerId]);

        if (balanceResult.rowCount === 0) {
            return res.status(404).send('Customer not found');
        }

        const currentBalance = balanceResult.rows[0].outstanding_balance;

        if (currentBalance < amount) {
            return res
                .status(400)
                .send('Insufficient balance to remove the specified amount');
        }

        // Update customer's outstanding balance
        const updateQuery = `
            UPDATE customers
            SET outstanding_balance = outstanding_balance - $1
            WHERE customer_id = $2
            RETURNING outstanding_balance;
        `;
        const result = await pool.query(updateQuery, [amount, customerId]);

        res.send({
            message: 'Balance removed successfully',
            newBalance: result.rows[0].outstanding_balance,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/customers/addCustomer", async (req, res) => {
    const { name, address } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO customers (name, address) VALUES ($1, $2) RETURNING *",
        [name, address]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error adding customer", err);
      res.status(500).send("Server error");
    }
  });






app.post("/mill/createMill",async(req,res)=>{
   try{
    const {mill_name,location,amount_due}=req.body
    console.log(mill_name,location,amount_due)
    const result=await pool.query(`insert into mills (mill_name,location,amount_due) values ($1,$2,$3)`,[mill_name,location,amount_due])
    console.log(result)
    res.status(200).send("Data Received");
   }
   catch(err){
        console.log("Error occured",err)
        res.status(400).send({"Error":err})
   }
})

app.put("/mill/addAmount/:id",async(req,res)=>{
    try{
        const id=req.params.id
        const {amount}=req.body
        const result=await pool.query(`update mills set amount_due=amount_due+$1 where mill_id=$2`,[amount,id])
        res.status(200).send(result)
    }catch(err){
        res.status(400).send({"error":err})
    }

})
app.put("/mill/removeAmount/:id",async(req,res)=>{
    try{
        const id=req.params.id
        const {amount}=req.body
        const result=await pool.query(`update mills set amount_due=amount_due-$1 where mill_id=$2`,[amount,id])
        res.status(200).send(result)
    }catch(err){
        res.status(400).send({"error":err})
    }
})

app.get("/mill/all", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM mills")
        res.status(200).send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(400).send({"error":err});
    }
});

app.get("/mill/allAmount",async(req,res)=>{
    try{
        const result=await pool.query("select sum(amount_due) from mills")
        res.status(200).send(result.rows)
    }
    catch(err){
        res.status(400).send({"error":err})
    }
})


    app.put("/profits/addProfit",async(req,res)=>{
        const {profit}=req.body

        try{
            const todayDate=await pool.query("select to_char(current_date, 'DD-MM-YYYY') as current_date")
            
            const formattedDate=todayDate.rows[0]["current_date"]
            const result=await pool.query(`select * from profits where date_of_profit=$1`,[formattedDate])
            if (result.rowCount > 0) {
               try{
                    const result2=await pool.query(`update profits set profit_amount=profit_amount+$1 where date_of_profit=$2`,[parseFloat(profit),formattedDate])
                    res.status(200).send("Updation successful into profits table")
                }catch(err){
                console.log("Error in Updationd Into Profits",err)
                res.status(400).send(err)
               }
                
            } else {
                try{
                    const resss=await pool.query(`insert into profits (date_of_profit,profit_amount) values ($1,$2)`,[formattedDate,parseFloat(profit)])
                    res.status(200).send("insertion successful into profits table")
                }catch(err){
                    console.log("Error in Inserting Into Profits",err)
                    res.status(400).send(err)
                }
            }

        
    }catch(err){
        console.log("Error in adding profits",err)
        res.status(400).send({"Error in adding profits":err})
    }

})
app.get("/profits/today",async(req,res)=>{
    try{
        const result=await pool.query("select * from profits where date_of_profit=current_date")
        res.status(200).send(result.rows)

    }catch(err){
        console.log("Error in fetching profits")
        res.status(400).send(err)
    }
})
app.get("/profits/date", async (req, res) => {
    try {
      const { date } = req.query; 
      const result = await pool.query(
        "SELECT * FROM profits WHERE date_of_profit = $1",
        [date]
      );
      res.status(200).send(result.rows);
    } catch (err) {
      console.log("Error in fetching profits");
      res.status(400).send(err);
    }
  });
  
app.get("/profits/month", async (req, res) => {
    try {
      // Get the start and end dates of the current month
      const startDate = await pool.query("SELECT TO_CHAR(DATE_TRUNC('month', CURRENT_DATE), 'YYYY-MM-DD') AS start_date");
      const endDate = await pool.query("SELECT TO_CHAR(DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day', 'YYYY-MM-DD') AS end_date");
  
      // Query to fetch both the total profit and total expenses for the current month
      const result = await pool.query(
        `SELECT 
          SUM(profit_amount) AS total_profit, 
          SUM(expenses_amount) AS total_expenses
         FROM profits
         WHERE date_of_profit BETWEEN $1 AND $2`,
        [startDate.rows[0].start_date, endDate.rows[0].end_date]
      );
  
      // Extract the total profit and expenses from the result
      let totalProfit = result.rows[0].total_profit;
      let totalExpenses = result.rows[0].total_expenses;
  
      // Handle null values (if no profit or expenses for the current month)
      if (totalProfit === null) {
        totalProfit = 0.00;
      } else {
        totalProfit = parseFloat(totalProfit).toFixed(2);
      }
  
      if (totalExpenses === null) {
        totalExpenses = 0.00;
      } else {
        totalExpenses = parseFloat(totalExpenses).toFixed(2);
      }
  
      // Send the result as the response
      res.status(200).send({
        total_profit: totalProfit,
        total_expenses: totalExpenses
      });
    } catch (err) {
      console.log("Error in fetching profits and expenses for this month:", err);
      res.status(400).send({ "Error": err.message });
    }
  });
  
  
  
app.get("/profits/all",async(req,res)=>{
    try{
        const result=await pool.query("select * from profits")
        res.status(200).send(result.rows)

    }catch(err){
        console.log("Error in fetching profits")
        res.status(400).send(err)
    }
})

app.put("/profits/addExpenses",async(req,res)=>{
    try{
        const {exes}=req.body
        const todayDate=await pool.query("select to_char(current_date, 'DD-MM-YYYY') as current_date")
        const formattedDate=todayDate.rows[0]["current_date"]
        const response=await pool.query(`update profits set expenses_amount=expenses_amount+$1 where date_of_profit=$2`,[exes,formattedDate])
        res.status(200).send("Expenses Amount Updated Successfullyy")
    }catch(err){
        res.status(400).send({"Error in expenses amount updation":err})
    }

})

/*
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"Client/build/index.html"))

})
*/
app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})