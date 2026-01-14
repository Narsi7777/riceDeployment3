const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Create a mill
router.post("/mill/createMill", async (req, res) => {
  const { mill_name, location, amount_due } = req.body;

  try {
    await pool.query(
      "INSERT INTO mills (mill_name, location, amount_due) VALUES ($1, $2, $3)",
      [mill_name, location, amount_due]
    );
    res.status(200).send("Mill added");
  } catch (err) {
    console.error("Error inserting mill:", err);
    res.status(400).send({ error: err.message });
  }
});

// Add money to mill
router.put("/mill/addAmount/:id", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    await pool.query("UPDATE mills SET amount_due = amount_due + $1 WHERE mill_id = $2", [amount, id]);
    res.status(200).send("Amount added");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Remove money from mill
router.put("/mill/removeAmount/:id", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    await pool.query("UPDATE mills SET amount_due = amount_due - $1 WHERE mill_id = $2", [amount, id]);
    res.status(200).send("Amount removed");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all mills
router.get("/mill/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mills");
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get total amount from mills
router.get("/mill/allAmount", async (req, res) => {
  try {
    const result = await pool.query("SELECT SUM(amount_due) FROM mills");
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Add new packet purchase from mills
router.put("/mill/addNewPackets", async (req, res) => {
  const { packetsData } = req.body;

  const values = [
    parseInt(packetsData.millId, 10),
    "buy",
    parseInt(packetsData.boughtQuantity, 10) * parseInt(packetsData.costOfEachPacket),
    packetsData.brandName || null,
    parseInt(packetsData.boughtQuantity, 10) || null,
    parseFloat(packetsData.costOfEachPacket) || null,
  ];

  try {
    await pool.query(
      "INSERT INTO mill_transactions (mill_id, transaction_type, amount, rice_brand, rice_quantity, rice_price) VALUES ($1, $2, $3, $4, $5, $6)",
      values
    );
    res.status(200).send("Mill transaction recorded");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Record a payment to mill
router.put("/mill/removeMoney", async (req, res) => {
  const { amount, millID } = req.body;

  try {
    await pool.query("INSERT INTO mill_transactions (mill_id, transaction_type, amount) VALUES ($1, $2, $3)", [
      parseInt(millID),
      "pay",
      parseInt(amount),
    ]);
    res.status(200).send("Payment recorded");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
