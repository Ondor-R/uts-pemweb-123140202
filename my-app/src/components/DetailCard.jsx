import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DetailCard = ({ coin, onClose }) => {
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!coin) return;

    setChartData([]);
    setAmount('');
    setChartError(null);
    setChartLoading(true);

    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=7`
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        const formattedData = data.prices.map((price) => ({
          date: new Date(price[0]).toLocaleDateString('en-US', {month: 'short',day: 'numeric', }),
          price: price[1],
        }));
        setChartData(formattedData);
      } catch (err) {
        setChartError(err.message);
      } finally {
        setChartLoading(false);
      }
    };
    
    fetchChartData();
  }, [coin]);

  if (!coin) {
    return (
      <div className="detail-card detail-card-placeholder">
        <p>Pilih koin untuk melihat detail</p>
      </div>
    );
  }

  const totalValue = (amount ? parseFloat(amount) : 0) * coin.current_price;

  return (
    <div className="detail-card">
      <div className="detail-header">
        <div className="detail-header-info">
          <img src={coin.image} alt={coin.name} />
          <h2>
            {coin.name} ({coin.symbol.toUpperCase()})
          </h2>
        </div>
        <button onClick={onClose} className="detail-close-button">
          &times;
        </button>
      </div>

      <h3 className="detail-section-title">Grafik 7 Hari</h3>
      <div className="chart-container">
        {chartLoading && <p>Memuat grafik...</p>}
        {chartError && (
          <p className="data-message-error">
            Gagal memuat grafik: {chartError}
          </p>
        )}
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis
                stroke="#9CA3AF"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(val) => `$${val.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E5E7EB' }}
                formatter={(value) => [
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value),
                  'Harga',
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <section className="portfolio-calculator">
        <h3 className="detail-section-title">Kalkulator Portofolio</h3>
        <form className="portfolio-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="amount">Jumlah Koin</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="any"
              placeholder="0.00"
            />
          </div>
          <div>
            <h4 className="portfolio-value-label">Total Nilai Portofolio:</h4>
            <p className="portfolio-value-total">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(totalValue)}
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};

export default DetailCard;