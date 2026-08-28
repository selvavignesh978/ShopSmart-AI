// src/services/api.js
import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/+$/, '')}/api`;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopsmart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('shopsmart_token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: async (userData) => {
    const response = await client.post('/auth/signup', userData);
    return response.data.data;
  },
  login: async (email, password) => {
    const response = await client.post('/auth/login', { email, password });
    return response.data.data;
  },
  me: async () => {
    const response = await client.get('/auth/me');
    return response.data.data;
  },
  addAddress: async (addressData) => {
    const response = await client.post('/auth/address', addressData);
    return response.data.data;
  },
  updateAddress: async (addressId, addressData) => {
    const response = await client.put(`/auth/address/${addressId}`, addressData);
    return response.data.data;
  },
  deleteAddress: async (addressId) => {
    const response = await client.delete(`/auth/address/${addressId}`);
    return response.data.data;
  }
};

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await client.get('/products', { params: { limit: 100, ...params } });
      return response.data.data || [];
    } catch {
      return [];
    }
  },
  getProductById: async (id) => {
    try {
      const response = await client.get(`/products/${id}`);
      return response.data.data || null;
    } catch {
      return null;
    }
  },
  addProduct: async (product) => {
    const formatted = {
      ...product,
      price: Number(product.price || 0),
      rating: product.rating ? Number(product.rating) : 4.0,
      image: product.image ? product.image.replace(/^\./, '') : '/image/placeholder.jpg'
    };
    const response = await client.post('/products', formatted);
    return response.data.data;
  },
  updateProduct: async (id, updatedData) => {
    const payload = { ...updatedData };
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.image) payload.image = payload.image.replace(/^\./, '');
    const response = await client.put(`/products/${id}`, payload);
    return response.data.data;
  },
  deleteProduct: async (id) => {
    await client.delete(`/products/${id}`);
    return id;
  },
  createReview: async (id, reviewData) => {
    const response = await client.post(`/products/${id}/reviews`, reviewData);
    return response.data.data;
  },
  parseAISearch: async (query, context = {}) => {
    try {
      const response = await client.post('/ai-search', { query, context });
      return response.data.data || [];
    } catch {
      return [];
    }
  },
  searchProducts: async (q) => {
    try {
      const response = await client.get('/products/search', { params: { q } });
      return response.data.data || [];
    } catch {
      return [];
    }
  },
  getCategories: async () => {
    try {
      const response = await client.get('/products/categories');
      return response.data.data || [];
    } catch {
      return [];
    }
  }
};

export const cartService = {
  getCart: async () => (await client.get('/cart')).data.data,
  addToCart: async (productId, quantity = 1) =>
    (await client.post('/cart', { productId, quantity: Number(quantity) })).data.data,
  updateQuantity: async (productId, quantity) =>
    (await client.put(`/cart/${productId}`, { quantity: Number(quantity) })).data.data,
  removeFromCart: async (productId) =>
    (await client.delete(`/cart/${productId}`)).data.data
};

export const wishlistService = {
  getWishlist: async () => (await client.get('/wishlist')).data.data,
  addToWishlist: async (productId) => (await client.post('/wishlist', { productId })).data.data,
  removeFromWishlist: async (productId) => (await client.delete(`/wishlist/${productId}`)).data.data
};

export const recommendationService = {
  logView: async (productId) => client.post('/history/view', { productId }),
  getRecommendations: async () => {
    try {
      const response = await client.get('/recommendations');
      return response.data.data || [];
    } catch {
      return [];
    }
  }
};

export const contactService = {
  submitContact: async (contactData) => {
    const response = await client.post('/contact', contactData);
    return response.data;
  }
};

export const paymentService = {
  createOrder: async (items = [], totalAmount = 0, shippingAddress = {}) => {
    const response = await client.post('/payment/create-order', {
      items,
      totalAmount: Number(totalAmount),
      shippingAddress
    });
    return response.data;
  },
  verifyPayment: async (paymentData) => {
    const response = await client.post('/payment/verify', paymentData);
    return response.data;
  },
  payWithCustomCard: async (paymentPayload) => {
    const response = await client.post('/payment/custom-card-pay', paymentPayload);
    return response.data;
  },
  getMyOrders: async () => (await client.get('/payment/my-orders')).data.data,
  cancelOrder: async (orderId) => (await client.put(`/payment/orders/${orderId}/cancel`)).data.data,
  updateOrderAddress: async (orderId, addressData) =>
    (await client.put(`/payment/orders/${orderId}/address`, addressData)).data.data
};

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await client.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.url;
  }
};

export default client;