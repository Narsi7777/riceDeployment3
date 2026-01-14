const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Add profit for today
router.put("/profits/addProfit", async (req, res) => {
  const { profit } = req.body;

  try {
    const dateResult = await pool.query("SELECT CURRENT_DATE AS today");
    const today = dateResult.rows[0].today;

    const exists = await pool.query("SELECT * FROM profits WHERE date_of_profit = $1", [today]);

    if (exists.rowCount > 0) {
      await pool.query(
        "UPDATE profits SET profit_amount = profit_amount + $1 WHERE date_of_profit = $2",
        [parseFloat(profit), today]
      );
      res.send("Profit updated");
    } else {
      await pool.query("INSERT INTO profits (date_of_profit, profit_amount) VALUES ($1, $2)", [
        today,
        parseFloat(profit),
      ]);
      res.send("Profit inserted");
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Add expenses
router.put("/profits/addExpenses", async (req, res) => {
  const { exes } = req.body;
  if (!exes || isNaN(exes)) return res.status(400).send("Invalid expenses");

  const dateResult = await pool.query("SELECT CURRENT_DATE AS today");
  const today = dateResult.rows[0].today;

  const result = await pool.query(
    "UPDATE profits SET expenses_amount = expenses_amount + $1 WHERE date_of_profit = $2",
    [parseFloat(exes), today]
  );

  if (result.rowCount === 0) {
    return res.status(404).send("No profit record found for today");
  }

  res.send("Expenses updated");
});

// Get today's profits
router.get("/profits/today", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM profits WHERE date_of_profit = CURRENT_DATE");
    res.send(result.rows);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get profit by date
router.get("/profits/date", async (req, res) => {
  const { date } = req.query;
  try {
    const result = await pool.query("SELECT * FROM profits WHERE date_of_profit = $1", [date]);
    res.send(result.rows);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get this month's profit and expenses
router.get("/profits/month", async (req, res) => {
  try {
    const startRes = await pool.query("SELECT DATE_TRUNC('month', CURRENT_DATE) AS start_date");
    const endRes = await pool.query("SELECT (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day') AS end_date");

    const result = await pool.query(
      `SELECT SUM(profit_amount) AS total_profit, SUM(expenses_amount) AS total_expenses 
       FROM profits WHERE date_of_profit BETWEEN $1 AND $2`,
      [startRes.rows[0].start_date, endRes.rows[0].end_date]
    );

    res.send({
      total_profit: parseFloat(result.rows[0].total_profit || 0).toFixed(2),
      total_expenses: parseFloat(result.rows[0].total_expenses || 0).toFixed(2),
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all profits
router.get("/profits", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM profits");
    res.send(result.rows);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
