const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Add a transaction (selling)
router.put("/addTransaction", async (req, res) => {
  const {
    customer_id,
    transaction_date,
    amount,
    transaction_type,
    customer_name,
    address,
    sellingbrand,
    sellingquantity,
    boughtprize,
    sellingprize,
  } = req.body;

  const sql = `
    INSERT INTO transactions (
      customer_id,
      transaction_date,
      amount,
      transaction_type,
      customer_name,
      address,
      sellingbrand,
      sellingquantity,
      boughtprize,
      sellingprize
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    customer_id,
    transaction_date,
    amount,
    transaction_type,
    customer_name,
    address,
    sellingbrand,
    sellingquantity,
    boughtprize,
    sellingprize,
  ];

  try {
    const result = await pool.query(sql, values);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.error("Error inserting transaction:", error);
    res.status(400).send({ error: "Failed to insert transaction" });
  }
});

// Add a transaction (removal)
router.put("/removeTransaction", async (req, res) => {
  const {
    customer_id,
    transaction_date,
    amount,
    transaction_type,
    customer_name,
    address,
  } = req.body;

  const sql = `
    INSERT INTO transactions (
      customer_id,
      transaction_date,
      amount,
      transaction_type,
      customer_name,
      address
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    customer_id,
    transaction_date,
    amount,
    transaction_type,
    customer_name,
    address,
  ];

  try {
    const result = await pool.query(sql, values);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.error("Error inserting removal transaction:", error);
    res.status(400).send({ error: "Failed to insert removal transaction" });
  }
});

// Get added transactions by date
router.post("/addedDetails", async (req, res) => {
  const { formattedDate } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE transaction_date = $1 AND transaction_type = 'add'",
      [formattedDate]
    );
    res.status(200).send(result.rows);
  } catch (err) {
    console.error("Error fetching added details:", err);
    res.status(400).send({ error: err.message });
  }
});

// Get removed transactions by date
router.post("/removedDetails", async (req, res) => {
  const { formattedDate } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE transaction_date = $1 AND transaction_type = 'remove'",
      [formattedDate]
    );
    res.status(200).send(result.rows);
  } catch (err) {
    console.error("Error fetching removed details:", err);
    res.status(400).send({ error: err.message });
  }
});

// Get today's date in ISO format
router.get("/todaysDate", async (req, res) => {
  try {
    const result = await pool.query("SELECT (current_timestamp AT TIME ZONE 'Asia/Kolkata') AS current_date");
    const currentDate = new Date(result.rows[0].current_date).toISOString().split("T")[0];
    res.status(200).json({ current_date: currentDate });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
