/**
 *
 * OrderItems
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import { CART_ITEM_STATUS } from '../../../constants';
import { ROLES } from '../../../constants';

import Button from '../../Common/Button';
import { ArrowBackIcon } from '../../Common/Icon';
import SelectOption from '../../Common/SelectOption';

const OrderItems = props => {
  const { order, user, updateOrderItemStatus } = props;

  const handleOrderItemStatusChange = (itemId, status) => {
    const newStatus = {
      itemId,
      status
    };

    updateOrderItemStatus(newStatus);
  };

  const getStatusOptions = () => {
    const statuses = Object.values(CART_ITEM_STATUS);

    const statusOptions = statuses.map(status => {
      return { value: status, label: status };
    });

    return statusOptions;
  };

  const renderItemsAction = item => {
    const isAdmin = user.role === ROLES.Admin;

    if (isAdmin) {
      return (
        <SelectOption
          name={`status`}
          value={{
            value: item && item.status ? item.status : 'Not processed',
            label: item && item.status ? item.status : 'Not processed'
          }}
          options={getStatusOptions()}
          handleSelectChange={(n, v) => {
            handleOrderItemStatusChange(item._id, v.value);
          }}
        />
      );
    }
  };

  return (
    <div className='order-items pt-3'>
      <h2>Order Items</h2>
      <hr />

      {order?.cart?.products?.map((item, index) => (
        <div key={`${item.product?.name}-${index}`} className='order-item-box'>
          <div className='d-flex flex-column flex-lg-row mb-3 align-items-lg-center'>
            <div className='order-item-details'>
              <Row>
                <Col xs='12' sm='6'>
                  <div className='d-flex align-items-center mb-2 mb-sm-0'>
                    <img
                      className='item-image mr-2'
                      src={`${
                        item.product?.imageUrl
                          ? item.product?.imageUrl
                          : '/images/placeholder-image.png'
                      }`}
                    />
                    <div>
                      <Link
                        to={`/product/${item.product?.slug}`}
                        className='item-link'
                      >
                        <h4 className='mb-1 item-name'>
                          {item.product?.name}
                        </h4>
                      </Link>
                      <p className='mb-1 item-sku'>{item.product?.sku}</p>
                      {/* Display size */}
                      {item.size && (
                        <p className='mb-1 item-size'>
                          <span className='text-muted'>Size: </span>
                          <span className='font-weight-bold'>{item.size}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </Col>
                <Col xs='6' sm='3'>
                  <div className='text-center text-sm-left'>
                    <p className='text-muted mb-1'>Quantity</p>
                    <h5 className='mb-0'>{item.quantity}</h5>
                  </div>
                </Col>
                <Col xs='6' sm='3'>
                  <div className='text-center text-sm-right'>
                    <p className='text-muted mb-1'>Price</p>
                    <h5 className='mb-0'>₹{item.purchasePrice}</h5>
                  </div>
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col xs='12' sm='6'>
                  <div className='status-info'>
                    <p className='text-muted mb-1'>Status</p>
                    <p className={`status-label ${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </p>
                  </div>
                </Col>
                <Col xs='12' sm='6'>
                  <div className='text-sm-right'>
                    <p className='text-muted mb-1'>Total</p>
                    <h5 className='total-price'>₹{item.totalPrice}</h5>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          <div className='order-item-actions d-flex justify-content-between align-items-center'>
            <div className='item-status'>{renderItemsAction(item)}</div>
          </div>

          <hr />
        </div>
      ))}
    </div>
  );
};

export default OrderItems;