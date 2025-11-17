import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/client';
import './Products.scss';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
  });

  // Update filters when URL params change (e.g., clicking from home page)
  useEffect(() => {
    const newFilters = {
      category: searchParams.get('category') || '',
      size: searchParams.get('size') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || '',
    };
    setFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.size) params.size = filters.size;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await API.get('/products', { params });
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newParams = {};
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) newParams[k] = newFilters[k];
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      size: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
    });
    setSearchParams({});
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            {filters.category ? `${filters.category}s` : 'Our Products'}
          </h1>
          {getActiveFilterCount() > 0 && (
            <p className="filter-count">
              {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied
            </p>
          )}
        </div>

        <div className="products-layout">
          <aside className="filters">
            <div className="filters-header">
              <h3>Filters</h3>
              {getActiveFilterCount() > 0 && (
                <button className="clear-all-link" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="T-Shirt">T-Shirts</option>
                <option value="Hoodie">Hoodies</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Size</label>
              <div className="size-buttons">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    className={`size-btn ${filters.size === size ? 'active' : ''}`}
                    onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="">Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <button className="clear-filters" onClick={clearFilters}>
              Clear All Filters
            </button>
          </aside>

          <div className="products-content">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <p>No products found</p>
                <button onClick={clearFilters} className="clear-btn">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-header">
                  <p className="products-count">
                    Showing {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="product-grid">
                  {products.map(product => (
                    <Link
                      to={`/products/${product._id}`}
                      key={product._id}
                      className="product-card"
                    >
                      <div className="product-image">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} loading="lazy" />
                        ) : (
                          <div className="image-placeholder">{product.name[0]}</div>
                        )}
                        {product.rating > 0 && (
                          <div className="rating-badge">
                            ★ {product.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-category">{product.category}</p>
                        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;