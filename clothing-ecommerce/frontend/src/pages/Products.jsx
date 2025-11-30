import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import { productAPI } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [filters, setFilters] = useState({
    category: 'All',
    size: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 12,
        ...filters
      };

      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'All') {
          delete params[key];
        }
      });

      const response = await productAPI.getProducts(params);
      setProducts(response.data.products);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalProducts: response.data.totalProducts,
        hasNextPage: response.data.hasNextPage,
        hasPrevPage: response.data.hasPrevPage
      });
    } catch (error) {
      setError('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    console.log('handleFilterChange called with:', newFilters);
    console.log('Current filters before change:', filters);
    setFilters({ ...filters, ...newFilters });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={!pagination.hasPrevPage}
          className="pagination-btn"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="pagination-btn"
        >
          Previous
        </button>
        
        {startPage > 1 && <span className="pagination-ellipsis">...</span>}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-btn ${page === pagination.currentPage ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
        
        {endPage < pagination.totalPages && <span className="pagination-ellipsis">...</span>}
        
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="pagination-btn"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(pagination.totalPages)}
          disabled={!pagination.hasNextPage}
          className="pagination-btn"
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <aside className="filters-sidebar">
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </aside>

        <main className="products-content">
          <div className="products-header">
            <h1>Products</h1>
            <p>
              Showing {products.length} of {pagination.totalProducts} products
            </p>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {renderPagination()}
            </>
          )}
        </main>
      </div>

      <style jsx>{`
        .products-page {
          padding: 2rem 1rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .products-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        .filters-sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .products-content {
          min-height: 600px;
        }

        .products-header {
          margin-bottom: 2rem;
        }

        .products-header h1 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 2rem;
        }

        .products-header p {
          margin: 0;
          color: #666;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .loading, .error, .no-products {
          text-align: center;
          padding: 3rem;
          font-size: 1.1rem;
        }

        .error {
          color: #dc3545;
        }

        .no-products {
          color: #666;
        }

        .no-products h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .pagination-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid #ddd;
          background: white;
          color: #333;
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #f8f9fa;
          border-color: #007bff;
        }

        .pagination-btn.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-ellipsis {
          padding: 0 0.5rem;
          color: #666;
        }

        @media (max-width: 1024px) {
          .products-container {
            grid-template-columns: 1fr;
          }

          .filters-sidebar {
            position: static;
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 768px) {
          .products-page {
            padding: 1rem;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
          }

          .pagination {
            gap: 0.25rem;
          }

          .pagination-btn {
            padding: 0.375rem 0.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;
