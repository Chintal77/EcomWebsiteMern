import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../index.css';
import { useEffect, useReducer, useState } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const getLogger = () => {
  if (process.env.NODE_ENV === 'development') {
    return require('use-reducer-logger').default;
  }
  return (r) => r;
};

function ProductScreen({ cartItems, setCartItems }) {
  const { slug } = useParams();
  const logger = getLogger();

  const [{ product, loading, error }, dispatch] = useReducer(logger(reducer), {
    product: {},
    loading: true,
    error: '',
  });

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product && product.name) {
      document.title = `ShopFusion | ${product.name}`;
    }
  }, [product]);

  const handleAddToCart = () => {
    const existingQty = cartItems[product.slug] || 0;
    const updatedCart = {
      ...cartItems,
      [product.slug]: existingQty + quantity,
    };
    setCartItems(updatedCart);
  };

  if (loading) return <div className="message">Loading product details...</div>;
  if (error)
    return (
      <div className="not-found">
        <h2>Oops! Product Not Found</h2>
        <p>
          The product you are looking for doesn’t exist or has been removed.
        </p>
        <a href="/" className="back-home-btn">
          🔙 Go Back Home
        </a>
      </div>
    );

  const discountMatch = product.badge?.match(/(\d+)%/);
  const discountPercentage = discountMatch ? parseInt(discountMatch[1]) : 0;
  const discountAmount = Math.round((product.price * discountPercentage) / 100);
  const finalPrice = product.price - discountAmount;

  return (
    <section className="product-detail-section">
      <div className="product-card-glass">
        <div className="product-left">
          <img
            src={product.image}
            alt={product.name}
            className="product-img-glass"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/broken.png';
            }}
          />
        </div>

        <div className="product-right">
          {product.badge && <span className="badge">{product.badge}</span>}
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            ⭐ {product.rating} <span>({product.numReviews} reviews)</span>
          </div>

          <div className="price-block">
            <p className="price-original">
              MRP: <del>₹{product.price.toLocaleString()}</del>
            </p>
            <p className="price-discount">
              You Save: ₹{discountAmount.toLocaleString()} ({discountPercentage}
              %)
            </p>
            <p className="price-final">
              Deal Price: <strong>₹{finalPrice.toLocaleString()}</strong>
            </p>
          </div>

          <p className="description">{product.description}</p>

          <div className="extra-info">
            <p
              className={`stock ${
                product.countInStock > 0 ? 'in-stock' : 'out-of-stock'
              }`}
            >
              {product.countInStock > 0 ? '✅ In Stock' : '❌ Out of Stock'}
            </p>
            <p>
              Sold by <strong>ShopFusion Retail</strong>
            </p>
            <p>
              Delivery by <strong>Monday, July 29</strong>
            </p>
            <p>🔁 7-Day Return Policy</p>
            <p>🔒 Secure Transaction</p>
          </div>

          <div className="quantity-select">
            <label htmlFor="quantity">Qty:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[...Array(10).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button
              className="btn-cart"
              disabled={product.countInStock === 0}
              onClick={handleAddToCart}
              style={{
                backgroundColor: product.countInStock === 0 ? '#ccc' : '',
                cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              🛒 Add to Cart
            </button>

            <button
              className="btn-buy"
              disabled={product.countInStock === 0}
              style={{
                backgroundColor: product.countInStock === 0 ? '#ccc' : '',
                cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ⚡ Buy Now
            </button>
          </div>

          <div className="payment-methods">
            <p>💳 Pay via: UPI | Cards | EMI | NetBanking</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductScreen;
