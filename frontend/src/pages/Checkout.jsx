import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import useCartStore from '../store/cartStore';

const API_URL = import.meta.env.VITE_API_URL;

function CheckoutForm() {
  const navigate = useNavigate();
  const items = useCartStore(state => state.items);
  const getTotalPrice = useCartStore(state => state.getTotalPrice);
  const clearCart = useCartStore(state => state.clearCart);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('dummy_card'); // 'dummy_card'
  const [card, setCard] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const totalPrice = getTotalPrice();
  const shippingCost = 0;
  const tax = 0;
  const finalTotal = totalPrice + shippingCost + tax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (e) => {
    setCard({
      ...card,
      [e.target.name]: e.target.value,
    });
  };

  const validateDummyCard = () => {
    const number = (card.number || '').replace(/\s+/g, '');
    const cvv = (card.cvv || '').trim();
    const holder = (card.holder || '').trim();
    const expiry = (card.expiry || '').trim();

    if (!holder) return 'Card holder name is required';
    if (!/^\d{16}$/.test(number)) return 'Card number must be 16 digits';
    if (!/^\d{3}$/.test(cvv)) return 'CVV must be 3 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return 'Expiry must be in MM/YY format';

    const [mmStr, yyStr] = expiry.split('/');
    const mm = Number(mmStr);
    const yy = Number(yyStr);

    const year = 2000 + yy;
    const monthIndex = mm - 1;

    // Expiry is valid through the end of the month; compare against start of next month
    const expiresAt = new Date(year, monthIndex + 1, 1);
    if (Number.isNaN(expiresAt.getTime())) return 'Invalid expiry date';

    const now = new Date();
    if (expiresAt <= now) return 'Card is expired';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items || items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      if (paymentMethod === 'dummy_card') {
        const validationError = validateDummyCard();
        if (validationError) {
          setError(validationError);
          setProcessing(false);
          return;
        }

        // Simulated payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 2200));
      }

      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        products: items.map(item => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        paymentMethod,
      };

      const res = await axios.post(`${API_URL}/orders`, orderData);

      clearCart();
      navigate(`/order-confirmation/${res.data.data.orderId}`);
    } catch (err) {
      setError(err?.response?.data?.error || 'There was an error placing your order. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const submitLabel = () => {
    if (processing) {
      return 'Processing Payment...';
    }
    return `Pay Now - $${finalTotal.toFixed(2)}`;
  };

  return (
    <div style={styles.container} className="checkout-page">
      <motion.div
        style={styles.formContainer}
        className="checkout-form"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={styles.title}>Contact Information</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (e.g., +923001234567)"
              style={styles.input}
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <h2 style={styles.title}>Shipping Address</h2>
          <div style={styles.inputGroup}>
            <input
              type="text"
              name="address"
              placeholder="Address"
              style={styles.input}
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <h2 style={styles.title}>Payment</h2>
          <div style={styles.paymentMethodRow}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="paymentMethod"
                value="dummy_card"
                checked={paymentMethod === 'dummy_card'}
                onChange={() => setPaymentMethod('dummy_card')}
                disabled={processing}
              />
              <span style={styles.radioText}>Card</span>
            </label>
          </div>

          {paymentMethod === 'dummy_card' && (
            <div style={styles.cardBox}>
              <div style={styles.inputGroup}>
                <div style={styles.iconInput}>
                  <span aria-hidden="true" style={styles.inputIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                      <line x1="6" y1="15" x2="10" y2="15" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="number"
                    inputMode="numeric"
                    placeholder="Card Number"
                    style={{ ...styles.input, paddingLeft: '44px' }}
                    value={card.number}
                    onChange={handleCardChange}
                    disabled={processing}
                    autoComplete="cc-number"
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  name="holder"
                  placeholder="Card Holder Name"
                  style={styles.input}
                  value={card.holder}
                  onChange={handleCardChange}
                  disabled={processing}
                  autoComplete="cc-name"
                />
              </div>
              <div style={styles.cardRow}>
                <div style={{ ...styles.inputGroup, ...styles.cardRowItem }}>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="Expiry (MM/YY)"
                    style={styles.input}
                    value={card.expiry}
                    onChange={handleCardChange}
                    disabled={processing}
                    autoComplete="cc-exp"
                  />
                </div>
                <div style={{ ...styles.inputGroup, ...styles.cardRowItem }}>
                  <input
                    type="password"
                    name="cvv"
                    inputMode="numeric"
                    placeholder="CVV (3 digits)"
                    style={styles.input}
                    value={card.cvv}
                    onChange={handleCardChange}
                    disabled={processing}
                    autoComplete="cc-csc"
                  />
                </div>
              </div>
            </div>
          )}

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.button} disabled={processing}>
            {submitLabel()}
          </button>
        </form>
      </motion.div>

      <motion.div
        style={styles.summaryContainer}
        className="checkout-summary"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 style={styles.title}>Order Summary</h2>
        {items.map(item => (
          <div key={item._id} style={styles.item}>
            <img src={item.image} alt={item.name} style={styles.itemImage} />
            <div style={styles.itemDetails}>
              <p style={styles.itemName}>{item.name}</p>
              <p style={styles.itemMeta}>Qty: {item.quantity}</p>
            </div>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div style={styles.summaryLine}>
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div style={{ ...styles.summaryLine, ...styles.total }}>
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </motion.div>
    </div>
  );
}

function Checkout() {
  return <CheckoutForm />;
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2rem',
    gap: '2rem',
  },
  formContainer: {
    flex: 2,
  },
  summaryContainer: {
    flex: 1,
    border: '1px solid #eee',
    padding: '1rem',
    borderRadius: '8px',
  },
  title: {
    marginBottom: '1.5rem',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  paymentMethodRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  radioText: {
    fontSize: '14px',
  },
  cardBox: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    background: '#fafafa',
  },
  iconInput: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    pointerEvents: 'none',
  },
  cardRow: {
    display: 'flex',
    gap: '12px',
  },
  cardRowItem: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  itemImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: '1rem',
  },
  itemName: {
    margin: 0,
    fontWeight: 600,
  },
  itemMeta: {
    margin: 0,
    opacity: 0.8,
    fontSize: '13px',
  },
  summaryLine: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  total: {
    fontWeight: 'bold',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
  },
};

export default Checkout;
