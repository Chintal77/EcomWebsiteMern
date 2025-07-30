import { useEffect, useState } from 'react';
import '../orders.css';

function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    document.title = 'Shopfusion | My Orders';

    const savedOrders = JSON.parse(
      localStorage.getItem(`orders_${userInfo.email}`) || '[]'
    );
    setOrders(savedOrders);
    setLoading(false);
  }, [userInfo.email]);

  if (!userInfo.name) {
    return <p className="order-error">❌ Please log in to view your orders.</p>;
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">📜 My Orders</h2>

      {loading ? (
        <p className="loading-message">Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">You have not placed any orders yet.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-card">
            <h3 className="order-id">🧾 Order #{index + 1}</h3>
            <p className="order-date">📅 Placed on: {order.date}</p>

            {order.items.map((item) => (
              <div key={item.slug} className="order-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                  <p>
                    Price: ₹{item.price.toLocaleString('en-IN')} x{' '}
                    {item.quantity}
                  </p>
                  <p>
                    Subtotal: ₹
                    {(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}

            {/* ✅ Dynamic Shipping Info */}
            {order.deliveryInfo && (
              <div className="shipping-info">
                <strong>Shipping To:</strong>
                <br />
                {order.deliveryInfo.fullName}
                <br />
                {order.deliveryInfo.address},{order.deliveryInfo.landmark},{' '}
                {order.deliveryInfo.city}, {order.deliveryInfo.state} -{' '}
                {order.deliveryInfo.pin}
                <br />
                Phone: {order.deliveryInfo.phone}
              </div>
            )}

            <div className="order-total">
              <strong>Total: ₹{order.total.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrdersScreen;
