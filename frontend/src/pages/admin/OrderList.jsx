import React, { useEffect, useMemo, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../services/orderService';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDraft, setStatusDraft] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const token = useMemo(() => localStorage.getItem('token'), []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) {
          throw new Error('Admin token missing. Please login again.');
        }

        const data = await getOrders(token);
        const list = Array.isArray(data?.data) ? data.data : [];
        setOrders(list);

        // Initialize status draft values
        const draft = {};
        for (const o of list) {
          if (o?._id) draft[o._id] = o.orderStatus || 'processing';
        }
        setStatusDraft(draft);
      } catch (err) {
        setError(err?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const formatDateTime = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString();
  };

  const statusLabel = (orderStatus) => {
    if (orderStatus === 'delivered') return 'Delivered';
    // Treat everything else as "Pending" per admin requirement
    return 'Pending';
  };

  const handleSaveStatus = async (order) => {
    try {
      if (!token) {
        throw new Error('Admin token missing. Please login again.');
      }
      if (!order?._id) return;

      const nextStatus = statusDraft[order._id] || order.orderStatus || 'processing';

      setUpdatingId(order._id);
      setError(null);

      const res = await updateOrderStatus(token, order._id, nextStatus);
      const updated = res?.data;

      if (!updated?._id) {
        throw new Error('Failed to update order status');
      }

      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      setStatusDraft((prev) => ({ ...prev, [updated._id]: updated.orderStatus }));
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.section}>
          <div style={styles.stateText}>Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.section}>
          <div style={styles.alertError}>
            <span style={styles.alertStrong}>Error:</span> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Customer Orders</h2>
          <div style={styles.subTitle}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        {orders.length === 0 ? (
        <p style={styles.stateText}>No orders found.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Products</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const currentDraft = statusDraft[order._id] || order.orderStatus || 'processing';
                const lines = Array.isArray(order?.products) ? order.products : [];

                return (
                  <tr key={order._id}>
                    <td style={styles.td}>
                      <div style={styles.orderIdPrimary}>{order.orderId || order._id}</div>
                      {order.orderId && <div style={styles.orderIdSecondary}>{order._id}</div>}
                    </td>
                    <td style={styles.td}>{order?.customer?.name || '-'}</td>
                    <td style={styles.td}>{order?.customer?.phone || '-'}</td>
                    <td style={{ ...styles.td, ...styles.addressCell }}>{order?.customer?.address || '-'}</td>
                    <td style={{ ...styles.td, ...styles.productsCell }}>
                      {lines.length === 0 ? (
                        '-'
                      ) : (
                        <ul style={styles.productList}>
                          {lines.map((p, idx) => {
                            const name = p?.name || p?.productId?.name || 'Unknown product';
                            const qty = p?.quantity;
                            const key = p?.productId?._id || p?.productId || `${order._id}-${idx}`;

                            return (
                              <li key={key} style={styles.productListItem}>
                                {name}{qty ? ` x${qty}` : ''}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                    <td style={styles.td}>${Number(order?.totalAmount || 0).toLocaleString()}</td>
                    <td style={styles.td}>
                      <div
                        style={{
                          ...styles.statusBadge,
                          ...(order.orderStatus === 'delivered' ? styles.statusDelivered : styles.statusPending),
                        }}
                      >
                        {statusLabel(order.orderStatus)}
                      </div>
                      <div style={styles.statusRaw}>{order.orderStatus || '-'}</div>
                    </td>
                    <td style={styles.td}>{formatDateTime(order.createdAt)}</td>
                    <td style={styles.td}>
                      <div style={styles.updateRow}>
                        <select
                          value={currentDraft}
                          onChange={(e) =>
                            setStatusDraft((prev) => ({ ...prev, [order._id]: e.target.value }))
                          }
                          style={styles.select}
                          disabled={updatingId === order._id}
                        >
                          <option value="processing">Pending</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleSaveStatus(order)}
                          style={styles.button}
                          disabled={updatingId === order._id}
                        >
                          {updatingId === order._id ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 16px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    color: '#0f172a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '12px',
    marginBottom: '12px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 800,
  },
  subTitle: {
    marginTop: '6px',
    color: '#64748b',
    fontSize: '13px',
  },
  stateText: {
    padding: '10px 0',
    color: '#334155',
  },
  alertError: {
    padding: '12px 12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    color: '#991b1b',
    fontSize: '14px',
  },
  alertStrong: {
    fontWeight: 800,
    marginRight: '6px',
  },
  section: {
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '16px',
    backgroundColor: '#fff',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(2, 6, 23, 0.06)',
  },
  tableWrap: {
    width: '100%',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'separate',
    borderSpacing: 0,
    backgroundColor: '#fff',
  },
  th: {
    borderBottom: '1px solid #e5e7eb',
    padding: '10px 10px',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontSize: '12px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  td: {
    borderBottom: '1px solid #eef2f7',
    padding: '10px 10px',
    verticalAlign: 'top',
    color: '#0f172a',
    fontSize: '14px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  addressCell: {
    maxWidth: '220px',
  },
  productsCell: {
    maxWidth: '220px',
  },
  productList: {
    margin: 0,
    paddingLeft: '18px',
  },
  productListItem: {
    marginBottom: '4px',
  },
  orderIdPrimary: {
    fontWeight: 700,
  },
  orderIdSecondary: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '6px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  updateRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  select: {
    padding: '8px 10px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '140px',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 800,
    width: '100%',
    maxWidth: '140px',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 800,
    border: '1px solid transparent',
  },
  statusPending: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    color: '#9a3412',
  },
  statusDelivered: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    color: '#065f46',
  },
  statusRaw: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '6px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
};

export default OrderList;
