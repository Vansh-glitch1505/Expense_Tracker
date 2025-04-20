import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  user: "postgres",         // replace with your DB user
  host: "localhost",
  database: "Expense_Tracker",       // replace with your DB name
  password: "Vansh@1505", // replace with your DB password 
  port: 5432,
});

// Get current balance
app.get("/api/balance", async (req, res) => {
  const result = await pool.query(
    "SELECT running_balance FROM expense_tracker ORDER BY id DESC LIMIT 1"
  );
  res.json({ running_balance: result.rows[0]?.running_balance || 0 });
});

// Deposit money
app.post("/api/deposit", async (req, res) => {
    try {
      const { amount } = req.body;
      const latest = await pool.query(
        "SELECT running_balance FROM expense_tracker ORDER BY id DESC LIMIT 1"
      );
      const currentBalance = parseFloat(latest.rows[0]?.running_balance || 0);
      const newBalance = currentBalance + parseFloat(amount) ;
  
      const insert = await pool.query(
        "INSERT INTO expense_tracker (type, name, amount, running_balance) VALUES ('deposit', NULL, $1, $2) RETURNING running_balance",
        [amount, newBalance]
      );
      console.log("New balance after deposit:", newBalance); // ✅ For Debugging
      res.json({ running_balance: insert.rows[0].running_balance });
    } catch (err) {
      console.error("Error in POST /api/deposit:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

// Withdraw money
app.post("/api/withdraw", async (req, res) => {
  const { name, amount } = req.body;
  const latest = await pool.query(
    "SELECT running_balance FROM expense_tracker ORDER BY id DESC LIMIT 1"
  );
  const currentBalance = latest.rows[0]?.running_balance || 0;

  if (amount > currentBalance) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  const newBalance = currentBalance - amount;

  const insert = await pool.query(
    "INSERT INTO expense_tracker (type, name, amount, running_balance) VALUES ('withdrawal', $1, $2, $3) RETURNING running_balance",
    [name, amount, newBalance]
  );

  res.json(insert.rows[0]);
});

// New endpoint to fetch all deposits and withdrawals
app.get("/api/transactions", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT type, name, amount, running_balance, created_at FROM expense_tracker ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




app.listen(5000, () => console.log("Server running on port 5000"));
