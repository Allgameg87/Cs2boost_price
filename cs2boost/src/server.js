const express = require('express');
const bodyParser = require('body-parser');
const { initiatePayment, verifyPayment } = require('./payment');
const { initDatabase, addKey, getRandomUnusedKey } = require('./database');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database
initDatabase();

// Add sample keys (run once or via admin panel)
const sampleKeys = [
  { key: 'KEY1-ABC123', product: 'Расширенный Ключ' },
  { key: 'KEY2-DEF456', product: 'Расширенный Ключ' },
  { key: 'KEY3-GHI789', product: 'Расширенный Ключ' }
];
sampleKeys.forEach(({ key, product }) => {
  addKey(key, product, (err) => {
    if (err) console.error('Error adding key:', err);
  });
});

// Payment initiation
app.post('/api/initiate-payment', async (req, res) => {
  const { amount, email, product } = req.body;
  const orderId = `ORDER-${Date.now()}`;
  try {
    const paymentUrl = await initiatePayment(orderId, amount, email, product);
    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment success callback
app.get('/payment/success', async (req, res) => {
  const paymentId = req.query.paymentId;
  try {
    const isSuccess = await verifyPayment(paymentId);
    if (isSuccess) {
      getRandomUnusedKey('Расширенный Ключ', (err, key) => {
        if (err || !key) {
          res.send('Error: No keys available');
          return;
        }
        res.send(`Ваш ключ: ${key}`);
      });
    } else {
      res.send('Payment failed');
    }
  } catch (error) {
    res.status(500).send('Error verifying payment');
  }
});

// Payment cancel callback
app.get('/payment/cancel', (req, res) => {
  res.send('Payment cancelled');
});

app.listen(3000, () => console.log('Server running on port 3000'));