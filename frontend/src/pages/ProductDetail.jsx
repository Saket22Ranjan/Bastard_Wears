import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { CartContext } from '../context/CartContext';
import ReviewSection from '../components/ReviewSection';
import Rating from '../components/Rating';
import './ProductDetail.scss';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    fetchProduct(); // Refresh product to show new review
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const sizeStock = product.sizes.find(s => s.size === selectedSize);
    if (!sizeStock || sizeStock.stock < quantity) {
      toast.error('Insufficient stock');
      return;
    }

    addToCart(product, selectedSize, quantity);
    toast.success('Added to cart!');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-layout">
          <div className="product-images">
            <div className="main-image">
              {product.images && product.images[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} />
              ) : (
                <div className="image-placeholder">{product.name[0]}</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            
            {product.rating > 0 && (
              <div className="product-rating">
                <Rating value={product.rating} text={`${product.numReviews} reviews`} size="1.1rem" />
              </div>
            )}
            
            <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="size-selector">
              <h3>Select Size</h3>
              <div className="sizes">
                {product.sizes.map(sizeObj => (
                  <button
                    key={sizeObj.size}
                    className={`size-btn ${selectedSize === sizeObj.size ? 'active' : ''} ${sizeObj.stock === 0 ? 'disabled' : ''}`}
                    onClick={() => sizeObj.stock > 0 && setSelectedSize(sizeObj.size)}
                    disabled={sizeObj.stock === 0}
                  >
                    {sizeObj.size}
                    {sizeObj.stock === 0 && <span className="out-of-stock">Out</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-selector">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>

        {/* Review Section */}
        <ReviewSection product={product} onReviewAdded={handleReviewAdded} />
      </div>
    </div>
  );
};

export default ProductDetail;