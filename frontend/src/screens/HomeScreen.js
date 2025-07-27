import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useReducer, useState, useCallback } from 'react';
import logger from 'use-reducer-logger';
import '../HomeScreen.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen({ cartItems, setCartItems }) {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  const [showCart, setShowCart] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  const fetchData = useCallback(async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const result = await axios.get('/api/products');
      dispatch({ type: 'FETCH_SUCCESS', payload: result.data });

      if (error) {
        setShowRecovery(true);
        setTimeout(() => setShowRecovery(false), 3000);
      }
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: err.message });
    }
  }, [error]); // 👈 Add dependencies here

  useEffect(() => {
    document.title = 'ShopFusion';
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (error) {
      const retryInterval = setInterval(() => {
        fetchData();
      }, 5000);

      return () => clearInterval(retryInterval);
    }
  }, [error, fetchData]);

  const handleAddToCart = (product) => {
    setShowCart(true);
    setCartItems((prevCart) => {
      const existingQty = prevCart[product.slug] || 0;
      return {
        ...prevCart,
        [product.slug]: existingQty + 1,
      };
    });
  };

  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="container">
      {(showCart || cartCount > 0) && (
        <Link to="/cart" className="cart-indicator">
          🛒 <span className="cart-count">{cartCount}</span>
        </Link>
      )}

      <main>
        <h1 className="heading">Featured Products</h1>

        {/* ✅ We are back message */}
        {showRecovery && (
          <div className="recovery-message">
            ✅ We're back online! Products loaded successfully.
          </div>
        )}

        <div className="products">
          {loading ? (
            <p className="message">
              Products are loading from backend, please wait...
            </p>
          ) : error ? (
            <div className="error-box">
              <h2>😓 Oops! Something went wrong</h2>
              <p>
                Our servers are currently unreachable or experiencing issues.
              </p>
              <p>Please hang tight while we retry...</p>
            </div>
          ) : (
            products.map((product) => {
              const discountMatch = product.badge?.match(/(\d+)%/);
              const discountPercentage = discountMatch
                ? parseInt(discountMatch[1])
                : 0;
              const discountAmount = Math.round(
                (product.price * discountPercentage) / 100
              );
              const finalPrice = product.price - discountAmount;

              return (
                <div className="product-card" key={product.slug}>
                  {product.badge && (
                    <span className="badge">{product.badge}</span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3 className="product-name">
                      <Link to={`/product/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="product-price">
                      <span className="original-price">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>{' '}
                      <span className="final-price">
                        ₹{finalPrice.toLocaleString('en-IN')}
                      </span>
                    </p>
                    <p className="product-discount">
                      You save ₹{discountAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="product-rating">
                      ⭐ {product.rating}{' '}
                      <span>({product.numReviews} reviews)</span>
                    </p>
                    <button
                      className="btn-cart"
                      disabled={product.countInStock === 0}
                      onClick={() => handleAddToCart(product)}
                      style={{
                        backgroundColor:
                          product.countInStock === 0 ? '#ccc' : '',
                        cursor:
                          product.countInStock === 0
                            ? 'not-allowed'
                            : 'pointer',
                      }}
                    >
                      {product.countInStock === 0
                        ? 'Out of Stock'
                        : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default HomeScreen;
