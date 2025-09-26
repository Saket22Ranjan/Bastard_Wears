/**
 *
 * OrderDetails
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import OrderMeta from '../OrderMeta';
import OrderItems from '../OrderItems';
import OrderSummary from '../OrderSummary';

const OrderDetails = props => {
  const { order, user, cancelOrder, updateOrderItemStatus, onBack } = props;

  return (
    <div className='order-details'>
      <Row>
        <Col xs='12' md='12'>
          <OrderMeta order={order} cancelOrder={cancelOrder} onBack={onBack} />
        </Col>
      </Row>
      
      {/* Display Address Information */}
      {order.address && (
        <Row className='mt-4'>
          <Col xs='12'>
            <div className='order-address-info p-3 bg-light rounded'>
              <h5 className='mb-3'>Delivery Address</h5>
              <div className='address-details'>
                <p className='mb-1'><strong>Name:</strong> {order.address.name}</p>
                <p className='mb-1'><strong>Phone:</strong> {order.address.phoneNumber}</p>
                <p className='mb-1'><strong>Address:</strong> {order.address.address}</p>
                <p className='mb-0'>
                  <strong>Location:</strong> {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipCode}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      )}

      <Row className='mt-5'>
        <Col xs='12' lg='8'>
          <OrderItems
            order={order}
            user={user}
            updateOrderItemStatus={updateOrderItemStatus}
          />
        </Col>
        <Col xs='12' lg='4' className='mt-5 mt-lg-0'>
          <OrderSummary order={order} />
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetails;