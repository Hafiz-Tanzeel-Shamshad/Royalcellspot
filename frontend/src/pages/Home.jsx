import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService.js";
import ProductCard from "../components/ProductCard.jsx";

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [expandedModel, setExpandedModel] = useState(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  const brands = [
    { id: 'Apple', label: 'Apple', icon: '🍎', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)' },
    { id: 'Samsung', label: 'Samsung', icon: '📱', gradient: 'linear-gradient(135deg, #1a237e 0%, #42a5f5 100%)' },
    { id: 'Google', label: 'Google', icon: '🔍', gradient: 'linear-gradient(135deg, #ea4335 0%, #4285f4 100%)' },
  ];

  const filteredProducts = selectedBrand === 'all' 
    ? products 
    : products.filter(p => p.brand === selectedBrand);

  const appleProducts = products.filter(p => p.brand === 'Apple');
  const samsungProducts = products.filter(p => p.brand === 'Samsung');
  const googleProducts = products.filter(p => p.brand === 'Google');

  const getIphoneModelName = (product) => {
    if (product.brand !== 'Apple') {
      return null;
    }

    const match = product.name.match(/^iPhone\s+\d+/);
    return match ? match[0] : null;
  };

  const isIphoneProduct = (product) => Boolean(getIphoneModelName(product));

  const appleIphoneGroups = new Map();
  const appleOtherProducts = [];

  appleProducts.forEach((product) => {
    if (isIphoneProduct(product)) {
      const modelName = getIphoneModelName(product);
      if (!appleIphoneGroups.has(modelName)) {
        appleIphoneGroups.set(modelName, []);
      }
      appleIphoneGroups.get(modelName).push(product);
    } else {
      appleOtherProducts.push(product);
    }
  });

  const toggleModel = (modelName) => {
    setExpandedModel((prev) => (prev === modelName ? null : modelName));
  };

  return (
    <div style={styles.container}>
      {/* Hero Section - Premium Mobile Store */}
      <motion.section 
        style={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span style={styles.heroBadge}>✈️ International Shipping Available</span>
            <h1 style={styles.heroTitle}>
              Premium
              <br />
              <span style={styles.heroTitleGradient}>Smartphones</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Discover the latest flagship devices from world-renowned brands. 
              Authentic products with global warranty.
            </p>
            <div style={styles.heroButtons}>
              <Link to="/products" style={styles.btnPrimary}>
                Shop Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <a href="#brands" style={styles.btnSecondary}>Explore Brands</a>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Phone Mockup */}
        <motion.div 
          style={styles.heroPhone}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div style={styles.phoneMockup}>
            <div style={styles.phoneScreen}>
              <div style={styles.phoneImageBackground} />
              <div style={styles.phoneLabelWrap}>
                <p style={styles.phoneText}>Latest Flagships</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Scrolling Marquee */}
      <div style={styles.marquee}>
        <motion.div
          style={styles.marqueeContent}
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span style={styles.marqueeItem}>✓ Authentic Products</span>
              <span style={styles.marqueeDot}>•</span>
              <span style={styles.marqueeItem}>✈️ Global Shipping</span>
              <span style={styles.marqueeDot}>•</span>
              <span style={styles.marqueeItem}>🔒 Secure Payment</span>
              <span style={styles.marqueeDot}>•</span>
              <span style={styles.marqueeItem}>↩️ 30-Day Returns</span>
              <span style={styles.marqueeDot}>•</span>
              <span style={styles.marqueeItem}>🎁 Best Prices</span>
              <span style={styles.marqueeDot}>•</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Trust Badges */}
      <section style={styles.trustSection}>
        <div style={styles.trustGrid}>
          <motion.div 
            style={styles.trustItem}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div style={styles.trustIcon}>🔒</div>
            <h4 style={styles.trustTitle}>Secure Checkout</h4>
            <p style={styles.trustDesc}>256-bit SSL encryption</p>
          </motion.div>
          <motion.div 
            style={styles.trustItem}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div style={styles.trustIcon}>✈️</div>
            <h4 style={styles.trustTitle}>Worldwide Delivery</h4>
            <p style={styles.trustDesc}>10-15 business days</p>
          </motion.div>
          <motion.div 
            style={styles.trustItem}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div style={styles.trustIcon}>✓</div>
            <h4 style={styles.trustTitle}>100% Authentic</h4>
            <p style={styles.trustDesc}>Original warranty</p>
          </motion.div>
          <motion.div 
            style={styles.trustItem}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div style={styles.trustIcon}>💳</div>
            <h4 style={styles.trustTitle}>Easy Payments</h4>
            <p style={styles.trustDesc}>All major cards accepted</p>
          </motion.div>
        </div>
      </section>

      {/* Brands Showcase */}
      <section id="brands" style={styles.brandsSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={styles.sectionTitle}>Shop by Brand</h2>
          <p style={styles.sectionSubtitle}>Choose from the world's leading smartphone manufacturers</p>
          
          <div style={styles.brandCards}>
            {brands.map((brand, index) => (
              <motion.button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.id)}
                style={{
                  ...styles.brandCard,
                  background: selectedBrand === brand.id ? brand.gradient : 'rgba(255,255,255,0.05)',
                  border: selectedBrand === brand.id ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.1)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <span style={styles.brandIcon}>{brand.icon}</span>
                <h3 style={styles.brandName}>{brand.label}</h3>
                <p style={styles.brandCount}>
                  {products.filter(p => p.brand === brand.id).length} Products
                </p>
              </motion.button>
            ))}
            
            <motion.button
              onClick={() => setSelectedBrand('all')}
              style={{
                ...styles.brandCard,
                background: selectedBrand === 'all' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.05)',
                border: selectedBrand === 'all' ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <span style={styles.brandIcon}>🌍</span>
              <h3 style={styles.brandName}>All Brands</h3>
              <p style={styles.brandCount}>{products.length} Products</p>
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      {selectedBrand === 'all' && (
        <>
          {/* Apple Section */}
          <section style={styles.brandSection}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🍎 Apple iPhones</h2>
                <p style={styles.sectionSubtitle}>Latest iPhone models with Apple warranty</p>
              </div>
              <Link to="/products?brand=apple" style={styles.viewAll}>View All →</Link>
            </div>
            <div style={styles.modelRow}>
              {Array.from(appleIphoneGroups.entries()).map(([modelName, variants]) => (
                <motion.button
                  key={modelName}
                  type="button"
                  onClick={() => toggleModel(modelName)}
                  style={styles.modelCard}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span style={styles.modelLabel}>iPhone</span>
                  <span style={styles.modelName}>{modelName}</span>
                  <span style={styles.modelMeta}>
                    {variants.length} variant{variants.length === 1 ? '' : 's'}
                  </span>
                </motion.button>
              ))}
            </div>
            {expandedModel && (
              <div style={styles.variantStack}>
                <div>
                  <h3 style={styles.variantTitle}>{expandedModel} Variants</h3>
                  <div style={styles.productsGrid}>
                    {(appleIphoneGroups.get(expandedModel) || []).map((variant, index) => (
                      <motion.div
                        key={variant.id || variant._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard product={variant} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {appleOtherProducts.length > 0 && (
              <div style={styles.productsGrid}>
                {appleOtherProducts.map((product, index) => (
                  <motion.div
                    key={product.id || product._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Samsung Section */}
          <section style={styles.brandSection}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>📱 Samsung Galaxy</h2>
                <p style={styles.sectionSubtitle}>Premium Android smartphones</p>
              </div>
              <Link to="/products?brand=samsung" style={styles.viewAll}>View All →</Link>
            </div>
            <div style={styles.productsGrid}>
              {samsungProducts.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Google Section */}
          <section style={styles.brandSection}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🔍 Google Pixel</h2>
                <p style={styles.sectionSubtitle}>Pure Android experience with AI features</p>
              </div>
              <Link to="/products?brand=google" style={styles.viewAll}>View All →</Link>
            </div>
            <div style={styles.productsGrid}>
              {googleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Filtered Products */}
      {selectedBrand !== 'all' && (
        <section style={styles.productsSection}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>{selectedBrand} Products</h2>
              <p style={styles.sectionSubtitle}>Showing {filteredProducts.length} products</p>
            </div>
            <button onClick={() => setSelectedBrand('all')} style={styles.resetBtn}>Show All</button>
          </div>
          {selectedBrand === 'Apple' ? (
            <>
              <div style={styles.modelRow}>
                {Array.from(appleIphoneGroups.entries()).map(([modelName, variants]) => (
                  <motion.button
                    key={modelName}
                    type="button"
                    onClick={() => toggleModel(modelName)}
                    style={styles.modelCard}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <span style={styles.modelLabel}>iPhone</span>
                    <span style={styles.modelName}>{modelName}</span>
                    <span style={styles.modelMeta}>
                      {variants.length} variant{variants.length === 1 ? '' : 's'}
                    </span>
                  </motion.button>
                ))}
              </div>
              {expandedModel && (
                <div style={styles.variantStack}>
                  <div>
                    <h3 style={styles.variantTitle}>{expandedModel} Variants</h3>
                    <div style={styles.productsGrid}>
                      {(appleIphoneGroups.get(expandedModel) || []).map((variant, index) => (
                        <motion.div
                          key={variant.id || variant._id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ProductCard product={variant} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {appleOtherProducts.length > 0 && (
                <div style={styles.productsGrid}>
                  {appleOtherProducts.map((product, index) => (
                    <motion.div
                      key={product.id || product._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={styles.productsGrid}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <motion.div
          style={styles.ctaContent}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={styles.ctaTitle}>Ready to Upgrade?</h2>
          <p style={styles.ctaSubtitle}>
            Get the latest flagship devices with international warranty and fast global shipping.
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/products" style={styles.ctaBtn}>Browse All Products</Link>
            <a href="/contact" style={styles.ctaBtnOutline}>Contact Us</a>
          </div>
          <div style={styles.ctaFeatures}>
            <span style={styles.ctaFeature}>✓ Free Shipping over $500</span>
            <span style={styles.ctaFeature}>✓ Secure Payment</span>
            <span style={styles.ctaFeature}>✓ 30-Day Returns</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
  },
  hero: {
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  heroContent: {
    maxWidth: '1400px',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  heroBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#60A5FA',
    marginBottom: '24px',
    letterSpacing: '0.5px',
  },
  heroTitle: {
    fontSize: 'clamp(48px, 8vw, 88px)',
    fontWeight: '800',
    lineHeight: '1',
    marginBottom: '24px',
    color: '#FFFFFF',
    letterSpacing: '-2px',
  },
  heroTitleGradient: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: 'clamp(16px, 2vw, 20px)',
    color: '#CBD5E1',
    lineHeight: '1.6',
    marginBottom: '32px',
    maxWidth: '500px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.3s',
    border: 'none',
  },
  btnSecondary: {
    display: 'inline-block',
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  },
  heroPhone: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneMockup: {
    width: 'clamp(240px, 26vw, 300px)',
    aspectRatio: '1 / 2',
    backgroundColor: '#1E293B',
    borderRadius: '40px',
    border: '3px solid rgba(59, 130, 246, 0.3)',
    boxShadow: '0 50px 100px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)',
    overflow: 'hidden',
    position: 'relative',
  },
  phoneScreen: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0',
    padding: '18px 16px 16px',
    overflow: 'hidden',
    position: 'relative',
  },
  phoneImageBackground: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(https://media.secure-mobiles.com/product-images/17XA2.1.responsive-lg.centre.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'auto 100%',
    backgroundColor: 'rgba(59, 130, 246, 0.14)',
  },
  phoneLabelWrap: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '10px',
  },
  phoneImage: {
    width: '100%',
    maxWidth: '215px',
    maxHeight: '58%',
    height: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 18px 32px rgba(0,0,0,0.22))',
    flexShrink: 0,
  },
  phoneText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    margin: 0,
  },
  marquee: {
    backgroundColor: '#FFFFFF',
    padding: '20px 0',
    overflow: 'hidden',
    borderTop: '1px solid #E2E8F0',
    gap: '40px',
    whiteSpace: 'nowrap',
  },
  marqueeItem: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: '0.5px',
  },
  marqueeDot: {
    fontSize: '14px',
    color: '#94A3B8',
  },
  trustSection: {
    padding: '60px 24px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
  },
  trustGrid: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
  },
  trustItem: {
    textAlign: 'center',
    padding: '32px 24px',
    backgroundColor: '#F8FAFC',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    transition: 'all 0.3s',
  },
  trustIcon: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  trustTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#0F172A',
  },
  trustDesc: {
    fontSize: '14px',
    color: '#64748B',
  },
  brandsSection: {
    padding: '80px 24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: 'clamp(32px, 5vw, 48px)',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '8px',
    letterSpacing: '-1px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#64748B',
    marginBottom: '40px',
  },
  brandCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  brandCard: {
    padding: '32px 24px',
    borderRadius: '20px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s',
    border: 'none',
    color: '#0F172A',
  },
  brandIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#0F172A',
  },
  brandCount: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
  },
  brandSection: {
    padding: '80px 24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  viewAll: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    padding: '8px 16px',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  modelRow: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  modelCard: {
    minWidth: '200px',
    padding: '16px 18px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textAlign: 'left',
  },
  modelLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#64748B',
  },
  modelName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F172A',
  },
  modelMeta: {
    fontSize: '13px',
    color: '#64748B',
  },
  variantStack: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  variantTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#0F172A',
  },
  productsSection: {
    padding: '80px 24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  resetBtn: {
    padding: '10px 20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#0F172A',
  },
  ctaSection: {
    padding: '100px 24px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    margin: '80px 0 0',
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 'clamp(36px, 6vw, 56px)',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '16px',
    letterSpacing: '-1px',
  },
  ctaSubtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '32px',
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '32px',
  },
  ctaBtn: {
    display: 'inline-block',
    padding: '16px 40px',
    backgroundColor: '#fff',
    color: '#6366f1',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '16px',
    transition: 'all 0.3s',
  },
  ctaBtnOutline: {
    display: 'inline-block',
    padding: '16px 40px',
    backgroundColor: 'transparent',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  },
  ctaFeatures: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaFeature: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
};

// Responsive
if (typeof window !== 'undefined') {
  const handleResize = () => {
    if (window.innerWidth <= 968) {
      styles.heroContent.gridTemplateColumns = '1fr';
      styles.heroPhone.display = 'none';
    }
    if (window.innerWidth <= 768) {
      styles.trustGrid.gridTemplateColumns = 'repeat(2, 1fr)';
      styles.brandCards.gridTemplateColumns = 'repeat(2, 1fr)';
    }
    if (window.innerWidth <= 480) {
      styles.trustGrid.gridTemplateColumns = '1fr';
      styles.brandCards.gridTemplateColumns = '1fr';
      styles.productsGrid.gridTemplateColumns = '1fr';
    }
  };
  handleResize();
  window.addEventListener('resize', handleResize);
}

export default Home;
