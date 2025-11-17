import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/client';
import Loading from '../components/Loading';
import { FiUser, FiMail, FiCalendar, FiPackage, FiMapPin } from 'react-icons/fi';
import './Profile.scss';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !user.isAdmin) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my-orders');
      setOrders(data.orders.slice(0, 5)); // Show last 5 orders
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="empty-state">
            <p>Please login to view your profile</p>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="welcome-section">
            <h1>Welcome back, {user.name}! 👋</h1>
            <p>Manage your profile and orders</p>
          </div>
        </div>

        <div className="profile-grid">
          {/* User Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Personal Information</h2>
            </div>
            <div className="card-body">
              <div className="info-item">
                <div className="info-icon">
                  <FiUser />
                </div>
                <div className="info-content">
                  <span className="label">Full Name</span>
                  <span className="value">{user.name}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <FiMail />
                </div>
                <div className="info-content">
                  <span className="label">Email Address</span>
                  <span className="value">{user.email}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <FiCalendar />
                </div>
                <div className="info-content">
                  <span className="label">Member Since</span>
                  <span className="value">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Card */}
          <div className="profile-card orders-card">
            <div className="card-header">
              <h2>Recent Orders</h2>
              {orders.length > 0 && (
                <Link to="/orders" className="view-all-link">View All →</Link>
              )}
            </div>
            <div className="card-body">
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <FiPackage />
                  <p>No orders yet</p>
                  <Link to="/products" className="shop-now-btn">Start Shopping</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <Link
                      to="/orders"
                      key={order._id}
                      className="order-item"
                    >
                      <div className="order-info">
                        <span className="order-id">#{order._id.slice(-6)}</span>
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <div className="order-details">
                        <span className="order-total">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                        <span className={`order-status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Saved Addresses Card */}
          <div className="profile-card addresses-card">
            <div className="card-header">
              <h2>Saved Addresses</h2>
            </div>
            <div className="card-body">
              <div className="addresses-list">
                <div className="address-item">
                  <div className="address-icon">
                    <FiMapPin />
                  </div>
                  <div className="address-content">
                    <h4>Last Used Address</h4>
                    <p>
                      {user.name}<br />
                      Add your address from checkout<br />
                      to see it here
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;