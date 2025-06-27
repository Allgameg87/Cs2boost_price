const axios = require('axios');

const initiatePayment = async (orderId, amount, customerEmail, product) => {
  const payload = {
    merchantId: 'YOUR_MERCHANT_ID',
    sharedSecret: 'YOUR_SHARED_SECRET',
    orderId: orderId,
    amount: amount,
    currency: 'EUR',
    email: customerEmail,
    description: `Purchase of ${product}`,
    successUrl: 'http://localhost:3000/payment/success',
    cancelUrl: 'http://localhost:3000/payment/cancel'
  };

  try {
    const response = await axios.post('https://api.cardlink.link/payment', payload);
    return response.data.paymentUrl;
  } catch (error) {
    throw new Error('Payment initiation failed: ' + error.message);
  }
};

const verifyPayment = async (paymentId) => {
  try {
    const response = await axios.get(`https://api.cardlink.link/payment/status/${paymentId}`, {
      headers: {
        'Authorization': `Bearer YOUR_SHARED_SECRET`
      }
    });
    return response.data.status === 'SUCCESS';
  } catch (error) {
    throw new Error('Payment verification failed: ' + error.message);
  }
};

module.exports = { initiatePayment, verifyPayment };