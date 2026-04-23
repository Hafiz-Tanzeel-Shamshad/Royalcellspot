import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/cartStore';

function Cart() {
  const navigate = useNavigate();
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);
  const getTotalPrice = useCartStore(state => state.getTotalPrice);

  const totalPrice = getTotalPrice();
  const savings = items.reduce((acc, item) => {
    return acc + ((item.originalPrice - item.price) * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptySubtitle}>Add some phones to get started!</p>
          <button 
            onClick={() => navigate('/products')} 
            style={styles.shopNowBtn}
          >
            Browse Phones
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Shopping Cart</h1>
        <p style={styles.itemCount}>{items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p>
      </div>

      <div style={styles.layout}>
        {/* Cart Items */}
        <div style={styles.cartItems}>
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.selectedColor}-${item.selectedStorage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ delay: index * 0.1 }}
                style={styles.cartItem}
              >
                {/* Product Image */}
                <div 
                  style={styles.itemImage}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                </div>

                {/* Product Details */}
                <div style={styles.itemDetails}>
                  <div style={styles.itemHeader}>
                    <div>
                      <p style={styles.itemBrand}>{item.brand}</p>
                      <h3 
                        style={styles.itemName}
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        {item.name}
                      </h3>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id, item.selectedColor, item.selectedStorage)}
                      style={styles.removeBtn}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>

                  {/* Variants */}
                  <div style={styles.variants}>
                    {item.selectedColor && (
                      <span style={styles.variant}>Color: {item.selectedColor}</span>
                    )}
                    {item.selectedStorage && (
                      <span style={styles.variant}>Storage: {item.selectedStorage}</span>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div style={styles.quantityPrice}>
                    <div style={styles.quantitySelector}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedStorage, item.quantity - 1)}
                        style={styles.qtyBtn}
                      >
                        -
                      </button>
                      <span style={styles.qtyValue}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedStorage, item.quantity + 1)}
                        style={styles.qtyBtn}
                      >
                        +
                      </button>
                    </div>

                    <div style={styles.priceSection}>
                      {item.originalPrice !== item.price && (
                        <span style={styles.originalPrice}>${(item.originalPrice * item.quantity).toLocaleString()}</span>
                      )}
                      <span style={styles.currentPrice}>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button onClick={clearCart} style={styles.clearCartBtn}>
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <motion.div 
          style={styles.summary}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          
          <div style={styles.summaryRows}>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            {savings > 0 && (
              <div style={styles.summaryRow}>
                <span style={styles.savingsText}>You Save</span>
                <span style={styles.savingsText}>-${savings.toLocaleString()}</span>
              </div>
            )}
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={styles.freeShipping}>{totalPrice >= 500 ? 'FREE' : '$25'}</span>
            </div>
          </div>

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>${(totalPrice + (totalPrice >= 500 ? 0 : 25)).toLocaleString()} USD</span>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            style={styles.checkoutBtn}
          >
            Proceed to Checkout
          </button>

          <div style={styles.features}>
            <div style={styles.feature}>
              <span>🔒</span>
              <span>Secure Checkout</span>
            </div>
            <div style={styles.feature}>
              <span>✈️</span>
              <span>International Shipping</span>
            </div>
            <div style={styles.feature}>
              <span>✓</span>
              <span>Authentic Products</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 24px',
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 8px',
  },
  itemCount: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '32px',
    alignItems: 'start',
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cartItem: {
    display: 'flex',
    gap: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  itemImage: {
    width: '140px',
    height: '140px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  itemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '10px',
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemBrand: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0 0 4px',
  },
  itemName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
    cursor: 'pointer',
  },
  removeBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.5)',
    padding: '8px',
    borderRadius: '8px',
  },
  variants: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  variant: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  quantityPrice: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    flexWrap: 'wrap',
    gap: '16px',
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  qtyBtn: {
    width: '36px',
    height: '36px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    width: '50px',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  originalPrice: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.4)',
    textDecoration: 'line-through',
  },
  currentPrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
  },
  clearCartBtn: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  summary: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '28px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: '100px',
  },
  summaryTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 20px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  summaryRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  savingsText: {
    color: '#10b981',
    fontWeight: '600',
  },
  freeShipping: {
    color: '#10b981',
    fontWeight: '600',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderTop: '2px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '20px',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
  },
  checkoutBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '20px',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '100px 20px',
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px',
  },
  emptySubtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '32px',
  },
  shopNowBtn: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  },
};

// Responsive
if (typeof window !== 'undefined') {
  const handleResize = () => {
    if (window.innerWidth <= 968) {
      styles.layout.gridTemplateColumns = '1fr';
      styles.summary.position = 'static';
    }
    if (window.innerWidth <= 640) {
      styles.cartItem.flexDirection = 'column';
      styles.itemImage.width = '100%';
      styles.itemImage.height = '200px';
    }
  };
  handleResize();
  window.addEventListener('resize', handleResize);
}

export default Cart;
