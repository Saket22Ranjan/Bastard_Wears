/**
 *
 * SignupProvider
 *
 */

import React from 'react';

import { GoogleIcon } from '../Icon';
import { API_URL } from '../../../constants';

const SignupProvider = () => {
  return (
    <div className='signup-provider'>
      <a href={`${API_URL}/auth/google`} className='mb-2 google-btn'>
        <GoogleIcon />
        <span className='btn-text'>Login with Google</span>
      </a>

      
    </div>
  );
};

export default SignupProvider;
