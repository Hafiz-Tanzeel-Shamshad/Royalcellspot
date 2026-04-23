const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const { sendSMS, isValidE164Phone, normalizePhoneToE164 } = require('../utils/sendSMS');

// @desc      Create new order
// @route     POST /api/orders
// @access    Public
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { customer, products, paymentMethod } = req.body;

  // Simple validation
  if (!customer || !products || products.length === 0) {
    return next(new ErrorResponse('Please provide customer and products', 400));
  }

  const customerPhone = normalizePhoneToE164(customer.phone);
  if (!customerPhone || !isValidE164Phone(customerPhone)) {
    return next(
      new ErrorResponse(
        'Phone number must be valid. Use E.164 format (e.g., +923001234567) or Pakistan format 03XXXXXXXXX.',
        400
      )
    );
  }

  // Store normalized phone
  customer.phone = customerPhone;

  const allowedPaymentMethods = new Set(['cod', 'dummy_card']);
  const finalPaymentMethod = paymentMethod || 'cod';

  if (!allowedPaymentMethods.has(finalPaymentMethod)) {
    return next(new ErrorResponse('Invalid payment method', 400));
  }

  // Derive payment status server-side (never trust client for this)
  const finalPaymentStatus = finalPaymentMethod === 'dummy_card' ? 'paid' : 'pending';

  let totalAmount = 0;
  const orderProducts = [];

  for (const item of products) {
    // Validate that productId is provided
    if (!item.productId) {
      return next(
        new ErrorResponse('Product ID is required for all items', 400)
      );
    }

    // Validate ObjectId format
    if (!item.productId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new ErrorResponse(`Invalid product ID format: ${item.productId}`, 400)
      );
    }

    // Fetch product from database
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${item.productId}`, 404)
      );
    }

    // Check stock availability
    if (product.stock < item.quantity) {
      return next(
        new ErrorResponse(`Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`, 400)
      );
    }

    totalAmount += (product.discountPrice || product.price) * item.quantity;
    orderProducts.push({
      productId: product._id,
      name: product.name,
      price: (product.discountPrice || product.price),
      quantity: item.quantity,
      image: product.images[0] || '',
    });

    // Decrease stock
    product.stock -= item.quantity;
    await product.save();
  }

  const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const order = await Order.create({
    orderId,
    customer,
    products: orderProducts,
    totalAmount,
    paymentMethod: finalPaymentMethod,
    paymentStatus: finalPaymentStatus,
  });

  let smsMeta;
  try {
    const frontendBaseUrl = String(process.env.FRONTEND_URL || 'http://localhost:5173')
      .trim()
      .replace(/\/+$/, '');

    const trackingUrl = `${frontendBaseUrl}/order-confirmation/${order.orderId}`;

    const smsMessage = [
      'Order Confirmed! 🧾',
      '',
      `Order ID: ${order.orderId}`,
      '',
      'Track your order:',
      trackingUrl,
      '',
      'Your checkout was successful. You will receive your product within 10 business days.',
      '',
      'Thank you for shopping with us! We appreciate your trust and look forward to serving you again.',
    ].join('\n');

    const smsResult = await sendSMS(order.customer.phone, smsMessage);
    smsMeta = { sent: true, ...smsResult };
  } catch (smsError) {
    smsMeta = {
      sent: false,
      error: smsError.message,
      code: smsError.code,
      status: smsError.status,
      moreInfo: smsError.moreInfo,
      details: smsError.details,
    };
    console.log('SMS error:', smsError);
  }

  try {
    const itemsText = order.products
      .map((p, idx) => {
        const lineTotal = Number(p.price) * Number(p.quantity);
        return `${idx + 1}. ${p.name} x${p.quantity} @ ${p.price} = ${lineTotal}`;
      })
      .join('\n');

    const emailText = [
      'New order placed:',
      '',
      `Order ID: ${order.orderId}`,
      `Total Amount: ${order.totalAmount}`,
      `Payment Method: ${order.paymentMethod}`,
      `Payment Status: ${order.paymentStatus}`,
      '',
      'Customer:',
      `Name: ${order.customer?.name || ''}`,
      `Email: ${order.customer?.email || ''}`,
      `Phone: ${order.customer?.phone || ''}`,
      `Address: ${order.customer?.address || ''}`,
      '',
      'Items:',
      itemsText || '(none)',
    ].join('\n');

    await sendEmail(`New Order Received (${order.orderId})`, emailText);
  } catch (emailError) {
    console.log('Email error:', emailError);
  }

  res.status(201).json({
    success: true,
    data: order,
    sms: smsMeta,
  });
});

// @desc      Get all orders
// @route     GET /api/orders
// @access    Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single order
// @route     GET /api/orders/:id
// @access    Private/Admin
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: order });
});

// @desc      Track order by Order ID
// @route     GET /api/orders/track/:orderId
// @access    Public
exports.trackOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ orderId: req.params.orderId });

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.orderId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      orderId: order.orderId,
      customer: order.customer,
      products: order.products,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    },
  });
});

// @desc      Track order by Phone Number
// @route     GET /api/orders/track?phone=03xxxxxxxxx
// @access    Public
exports.trackOrderByPhone = asyncHandler(async (req, res, next) => {
  const { phone } = req.query;

  if (!phone) {
    return next(new ErrorResponse('Please provide a phone number', 400));
  }

  const orders = await Order.find({ 'customer.phone': phone });

  if (!orders || orders.length === 0) {
    return next(
      new ErrorResponse(`No orders found for phone number ${phone}`, 404)
    );
  }

  const trackingData = orders.map(order => ({
    orderId: order.orderId,
    customer: order.customer,
    products: order.products,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt,
  }));

  res.status(200).json({
    success: true,
    data: trackingData,
  });
});


// @desc      Update order status
// @route     PUT /api/orders/:id/status
// @access    Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});