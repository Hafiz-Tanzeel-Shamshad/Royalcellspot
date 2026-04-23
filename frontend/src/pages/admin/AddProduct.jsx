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
    specs: {
      ram: '',
      storage: '',
      battery: '',
      processor: '',
    },
    stock: '',
  });
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
        specs: {
          ram: '',
          storage: '',
          battery: '',
          processor: '',
        },
        stock: '',
      });
    } catch (error) {
      setMessage('Failed to add product. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Product</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input style={styles.input} type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
        <input style={styles.input} type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input style={styles.input} type="number" name="discountPrice" placeholder="Discount Price" value={formData.discountPrice} onChange={handleChange} />
        <textarea style={styles.textarea} name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
        <input style={styles.input} type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <input style={styles.input} type="text" name="images" placeholder="Image URLs (comma-separated)" value={formData.images.join(', ')} onChange={handleImageChange} />
        <h3 style={styles.subtitle}>Specifications</h3>
        <input style={styles.input} type="text" name="specs.ram" placeholder="RAM" value={formData.specs.ram} onChange={handleChange} />
        <input style={styles.input} type="text" name="specs.storage" placeholder="Storage" value={formData.specs.storage} onChange={handleChange} />
        <input style={styles.input} type="text" name="specs.battery" placeholder="Battery" value={formData.specs.battery} onChange={handleChange} />
        <input style={styles.input} type="text" name="specs.processor" placeholder="Processor" value={formData.specs.processor} onChange={handleChange} />
        <input style={styles.input} type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
        <button style={styles.button} type="submit">Add Product</button>
      </form>
    </div>
  );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    subtitle: {
        marginTop: '20px',
        marginBottom: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginBottom: '10px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    textarea: {
        marginBottom: '10px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        minHeight: '100px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    message: {
        textAlign: 'center',
        marginBottom: '20px',
        color: 'green',
        fontWeight: 'bold',
    }
};

export default AddProduct;