// PaymentMethodScreen.js
import React, { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../payment.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const latestOrder = JSON.parse(
    localStorage.getItem('latestOrderSummary') || '{}'
  );
  const cartItems =
    JSON.parse(localStorage.getItem(`orders_${userInfo.email}`) || '[]')?.slice(
      -1
    )[0]?.items || [];

  const shippingAddress = latestOrder.deliveryInfo || {};
  const itemsPrice = latestOrder.subtotal || 0;
  const taxAmount = latestOrder.taxAmount || 0;
  const shippingCharge = latestOrder.shippingCharge || 0;
  const grandTotal = latestOrder.grandTotal || 0;

  const [paymentMethodName, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    if (!shippingAddress?.address) navigate('/checkout');
  }, [shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    if (!paymentMethodName)
      return toast.error('❌ Please select a payment method');

    if (paymentMethodName === 'Card') {
      const { number, expiry, cvv } = cardDetails;
      if (!number || !expiry || !cvv) {
        toast.error('❌ Please fill in all card details.');
        return;
      }
    }

    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod: paymentMethodName,
          itemsPrice,
          shippingPrice: shippingCharge,
          taxPrice: taxAmount,
          totalPrice: grandTotal,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem(`cartItems_${userInfo.email}`);
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error('❌ ' + (err.response?.data?.message || err.message));
    }
  };

  const paymentOptions = [
    { id: 'PhonePe', label: 'PhonePe', icon: '/icons/phonepe.png' },
    { id: 'GPay', label: 'GPay', icon: '/icons/gpay.png' },
    { id: 'Paytm', label: 'Paytm', icon: '/icons/paytm.png' },
    { id: 'Card', label: 'Credit/Debit Card', icon: '/icons/card.png' },
  ];

  return (
    <div className="payment-method-wrapper">
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1>🧾 Review & Payment</h1>

        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
            <div className="card-container">
              <h4>🛍️ Cart Items</h4>
              {cartItems.map((item) => (
                <div key={item.slug} className="cart-item">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">
                    {item.quantity} x ₹{item.price} = ₹
                    {item.quantity * item.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="card-container">
              <h4>📦 Shipping Address</h4>
              <p>
                {shippingAddress.name}, {shippingAddress.phone}
              </p>
              <p>
                {shippingAddress.address}, {shippingAddress.landmark}
              </p>
              <p>
                {shippingAddress.city}, {shippingAddress.state} -{' '}
                {shippingAddress.pin}
              </p>
              <p>{shippingAddress.country}</p>
            </div>

            <div className="d-grid mt-4">
              <Button
                type="button"
                onClick={placeOrderHandler}
                className="btn btn-success"
                disabled={cartItems.length === 0}
              >
                🚀 Place Order
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="card-container">
              <h4>💰 Payment Summary</h4>
              <ul className="summary-list">
                <li>
                  <span>Subtotal:</span> ₹{itemsPrice.toFixed(2)}
                </li>
                <li>
                  <span>Tax:</span> ₹{taxAmount.toFixed(2)}
                </li>
                <li>
                  <span>Shipping:</span> ₹{shippingCharge.toFixed(2)}
                </li>
                <li>
                  <strong>Total:</strong> ₹{grandTotal.toFixed(2)}
                </li>
              </ul>
            </div>

            <div className="card-container">
              <h4>💳 Select Payment Method</h4>
              <Form>
                {paymentOptions.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-option ${
                      paymentMethodName === method.id ? 'selected' : ''
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <Form.Check
                      inline
                      name="paymentMethod"
                      type="radio"
                      id={method.id}
                      value={method.id}
                      checked={paymentMethodName === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <img
                      src={method.icon}
                      alt={method.label}
                      className="payment-icon"
                    />
                    <label htmlFor={method.id}>{method.label}</label>
                  </div>
                ))}

                {paymentMethodName === 'Card' && (
                  <div className="card-details">
                    <Form.Group className="mb-3" controlId="cardNumber">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            number: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="expiry">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            expiry: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="cvv">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
