const express = require('express');
const {
  createOrder,
  trackOrderById,
  trackOrderByPhone,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require('../controllers/orders');

const Order = require('../models/Order');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(createOrder)
  .get(protect, authorize('admin'), advancedResults(Order, {
    path: 'products.productId',
    select: 'name price'
  }), getOrders);

router.get('/track/:orderId', trackOrderById);
router.get('/track', trackOrderByPhone);

router.route('/:id').get(protect, getOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;