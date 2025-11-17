/**
 *
 * OrderMeta
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import { CART_ITEM_STATUS } from '../../../constants';
import { formatDate } from '../../../utils/date';
import Button from '../../Common/Button';
import { ArrowBackIcon } from '../../Common/Icon';

const OrderMeta = props => {
  const { order, cancelOrder, onBack } = props;

  const renderMetaAction = () => {
    const isNotDelivered =
      order.products.filter(i => i.status === CART_ITEM_STATUS.Delivered)
        .length < 1;

    if (isNotDelivered) {
      return <Button size='sm' text='Cancel Order' onClick={cancelOrder} />;
    }
  };

  return (
  <div className='order-meta'>
    <div className='d-flex align-items-center justify-content-between mb-3 title'>
      <h2 className='mb-0'>Order Details</h2>
      <Button
        variant='link'
        icon={<ArrowBackIcon />}
        size='sm'
        text='Back to orders'
        onClick={onBack}
      ></Button>
    </div>

    <Row>
      <Col xs='12' md='8'>
        {/* Order Information */}
        <Row>
          <Col xs='4'>
            <p className='one-line-ellipsis'>Order ID</p>
          </Col>
          <Col xs='8'>
            <span className='order-label one-line-ellipsis'>{` ${order._id}`}</span>
          </Col>
        </Row>
        <Row>
          <Col xs='4'>
            <p className='one-line-ellipsis'>Order Date</p>
          </Col>
          <Col xs='8'>
            <span className='order-label one-line-ellipsis'>{` ${formatDate(
              order.created
            )}`}</span>
          </Col>
        </Row>
        
        {/* Delivery Address Section */}
        {order.address && (
          <>
            <hr className='my-3' />
            <Row>
              <Col xs='12'>
                <h5 className='mb-2'>Delivery Address</h5>
              </Col>
            </Row>
            <Row>
              <Col xs='4'>
                <p className='one-line-ellipsis'>Street Address</p>
              </Col>
              <Col xs='8'>
                <span className='order-label'>{order.address.address}</span>
              </Col>
            </Row>
            <Row>
              <Col xs='4'>
                <p className='one-line-ellipsis'>City</p>
              </Col>
              <Col xs='8'>
                <span className='order-label'>{order.address.city}</span>
              </Col>
            </Row>
            <Row>
              <Col xs='4'>
                <p className='one-line-ellipsis'>State</p>
              </Col>
              <Col xs='8'>
                <span className='order-label'>{order.address.state}</span>
              </Col>
            </Row>
            <Row>
              <Col xs='4'>
                <p className='one-line-ellipsis'>Country</p>
              </Col>
              <Col xs='8'>
                <span className='order-label'>{order.address.country}</span>
              </Col>
            </Row>
            <Row>
              <Col xs='4'>
                <p className='one-line-ellipsis'>Zip Code</p>
              </Col>
              <Col xs='8'>
                <span className='order-label'>{order.address.zipCode}</span>
              </Col>
            </Row>
            {order.address.isDefault && (
              <Row>
                <Col xs='12'>
                  <small className='text-muted'>
                    <i className='fa fa-check-circle mr-1'></i>
                    Default Address
                  </small>
                </Col>
              </Row>
            )}
          </>
        )}
        
        {/* If no address available */}
        {!order.address && (
          <>
            <hr className='my-3' />
            <Row>
              <Col xs='12'>
                <div className='alert alert-warning'>
                  <i className='fa fa-exclamation-triangle mr-2'></i>
                  No delivery address information available for this order.
                </div>
              </Col>
            </Row>
          </>
        )}
      </Col>
      
      <Col xs='12' md='4' className='text-left text-md-right'>
        {renderMetaAction()}
      </Col>
    </Row>
  </div>
  )
}
export default OrderMeta;
