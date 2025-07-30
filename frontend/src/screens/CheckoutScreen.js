import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../checkout.css';

function CheckoutScreen({ cartItems, setCartItems }) {
  const [productsInCart, setProductsInCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    document.title = 'Shopfusion | Checkout';
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const cartProductSlugs = Object.keys(cartItems);
    const filtered = products.filter((product) =>
      cartProductSlugs.includes(product.slug)
    );
    setProductsInCart(filtered);
  }, [products, cartItems]);

  const totalAmount = productsInCart.reduce((acc, product) => {
    const quantity = cartItems[product.slug];
    const discountMatch = product.badge?.match(/(\d+)%/);
    const discount = discountMatch ? parseInt(discountMatch[1]) : 0;
    const finalPrice =
      product.price - Math.round((product.price * discount) / 100);
    return acc + finalPrice * quantity;
  }, 0);

  const handlePlaceOrder = () => {
    alert('✅ Order placed successfully!');
    setCartItems({});
    navigate('/');
  };

  if (!userInfo.name) {
    navigate('/login?redirect=/checkout');
    return null;
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">🧾 Checkout Summary</h2>

      {loading ? (
        <p className="loading-message">Loading your cart...</p>
      ) : (
        <div className="checkout-grid">
          {/* LEFT: Cart Items */}
          <div className="cart-items">
            <h3 className="section-title">🛒 Items in Your Cart</h3>

            {productsInCart.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              productsInCart.map((product) => {
                const quantity = cartItems[product.slug];
                const discountMatch = product.badge?.match(/(\d+)%/);
                const discount = discountMatch ? parseInt(discountMatch[1]) : 0;
                const finalPrice =
                  product.price - Math.round((product.price * discount) / 100);
                const subtotal = finalPrice * quantity;

                return (
                  <div key={product.slug} className="cart-item">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    <div>
                      <h4 className="product-name">{product.name}</h4>
                      <p>
                        Qty: <span className="bold">{quantity}</span>
                      </p>
                      <p>Price: ₹{finalPrice.toLocaleString('en-IN')} each</p>
                      <p className="subtotal">
                        Subtotal: ₹{subtotal.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Summary */}
          <div className="summary-box">
            <h3 className="section-title">📦 Delivery Info</h3>
            <div className="delivery-info">
              <p>
                <strong>Name:</strong> {userInfo.name}
              </p>
              <p>
                <strong>Email:</strong> {userInfo.email}
              </p>
              <p>
                <strong>Phone:</strong> +91-9876543210
              </p>
              <p>
                <strong>Address:</strong> 123 Example Street
              </p>
              <p>
                <strong>Landmark:</strong> Near City Mall
              </p>
              <p>
                <strong>City:</strong> Mumbai
              </p>
              <p>
                <strong>State:</strong> Maharashtra
              </p>
              <p>
                <strong>PIN Code:</strong> 400001
              </p>
              <p>
                <strong>Country:</strong> India
              </p>
            </div>

            <h3 className="section-title">💳 Payment Summary</h3>
            <div className="total-price">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>

            <button className="place-order-btn" onClick={handlePlaceOrder}>
              ✅ Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutScreen;
