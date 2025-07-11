require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const pool = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// === CORS Configuration ===
const allowedOrigins = [
  "https://ricevault.shop"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// === Helmet (basic security, no CSP) ===
app.use(helmet()); // You can add back CSP after verifying CORS is working

// === Body Parsers ===
app.use(express.json());
app.use(bodyParser.json());

// === Serve Frontend in Production ===
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "Client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Client/build", "index.html"));
  });
}

// === Routes & Middleware ===
const verifyToken = require("./middleware/verifyToken");
const authRoutes = require("./auth");
const customerRoutes = require("./routes/customers");
const storageRoutes = require("./routes/storage");
const millRoutes = require("./routes/mills");
const profitRoutes = require("./routes/profits");
const transactionRoutes = require("./routes/transactions");

app.use("/api/auth", authRoutes);
app.use("/", verifyToken, customerRoutes);
app.use("/", verifyToken, storageRoutes);
app.use("/", verifyToken, millRoutes);
app.use("/", verifyToken, profitRoutes);
app.use("/", verifyToken, transactionRoutes);

// === Chatbot Endpoint ===
app.post("/api/chatbot", verifyToken, async (req, res) => {
  const userQuestion = req.body.query;
  const schema = fs.readFileSync("dbSchema.txt", "utf8");

  const prompt = `You are an intelligent SQL generator bot. Based on the schema below and the user's question, generate a valid SQL query for a PostgreSQL database.

Database Schema:
${schema}

Instructions:
- Use PostgreSQL syntax only (NOT MySQL).
- For date filtering, use EXTRACT(MONTH FROM column) and EXTRACT(YEAR FROM column).
- For name filtering, use: LOWER(name) LIKE LOWER('%<name>%')
- Return only the SQL query. No explanations or markdown.

User Question: ${userQuestion}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL_NAME,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    const completion = await response.json();
    const sql = completion.choices[0].message.content.trim();

    pool.query(sql, async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message, sql });
      }

      const data = results.rows || results;
      const prompt2 = `You are a helpful assistant. A user asked: "${userQuestion}".
We generated and ran this SQL query: ${sql}
Here is the data: ${JSON.stringify(data)}

Based on this data, give a clear and direct answer to the question without explaining the SQL or schema.`;

      const response2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [{ role: "user", content: prompt2 }],
          temperature: 0.2,
        }),
      });

      const finalCompletion = await response2.json();
      const answer = finalCompletion.choices[0].message.content.trim();

      return res.json({
        sql,
        message: "Query executed successfully",
        response: answer,
      });
    });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

// === Start Server ===
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
