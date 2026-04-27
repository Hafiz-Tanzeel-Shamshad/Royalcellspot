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

/**
 * Normalizes backend product data to include image field for ProductCard
 */
const normalizeBackendProduct = (product) => {
  return normalizeProductShape(product);
};

const fetchBackendProducts = async () => {
  const response = await axios.get(`${API_URL}/products?limit=1000`);

  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data.map(normalizeBackendProduct);
  }

  return [];
};

/**
 * Fetches products from backend API (primary source)
 * Uses local products only if the API is unavailable
 */
export const getProducts = async () => {
  try {
    const backendProducts = await fetchBackendProducts();
    if (backendProducts.length > 0) {
      return backendProducts;
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

  try {
    // Numeric legacy URLs (for example /product/9) do not map to MongoDB ids.
    // Resolve them against the full DB-backed list so old links keep working.
    if (!isMongoObjectId(normalizedId)) {
      const legacyIndex = Number(normalizedId);
      if (Number.isInteger(legacyIndex) && legacyIndex > 0) {
        const backendProducts = await fetchBackendProducts();
        const legacyProduct = backendProducts[legacyIndex - 1];
        if (legacyProduct) {
          return legacyProduct;
        }
      }

      const localProduct = localProducts.find(p =>
        String(p._id) === normalizedId || String(p.id) === normalizedId
      );
      return localProduct || null;
    }

    // Try to fetch from backend using the MongoDB id
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
