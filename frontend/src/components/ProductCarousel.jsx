import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './ProductCarousel.scss';

const ProductCarousel = ({ products, title }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-carousel-section">
      {title && <h2 className="carousel-title">{title}</h2>}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          968: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
        className="carousel-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <Link to={`/products/${product._id}`} className="product-card-carousel">
              <div className="product-image">
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} loading="lazy" />
                ) : (
                  <div className="image-placeholder">{product.name[0]}</div>
                )}
                {product.rating > 0 && (
                  <div className="rating-badge">★ {product.rating.toFixed(1)}</div>
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;