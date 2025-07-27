import { useEffect, useReducer, useState } from 'react';
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

  const [productsInCart, setProductsInCart] = useState([]);

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

  useEffect(() => {
    const cartProductSlugs = Object.keys(cartItems);
    const filteredProducts = products.filter((product) =>
      cartProductSlugs.includes(product.slug)
    );
    setProductsInCart(filteredProducts);
  }, [products, cartItems]);

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

  const handleDeleteItem = (slug) => {
    if (window.confirm('Remove this item from the cart?')) {
      const updatedCart = { ...cartItems };
      delete updatedCart[slug];
      setCartItems(updatedCart);
    }
  };

  const increaseQuantity = (slug) => {
    const product = products.find((p) => p.slug === slug);
    const currentQty = cartItems[slug];

    if (product && currentQty < product.countInStock) {
      setCartItems((prev) => ({
        ...prev,
        [slug]: prev[slug] + 1,
      }));
    } else {
      alert(
        `❗ Only ${product.countInStock} item(s) available for "${product.name}". You can't add more.`
      );
    }
  };

  const decreaseQuantity = (slug) => {
    setCartItems((prev) => ({
      ...prev,
      [slug]: Math.max(1, prev[slug] - 1),
    }));
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
                    <h4>
                      <Link
                        to={`/product/${product.slug}`}
                        className="product-link"
                      >
                        {product.name}
                      </Link>
                    </h4>
                    <p>
                      <span className="label">Original:</span>{' '}
                      <s>₹{product.price.toLocaleString('en-IN')}</s>
                    </p>
                    <p>
                      <span className="label">Now:</span> ₹
                      {finalPrice.toLocaleString('en-IN')}
                    </p>

                    <div className="quantity-controls">
                      <span className="label">Qty:</span>
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQuantity(product.slug)}
                      >
                        ➖
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => increaseQuantity(product.slug)}
                        disabled={
                          cartItems[product.slug] >= product.countInStock
                        }
                        title={
                          cartItems[product.slug] >= product.countInStock
                            ? `Only ${product.countInStock} in stock`
                            : ''
                        }
                      >
                        ➕
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteItem(product.slug)}
                        title="Remove item"
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
