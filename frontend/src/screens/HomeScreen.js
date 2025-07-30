import { Link, useNavigate } from 'react-router-dom';
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

  const [, setShowCart] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

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
  }, [error]);

  useEffect(() => {
    document.title = 'ShopFusion';
    fetchData();
    const storedUser = localStorage.getItem('userInfo');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUserInfo(parsedUser);

    // Load user-specific cart items
    if (parsedUser?.email) {
      const storedCart = localStorage.getItem(`cartItems_${parsedUser.email}`);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, [fetchData, setCartItems]);

  useEffect(() => {
    if (error) {
      const retryInterval = setInterval(() => {
        fetchData();
      }, 5000);
      return () => clearInterval(retryInterval);
    }
  }, [error, fetchData]);

  const handleAddToCart = async (product) => {
    if (!userInfo) {
      alert('⚠️ Please login to add items to your cart.');
      navigate('/login?redirect=/');
      return;
    }

    const existingQty = cartItems[product.slug] || 0;

    try {
      const { data } = await axios.get(`/api/products/${product._id}`);
      if (existingQty >= data.countInStock) {
        alert('❌ Cannot add more. Stock limit reached!');
        return;
      }

      setShowCart(true);

      const updatedCart = {
        ...cartItems,
        [product.slug]: existingQty + 1,
      };

      setCartItems(updatedCart);
      localStorage.setItem(
        `cartItems_${userInfo.email}`,
        JSON.stringify(updatedCart)
      ); // 💾 persist

      // 🔔 Manual trigger to simulate cross-tab event
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      alert('⚠️ Error checking stock. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <main>
        <h1 className="heading">Featured Products</h1>

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
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
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
                      className={`btn-cart ${
                        product.countInStock === 0
                          ? 'btn-out'
                          : (cartItems[product.slug] || 0) >=
                            product.countInStock
                          ? 'btn-limit'
                          : 'btn-add'
                      }`}
                      disabled={
                        product.countInStock === 0 ||
                        (cartItems[product.slug] || 0) >= product.countInStock
                      }
                      onClick={() => handleAddToCart(product)}
                      title={
                        product.countInStock === 0
                          ? 'Out of stock'
                          : (cartItems[product.slug] || 0) >=
                            product.countInStock
                          ? 'You have reached the max quantity available.'
                          : ''
                      }
                    >
                      {product.countInStock === 0
                        ? 'Out of Stock'
                        : (cartItems[product.slug] || 0) >= product.countInStock
                        ? 'Limit Reached'
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
