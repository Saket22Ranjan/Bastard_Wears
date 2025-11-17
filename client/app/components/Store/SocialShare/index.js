/**
 *
 * SocialShare
 *
 */

import React from 'react';

import {
  
  TwitterShareButton,
  WhatsappShareButton,
  
} from 'react-share';

const SocialShare = props => {
  const { product } = props;

  const shareMsg = `I ♥ ${
    product.name
  } product on Mern Store!  Here's the link, ${
    window.location.protocol !== 'https' ? 'http' : 'https'
  }://${window.location.host}/product/${product.slug}`;

  return (
    <ul className='d-flex flex-row mx-0 mb-0 justify-content-center justify-content-md-start share-box'>
      
      <li>
        <TwitterShareButton url={`${shareMsg}`} className='share-btn twitter'>
          <i className='fa fa-twitter'></i>
        </TwitterShareButton>
      </li>
      
      <li>
        <WhatsappShareButton url={`${shareMsg}`} className='share-btn whatsapp'>
          <i className='fa fa-whatsapp'></i>
        </WhatsappShareButton>
      </li>
    </ul>
  );
};

export default SocialShare;
