import './App.css';
import data from './data';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header className="header">
          <Link to="/" className="logo">
            ShopFusion
          </Link>
          <div className="auth-buttons">
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/signup" className="btn">
              Sign Up
            </Link>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/products/:slug" element={<ProductScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
