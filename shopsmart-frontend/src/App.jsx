import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import { cartService } from './services/api';

function App() {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem('shopsmart_token');

  const loadCart = useCallback(async () => {
    if (token) {
      try {
        const remoteCart = await cartService.getCart();
        const items = (remoteCart.items || []).map((item) => ({
          ...(item.product || {}),
          quantity: item.quantity,
          cartItemId: item._id
        }));
        setCart(items);
        return;
      } catch (err) {
        console.error('Cart sync failed:', err);
      }
    }
    const local = localStorage.getItem('shopsmart_cart');
    if (local) {
      try {
        setCart(JSON.parse(local));
      } catch {
        setCart([]);
      }
    }
  }, [token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product) => {
    if (token) {
      try {
        await cartService.addToCart(product._id, 1);
        await loadCart();
        return;
      } catch (err) {
        console.error('Failed to add to database cart:', err);
      }
    }
    const existingIndex = cart.findIndex((item) => item._id === product._id);
    let updated;
    if (existingIndex > -1) {
      updated = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updated);
    localStorage.setItem('shopsmart_cart', JSON.stringify(updated));
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    if (token) {
      try {
        await cartService.updateQuantity(productId, newQuantity);
        await loadCart();
        return;
      } catch (err) {
        console.error('Failed to update cart quantity on database:', err);
      }
    }
    const updated = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updated);
    localStorage.setItem('shopsmart_cart', JSON.stringify(updated));
  };

  const removeFromCart = async (productId) => {
    if (token) {
      try {
        await cartService.removeFromCart(productId);
        await loadCart();
        return;
      } catch (err) {
        console.error('Failed to remove from database cart:', err);
      }
    }
    const updated = cart.filter((item) => item._id !== productId);
    setCart(updated);
    localStorage.setItem('shopsmart_cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('shopsmart_cart');
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col w-full">
        <Navbar cartCount={cart.reduce((total, item) => total + (item.quantity || 1), 0)} />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  updateQuantity={updateQuantity}
                />
              }
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;