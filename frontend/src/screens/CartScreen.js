import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    document.title = 'Shopfusion | Cart';
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchProducts();
  }, []);

  const cartProductSlugs = Object.keys(cartItems);
  const productsInCart = products.filter((product) =>
    cartProductSlugs.includes(product.slug)
  );

  const cartIsEmpty = productsInCart.length === 0;

  const totalAmount = productsInCart.reduce((acc, product) => {
    const quantity = cartItems[product.slug];
    const discountMatch = product.badge?.match(/(\d+)%/);
    const discountPercentage = discountMatch ? parseInt(discountMatch[1]) : 0;
    const finalPrice =
      product.price - Math.round((product.price * discountPercentage) / 100);
    return acc + finalPrice * quantity;
  }, 0);

  const handleEmptyCart = () => {
    if (window.confirm('Are you sure you want to empty the cart?')) {
      setCartItems({});
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-heading">🛒 Your Shopping Cart</h2>

      {loading ? (
        <p className="cart-loading">Loading cart items...</p>
      ) : error ? (
        <p className="cart-error">❌ Error: {error}</p>
      ) : cartIsEmpty ? (
        <div className="cart-empty">
          <h3>🛍️ Oops! Your cart is empty</h3>
          <Link to="/" className="btn-shop">
            Go Back to Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {productsInCart.map((product) => {
              const quantity = cartItems[product.slug];
              const discountMatch = product.badge?.match(/(\d+)%/);
              const discountPercentage = discountMatch
                ? parseInt(discountMatch[1])
                : 0;
              const finalPrice =
                product.price -
                Math.round((product.price * discountPercentage) / 100);
              const subtotal = finalPrice * quantity;

              return (
                <div className="cart-item-card" key={product.slug}>
                  <img src={product.image} alt={product.name} />
                  <div className="item-info">
                    <h4>{product.name}</h4>
                    <p>
                      <span className="label">Original:</span>{' '}
                      <s>₹{product.price.toLocaleString('en-IN')}</s>
                    </p>
                    <p>
                      <span className="label">Now:</span> ₹
                      {finalPrice.toLocaleString('en-IN')}
                    </p>
                    <p>
                      <span className="label">Qty:</span> {quantity}
                    </p>
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
            <h3>Total Amount</h3>
            <h2>₹{totalAmount.toLocaleString('en-IN')}</h2>
            <button className="checkout-btn">✅ Proceed to Checkout</button>
            <button className="empty-btn" onClick={handleEmptyCart}>
              🗑️ Empty Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen;
