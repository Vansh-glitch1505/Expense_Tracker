import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

function Amount() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  // Fetch balance when component mounts
  useEffect(() => {
    axios
      .get("/api/balance")
      .then((res) => setBalance(parseFloat(res.data.running_balance) || 0))
      .catch((err) => console.error(err));
  }, []);

  // Listen for balance updates triggered by other components
  useEffect(() => {
    const handleBalanceUpdate = (e) => {
      const newBalance = parseFloat(e.detail);
      if (!isNaN(newBalance)) {
        setBalance(newBalance);
      }
    };

    window.addEventListener("balanceUpdated", handleBalanceUpdate);
    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
    };
  }, []);

  const handleAddMoney = async () => {
    const amountToAdd = parseFloat(amount);
    if (!isNaN(amountToAdd) && amountToAdd > 0) {
      try {
        const res = await axios.post("/api/deposit", { amount: amountToAdd });
        console.log("Deposit success:", res.data);
        const newBalance = parseFloat(res.data.running_balance) || 0;
        setBalance(newBalance);
        setAmount("");

        // Dispatch event to notify others (if needed)
        const event = new CustomEvent("balanceUpdated", {
          detail: newBalance,
        });
        window.dispatchEvent(event);
      } catch (err) {
        console.error("Deposit error:", err);
      }
    } else {
      alert("Please enter a valid positive amount.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
      <Card className="shadow-lg p-4" style={{ width: "40rem", background: "#ffd86b" }}>
        <Card.Title>Your Current Balance</Card.Title>
        <Card.Body className="d-flex flex-column align-items-center">
          <Card.Text className="text" style={{ color: "#ed8200", fontSize: "24px" }}>
            Rs. {balance.toFixed(2)}
          </Card.Text>

          <Form.Control
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            style={{ width: "80%", marginBottom: "10px", padding: "10px" }}
          />

          <Button
            variant="primary"
            onClick={handleAddMoney}
            disabled={!amount || isNaN(parseFloat(amount))}
            style={{ backgroundColor: "#ed8200", border: "none", padding: "15px 30px" }}
          >
            Add Money to Wallet
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Amount;
