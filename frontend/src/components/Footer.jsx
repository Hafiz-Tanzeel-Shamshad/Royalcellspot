import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const footerSections = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', to: '/products' },
        { label: 'Apple iPhones', to: '/products?brand=apple' },
        { label: 'Samsung Galaxy', to: '/products?brand=samsung' },
        { label: 'Google Pixel', to: '/products?brand=google' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', to: '#' },
        { label: 'Shipping Info', to: '#' },
        { label: 'Returns Policy', to: '#' },
        { label: 'FAQ', to: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '#' },
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
      ]
    }
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Main Footer Content */}
        <div style={styles.mainContent}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>◆</span>
              <span style={styles.logoText}>RoyalCellSpot</span>
            </div>
            <p style={styles.brandDescription}>
              Your trusted destination for premium smartphones. 
              Authentic devices with international warranty and global shipping.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink} aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" style={styles.socialLink} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" style={styles.socialLink} aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map(section => (
            <div key={section.title} style={styles.footerSection}>
              <h4 style={styles.sectionTitle}>{section.title}</h4>
              <ul style={styles.linksList}>
                {section.links.map((link, index) => (
                  <li key={`${section.title}-${link.label}-${index}`}>
                    <Link to={link.to} style={styles.link}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div style={styles.paymentSection}>
          <p style={styles.paymentText}>Secure Payment Methods</p>
          <div style={styles.paymentMethods}>
            <div style={styles.paymentBadge}>💳 Visa</div>
            <div style={styles.paymentBadge}>💳 Mastercard</div>
            <div style={styles.paymentBadge}>💳 Amex</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © 2026 RoyalCellSpot. All rights reserved.
          </p>
          <p style={styles.shipping}>
            ✈️ International Shipping • 🌍 Global Warranty
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#f8f9ff',
    color: '#0a0a0a',
    marginTop: '100px',
    padding: '80px 0 0',
    borderTop: '1px solid #e8eaff',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '48px',
    paddingBottom: '48px',
    borderBottom: '1px solid #e8eaff',
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '28px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  brandDescription: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6',
    maxWidth: '320px',
  },
  socialLinks: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  socialLink: {
    color: '#666',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    border: '1px solid #e8eaff',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#0a0a0a',
  },
  linksList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  link: {
    color: '#666',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  paymentSection: {
    padding: '32px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    borderBottom: '1px solid #e8eaff',
  },
  paymentText: {
    fontSize: '13px',
    color: '#666',
  },
  paymentMethods: {
    display: 'flex',
    gap: '12px',
  },
  paymentBadge: {
    backgroundColor: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#666',
    border: '1px solid #e8eaff',
  },
  bottomBar: {
    padding: '24px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  copyright: {
    fontSize: '13px',
    color: '#999',
  },
  shipping: {
    fontSize: '13px',
    color: '#999',
  },
};

// Responsive
if (typeof window !== 'undefined') {
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      styles.mainContent.gridTemplateColumns = '1fr';
      styles.mainContent.gap = '32px';
      styles.bottomBar.flexDirection = 'column';
      styles.bottomBar.textAlign = 'center';
    }
  };
  handleResize();
  window.addEventListener('resize', handleResize);
}

export default Footer;
