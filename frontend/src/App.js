import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import Header from './components/Header'; // ✅ import Header
import MyOrdersScreen from './screens/MyOrdersScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <ToastContainer position="bottom-center" limit={1} />
        <Header cartItems={cartItems} /> {/* ✅ Use Header */}
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
            <Route
              path="/checkout"
              element={
                <CheckoutScreen
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              }
            />

            <Route path="/orders" element={<MyOrdersScreen />} />

            <Route path="/order-success" element={<OrderSuccessScreen />} />
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
