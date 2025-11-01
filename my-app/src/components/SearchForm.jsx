import React, { useState, useEffect } from 'react';

const FilterForm = ({ onFilterChange }) => {
    const [searchName, setSearchName] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('market_cap_desc');
    const [priceChange, setPriceChange] = useState('all');

    useEffect(() => {
        onFilterChange({
        searchName,
        minPrice: minPrice ? Number(minPrice) : 0,
        maxPrice: maxPrice ? Number(maxPrice) : Infinity,
        sortBy,
        priceChange,
        });
    }, [searchName, minPrice, maxPrice, sortBy, priceChange, onFilterChange]);


    return (
        <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
            <div className="filter-grid">
                <div>
                    <label htmlFor="searchName">Nama Koin</label>
                    <input type="text" id="searchName" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="e.g., Bitcoin"/>
                </div>
                <div>
                    <label htmlFor="minPrice">Harga Min</label>
                    <input type="number" id="minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min="0"/>
                </div>
                <div>
                    <label htmlFor="maxPrice">Harga Max</label>
                    <input type="number" id="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min="0"/>
                </div>
                <div>
                    <label htmlFor="sortBy">Urutkan</label>
                    <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="market_cap_desc">Market Cap (Tinggi)</option>
                    </select>
                </div>

                <fieldset>
                <legend>Perubahan 24j</legend>
                <div className="radio-group">
                    <label className="radio-label">
                    <input
                        type="radio"
                        name="priceChange"
                        value="all"
                        checked={priceChange === 'all'}
                        onChange={(e) => setPriceChange(e.target.value)}
                    />
                    <span>Semua</span>
                    </label>
                    <label className="radio-label">
                    <input
                        type="radio"
                        name="priceChange"
                        value="positive"
                        checked={priceChange === 'positive'}
                        onChange={(e) => setPriceChange(e.target.value)}
                    />
                    <span>Naik</span>
                    </label>
                    <label className="radio-label">
                    <input
                        type="radio"
                        name="priceChange"
                        value="negative"
                        checked={priceChange === 'negative'}
                        onChange={(e) => setPriceChange(e.target.value)}
                    />
                    <span>Turun</span>
                    </label>
                </div>
                </fieldset>
            </div>
        </form>
    );
};

export default FilterForm;