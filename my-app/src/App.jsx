import { useEffect, useCallback, useState, } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header.jsx';
import DataTable from './components/DataTable.jsx';

function App() {
const [coins, setCoins] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

//fetch data dari API
const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null);

  const api_url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&order=market_cap_desc&per_page=10&page=1&sparkline=false';

  try {
    const response = await fetch(api_url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setCoins(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);

return (
    <div className="app-container">
      <Header/>

      <main className="main-container">
        <DataTable
          coins={coins}
          loading={loading}
          error={error}
          onCoinSelect={() => {}}
        />
      </main>
    </div>
  );
}

export default App;
