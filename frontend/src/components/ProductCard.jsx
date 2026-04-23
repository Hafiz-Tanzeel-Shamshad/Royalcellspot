import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "../store/cartStore";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    
    addItem(
      product, 
      1, 
      product.colors?.[0] || null, 
      product.storage?.[0] || null
    );
    
    setAddedToCart(true);
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setAddedToCart(false), 2000);
    }, 600);
  };

  const handleViewDetails = () => {
    const id = product._id || product.id;
    navigate(`/product/${id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      style={styles.card}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={handleViewDetails}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <motion.div 
          style={styles.discountBadge}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          -{discount}%
        </motion.div>
      )}

      {/* Product Image */}
      <motion.div 
        style={styles.imageWrapper}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {imageError ? (
          <div style={styles.imagePlaceholder}>
            <span style={styles.placeholderIcon}>📱</span>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            style={styles.img} 
            loading="lazy"
            onError={handleImageError}
          />
        )}
      </motion.div>

      {/* Product Details */}
      <div style={styles.details}>
        <div style={styles.brandRow}>
          <p style={styles.brand}>{product.brand}</p>
          {product.category === 'smartphones' && (
            <span style={styles.categoryBadge}>📱</span>
          )}
        </div>
        
        <h3 style={styles.name}>{product.name}</h3>
        
        {product.storage && product.storage.length > 0 && (
          <p style={styles.storage}>From: {product.storage[0]}</p>
        )}

        {/* Price */}
        <div style={styles.priceContainer}>
          <span style={styles.newPrice}>${product.discountPrice.toLocaleString()}</span>
          {product.price !== product.discountPrice && (
            <span style={styles.oldPrice}>${product.price.toLocaleString()}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <AnimatePresence mode="wait">
          {addedToCart ? (
            <motion.button
              key="added"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={styles.addedBtn}
            >
              ✓ Added
            </motion.button>
          ) : (
            <motion.button
              key="add"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                ...styles.addBtn,
                ...(isAdding ? styles.addBtnAdding : {})
              }}
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Add to Cart
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "20px",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.3s ease",
    border: "1px solid #f0f0f0",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
  },
  discountBadge: {
    position: "absolute",
    top: "14px",
    left: "14px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "100px",
    fontSize: "12px",
    fontWeight: "700",
    zIndex: 2,
  },
  imageWrapper: {
    backgroundColor: "#f8f9ff",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "220px",
    borderBottom: "1px solid #f0f0f0",
  },
  img: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "contain",
    transition: "transform 0.3s ease",
  },
  imagePlaceholder: {
    width: "100%",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
  },
  placeholderIcon: {
    fontSize: "48px",
    opacity: 0.5,
  },
  details: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  brandRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0,
  },
  categoryBadge: {
    fontSize: "14px",
  },
  name: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0a0a0a",
    marginBottom: "6px",
    lineHeight: "1.3",
  },
  storage: {
    fontSize: "13px",
    color: "#666",
    margin: 0,
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    marginTop: "auto",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#bfbfbf",
    fontSize: "14px",
  },
  newPrice: {
    color: "#0a0a0a",
    fontWeight: "700",
    fontSize: "22px",
  },
  addBtn: {
    width: "100%",
    padding: "14px 16px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s",
  },
  addBtnAdding: {
    opacity: 0.8,
  },
  addedBtn: {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};

export default ProductCard;
