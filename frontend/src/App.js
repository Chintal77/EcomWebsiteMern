import './App.css';
import data from './data';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import CartScreen from './screens/CartScreen';

function App() {
  const [cartItems, setCartItems] = useState({}); // 🔁 shared cart state

  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="header">
          <Link to="/" className="logo">
            ShopFusion
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
            <Route path="/products/:slug" element={<ProductScreen />} />
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
