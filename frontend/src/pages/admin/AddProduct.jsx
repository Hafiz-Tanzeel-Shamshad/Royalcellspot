import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    discountPrice: '',
    description: '',
    category: '',
    images: [],
    colors: [],
    storage: [],
    specs: {
      ram: '',
      storage: '',
      battery: '',
      processor: '',
    },
    stock: '',
  });
  const [colorsInput, setColorsInput] = useState('');
  const [storageInput, setStorageInput] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specs.')) {
      const specName = name.split('.')[1];
      setFormData({
        ...formData,
        specs: { ...formData.specs, [specName]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: e.target.value.split(',').map(img => img.trim()) });
  };

  const addChipValue = (field, rawValue) => {
    const value = String(rawValue || '').trim();
    if (!value) return;

    setFormData((prev) => {
      const currentValues = prev[field] || [];
      if (currentValues.includes(value)) return prev;
      return { ...prev, [field]: [...currentValues, value] };
    });
  };

  const removeChipValue = (field, valueToRemove) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((value) => value !== valueToRemove),
    }));
  };

  const handleChipKeyDown = (field, setInputValue) => (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      const value = e.currentTarget.value;
      if (String(value || '').trim()) {
        e.preventDefault();
        addChipValue(field, value);
        setInputValue('');
      }
    }
  };

  const handleChipBlur = (field, setInputValue) => (e) => {
    const value = e.currentTarget.value;
    if (String(value || '').trim()) {
      addChipValue(field, value);
      setInputValue('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Product added successfully!');
      setFormData({
        name: '',
        brand: '',
        price: '',
        discountPrice: '',
        description: '',
        category: '',
        images: [],
        colors: [],
        storage: [],
        specs: {
          ram: '',
          storage: '',
          battery: '',
          processor: '',
        },
        stock: '',
      });
      setColorsInput('');
      setStorageInput('');
    } catch (error) {
      setMessage('Failed to add product. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div>
            <div style={styles.kicker}>Admin</div>
            <h2 style={styles.title}>Add New Product</h2>
            <p style={styles.subtitleText}>Create a product with pricing, inventory, and variant options.</p>
          </div>
          {message && <div style={styles.message}>{message}</div>}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Core Details</div>
            <div style={styles.grid}>
              <input style={styles.input} type="text" name="name" placeholder="Product name" value={formData.name} onChange={handleChange} required />
              <input style={styles.input} type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
              <input style={styles.input} type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
              <input style={styles.input} type="number" name="discountPrice" placeholder="Discount price" value={formData.discountPrice} onChange={handleChange} />
              <input style={styles.input} type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
              <input style={styles.input} type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
              <textarea style={{ ...styles.textarea, gridColumn: '1 / -1' }} name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Images</div>
            <div style={styles.stack}>
              <input style={styles.input} type="text" name="images" placeholder="Image URLs (comma-separated)" value={formData.images.join(', ')} onChange={handleImageChange} />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Colors & Storage</div>
            <div style={styles.grid}>
              <div style={styles.chipField}>
                <div style={styles.chipList}>
                  {formData.colors.map((color) => (
                    <button key={color} type="button" style={styles.chip} onClick={() => removeChipValue('colors', color)}>
                      {color}
                      <span style={styles.chipRemove}>×</span>
                    </button>
                  ))}
                  <input
                    style={styles.chipInput}
                    type="text"
                    name="colors"
                    placeholder="Add colors and press Enter"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    onKeyDown={handleChipKeyDown('colors', setColorsInput)}
                    onBlur={handleChipBlur('colors', setColorsInput)}
                  />
                </div>
              </div>

              <div style={styles.chipField}>
                <div style={styles.chipList}>
                  {formData.storage.map((item) => (
                    <button key={item} type="button" style={styles.chip} onClick={() => removeChipValue('storage', item)}>
                      {item}
                      <span style={styles.chipRemove}>×</span>
                    </button>
                  ))}
                  <input
                    style={styles.chipInput}
                    type="text"
                    name="storage"
                    placeholder="Add storage values and press Enter"
                    value={storageInput}
                    onChange={(e) => setStorageInput(e.target.value)}
                    onKeyDown={handleChipKeyDown('storage', setStorageInput)}
                    onBlur={handleChipBlur('storage', setStorageInput)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button style={styles.button} type="submit">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
    page: {
        minHeight: '100vh',
        padding: '28px 16px 40px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    },
    shell: {
        maxWidth: '980px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '18px',
        flexWrap: 'wrap',
    },
    kicker: {
        fontSize: '11px',
        fontWeight: 800,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#4f46e5',
        marginBottom: '8px',
    },
    title: {
        margin: 0,
        fontSize: '30px',
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        color: '#0f172a',
    },
    subtitleText: {
        margin: '10px 0 0',
        color: '#475569',
        maxWidth: '620px',
    },
    message: {
        minWidth: '220px',
        padding: '12px 14px',
        borderRadius: '14px',
        background: '#ecfdf5',
        color: '#065f46',
        fontWeight: 700,
        border: '1px solid #a7f3d0',
        alignSelf: 'flex-start',
    },
    form: {
        display: 'grid',
        gap: '16px',
    },
    card: {
        background: '#fff',
        border: '1px solid rgba(148, 163, 184, 0.22)',
        borderRadius: '20px',
        padding: '18px',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
    },
    cardTitle: {
        marginBottom: '14px',
        fontSize: '13px',
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#334155',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '12px',
    },
    stack: {
        display: 'grid',
        gap: '12px',
    },
    chipField: {
      minHeight: '58px',
      padding: '8px 10px',
      borderRadius: '14px',
      border: '1px solid #dbe3ee',
      backgroundColor: '#fff',
    },
    chipList: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    chipInput: {
      flex: 1,
      minWidth: '180px',
      padding: '10px 6px',
      fontSize: '15px',
      border: 'none',
      outline: 'none',
      background: 'transparent',
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '9px 12px',
      borderRadius: '999px',
      border: '1px solid #c7d2fe',
      background: '#eef2ff',
      color: '#3730a3',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 700,
    },
    chipRemove: {
      fontSize: '16px',
      lineHeight: 1,
      color: '#4f46e5',
    },
    input: {
        width: '100%',
        padding: '13px 14px',
        fontSize: '15px',
        borderRadius: '14px',
        border: '1px solid #dbe3ee',
        backgroundColor: '#fff',
        outline: 'none',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '13px 14px',
        fontSize: '15px',
        borderRadius: '14px',
        border: '1px solid #dbe3ee',
        backgroundColor: '#fff',
        outline: 'none',
        minHeight: '120px',
        resize: 'vertical',
        boxSizing: 'border-box',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '2px',
    },
    button: {
        padding: '13px 22px',
        fontSize: '15px',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        cursor: 'pointer',
        fontWeight: 800,
        boxShadow: '0 14px 26px rgba(99, 102, 241, 0.22)',
    },
};

export default AddProduct;
