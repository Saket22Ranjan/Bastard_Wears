/**
 *
 * OrderList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import { formatDate } from '../../../utils/date';

const OrderList = props => {
  const { orders } = props;

  const renderFirstProduct = order => {
    if (order?.cart?.products && order.cart.products.length > 0) {
      const firstProduct = order.cart.products[0];
      return (
        <div className='d-flex align-items-center'>
          <img
            className='item-image mr-2'
            src={`${
              firstProduct.product?.imageUrl
                ? firstProduct.product?.imageUrl
                : '/images/placeholder-image.png'
            }`}
          />
          <div>
            <Link
              to={`/product/${firstProduct.product?.slug}`}
              className='item-link'
            >
              <h5 className='mb-1'>{firstProduct.product?.name}</h5>
            </Link>
            <div className='d-flex flex-wrap'>
              <small className='text-muted mr-2'>
                Qty: {firstProduct.quantity}
              </small>
              {firstProduct.size && (
                <small className='text-muted mr-2'>
                  Size: <span className='font-weight-bold'>{firstProduct.size}</span>
                </small>
              )}
              <small className='text-muted'>
                ₹{firstProduct.purchasePrice}
              </small>
            </div>
            {order.cart.products.length > 1 && (
              <small className='text-info'>
                +{order.cart.products.length - 1} more item(s)
              </small>
            )}
          </div>
        </div>
      );
    }
    return <span>No products</span>;
  };

  return (
    <div className='order-list'>
      {orders.map((order, index) => (
        <div key={`${order._id}-${index}`} className='order-box'>
          <div className='order-details'>
            <div className='row align-items-center'>
              <div className='col-md-8'>
                <div className='order-info mb-3'>
                  <div className='d-flex justify-content-between align-items-center mb-2'>
                    <h6 className='order-id mb-0'>
                      Order #{order._id}
                    </h6>
                    <span className={`order-status status-${order.paymentStatus?.toLowerCase()}`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  <p className='order-date text-muted mb-2'>
                    {formatDate(order.created)}
                  </p>
                  {renderFirstProduct(order)}
                </div>
              </div>
              <div className='col-md-4 text-md-right'>
                <div className='order-summary'>
                  <h5 className='order-total mb-2'>₹{order.total}</h5>
                  <Link
                    to={`/order/${order._id}`}
                    className='btn btn-outline-primary btn-sm'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;