import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import API from '../api/client';
import { AuthContext } from '../context/AuthContext';
import Rating from './Rating';
import './ReviewSection.scss';

const ReviewSection = ({ product, onReviewAdded }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  // Check if user has purchased this product
  useEffect(() => {
    if (user && product) {
      checkPurchaseStatus();
    }
  }, [user, product]);

  const checkPurchaseStatus = async () => {
    setCheckingPurchase(true);
    try {
      const { data } = await API.get(`/products/${product._id}/check-purchase`);
      setHasPurchased(data.hasPurchased);
    } catch (error) {
      console.error('Error checking purchase status:', error);
    } finally {
      setCheckingPurchase(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to add a review');
      return;
    }

    if (!hasPurchased) {
      toast.error('You can only review products you have purchased');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setLoading(true);

    try {
      await API.post(`/products/${product._id}/reviews`, {
        rating,
        comment,
      });

      toast.success('Review added successfully!');
      setRating(0);
      setComment('');
      
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-section">
      <h2>Customer Reviews</h2>

      {/* Overall Rating */}
      <div className="overall-rating">
        <div className="rating-summary">
          <div className="rating-number">{product.rating.toFixed(1)}</div>
          <div className="rating-details">
            <Rating value={product.rating} size="1.2rem" />
            <p>{product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}</p>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      {user && hasPurchased && (
        <div className="add-review">
          <div className="verified-badge">
            <span>✓ Verified Purchase</span>
          </div>
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="star-rating-input">
              <label>Rating</label>
              <div className="stars">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <button
                      type="button"
                      key={index}
                      className={ratingValue <= (hover || rating) ? 'active' : ''}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <FaStar />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows="4"
                required
              />
            </div>

            <button type="submit" className="submit-review-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {user && !hasPurchased && !checkingPurchase && (
        <div className="purchase-required">
          <div className="info-icon">🛍️</div>
          <h3>Purchase Required to Review</h3>
          <p>You need to purchase this product before you can write a review.</p>
          <p className="note">This helps ensure authentic reviews from real customers.</p>
        </div>
      )}

      {!user && (
        <div className="login-prompt">
          <div className="info-icon">👤</div>
          <h3>Login to Write a Review</h3>
          <p>Please login to share your experience with this product.</p>
        </div>
      )}

      {checkingPurchase && (
        <div className="checking-purchase">
          <div className="spinner"></div>
          <p>Checking purchase status...</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        <h3>Customer Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div>
                  <div className="reviewer-info">
                    <h4>{review.name}</h4>
                    <span className="verified-badge-small">✓ Verified Purchase</span>
                  </div>
                  <Rating value={review.rating} size="0.9rem" />
                </div>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;