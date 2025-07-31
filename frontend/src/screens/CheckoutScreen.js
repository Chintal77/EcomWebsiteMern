import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../checkout.css';

function CheckoutScreen({ cartItems, setCartItems }) {
  const [productsInCart, setProductsInCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pin, setPin] = useState('');
  const [country, setCountry] = useState('');
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

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
    if (!paymentMode) {
      alert('⚠️ Please select a payment mode before placing the order.');
      return;
    }

    if (
      paymentMode === 'Card' &&
      (!cardDetails.number ||
        !cardDetails.name ||
        !cardDetails.expiry ||
        !cardDetails.cvv)
    ) {
      alert('⚠️ Please fill in all card details.');
      return;
    }

    const order = {
      date: new Date().toLocaleString(),
      status: 'Placed',
      paymentMode: paymentMode || 'Not Selected',
      deliveryInfo: {
        name: userInfo.name,
        email: userInfo.email,
        phone,
        address,
        landmark,
        city,
        state: stateName,
        pin,
        country,
      },
      items: productsInCart.map((product) => {
        const quantity = cartItems[product.slug];
        const discountMatch = product.badge?.match(/(\d+)%/);
        const discount = discountMatch ? parseInt(discountMatch[1]) : 0;
        const finalPrice =
          product.price - Math.round((product.price * discount) / 100);

        return {
          slug: product.slug,
          name: product.name,
          image: product.image,
          quantity,
          price: finalPrice,
        };
      }),
      total: totalAmount,
    };

    const existingOrders = JSON.parse(
      localStorage.getItem(`orders_${userInfo.email}`) || '[]'
    );
    existingOrders.push(order);
    localStorage.setItem(
      `orders_${userInfo.email}`,
      JSON.stringify(existingOrders)
    );

    setCartItems({});
    localStorage.removeItem(`cartItems_${userInfo.email}`);

    navigate('/order-success');
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
            <div className="delivery-info-form">
              <div className="form-group">
                <label>Name:</label>
                <input type="text" value={userInfo.name} disabled />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input type="email" value={userInfo.email} disabled />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Landmark:</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>State:</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>PIN Code:</label>
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Country:</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </div>

            <h3 className="section-title">💳 Payment Summary</h3>
            <div className="total-price">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>

            <h3 className="section-title">🪙 Select Payment Mode</h3>
            <button
              className="payment-btn phonepe"
              onClick={() => setPaymentMode('PhonePe')}
            >
              📱 PhonePe
            </button>
            <button
              className="payment-btn paytm"
              onClick={() => setPaymentMode('Paytm')}
            >
              💳 Paytm
            </button>
            <button
              className="payment-btn gpay"
              onClick={() => setPaymentMode('GPay')}
            >
              🤑 GPay
            </button>
            <button
              className="payment-btn card"
              onClick={() => {
                setPaymentMode('Card');
                setShowCardPopup(true);
              }}
            >
              💳 Credit/Debit Card
            </button>

            <button className="place-order-btn" onClick={handlePlaceOrder}>
              ✅ Place Order
            </button>
          </div>
        </div>
      )}
      {showCardPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Enter Card Details</h3>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, number: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Name on Card</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, name: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="popup-actions">
              <button
                className="close-btn"
                onClick={() => setShowCardPopup(false)}
              >
                ❌ Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  setShowCardPopup(false);
                  handlePlaceOrder();
                }}
              >
                ✅ Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutScreen;
