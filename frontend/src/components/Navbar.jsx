import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { createLead } from '../services/leadService';
import { getLead, setLead } from '../utils/leadStorage';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());
  const location = useLocation();
  const navigate = useNavigate();

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadError, setLeadError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // One-time cleanup: if lead is expired, remove it from localStorage.
    getLead();
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
  ];

  const mobileCategoryLinks = [
    { to: '/products?brand=apple', label: 'Apple' },
    { to: '/products?brand=google', label: 'Google' },
    { to: '/products?brand=samsung', label: 'Samsung' },
  ];

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

  const handleCartClick = (e) => {
    e.preventDefault();
    const stored = getLead();
    if (stored) {
      navigate('/cart');
      return;
    }
    setLeadError(null);
    setShowLeadModal(true);
  };

  const handleLeadContinue = async (e) => {
    e.preventDefault();
    setLeadError(null);

    const email = (leadEmail || '').trim();
    const phone = (leadPhone || '').trim();

    if (!isValidEmail(email)) {
      setLeadError('Please enter a valid email');
      return;
    }
    if (!phone) {
      setLeadError('Please enter your phone number');
      return;
    }

    setLeadSaving(true);
    try {
      await createLead({ email, phone, source: 'header_cart' });
      setLead({ email, phone });
      setShowLeadModal(false);
      navigate('/cart');
    } catch (err) {
      setLeadError(
        err?.response?.data?.error || 'Could not save your details. Please try again.'
      );
      console.error(err);
    } finally {
      setLeadSaving(false);
    }
  };

  return (
    <>
      <motion.nav 
        style={{
          ...styles.nav,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#fff',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: '1px solid #f0f0f0',
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div style={styles.navContainer}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>◆</span>
            <span style={styles.logoText}>RoyalCellSpot</span>
          </Link>

          {/* Desktop Navigation */}
          <div style={styles.navLinks}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  ...styles.navLink,
                  ...(location.pathname === link.to ? styles.navLinkActive : {})
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div style={styles.navIcons}>
            {/* Logout Button for Admin */}
            {localStorage.getItem('token') && (
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            )}

            {/* Cart Icon with Badge */}
            <Link to="/cart" style={styles.cartBtn} onClick={handleCartClick}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={styles.cartBadge}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              style={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={styles.mobileMenu}
            >
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={styles.mobileNavLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {mobileCategoryLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={styles.mobileNavLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {showLeadModal && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !leadSaving && setShowLeadModal(false)}
          >
            <motion.div
              style={styles.modal}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(ev) => ev.stopPropagation()}
            >
              <h3 style={styles.modalTitle}>Continue</h3>
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
                    {leadSaving ? 'Saving...' : 'Continue'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s',
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '18px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#0a0a0a',
  },
  logoIcon: {
    fontSize: '26px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '36px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#666',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'color 0.2s',
    padding: '8px 0',
  },
  navLinkActive: {
    color: '#0a0a0a',
  },
  navIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  cartBtn: {
    background: '#f8f9ff',
    border: '1px solid #e8eaff',
    cursor: 'pointer',
    padding: '10px 14px',
    borderRadius: '12px',
    color: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    textDecoration: 'none',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    backgroundColor: '#6366f1',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    minWidth: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #fff',
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
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
  mobileMenuBtn: {
    display: 'none',
    background: '#f8f9ff',
    border: '1px solid #e8eaff',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '12px',
    color: '#6366f1',
  },
  mobileMenu: {
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: '#fff',
  },
  mobileNavLink: {
    textDecoration: 'none',
    color: '#0a0a0a',
    fontSize: '18px',
    fontWeight: '500',
    padding: '14px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  logoutButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

// Responsive
if (typeof window !== 'undefined') {
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      styles.navLinks.display = 'none';
      styles.mobileMenuBtn.display = 'flex';
    } else {
      styles.navLinks.display = 'flex';
      styles.mobileMenuBtn.display = 'none';
    }
  };
  handleResize();
  window.addEventListener('resize', handleResize);
}

export default Navbar;
