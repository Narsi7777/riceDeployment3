import axios from "./api";
import { React, useEffect, useState } from "react";
import "./Profits.css";
import TodaysProfits from "./DateProfits";
const Profits = () => {
  const [todayProfits, setTodayProfits] = useState(null);
 
  const [monthlyProfits, setMonthlyProfits] = useState({ total_profit: 0, total_expenses: 0 });
  const [addExpensesButtonClicked, setAddExpensesButtonClicked] = useState(false);
  const [expensesAmount, setExpensesAmount] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchTodayProfits = async () => {
      try {
        const response = await axios.get("/profits/today");
        setTodayProfits(response.data);
      } catch (err) {
        console.log("Error in fetching Today's profits");
      }
    };



    const fetchMonthlyProfits = async () => {
      try {
        const response = await axios.get("/profits/month");
        setMonthlyProfits(response.data);
      } catch (err) {
        console.log("Error in fetching Monthly profits");
      }
    };

    fetchTodayProfits();
  
    fetchMonthlyProfits();
  }, [updateSuccess]);

  const handleAddExpenses = () => {
    setAddExpensesButtonClicked(true);
  };

  const handleExpensesChange = (event) => {
    setExpensesAmount(event.target.value);
  };

  const handleOkButton = async () => {
    try {
      await axios.put("/profits/addExpenses", {
        exes: expensesAmount,
      });
      setUpdateSuccess(true);
      setAddExpensesButtonClicked(false);
    } catch (err) {
      console.log("Error in updating expenses");
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
    <div>
      
      <div className="mainDiv">
      <div className="FirstDiv">
  <h1>Today's Profits</h1>
  {todayProfits && todayProfits.length > 0 ? (
    todayProfits.map((item, index) => (
      <div key={index} className="box">
        <center>
          <h4>
            Date:{" "}
            <span style={{ fontSize: "1.25rem" }}>
              {new Date(item.date_of_profit).toLocaleDateString()}
            </span>
          </h4>
        </center>
        <center>
          <h4>
            Profit Amount:{" "}
            <span style={{ color: "blue", fontSize: "2rem" }}>
              {item.profit_amount || 0}
            </span>
          </h4>
        </center>
        <center>
          <h4>
            Expenses Amount:{" "}
            <span style={{ color: "red", fontSize: "2rem" }}>
              {item.expenses_amount || 0}
            </span>
          </h4>
        </center>
        <center>
          <h4>
            Total Profit:{" "}
            <span style={{ color: "green", fontSize: "2rem" }}>
              {(item.profit_amount || 0) - (item.expenses_amount || 0)}
            </span>
          </h4>
        </center>
      </div>
    ))
  ) : (
    <h4>No profit data available for today</h4>
  )}

  {addExpensesButtonClicked && (
    <div>
      <label>Expenses:</label>
      <input
        type="number"
        required
        id="expenses"
        name="Expenses"
        value={expensesAmount}
        onChange={handleExpensesChange}
      />
    </div>
  )}

  {addExpensesButtonClicked && (
    <button className="okButton" onClick={handleOkButton}>
      OK
    </button>
  )}

  {!addExpensesButtonClicked && (
    <button className="AddExpensesButton" onClick={handleAddExpenses}>
      Add Expenses
    </button>
  )}
</div>


        <div className="SecondDiv">
          <h1>Monthly Profits and Expenses</h1>
          <div className="box">
            <center>
              <h4>
                Total Monthly Profit:{" "}
                <span style={{ color: "blue", fontSize: "2rem" }}>
                  {monthlyProfits.total_profit || 0}
                </span>
              </h4>
            </center>
            <center>
              <h4>
                Total Monthly Expenses:{" "}
                <span style={{ color: "red", fontSize: "2rem" }}>
                  {monthlyProfits.total_expenses || 0}
                </span>
              </h4>
            </center>
            <center>
              <h4>
                Net Monthly Profit:{" "}
                <span style={{ color: "green", fontSize: "2rem" }}>
                  {(monthlyProfits.total_profit || 0) - (monthlyProfits.total_expenses || 0)}
                </span>
              </h4>
            </center>
          </div>
        </div>
      </div>
      <div className="ThirdDiv">
      
      <div className="box">
        <TodaysProfits />
        </div>
</div>

    </div>
  );
};

export default Profits;
