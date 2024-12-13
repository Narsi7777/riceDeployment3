import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TodaysProfits() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateProfit, setSelectedDateProfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  


  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedDateProfit(null); 
    setLoading(true);
    setError(null);

    const formattedDate = date.toISOString().split("T")[0];

    try {
      const response = await fetch(`/profits/date?date=${formattedDate}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profit data");
      }
      const profitData = await response.json();
      setSelectedDateProfit(profitData.length > 0 ? profitData[0] : null);
    } catch (err) {
      setError("Error fetching profit details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="FirstDiv">
     <h1>{selectedDate ? selectedDate.toDateString() : "No Date Selected"} </h1>


      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
      />
      {loading && <h4>Loading profit details...</h4>}
      {error && <h4 style={{ color: "red" }}>{error}</h4>}
      {!loading && !error && selectedDateProfit ? (
        <div className="box">
          <center>
            <h4>
              Date:{" "}
              <span style={{ fontSize: "1.25rem" }}>
                {new Date(selectedDateProfit.date_of_profit).toLocaleDateString()}
              </span>
            </h4>
          </center>
          <center>
            <h4>
              Profit Amount:{" "}
              <span style={{ color: "blue", fontSize: "2rem" }}>
                {selectedDateProfit.profit_amount || 0}
              </span>
            </h4>
          </center>
          <center>
            <h4>
              Expenses Amount:{" "}
              <span style={{ color: "red", fontSize: "2rem" }}>
                {selectedDateProfit.expenses_amount || 0}
              </span>
            </h4>
          </center>
          <center>
            <h4>
              Total Profit:{" "}
              <span style={{ color: "green", fontSize: "2rem" }}>
                {(selectedDateProfit.profit_amount || 0) -
                  (selectedDateProfit.expenses_amount || 0)}
              </span>
            </h4>
          </center>
        </div>
      ) : (
        !loading && !error && <h4>No profit data available for the selected date</h4>
      )}

   

      
   
    </div>
  );
}

export default TodaysProfits;
