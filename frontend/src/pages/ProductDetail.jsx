import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCartStore from "../store/cartStore";
import { getProductById } from "../services/productService";
import { createLead } from "../services/leadService";
import { getLead, setLead } from "../utils/leadStorage";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadError, setLeadError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
      if (data) {
        setSelectedColor(data.colors?.[0] || null);
        setSelectedStorage(data.storage?.[0] || null);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div style={styles.notFound}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          Go Home
        </button>
      </div>
    );
  }

  const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());


  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor, selectedStorage);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    const stored = getLead();
    if (stored) {
      addItem(product, quantity, selectedColor, selectedStorage);
      navigate('/checkout');
      return;
    }

    setLeadError(null);
    setShowLeadModal(true);
  };

  const handleLeadContinue = async (e) => {
    e.preventDefault();
    setLeadError(null);

    const email = (leadEmail || "").trim();
    const phone = (leadPhone || "").trim();

    if (!isValidEmail(email)) {
      setLeadError("Please enter a valid email");
      return;
    }
    if (!phone) {
      setLeadError("Please enter your phone number");
      return;
    }

    setLeadSaving(true);
    try {
      await createLead({ email, phone, source: "buy_now" });
      setLead({ email, phone });
      setShowLeadModal(false);

      addItem(product, quantity, selectedColor, selectedStorage);
      navigate('/checkout');
    } catch (err) {
      setLeadError(err?.response?.data?.error || "Could not save your details. Please try again.");
      console.error(err);
    } finally {
      setLeadSaving(false);
    }
  };

  return (
    <>
    <div style={styles.container}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span onClick={() => navigate('/')} style={styles.breadcrumbLink}>Home</span>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span onClick={() => navigate('/products')} style={styles.breadcrumbLink}>Products</span>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbCurrent}>{product.name}</span>
      </div>

      <div style={styles.productLayout}>
        {/* Product Image */}
        <motion.div 
          style={styles.imageSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.imageWrapper}>
            <img src={product.image} alt={product.name} style={styles.productImage} />
            {discount > 0 && (
              <div style={styles.discountBadge}>Save {discount}%</div>
            )}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          style={styles.infoSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p style={styles.brand}>{product.brand}</p>
          <h1 style={styles.productName}>{product.name}</h1>
          
          {/* Price */}
          <div style={styles.priceSection}>
            <span style={styles.currentPrice}>${product.discountPrice.toLocaleString()}</span>
            {product.price !== product.discountPrice && (
              <>
                <span style={styles.originalPrice}>${product.price.toLocaleString()}</span>
                <span style={styles.discountTag}>-{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div style={styles.optionGroup}>
              <label style={styles.optionLabel}>Color: <span style={styles.selectedValue}>{selectedColor}</span></label>
              <div style={styles.optionButtons}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      ...styles.optionBtn,
                      ...(selectedColor === color ? styles.optionBtnActive : {})
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Selection */}
          {product.storage && product.storage.length > 0 && (
            <div style={styles.optionGroup}>
              <label style={styles.optionLabel}>Storage: <span style={styles.selectedValue}>{selectedStorage}</span></label>
              <div style={styles.optionButtons}>
                {product.storage.map(storage => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    style={{
                      ...styles.optionBtn,
                      ...(selectedStorage === storage ? styles.optionBtnActive : {})
                    }}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div style={styles.optionGroup}>
            <label style={styles.optionLabel}>Quantity</label>
            <div style={styles.quantitySelector}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.qtyBtn}
              >
                -
              </button>
              <span style={styles.qtyValue}>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                style={styles.qtyBtn}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <motion.button
              style={styles.addToCartBtn}
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
            >
              {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
            </motion.button>
            <motion.button
              style={styles.buyNowBtn}
              onClick={handleBuyNow}
              whileTap={{ scale: 0.95 }}
            >
              Buy Now
            </motion.button>
          </div>

          {/* Features */}
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🚚</span>
              <div>
                <h4 style={styles.featureTitle}>Free International Shipping</h4>
                <p style={styles.featureDesc}>On orders above $500</p>
              </div>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <div>
                <h4 style={styles.featureTitle}>Authentic Product</h4>
                <p style={styles.featureDesc}>100% genuine with warranty</p>
              </div>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>↩️</span>
              <div>
                <h4 style={styles.featureTitle}>30-Day Returns</h4>
                <p style={styles.featureDesc}>Easy return policy</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>

    {showLeadModal && (
      <div
        style={styles.modalOverlay}
        onClick={() => !leadSaving && setShowLeadModal(false)}
      >
        <div style={styles.modal} onClick={(ev) => ev.stopPropagation()}>
          <h3 style={styles.modalTitle}>Continue to Checkout</h3>
          <p style={styles.modalSubtitle}>Enter your email and phone number to continue.</p>

          <form onSubmit={handleLeadContinue}>
            <input
              type="email"
              value={leadEmail}
              onChange={(ev) => setLeadEmail(ev.target.value)}
              placeholder="Email"
              style={styles.modalInput}
              disabled={leadSaving}
              required
            />
            <input
              type="tel"
              value={leadPhone}
              onChange={(ev) => setLeadPhone(ev.target.value)}
              placeholder="Phone"
              style={styles.modalInput}
              disabled={leadSaving}
              required
            />

            {leadError && <div style={styles.modalError}>{leadError}</div>}

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.modalCancel}
                onClick={() => setShowLeadModal(false)}
                disabled={leadSaving}
              >
                Cancel
              </button>
              <button type="submit" style={styles.modalContinue} disabled={leadSaving}>
                {leadSaving ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
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
  notFound: {
    textAlign: 'center',
    padding: '100px 20px',
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
  },
  backBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '16px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  breadcrumbSeparator: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
  breadcrumbCurrent: {
    color: '#fff',
    fontWeight: '500',
  },
  productLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '64px',
    alignItems: 'start',
  },
  imageSection: {
    position: 'sticky',
    top: '100px',
  },
  imageWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '24px',
    padding: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
  },
  discountBadge: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: '700',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  brand: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    margin: 0,
  },
  productName: {
    fontSize: 'clamp(28px, 4vw, 40px)',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
    lineHeight: '1.2',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#fff',
  },
  originalPrice: {
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.4)',
    textDecoration: 'line-through',
  },
  discountTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '6px 12px',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  optionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  selectedValue: {
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  optionButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  optionBtn: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.2s',
  },
  optionBtnActive: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '4px',
    width: 'fit-content',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  qtyBtn: {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    width: '60px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  addToCartBtn: {
    flex: 1,
    padding: '16px 24px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.2s',
  },
  buyNowBtn: {
    flex: 1,
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.2s',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  feature: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: '24px',
  },
  featureTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 4px',
  },
  featureDesc: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 9999,
  },
  modal: {
    width: '100%',
    maxWidth: '420px',
    background: '#fff',
    borderRadius: '16px',
    padding: '18px',
    border: '1px solid #f0f0f0',
  },
  modalTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#0a0a0a',
  },
  modalSubtitle: {
    margin: '6px 0 14px',
    fontSize: '13px',
    color: '#666',
  },
  modalInput: {
    width: '100%',
    padding: '12px 12px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    outline: 'none',
    fontSize: '14px',
    marginBottom: '10px',
  },
  modalError: {
    marginTop: '2px',
    marginBottom: '10px',
    color: '#b91c1c',
    fontSize: '13px',
    fontWeight: 600,
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '6px',
  },
  modalCancel: {
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  modalContinue: {
    padding: '10px 12px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
};

// Responsive
if (typeof window !== 'undefined') {
  const handleResize = () => {
    if (window.innerWidth <= 968) {
      styles.productLayout.gridTemplateColumns = '1fr';
      styles.productLayout.gap = '40px';
      styles.imageSection.position = 'static';
    }
  };
  handleResize();
  window.addEventListener('resize', handleResize);
}

export default ProductDetail;
