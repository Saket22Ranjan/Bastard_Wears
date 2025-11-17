import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { AuthContext } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import './AdminDashboard.scss';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'T-Shirt',
    images: [],
    sizes: [
      { size: 'XS', stock: 0 },
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 0 },
      { size: 'XXL', stock: 0 },
    ],
    featured: false,
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSizeStockChange = (size, stock) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.map((s) =>
        s.size === size ? { ...s, stock: parseInt(stock) || 0 } : s
      ),
    });
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images || [],
        sizes: product.sizes,
        featured: product.featured,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'T-Shirt',
        images: [],
        sizes: [
          { size: 'XS', stock: 0 },
          { size: 'S', stock: 0 },
          { size: 'M', stock: 0 },
          { size: 'L', stock: 0 },
          { size: 'XL', stock: 0 },
          { size: 'XXL', stock: 0 },
        ],
        featured: false,
      });
    }
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...productForm,
        images: productForm.images.filter((img) => img.trim() !== ''),
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, productData);
        toast.success('Product updated successfully');
      } else {
        await API.post('/products', productData);
        toast.success('Product created successfully');
      }

      setShowProductModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="tabs">
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="products-section">
            <button className="add-product-btn" onClick={() => openProductModal()}>
              + Add Product
            </button>

            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className="placeholder">{product.name[0]}</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                    <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
                    <div className="actions">
                      <button onClick={() => openProductModal(product)}>Edit</button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="orders-header">
              <h2>All Orders</h2>
              <span className="orders-count">{orders.length} Total Orders</span>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state">
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <h3>Order #{order._id.slice(-6)}</h3>
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-body">
                      <div className="order-section customer-info">
                        <h4>Customer Details</h4>
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">Name:</span>
                            <span className="value">{order.customerInfo.name}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Phone:</span>
                            <span className="value">{order.customerInfo.phone}</span>
                          </div>
                          <div className="info-item full-width">
                            <span className="label">Address:</span>
                            <span className="value">
                              {order.customerInfo.address.street}, {order.customerInfo.address.city},
                              {order.customerInfo.address.state} - {order.customerInfo.address.pincode}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="order-section order-products">
                        <h4>Products Ordered</h4>
                        <div className="products-list">
                          {order.products.map((item, index) => (
                            <div key={index} className="product-item">
                              <div className="product-details">
                                <span className="product-name">{item.name}</span>
                                <span className="product-meta">
                                  Size: {item.size} | Qty: {item.quantity}
                                </span>
                              </div>
                              <span className="product-price">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="order-total">
                          <span>Total Amount:</span>
                          <span className="total-price">
                            ₹{order.totalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="order-footer">
                      <div className="order-actions">
                        <label htmlFor={`status-${order._id}`}>Update Status:</label>
                        <select
                          id={`status-${order._id}`}
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showProductModal && (
          <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={handleProductSubmit}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    required
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductFormChange}
                      required
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductFormChange}
                    >
                      <option value="T-Shirt">T-Shirt</option>
                      <option value="Hoodie">Hoodie</option>
                    </select>
                  </div>
                </div>

                {/* ✅ Image Upload Section */}
                <div className="form-group">
                  <label>Product Images</label>
                  <ImageUpload
                    images={productForm.images}
                    onImagesChange={(newImages) =>
                      setProductForm({ ...productForm, images: newImages })
                    }
                    maxImages={4}
                  />
                </div>

                <div className="form-group">
                  <label>Stock by Size</label>
                  <div className="sizes-grid">
                    {productForm.sizes.map((sizeObj) => (
                      <div key={sizeObj.size} className="size-input">
                        <label>{sizeObj.size}</label>
                        <input
                          type="number"
                          value={sizeObj.stock}
                          onChange={(e) =>
                            handleSizeStockChange(sizeObj.size, e.target.value)
                          }
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={productForm.featured}
                      onChange={handleProductFormChange}
                    />
                    Featured Product
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowProductModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary">
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
