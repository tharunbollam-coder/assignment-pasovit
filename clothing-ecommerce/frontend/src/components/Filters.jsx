import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

const Filters = ({ filters, onFilterChange, onSearch }) => {
  const [categories, setCategories] = useState(['All']);
  const [sizes, setSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [priceRange, setPriceRange] = useState({ 
    min: filters.minPrice || '', 
    max: filters.maxPrice || '' 
  });

  // Sync local state with props
  useEffect(() => {
    setSearchTerm(filters.search || '');
    setPriceRange({ 
      min: filters.minPrice || '', 
      max: filters.maxPrice || '' 
    });
  }, [filters.search, filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, sizesRes] = await Promise.all([
          productAPI.getCategories(),
          productAPI.getSizes()
        ]);
        setCategories(categoriesRes.data);
        setSizes(sizesRes.data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ category });
  };

  const handleSizeChange = (size) => {
    onFilterChange({ size });
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
    
    const priceFilters = {};
    if (newPriceRange.min) priceFilters.minPrice = newPriceRange.min;
    if (newPriceRange.max) priceFilters.maxPrice = newPriceRange.max;
    
    onFilterChange(priceFilters);
  };

  const clearFilters = () => {
    console.log('Clear filters clicked');
    console.log('Current filters before clear:', filters);
    
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    
    // Clear all filters by resetting to default values
    const clearedFilters = {
      category: 'All',
      size: '',
      minPrice: '',
      maxPrice: '',
      search: ''  // Also clear the search term
    };
    
    console.log('Setting cleared filters:', clearedFilters);
    onFilterChange(clearedFilters);
    // No need to call onSearch('') separately since we're including search in the filters
  };

  return (
    <div className="filters">
      <div className="filters-header">
        <h2>Filters</h2>
        <button onClick={clearFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <div className="filter-section">
        <h3>Category</h3>
        <div className="filter-options">
          {categories.map((category) => (
            <label key={category} className="filter-option">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Size</h3>
        <div className="filter-options">
          {sizes.map((size) => (
            <label key={size} className="filter-option">
              <input
                type="radio"
                name="size"
                value={size}
                checked={filters.size === size}
                onChange={() => handleSizeChange(size)}
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-range">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className="price-input"
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="price-input"
            min="0"
          />
        </div>
      </div>

      <style jsx>{`
        .filters {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          height: fit-content;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .filters-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.25rem;
        }

        .clear-filters-btn {
          background: transparent;
          border: 1px solid #dc3545;
          color: #dc3545;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .clear-filters-btn:hover {
          background-color: #dc3545;
          color: white;
        }

        .search-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .search-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .search-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.3s;
        }

        .search-btn:hover {
          background-color: #0056b3;
        }

        .filter-section {
          margin-bottom: 1.5rem;
        }

        .filter-section h3 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1rem;
          font-weight: 600;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .filter-option input[type="radio"] {
          cursor: pointer;
        }

        .filter-option span {
          font-size: 0.875rem;
          color: #495057;
        }

        .price-range {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-input {
          width: 80px;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .price-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .price-range span {
          color: #666;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .filters {
            padding: 1rem;
          }

          .search-form {
            flex-direction: column;
          }

          .search-btn {
            width: 100%;
          }

          .price-range {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .price-input {
            width: 100%;
          }

          .price-range span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Filters;
