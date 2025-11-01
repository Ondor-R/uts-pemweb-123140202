import { useEffect, useCallback, useState, useMemo} from 'react'
import './App.css'
import Header from './components/Header.jsx';
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

        {/* Refresh data button*/}
        <div className="refresh-button-container">
          <button onClick={fetchData} disabled={loading} className="refresh-button">
            {loading ? (
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                      <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
                  </path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clip-rule="evenodd" />
              </svg>

            )}
            {loading ? 'Me-refresh...' : 'Refresh Data'}
          </button>
        </div>
        
        {/*content-grid: DataTable & DataCard*/}
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
