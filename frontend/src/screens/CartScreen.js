import { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CartScreen.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function CartScreen({ cartItems, setCartItems }) {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });

  const [productsInCart, setProductsInCart] = useState([]);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    document.title = 'ShopFusion | Cart';
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const cartProductSlugs = Object.keys(cartItems);
    const filteredProducts = products.filter((product) =>
      cartProductSlugs.includes(product.slug)
    );
    setProductsInCart(filteredProducts);
  }, [products, cartItems]);

  const updateLocalStorage = (updatedCart) => {
    if (userInfo?.email) {
      localStorage.setItem(
        `cartItems_${userInfo.email}`,
        JSON.stringify(updatedCart)
      );
      window.dispatchEvent(new Event('storage'));
    }
  };

  const updateQuantity = (slug, type) => {
    setCartItems((prev) => {
      const currentQty = prev[slug];
      const product = products.find((p) => p.slug === slug);
      const maxQty = product?.countInStock || 1;

      const newQty =
        type === 'inc'
          ? Math.min(currentQty + 1, maxQty)
          : Math.max(currentQty - 1, 1);

      const updatedCart = { ...prev, [slug]: newQty };
      updateLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const removeItem = (slug) => {
    if (window.confirm('Remove this item?')) {
      const updated = { ...cartItems };
      delete updated[slug];
      setCartItems(updated);
      updateLocalStorage(updated);
    }
  };

  const emptyCart = () => {
    if (window.confirm('Clear entire cart?')) {
      setCartItems({});
      updateLocalStorage({});
    }
  };

  const handleCheckout = () => {
    userInfo ? navigate('/checkout') : navigate('/login?redirect=/checkout');
  };

  const totalAmount = productsInCart.reduce((acc, product) => {
    const quantity = cartItems[product.slug];
    const discount = parseInt(product.badge?.match(/(\d+)%/)?.[1]) || 0;
    const discountedPrice =
      product.price - Math.round((product.price * discount) / 100);
    return acc + discountedPrice * quantity;
  }, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-heading">🛒 Your Cart</h1>

      {loading ? (
        <p className="cart-loading">Loading...</p>
      ) : error ? (
        <p className="cart-error">❌ {error}</p>
      ) : productsInCart.length === 0 ? (
        <div className="cart-empty">
          <h2>Your cart is empty 😢</h2>
          <Link to="/" className="btn-shop">
            🛍️ Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {productsInCart.map((product) => {
              const qty = cartItems[product.slug];
              const discount =
                parseInt(product.badge?.match(/(\d+)%/)?.[1]) || 0;
              const discountedPrice =
                product.price - Math.round((product.price * discount) / 100);
              const subtotal = discountedPrice * qty;

              return (
                <div key={product.slug} className="cart-item-card">
                  <img src={product.image} alt={product.name} />
                  <div className="item-info">
                    <Link
                      to={`/product/${product._id}`}
                      className="product-link"
                    >
                      <h4>{product.name}</h4>
                    </Link>
                    <p>
                      <span className="label">Price:</span>
                      <s>₹{product.price.toLocaleString('en-IN')}</s>{' '}
                      <strong className="text-green-600">
                        ₹{discountedPrice.toLocaleString('en-IN')}
                      </strong>
                    </p>

                    <div className="quantity-controls">
                      <div className="qty-group">
                        <button
                          onClick={() => updateQuantity(product.slug, 'dec')}
                          className="qty-btn"
                        >
                          ➖
                        </button>
                        <span className="qty-value">{qty}</span>
                        <button
                          onClick={() => updateQuantity(product.slug, 'inc')}
                          className="qty-btn"
                          disabled={qty >= product.countInStock}
                          title={`Max: ${product.countInStock}`}
                        >
                          ➕
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(product.slug)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>

                    <p>
                      <span className="label">Subtotal:</span> ₹
                      {subtotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <h2>₹{totalAmount.toLocaleString('en-IN')}</h2>
            <button onClick={handleCheckout} className="checkout-btn">
              ✅ Checkout
            </button>
            <button onClick={emptyCart} className="empty-btn">
              🗑️ Empty Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen;
