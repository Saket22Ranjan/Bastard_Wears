/**
 *
 * AddressList
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';

const AddressList = props => {
  const { addresses } = props;

  return (
    <div className='address-list'>
      {addresses.map((address, index) => (
        <div key={address._id} className='address-item border rounded p-3 mb-3'>
          <div className='d-flex justify-content-between align-items-start'>
            <div className='address-details'>
              <h6 className='mb-2'>
                {address.name}
                {address.isDefault && (
                  <span className='badge badge-primary ml-2'>Default</span>
                )}
              </h6>
              <p className='mb-1 text-muted'>
                <strong>Phone:</strong> {address.phoneNumber}
              </p>
              <p className='mb-1'>{address.address}</p>
              <p className='mb-0 text-muted'>
                {address.city}, {address.state}, {address.country} - {address.zipCode}
              </p>
            </div>
            <div className='address-actions'>
              <Link
                to={`/dashboard/address/edit/${address._id}`}
                className='btn btn-sm btn-outline-primary'
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;