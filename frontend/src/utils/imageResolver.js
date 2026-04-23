/**
 * Image Resolver Utility
 * Handles both URL-based images and local asset imports
 */

// Import all local assets
import iphone12 from '../assets/iphone12.png';
import iPhone12Pro from '../assets/iPhone12Pro.png';
import appleWatchUltra2 from '../assets/appleWatchUltra2.png';
import samsungS24Ultra from '../assets/samsungS24Ultra.png';
import samsungS25Ultra from '../assets/samsungS25Ultra.png';

// Map of asset filenames to imported modules
const assetMap = {
  'iphone12.png': iphone12,
  'iPhone12Pro.png': iPhone12Pro,
  'appleWatchUltra2.png': appleWatchUltra2,
  'samsungS24Ultra.png': samsungS24Ultra,
  'samsungS25Ultra.png': samsungS25Ultra,
};

/**
 * Resolves image path - returns URL if it's a valid URL, otherwise looks up in assets
 * @param {string} imagePath - Either a URL or asset filename
 * @returns {string} - Resolved image path/URL
 */
export const resolveImagePath = (imagePath) => {
  if (!imagePath) return null;
  
  // Check if it's a URL (starts with http/https or /)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Check if it's in the asset map
  if (assetMap[imagePath]) {
    return assetMap[imagePath];
  }
  
  // Check if it's a filename and try to find it in assets
  const filename = imagePath.split('/').pop();
  if (assetMap[filename]) {
    return assetMap[filename];
  }
  
  return imagePath;
};

/**
 * Gets the first valid image from an array of images or single image
 * @param {string|string[]} image - Single image or array of images
 * @returns {string} - First valid resolved image
 */
export const getFirstImage = (image) => {
  if (!image) return null;
  
  if (Array.isArray(image)) {
    // Get first image from array
    if (image.length > 0) {
      return resolveImagePath(image[0]);
    }
    return null;
  }
  
  // Handle single image
  return resolveImagePath(image);
};
