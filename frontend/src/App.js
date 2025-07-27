import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import CartScreen from './screens/CartScreen';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = Object.values(cartItems).reduce((sum, item) => {
    if (typeof item === 'number') return sum + item;
    if (typeof item === 'object' && item.quantity) return sum + item.quantity;
    return sum;
  }, 0);

  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="header">
          <Link to="/" className="logo">
            ShopFusion
          </Link>
          <Link to="/cart" className="cart-icon-link">
            🛒
            <span className="cart-count">
              <span className="cart-count">{cartCount}</span>
            </span>
          </Link>
        </header>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <HomeScreen cartItems={cartItems} setCartItems={setCartItems} />
              }
            />
            <Route
              path="/product/:slug"
              element={
                <ProductScreen
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              }
            />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route
              path="/cart"
              element={
                <CartScreen cartItems={cartItems} setCartItems={setCartItems} />
              }
            />
          </Routes>
        </main>

        <footer className="footer">
          &copy; {new Date().getFullYear()} ShopFusion. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
