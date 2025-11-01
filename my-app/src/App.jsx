import { useEffect, useCallback, useState, useMemo} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header.jsx';
import DataTable from './components/DataTable.jsx';
import FilterForm from './components/SearchForm.jsx';
import DetailCard from './components/DetailCard.jsx';

function App() {
const [coins, setCoins] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedCoin, setSelectedCoin] = useState(null);
const [filters, setFilters] = useState({
  searchName: '',
  minPrice: 0,
  maxPrice: Infinity,
  sortBy: 'market_cap_desc',
  priceChange: 'all',
});

//------------------------------------------------------fetch data dari API
const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null);
  setSelectedCoin(null);

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

//------------------------------------------------------Search Form thingy
const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

const filteredAndSortedCoins = useMemo(() => {
  let processedCoins = [...coins]
  .filter((coin) => coin.name.toLowerCase().includes(filters.searchName.toLowerCase()))
  .filter((coin) => coin.current_price >= filters.minPrice && coin.current_price <= filters.maxPrice)
  .filter((coin) => {
    if (filters.priceChange === 'positive')
      return coin.price_change_percentage_24h > 0;
    if (filters.priceChange === 'negative')
      return coin.price_change_percentage_24h < 0;
    return true;
  });

  processedCoins.sort((a, b) => {
    switch (filters.sortBy) {
      case 'market_cap_asc':
        return a.market_cap - b.market_cap;
      case 'price_desc':
        return b.current_price - a.current_price;
      case 'price_asc':
        return a.current_price - b.current_price;
      case 'market_cap_desc':
      default:
        return b.market_cap - a.market_cap;
    }
  });

  return processedCoins;
}, [coins, filters]);

const handleCoinSelect = (coin) => {
  setSelectedCoin(coin);
};

const handleCloseDetail = () => {
  setSelectedCoin(null);
};

//------------------------------------------------------App's return
return (
    <div className="app-container">
      <Header/>

      <main className="main-container">
        <FilterForm onFilterChange={handleFilterChange} />
        <div className="content-grid">

          <div className={selectedCoin ? 'table-container-split' : 'table-container-full'}>
            <DataTable
              coins={filteredAndSortedCoins}
              loading={loading}
              error={error}
              onCoinSelect={handleCoinSelect}
            />
          </div>

          {selectedCoin && (
            <aside className="detail-container">
              <DetailCard coin={selectedCoin} onClose={handleCloseDetail}/>
            </aside>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
