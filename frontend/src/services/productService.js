import axios from 'axios';
import { getFirstImage } from '../utils/imageResolver';
import localProducts from '../data/products';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Normalizes backend product data to include image field for ProductCard
 */
const normalizeBackendProduct = (product) => {
  return {
    ...product,
    image: product.images && product.images.length > 0 ? product.images[0] : '',
    colors: product.colors || [],
    storage: product.storage ? (Array.isArray(product.storage) ? product.storage : [product.storage]) : [],
  };
};

/**
 * Fetches products from backend API (primary source)
 * Uses local products as fallback only if API is unavailable
 */
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data.map(normalizeBackendProduct);
    }
    
    return [];
  } catch (apiError) {
    console.warn('Backend API unavailable, using local products as fallback:', apiError.message);
    // Fallback to local products
    return localProducts;
  }
};

/**
 * Fetches products from both sources by brand
 */
export const getProductsByBrand = async (brand) => {
  const allProducts = await getProducts();
  return allProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
};

/**
 * Fetches products from both sources by category
 */
export const getProductsByCategory = async (category) => {
  const allProducts = await getProducts();
  return allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

/**
 * Fetches a single product by ID from backend
 */
export const getProductById = async (id) => {
  try {
    // Try to fetch from backend using the ID
    const response = await axios.get(`${API_URL}/products/${id}`);
    
    if (response.data.data) {
      return normalizeBackendProduct(response.data.data);
    }
    
    return null;
  } catch (apiError) {
    console.error(`Error fetching product with id ${id}:`, apiError.message);
    
    // Fallback to local products - check both _id and id fields
    const localProduct = localProducts.find(p => 
      String(p._id) === String(id) || String(p.id) === String(id)
    );
    
    return localProduct || null;
  }
};
