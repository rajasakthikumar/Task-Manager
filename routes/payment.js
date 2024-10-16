const {paymentController} = require('../bootstrap'); 
const express = require('express');
const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/',protect,paymentController.createPayment);
router.get('/',protect,paymentController.getUserPayments);

console.log('Payment route is created');

module.exports = router;