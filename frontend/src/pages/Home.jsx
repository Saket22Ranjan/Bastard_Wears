import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/client';
import ProductCarousel from '../components/ProductCarousel';
import Loading from '../components/Loading';
import './Home.scss';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const [featuredRes, newArrivalsRes, trendingRes, bestSellersRes] = await Promise.all([
        API.get('/products/featured'),
        API.get('/products/new-arrivals'),
        API.get('/products/trending'),
        API.get('/products/best-sellers'),
      ]);

      setFeaturedProducts(featuredRes.data.products);
      setNewArrivals(newArrivalsRes.data.products);
      setTrending(trendingRes.data.products);
      setBestSellers(bestSellersRes.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="home">

      <section className="hero-image-grid">
        <div className="container">
          <div className="grid-layout">
            {/* Top Large Image */}
            <Link to="/products?category=T-Shirt" className="grid-item large">
              <div className="image-wrapper">
                <img src="/Bastard.png" alt="Premium Collection" />
                <div className="overlay"></div>
                <div className="content">
                  <h2>Premium Collection</h2>
                  <p>Discover Latest Trends</p>
                  <span className="shop-link">Shop Now →</span>
                </div>
              </div>
            </Link>

            {/* Bottom Row with Two Images */}
            <div className="bottom-row">
              <Link to="/products?category=Hoodie" className="grid-item small">
                <div className="image-wrapper">
                  <img src="/images/barbie.jpg" alt="Hoodies" />
                  <div className="overlay"></div>
                  <div className="content">
                    <h3>Hoodies</h3>
                    <span className="shop-link">View Collection →</span>
                  </div>
                </div>
              </Link>

              <Link to="/products?category=T-Shirt" className="grid-item small">
                <div className="image-wrapper">
                  <img src="/images/unisex.jpg" alt="T-Shirts" />
                  <div className="overlay"></div>
                  <div className="content">
                    <h3>T-Shirts</h3>
                    <span className="shop-link">View Collection →</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="products-section">
          <div className="container">
            <div className="section-header">
              <h2>NEW ARRIVALS</h2>
              <Link to="/products" className="view-all">View All →</Link>
            </div>
            <ProductCarousel products={newArrivals} title="" />
          </div>
        </section>
      )}

      {/* Trending Now */}
      {trending.length > 0 && (
        <section className="products-section alt-bg">
          <div className="container">
            <div className="section-header">
              <h2>TRENDING NOW</h2>
              <Link to="/products" className="view-all">View All →</Link>
            </div>
            <ProductCarousel products={trending} title="" />
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="products-section">
          <div className="container">
            <div className="section-header">
              <h2>BEST SELLERS</h2>
              <Link to="/products" className="view-all">View All →</Link>
            </div>
            <ProductCarousel products={bestSellers} title="" />
          </div>
        </section>
      )}

      {/* Featured Products Grid */}
      {featuredProducts.length > 0 && (
        <section className="featured-grid">
          <div className="container">
            <div className="section-header">
              <h2>FEATURED COLLECTION</h2>
            </div>
            <div className="product-grid">
              {featuredProducts.slice(0, 6).map(product => (
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
                    <p className="category">{product.category}</p>
                    <div className="price-row">
                      <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;