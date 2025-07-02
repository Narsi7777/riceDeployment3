const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Get all storage data
router.get("/storage", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Storage");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching storage data", err.stack);
    res.status(500).send("Internal server error");
  }
});

// Update storage column value
router.put("/updateStorage/:name", async (req, res) => {
  const { name } = req.params;
  const { column, value } = req.body;
  if (value === undefined) return res.status(400).send("Missing value");

  try {
    const result = await pool.query(`UPDATE Storage SET ${column}=$1 WHERE nameofthebrand=$2`, [value, name]);
    if (result.rowCount === 0) return res.status(404).send("No record found");
    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    console.error("Update error:", err.stack);
    res.status(400).send("Update failed");
  }
});

// Add packets
router.put("/updateStorage/:name/add", async (req, res) => {
  const { name } = req.params;
  const { addPackets } = req.body;

  if (addPackets === undefined) return res.status(400).send("Missing packet count");

  try {
    const result = await pool.query("SELECT quantityinpackets FROM storage WHERE nameofthebrand=$1", [name]);
    if (result.rowCount === 0) return res.status(404).send("Brand not found");

    const oldPackets = result.rows[0].quantityinpackets;
    const newPackets = oldPackets + addPackets;

    await pool.query("UPDATE Storage SET quantityinpackets=$1 WHERE nameofthebrand=$2", [newPackets, name]);
    res.status(200).json({ message: "Packets added successfully" });
  } catch (err) {
    console.error("Add packet error:", err);
    res.status(400).send("Add failed");
  }
});

// Remove packets
router.put("/updateStorage/:name/remove", async (req, res) => {
  const { name } = req.params;
  const { addPackets } = req.body;

  if (addPackets === undefined) return res.status(400).send("Missing packet count");

  try {
    const result = await pool.query("SELECT quantityinpackets FROM storage WHERE nameofthebrand=$1", [name]);
    if (result.rowCount === 0) return res.status(404).send("Brand not found");

    const oldPackets = result.rows[0].quantityinpackets;
    const newPackets = oldPackets - addPackets;

    await pool.query("UPDATE Storage SET quantityinpackets=$1 WHERE nameofthebrand=$2", [newPackets, name]);
    res.status(200).json({ message: "Packets removed successfully" });
  } catch (err) {
    console.error("Remove packet error:", err);
    res.status(400).send("Remove failed");
  }
});

// Add new brand
router.post("/storage/addBrand", async (req, res) => {
  const { nameofthebrand, quantityinpackets, costofeachpacket, location } = req.body;

  if (!nameofthebrand || !quantityinpackets || !costofeachpacket) {
    return res.status(400).send("Missing brand data");
  }

  try {
    await pool.query("INSERT INTO Storage VALUES ($1, $2, $3, $4)", [quantityinpackets, costofeachpacket, nameofthebrand, location]);
    res.status(200).send("Brand added");
  } catch (err) {
    console.error("Brand insert error:", err);
    res.status(400).send("Insert failed");
  }
});

// Get total storage details
router.get("/storage/allDetails", async (req, res) => {
  try {
    const result1 = await pool.query("SELECT SUM(quantityinpackets) AS totalPackets FROM storage");
    const result2 = await pool.query("SELECT SUM(quantityinpackets * costofeachpacket) AS totalCost FROM storage");

    res.status(200).send({
      totalPackets: result1.rows[0].totalpackets,
      totalCost: result2.rows[0].totalcost,
    });
  } catch (err) {
    res.status(400).send("Failed to fetch summary");
  }
});

module.exports = router;
