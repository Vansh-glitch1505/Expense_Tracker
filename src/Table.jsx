import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

function History() {
  const [rows, setRows] = useState([]);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    axios.get("/api/transactions")
      .then((res) => setRows(res.data))
      .catch((err) => console.error("Error fetching history:", err));
  };

  const handleAddRow = () => {
    const amount = parseFloat(newAmount);
    if (!newName || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid name and amount.");
      return;
    }

    axios.post("/api/withdraw", {
      name: newName,
      amount: amount
    })
      .then((res) => {
        fetchTransactions();  // Refresh history after successful withdraw
        setNewName("");
        setNewAmount("");
      })
      .catch((err) => {
        console.error("Error adding withdrawal:", err);
        alert(err.response?.data?.error || "Something went wrong.");
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Transaction History</h2>
      <Table striped bordered hover>
        <thead style={{ backgroundColor: "#ffc107" }}>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={row.type === "withdrawal" ? "table-danger" : "table-success"}>
              <td>{index + 1}</td>
              <td>{row.type}</td>
              <td>{row.name || "-"}</td>
              <td>₹ {row.amount}</td>
              <td>₹ {row.running_balance}</td>
              <td>{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}

          {/* Row to add new withdrawal */}
          <tr>
            <td>New</td>
            <td>withdrawal</td>
            <td>
              <Form.Control
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                placeholder="Amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </td>
            <td>-</td>
            <td>
              <Button variant="warning" onClick={handleAddRow}>
                Submit
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default History;
