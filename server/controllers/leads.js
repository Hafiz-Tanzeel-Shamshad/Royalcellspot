const Lead = require('../models/Lead');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

// @desc      Create a lead (email + phone)
// @route     POST /api/leads
// @access    Public
exports.createLead = asyncHandler(async (req, res, next) => {
  const { email, phone, source, items } = req.body;

  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPhone = (phone || '').trim();

  if (!isValidEmail(normalizedEmail)) {
    return next(new ErrorResponse('Please provide a valid email', 400));
  }

  if (!normalizedPhone) {
    return next(new ErrorResponse('Please provide a phone number', 400));
  }

  let lead;

  try {
    lead = await Lead.create({
      email: normalizedEmail,
      phone: normalizedPhone,
      source: source || 'add_to_cart',
    });
  } catch (err) {
    // Handle unique constraint violation (duplicate lead)
    if (err && err.code === 11000) {
      lead = await Lead.findOne({ email: normalizedEmail, phone: normalizedPhone });
    } else {
      throw err;
    }
  }

  try {
    const itemsText = Array.isArray(items) && items.length > 0
      ? [
          '',
          'Selected Products:',
          ...items.map((item, index) => {
            const colorText = item.selectedColor ? ` | Color: ${item.selectedColor}` : '';
            const storageText = item.selectedStorage ? ` | Storage: ${item.selectedStorage}` : '';
            const quantityText = item.quantity ? ` x${item.quantity}` : '';
            return `${index + 1}. ${item.name || 'Product'}${quantityText}${colorText}${storageText}`;
          }),
          '',
        ].join('\n')
      : '';

    const emailText = [
      'Dear Customer,',
      '',
      "Hope you're doing well",
      '',
      'Your order is expected to be delivered within 10 to 15 days. If you are interested in receiving a discount, please feel free to contact me using the email provided below. We would be happy to assist you further.',
      itemsText,
      '',
      'Contact Email: royalcellspot@gmail.com',
      '',
      'Looking forward to hearing from you.',
      '',
      'Best regards,',
      'Royalcellspot',
    ].join('\n');

    await sendEmail('Order Delivery & Discount Offer', emailText, {
      to: normalizedEmail,
    });
  } catch (emailError) {
    console.log('Lead customer email error:', emailError);
  }

  res.status(201).json({
    success: true,
    data: lead,
  });
});
