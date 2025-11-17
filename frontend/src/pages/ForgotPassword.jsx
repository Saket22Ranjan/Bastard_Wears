import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { FiMail } from 'react-icons/fi';
import './ForgotPassword.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/auth/forgot-password', { email });
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          {!emailSent ? (
            <>
              <div className="icon-wrapper">
                <FiMail />
              </div>
              <h2>Forgot Password?</h2>
              <p className="subtitle">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <Link to="/login" className="back-link">
                Back to Login
              </Link>
            </>
          ) : (
            <>
              <div className="success-icon">✓</div>
              <h2>Check Your Email</h2>
              <p className="subtitle">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="info-text">
                Please check your inbox and click the link to reset your password. 
                The link will expire in 1 hour.
              </p>
              <Link to="/login" className="submit-btn">
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;