import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import OrderList from './OrderList';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = ({ setAdmin }) => {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('token'), []);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAdmin(false);
    navigate('/admin/login');
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductError(null);

      const res = await axios.get(`${API_URL}/products`);
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setProducts(list);
    } catch (err) {
      setProductError(err?.response?.data?.error || err?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (p) => {
    const id = p?._id;
    if (!id) return;

    setEditingId(id);
    setProductError(null);

    setEditForm({
      name: p?.name || '',
      brand: p?.brand || '',
      category: p?.category || '',
      description: p?.description || '',
      price: p?.price ?? '',
      discountPrice: p?.discountPrice ?? '',
      stock: p?.stock ?? 0,
      imagesText: Array.isArray(p?.images) ? p.images.join(', ') : '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setSaving(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      if (!editingId || !editForm) return;
      if (!token) {
        setProductError('Admin token missing. Please login again.');
        return;
      }

      const priceNum = Number(editForm.price);
      const stockNum = Number(editForm.stock);
      const discountNum = editForm.discountPrice === '' ? undefined : Number(editForm.discountPrice);

      if (!editForm.name || !editForm.brand || !editForm.category || !editForm.description) {
        setProductError('Please fill all required fields (name, brand, category, description).');
        return;
      }
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        setProductError('Price must be a valid number.');
        return;
      }
      if (!Number.isFinite(stockNum) || stockNum < 0) {
        setProductError('Stock must be a valid number.');
        return;
      }
      if (discountNum !== undefined && (!Number.isFinite(discountNum) || discountNum < 0)) {
        setProductError('Discount price must be a valid number.');
        return;
      }

      setSaving(true);
      setProductError(null);

      const payload = {
        name: String(editForm.name).trim(),
        brand: String(editForm.brand).trim(),
        category: String(editForm.category).trim(),
        description: String(editForm.description).trim(),
        price: priceNum,
        stock: stockNum,
        images: String(editForm.imagesText || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (discountNum !== undefined) {
        payload.discountPrice = discountNum;
      }

      const res = await axios.put(`${API_URL}/products/${editingId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = res?.data?.data;
      if (updated?._id) {
        setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      }

      cancelEdit();
    } catch (err) {
      setProductError(err?.response?.data?.error || err?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (p) => {
    const id = p?._id;
    if (!id) return;

    setProductError(null);
    setDeleteCandidate(p);
  };

  const cancelDelete = () => {
    setDeleteCandidate(null);
    setDeletingId(null);
  };

  const confirmDelete = async () => {
    try {
      const id = deleteCandidate?._id;
      if (!id) return;

      if (!token) {
        setProductError('Admin token missing. Please login again.');
        cancelDelete();
        return;
      }

      setDeletingId(id);
      setProductError(null);

      await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prev) => prev.filter((x) => x._id !== id));
      if (editingId === id) cancelEdit();
      cancelDelete();
    } catch (err) {
      setProductError(err?.response?.data?.error || err?.message || 'Failed to delete product');
      setDeletingId(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
          <div style={styles.pageSubTitle}>Manage products and customer orders</div>
        </div>
      </div>

      <div style={styles.navigation}>
        <Link to="/admin/add-product" style={styles.navLink}>+ Add Product</Link>
        <button type="button" onClick={fetchProducts} style={styles.refreshButton}>Refresh</button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Products</h2>

        {loadingProducts ? (
          <div style={styles.stateText}>Loading products...</div>
        ) : productError ? (
          <div style={styles.alertError}>
            <span style={styles.alertStrong}>Error:</span> {productError}
          </div>
        ) : products.length === 0 ? (
          <div style={styles.stateText}>No products found.</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Discount</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td style={styles.td}>
                      <div style={styles.productName}>{p.name}</div>
                      <div style={styles.productId}>{p._id}</div>
                    </td>
                    <td style={styles.td}>{p.brand || '-'}</td>
                    <td style={styles.td}>{p.category || '-'}</td>
                    <td style={styles.td}>${Number(p.price || 0).toLocaleString()}</td>
                    <td style={styles.td}>{p.discountPrice != null ? `$${Number(p.discountPrice).toLocaleString()}` : '-'}</td>
                    <td style={styles.td}>{p.stock ?? 0}</td>
                    <td style={styles.td}>
                      <div style={styles.actionRow}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            startEdit(p);
                          }}
                          style={styles.editButton}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            requestDelete(p);
                          }}
                          style={styles.deleteButton}
                          disabled={deletingId === p._id}
                        >
                          {deletingId === p._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingId && editForm && (
          <div
            style={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) cancelEdit();
            }}
          >
            <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Edit Product</h3>
                <button type="button" onClick={cancelEdit} style={styles.iconButton} disabled={saving} aria-label="Close">
                  ×
                </button>
              </div>

              <div style={styles.formGrid}>
                <label style={styles.label}>
                  Name
                  <input style={styles.input} name="name" value={editForm.name} onChange={handleEditChange} />
                </label>

                <label style={styles.label}>
                  Brand
                  <input style={styles.input} name="brand" value={editForm.brand} onChange={handleEditChange} />
                </label>

                <label style={styles.label}>
                  Category
                  <input style={styles.input} name="category" value={editForm.category} onChange={handleEditChange} />
                </label>

                <label style={styles.label}>
                  Stock
                  <input style={styles.input} type="number" name="stock" value={editForm.stock} onChange={handleEditChange} />
                </label>

                <label style={styles.label}>
                  Price
                  <input style={styles.input} type="number" name="price" value={editForm.price} onChange={handleEditChange} />
                </label>

                <label style={styles.label}>
                  Discount Price
                  <input style={styles.input} type="number" name="discountPrice" value={editForm.discountPrice} onChange={handleEditChange} />
                </label>

                <label style={{ ...styles.label, gridColumn: '1 / -1' }}>
                  Description
                  <textarea style={styles.textarea} name="description" value={editForm.description} onChange={handleEditChange} />
                </label>

                <label style={{ ...styles.label, gridColumn: '1 / -1' }}>
                  Images (comma-separated)
                  <input style={styles.input} name="imagesText" value={editForm.imagesText} onChange={handleEditChange} />
                </label>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={cancelEdit} style={styles.cancelButton} disabled={saving}>
                  Cancel
                </button>
                <button type="button" onClick={saveEdit} style={styles.saveButton} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteCandidate && (
          <div
            style={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) cancelDelete();
            }}
          >
            <div style={styles.confirmModal} onMouseDown={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Delete Product</h3>
                <button type="button" onClick={cancelDelete} style={styles.iconButton} disabled={deletingId === deleteCandidate._id} aria-label="Close">
                  ×
                </button>
              </div>

              <div style={styles.confirmBody}>
                <p style={styles.confirmText}>
                  Are you sure you want to delete <strong>{deleteCandidate?.name || 'this product'}</strong>?
                </p>
                <p style={styles.confirmSubtext}>This action cannot be undone.</p>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={cancelDelete}
                  style={styles.cancelButton}
                  disabled={deletingId === deleteCandidate._id}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  style={styles.dangerButton}
                  disabled={deletingId === deleteCandidate._id}
                >
                  {deletingId === deleteCandidate._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <OrderList />
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
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '14px',
  },
  pageTitle: {
    margin: 0,
    fontSize: '26px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  pageSubTitle: {
    marginTop: '6px',
    color: '#475569',
    fontSize: '14px',
  },
  navigation: {
    marginBottom: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  navLink: {
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    padding: '10px 14px',
    borderRadius: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 10px 18px rgba(99, 102, 241, 0.18)',
  },
  refreshButton: {
    padding: '10px 14px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#0f172a',
  },
  section: {
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '16px',
    backgroundColor: '#fff',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(2, 6, 23, 0.06)',
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: '16px',
    fontWeight: 800,
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
  tableWrap: {
    width: '100%',
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    minWidth: '900px',
    backgroundColor: '#fff',
  },
  th: {
    borderBottom: '1px solid #e5e7eb',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontSize: '12px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  td: {
    borderBottom: '1px solid #eef2f7',
    padding: '12px',
    verticalAlign: 'top',
    color: '#0f172a',
    fontSize: '14px',
  },
  productName: {
    fontWeight: 800,
    lineHeight: 1.2,
  },
  productId: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '6px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  editButton: {
    padding: '8px 10px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 800,
  },
  deleteButton: {
    padding: '8px 10px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 800,
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18px',
    zIndex: 1000,
    overflowY: 'auto',
  },
  modal: {
    width: '100%',
    maxWidth: '780px',
    background: '#fff',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 22px 60px rgba(2, 6, 23, 0.35)',
    overflow: 'hidden',
  },
  confirmModal: {
    width: '100%',
    maxWidth: '520px',
    background: '#fff',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 22px 60px rgba(2, 6, 23, 0.35)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid #eef2f7',
    background: '#f8fafc',
  },
  modalTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
  },
  iconButton: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '20px',
    lineHeight: '20px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '14px 16px',
    borderTop: '1px solid #eef2f7',
    background: '#fafafa',
  },
  confirmBody: {
    padding: '16px',
  },
  confirmText: {
    margin: 0,
    fontSize: '14px',
    color: '#0f172a',
  },
  confirmSubtext: {
    margin: '8px 0 0',
    fontSize: '13px',
    color: '#475569',
  },
  dangerButton: {
    padding: '8px 12px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '8px 12px',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '14px',
  },
  input: {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    outline: 'none',
  },
  textarea: {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    minHeight: '90px',
    resize: 'vertical',
    outline: 'none',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AdminDashboard;