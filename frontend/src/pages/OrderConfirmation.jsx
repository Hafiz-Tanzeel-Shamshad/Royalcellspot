import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${API_URL}/orders/track/${orderId}`);
        setOrder(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.error || 'Order not found');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div style={styles.state}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={styles.state}>
        <h2 style={styles.h2}>Order not found</h2>
        <p style={styles.p}>{error}</p>
        <button onClick={() => navigate('/')} style={styles.buttonSecondary}>
          Go Home
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={styles.state}>
        <h2 style={styles.h2}>Order not found</h2>
        <button onClick={() => navigate('/')} style={styles.buttonSecondary}>
          Go Home
        </button>
      </div>
    );
  }

  const createdAt = order.createdAt ? new Date(order.createdAt) : null;
  const products = Array.isArray(order.products) ? order.products : [];

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={styles.card}
      >
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.h1}>Order Placed Successfully</h1>
            <div style={styles.metaRow}>
              <span><strong>Order ID:</strong> {order.orderId}</span>
              <span><strong>Status:</strong> {order.orderStatus}</span>
              <span><strong>Payment:</strong> {order.paymentStatus}</span>
            </div>
            {createdAt && (
              <div style={styles.metaRow}>
                <span><strong>Date:</strong> {createdAt.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div style={styles.badge}>✓</div>
        </div>

        <div style={styles.grid}>
          <div style={styles.section}>
            <h2 style={styles.h2}>Customer</h2>
            <div style={styles.kv}><span style={styles.k}>Name</span><span style={styles.v}>{order?.customer?.name || '-'}</span></div>
            <div style={styles.kv}><span style={styles.k}>Email</span><span style={styles.v}>{order?.customer?.email || '-'}</span></div>
            <div style={styles.kv}><span style={styles.k}>Phone</span><span style={styles.v}>{order?.customer?.phone || '-'}</span></div>
            <div style={styles.kv}><span style={styles.k}>Address</span><span style={styles.v}>{order?.customer?.address || '-'}</span></div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.h2}>Order Items</h2>
            {products.length === 0 ? (
              <p style={styles.p}>No products found on this order.</p>
            ) : (
              <div style={styles.items}>
                {products.map((p, idx) => (
                  <div key={`${p.productId || idx}`} style={styles.itemRow}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={styles.itemImg} />
                    ) : (
                      <div style={styles.itemImgPlaceholder} />
                    )}
                    <div style={styles.itemInfo}>
                      <div style={styles.itemName}>{p.name}</div>
                      {p.selectedColor && <div style={styles.itemMeta}>Color: {p.selectedColor}</div>}
                      {p.selectedStorage && <div style={styles.itemMeta}>Storage: {p.selectedStorage}</div>}
                      <div style={styles.itemMeta}>Qty: {p.quantity}</div>
                    </div>
                    <div style={styles.itemPrice}>${Number(p.price || 0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>${Number(order.totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={() => navigate('/products')} style={styles.buttonPrimary}>
            Continue Shopping
          </button>
          <button onClick={() => navigate('/')} style={styles.buttonSecondary}>
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '32px 16px',
    overflowX: 'hidden',
  },
  card: {
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '20px',
  },
  state: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '48px 16px',
    textAlign: 'center',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '14px',
  },
  badge: {
    width: '52px',
    height: '52px',
    borderRadius: '999px',
    background: '#10b981',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '20px',
    flexShrink: 0,
  },
  h1: {
    margin: 0,
    fontSize: '24px',
  },
  h2: {
    margin: '0 0 10px',
    fontSize: '18px',
  },
  p: {
    margin: 0,
    color: '#444',
  },
  metaRow: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    marginTop: '8px',
    color: '#444',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },
  section: {
    border: '1px solid #f0f0f0',
    borderRadius: '10px',
    padding: '14px',
  },
  kv: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    padding: '6px 0',
    borderBottom: '1px dashed #eee',
  },
  k: {
    color: '#666',
    fontSize: '13px',
  },
  v: {
    color: '#111',
    fontSize: '13px',
    textAlign: 'right',
    wordBreak: 'break-word',
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #f3f4f6',
    minWidth: 0,
  },
  itemImg: {
    width: '44px',
    height: '44px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  itemImgPlaceholder: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    border: '1px solid #eee',
    background: '#fafafa',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontWeight: 700,
    fontSize: '14px',
  },
  itemMeta: {
    fontSize: '12px',
    opacity: 0.8,
  },
  itemPrice: {
    fontWeight: 700,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '12px',
    marginTop: '12px',
    borderTop: '1px solid #eee',
  },
  totalLabel: {
    fontWeight: 700,
  },
  totalValue: {
    fontWeight: 800,
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '18px',
    flexWrap: 'wrap',
  },
  buttonPrimary: {
    padding: '10px 14px',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '10px 14px',
    background: '#fff',
    color: '#111827',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};

if (typeof window !== 'undefined') {
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      styles.container.padding = '16px 12px';
      styles.card.padding = '14px';
      styles.card.borderRadius = '12px';
      styles.headerRow.flexDirection = 'column';
      styles.headerRow.alignItems = 'flex-start';
      styles.badge.width = '44px';
      styles.badge.height = '44px';
      styles.badge.fontSize = '18px';
      styles.h1.fontSize = '20px';
      styles.h2.fontSize = '16px';
      styles.metaRow.fontSize = '13px';
      styles.metaRow.flexDirection = 'column';
      styles.metaRow.alignItems = 'flex-start';
      styles.metaRow.gap = '6px';
      styles.grid.gridTemplateColumns = '1fr';
      styles.grid.gap = '14px';
      styles.section.padding = '12px';
      styles.kv.flexDirection = 'column';
      styles.kv.alignItems = 'flex-start';
      styles.v.textAlign = 'left';
      styles.itemRow.alignItems = 'flex-start';
      styles.itemRow.flexWrap = 'wrap';
      styles.itemRow.gap = '8px';
      styles.itemInfo.width = '100%';
      styles.itemPrice.marginLeft = 'auto';
      styles.itemPrice.width = '100%';
      styles.itemPrice.textAlign = 'right';
      styles.actions.flexDirection = 'column';
      styles.actions.alignItems = 'stretch';
      styles.buttonPrimary.width = '100%';
      styles.buttonSecondary.width = '100%';
    }
    if (window.innerWidth <= 480) {
      styles.container.padding = '12px 10px';
      styles.card.borderRadius = '10px';
      styles.container.maxWidth = '100%';
      styles.state.padding = '36px 12px';
      styles.metaRow.fontSize = '12px';
      styles.itemName.fontSize = '13px';
      styles.itemMeta.fontSize = '11px';
      styles.itemPrice.fontSize = '13px';
      styles.itemImg.width = '40px';
      styles.itemImg.height = '40px';
      styles.itemImgPlaceholder.width = '40px';
      styles.itemImgPlaceholder.height = '40px';
      styles.buttonPrimary.padding = '12px';
      styles.buttonSecondary.padding = '12px';
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);
}

export default OrderConfirmation;
