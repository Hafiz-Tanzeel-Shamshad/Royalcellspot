import axios from 'axios';
import { getFirstImage } from '../utils/imageResolver';
import localProducts from '../data/products';

const API_URL = import.meta.env.VITE_API_URL;

const isMongoObjectId = (value) => /^[a-f\d]{24}$/i.test(String(value || '').trim());

const normalizeProductShape = (product) => ({
  ...product,
  _id: product._id || product.id,
  id: product.id || product._id,
  image: product.image || getFirstImage(product.images) || '',
  colors: Array.isArray(product.colors) ? product.colors : (product.colors ? [product.colors] : []),
  storage: Array.isArray(product.storage) ? product.storage : (product.storage ? [product.storage] : []),
});

const getProductKey = (product) => {
  const name = String(product?.name || '').trim().toLowerCase();
  const brand = String(product?.brand || '').trim().toLowerCase();
  const category = String(product?.category || '').trim().toLowerCase();

  return `${brand}::${name}::${category}`;
};

const mergeProducts = (primaryProducts, fallbackProducts) => {
  const merged = new Map();

  [...fallbackProducts, ...primaryProducts].forEach((product) => {
    const normalizedProduct = normalizeProductShape(product);
    merged.set(getProductKey(normalizedProduct), normalizedProduct);
  });

  return Array.from(merged.values());
};

/**
 * Normalizes backend product data to include image field for ProductCard
 */
const normalizeBackendProduct = (product) => {
  return normalizeProductShape(product);
};

/**
 * Fetches products from backend API (primary source)
 * Uses local products as fallback only if API is unavailable
 */
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    
    if (response.data.data && Array.isArray(response.data.data)) {
      return mergeProducts(
        response.data.data.map(normalizeBackendProduct),
        localProducts
      );
    }
    
    return localProducts.map(normalizeProductShape);
  } catch (apiError) {
    console.warn('Backend API unavailable, using local products as fallback:', apiError.message);
    // Fallback to local products
    return localProducts.map(normalizeProductShape);
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
  const normalizedId = String(id || '').trim();

  // Legacy local products use numeric ids; avoid calling the MongoDB endpoint
  // for those values because Product.findById() will throw a CastError.
  if (!isMongoObjectId(normalizedId)) {
    const localProduct = localProducts.find(p =>
      String(p._id) === normalizedId || String(p.id) === normalizedId
    );
    return localProduct || null;
  }

  try {
    // Try to fetch from backend using the ID
    const response = await axios.get(`${API_URL}/products/${normalizedId}`);
    
    if (response.data.data) {
      return normalizeBackendProduct(response.data.data);
    }
    
    return null;
  } catch (apiError) {
    console.error(`Error fetching product with id ${normalizedId}:`, apiError.message);
    
    // Fallback to local products - check both _id and id fields
    const localProduct = localProducts.find(p => 
      String(p._id) === normalizedId || String(p.id) === normalizedId
    );
    
    return localProduct || null;
  }
};
