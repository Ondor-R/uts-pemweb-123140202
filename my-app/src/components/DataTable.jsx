import React from 'react';

const DataTable = ({ coins, onCoinSelect, loading, error }) => {
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

                </tbody>
            </table>
        </div>
    );
};

export default DataTable;