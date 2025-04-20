import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import Head from './Head';
import Footer from './Footer';
import Amount from './Amount';
import History from './Table';
import Chart from '../Chart';
import axios from 'axios';

function App() {
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState([]);

  const fetchBalance = async () => {
    try {
      const res = await axios.get("/api/balance");
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  const fetchChartData = async () => {
    try {
      const res = await axios.get("/api/chart-data");
      setChartData(res.data);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchChartData();
  }, []);

  return (
    <StrictMode>
      <Head />
      <Amount balance={balance} />
      <History onTransactionAdded={() => {
        fetchBalance();
        fetchChartData();
      }} />
      <Chart chartData={chartData} />
      <Footer />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<App />);
