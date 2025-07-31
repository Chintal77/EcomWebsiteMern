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
    const order = {
      date: new Date().toLocaleString(),
      status: 'Placed',
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

    // ✅ Clear cart from both state and localStorage
    setCartItems({});
    localStorage.removeItem(`cartItems_${userInfo.email}`);

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
