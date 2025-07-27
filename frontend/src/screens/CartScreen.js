import { Link } from 'react-router-dom';
import data from '../data';
import '../CartScreen.css';

function CartScreen({ cartItems, setCartItems }) {
  const cartProductSlugs = Object.keys(cartItems);

  const productsInCart = data.products.filter((product) =>
    cartProductSlugs.includes(product.slug)
  );

  const cartIsEmpty = productsInCart.length === 0;

  const totalAmount = productsInCart.reduce((acc, product) => {
    const quantity = cartItems[product.slug];
    return acc + product.price * quantity;
  }, 0);

  const handleEmptyCart = () => {
    if (window.confirm('Are you sure you want to empty the cart?')) {
      setCartItems({});
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-heading">🛒 Your Shopping Cart</h2>

      {cartIsEmpty ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/" className="cart-link">
            🛍️ Go Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {productsInCart.map((product) => {
              const quantity = cartItems[product.slug];
              const subtotal = product.price * quantity;

              return (
                <div className="cart-item-card" key={product.slug}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <h3>{product.name}</h3>
                    <p>
                      <strong>Price:</strong> ₹
                      {product.price.toLocaleString('en-IN')}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {quantity}
                    </p>
                    <p>
                      <strong>Subtotal:</strong> ₹
                      {subtotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹{totalAmount.toLocaleString('en-IN')}</h3>
            <div className="cart-actions">
              <button className="checkout-btn">Proceed to Checkout</button>
              <button className="empty-btn" onClick={handleEmptyCart}>
                🗑️ Empty Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartScreen;
