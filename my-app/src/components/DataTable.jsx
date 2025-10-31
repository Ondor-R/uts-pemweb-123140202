import React from 'react';

const DataTable = ({ coins, onCoinSelect, loading, error }) => {
    const formatCurrency = (value) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(value);

    const formatLargeNumber = (value) => 
        new Intl.NumberFormat('id-ID', {
            notation: 'compact',
            compactDisplay: 'short',
        }).format(value);

    //if utk loading, error, dllny
    if (loading) {
        return <div className="data-message"><p>Loading data...</p></div>;
    }

    if (error) {
        return <div className="data-message data-message-error"><p>Error: {error}</p></div>;
    }

    if (!coins.length) {
        return <div className="data-message"><p>No data available.</p></div>;
    }

    return (
        <div className="table-wrapper">
            <table className="data-table">
                <thead>
                <tr>
                    <th scope="col">Koin</th>
                    <th scope="col">Harga</th>
                    <th scope="col">Perubahan 24j</th>
                    <th scope="col">Market Cap</th>
                </tr>
            </thead>
                <tbody>
                    {coins.map((coin) => (
                        <tr key={coin.id} onClick={() => onCoinSelect(coin)}>
                            <td>
                                <div className="coin-info">
                                    <div className="coin-image-wrapper">
                                        <img className="coin-image" src={coin.image} alt={coin.name}/>
                                    </div>
                                    <div className="coin-name">
                                        <div className="coin-name-main">{coin.name}</div>
                                        <div className="coin-name-symbol">{coin.symbol}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{formatCurrency(coin.current_price)}</td>
                            <td>
                                <span className={coin.price_change_percentage_24h > 0 ?'price-change-positive': 'price-change-negative'}>
                                    {coin.price_change_percentage_24h.toFixed(2)}%
                                </span>
                            </td>
                            <td className="market-cap">
                                {formatLargeNumber(coin.market_cap)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;