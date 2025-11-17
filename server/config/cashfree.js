const axios = require('axios');
const crypto = require('crypto');

class Cashfree {
  constructor() {
    this.appId = process.env.CASHFREE_APP_ID;
    this.secretKey = process.env.CASHFREE_SECRET_KEY;
    this.environment = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';
    
    // Set API URLs based on environment
    this.baseURL = this.environment === 'PRODUCTION' 
      ? 'https://api.cashfree.com' 
      : 'https://sandbox.cashfree.com';
  }

  // Create headers for API requests
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-client-id': this.appId,
      'x-client-secret': this.secretKey,
      'x-api-version': '2023-08-01'
    };
  }

  // Create payment session
  async createOrder(orderData) {
    try {
      const url = `${this.baseURL}/pg/orders`;
      const response = await axios.post(url, orderData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Cashfree API Error:', error.response?.data);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(orderId) {
    try {
      const url = `${this.baseURL}/pg/orders/${orderId}/payments`;
      const response = await axios.get(url, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Cashfree API Error:', error.response?.data);
      throw error;
    }
  }

  // Verify webhook signature (for security)
  verifyWebhookSignature(postData, timestamp, signature) {
    try {
      const signatureData = `${timestamp}${postData}`;
      const computedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(signatureData)
        .digest('base64');
      
      return computedSignature === signature;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }
}

module.exports = new Cashfree();