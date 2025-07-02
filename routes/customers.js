const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/customers/allDetails", async (req, res) => {
  try {
    const result = await pool.query("SELECT SUM(outstanding_balance) FROM customers");
    res.status(200).send({ totalAmount: result.rows[0].sum });
  } catch (err) {
    res.status(400).send("Cannot get customer details...");
  }
});

router.get("/customers", async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM customers");
    res.status(200).send(response.rows);
  } catch (err) {
    console.log("Error retrieving customers", err);
    res.status(500).send("Server error");
  }
});

router.post("/customers/addCustomer", async (req, res) => {
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

router.put("/addBalance/:customerId", async (req, res) => {
  const { customerId } = req.params;
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).send("Invalid amount");

  try {
    const result = await pool.query(
      `UPDATE customers SET outstanding_balance = outstanding_balance + $1 
       WHERE customer_id = $2 RETURNING outstanding_balance;`,
      [amount, customerId]
    );
    if (result.rowCount === 0) return res.status(404).send("Customer not found");

    res.send({
      message: "Balance added successfully",
      newBalance: result.rows[0].outstanding_balance,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.put("/removeBalance/:customerId", async (req, res) => {
  const { customerId } = req.params;
  const { amount } = req.body;

  try {
    const balanceResult = await pool.query("SELECT outstanding_balance FROM customers WHERE customer_id = $1", [customerId]);
    if (balanceResult.rowCount === 0) return res.status(404).send("Customer not found");

    const currentBalance = balanceResult.rows[0].outstanding_balance;
    if (currentBalance < amount) return res.status(400).send("Insufficient balance");

    const result = await pool.query(
      `UPDATE customers SET outstanding_balance = outstanding_balance - $1 WHERE customer_id = $2 RETURNING outstanding_balance;`,
      [amount, customerId]
    );
    res.send({ message: "Balance removed", newBalance: result.rows[0].outstanding_balance });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/custNameAddress", async (req, res) => {
  const { customerId } = req.query;
  try {
    const result = await pool.query(`SELECT name AS "customerName", address AS "custAddr" FROM customers WHERE customer_id=$1`, [customerId]);
    res.status(200).send(result.rows[0]);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

module.exports = router;
