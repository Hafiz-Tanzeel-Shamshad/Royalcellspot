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

export default OrderConfirmation;
