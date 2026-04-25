import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard.jsx";

function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const queryBrand = new URLSearchParams(location.search).get('brand');
    const normalizedBrand = queryBrand
      ? queryBrand.charAt(0).toUpperCase() + queryBrand.slice(1).toLowerCase()
      : 'all';

    setSelectedBrand(['Apple', 'Samsung', 'Google'].includes(normalizedBrand) ? normalizedBrand : 'all');
  }, [location.search]);

  const brands = [
    { id: 'all', label: 'All', icon: '🌍' },
    { id: 'Apple', label: 'Apple', icon: '🍎' },
    { id: 'Samsung', label: 'Samsung', icon: '📱' },
    { id: 'Google', label: 'Google', icon: '🔍' },
  ];

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'name', label: 'Name: A-Z' },
  ];

  // Filter products
  let filteredProducts = products;

  if (selectedBrand !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(query) || 
           p.brand.toLowerCase().includes(query)
    );
  }

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case 'price-high':
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={styles.loadingSpinner}
          />
          <p style={styles.loadingText}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={styles.title}>All Products</h1>
        <p style={styles.subtitle}>{filteredProducts.length} products found</p>
      </motion.div>

      {/* Filters */}
      <div style={styles.filters}>
        {/* Search */}
        <div style={styles.searchWrapper}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search phones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Brand Filters */}
        <div style={styles.brandFilters}>
          {brands.map(brand => (
            <motion.button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.id)}
              style={{
                ...styles.brandBtn,
                ...(selectedBrand === brand.id ? styles.brandBtnActive : {})
              }}
            >
              {brand.icon} {brand.label}
            </motion.button>
          ))}
        </div>

        {/* Sort Options */}
        <div style={styles.sortOptions}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
      {filteredProducts.length > 0 ? (
        <div style={styles.productList}>
          {filteredProducts.map((product, index) => (
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
      ) : (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No products found</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { 
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '16px',
    color: '#666',
  },
  header: { 
    textAlign: 'center', 
    marginBottom: '40px',
    paddingTop: '20px',
  },
  title: { 
    fontSize: '32px', 
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '10px',
  },
  subtitle: { 
    fontSize: '16px', 
    color: '#666',
  },
  filters: { 
    display: 'flex', 
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    marginBottom: '30px',
    gap: '15px',
    alignItems: 'center',
  },
  searchWrapper: { 
    display: 'flex', 
    alignItems: 'center',
    flex: '1',
    minWidth: '200px',
    backgroundColor: '#fff',
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  searchIcon: { 
    marginRight: '10px',
    color: '#666',
  },
  searchInput: { 
    flex: 1,
    padding: '0',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
  },
  brandFilters: { 
    display: 'flex', 
    gap: '10px',
    flexWrap: 'wrap',
  },
  brandBtn: { 
    padding: '8px 15px', 
    border: '1px solid #ddd', 
    borderRadius: '20px', 
    cursor: 'pointer',
    backgroundColor: '#fff',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500',
  },
  brandBtnActive: { 
    backgroundColor: '#6366f1', 
    color: '#fff',
    borderColor: '#6366f1',
  },
  sortOptions: {},
  sortSelect: { 
    padding: '8px 12px', 
    border: '1px solid #ddd', 
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  productList: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
    gap: '20px',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#666',
  },
};

export default Products;
