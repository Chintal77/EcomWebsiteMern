import '../CartScreen.css';
import data from '../data';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function CartScreen() {
  const [cartItems, setCartItems] = useState(data.products.slice(0, 2)); // simulate 2 items
  const [quantities, setQuantities] = useState(
    data.products.slice(0, 2).reduce((acc, product) => {
      acc[product.slug] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (slug, newQty) => {
    setQuantities({ ...quantities, [slug]: Number(newQty) });
  };

  const removeFromCart = (slug) => {
    setCartItems(cartItems.filter((item) => item.slug !== slug));
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[slug];
    setQuantities(updatedQuantities);
  };

  const total = cartItems.reduce((sum, item) => {
    const discount = item.price * 0.2;
    const finalPrice = item.price - discount;
    return sum + finalPrice * quantities[item.slug];
  }, 0);

  return (
    <section className="cart-glass">
      <h2 className="cart-title">🛒 Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="cart-empty">
          Your cart is empty.{' '}
          <Link to="/" className="shop-link">
            Go shopping!
          </Link>
        </p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => {
              const discount = item.price * 0.2;
              const finalPrice = item.price - discount;
              return (
                <div key={item.slug} className="cart-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-thumb"
                  />
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>
                      Price: <strong>₹{finalPrice.toLocaleString()}</strong>{' '}
                      <span className="strike">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </p>
                    <div className="cart-qty-remove">
                      <label>
                        Qty:
                        <select
                          value={quantities[item.slug]}
                          onChange={(e) =>
                            handleQuantityChange(item.slug, e.target.value)
                          }
                        >
                          {[...Array(10).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        className="btn-remove"
                        onClick={() => removeFromCart(item.slug)}
                      >
                        ❌ Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary-glass">
            <h3>Cart Summary</h3>
            <p>
              Total: <strong>₹{total.toLocaleString()}</strong>
            </p>
            <button className="btn-checkout">Proceed to Checkout</button>
          </div>
        </>
      )}
    </section>
  );
}

export default CartScreen;
