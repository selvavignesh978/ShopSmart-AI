// src/utils/imageResolver.js
const BACKEND_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';

export const resolveImageUrl = (img) => {
  if (!img || typeof img !== 'string') {
    return FALLBACK_IMAGE;
  }
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return encodeURI(img);
  }
  let formattedPath = img.replace(/^\.?\//, '/');
  if (!formattedPath.startsWith('/')) {
    formattedPath = `/${formattedPath}`;
  }
  return encodeURI(`${BACKEND_BASE_URL}${formattedPath}`);
};